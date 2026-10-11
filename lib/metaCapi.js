import crypto from "node:crypto";

/* ============================================================================
   Meta Conversions API - the server half of each conversion.

   Browser Pixel events get blocked often enough that purchase data goes
   missing; this sends the same event server-to-server, where nothing can
   block it. Both carry the same `event_id`, so Meta keeps one conversion
   rather than counting two.

   Docs: developers.facebook.com/docs/marketing-api/conversions-api
   ========================================================================= */

const API_VERSION = "v21.0";

/** Meta wants user identifiers lowercased, trimmed and SHA-256 hashed. */
function hash(value) {
  if (!value) return null;
  const normalised = String(value).trim().toLowerCase();
  if (!normalised) return null;
  return crypto.createHash("sha256").update(normalised).digest("hex");
}

/** Phone numbers hash in E.164 form without the leading + or any spaces. */
function hashPhone(value) {
  if (!value) return null;
  const digits = String(value).replace(/[^0-9]/g, "");
  if (!digits) return null;
  return crypto.createHash("sha256").update(digits).digest("hex");
}

/** Pull the real client IP when running behind Vercel's proxy. */
export function clientIpFrom(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || undefined;
}

/**
 * Send one event to the Conversions API.
 * Never throws - a tracking failure must not break a paid user's reading.
 */
export async function sendCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  email,
  phone,
  clientIp,
  userAgent,
  fbp,
  fbc,
  customData = {},
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;

  // Not configured yet: stay silent, the Pixel still works on its own.
  if (!pixelId || !token) return { skipped: true };

  const userData = {};
  const em = hash(email);
  const ph = hashPhone(phone);
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: customData,
      },
    ],
  };

  // Set META_TEST_EVENT_CODE while you watch Events Manager > Test Events.
  // Remove it before going live or the events stay in test and never optimise.
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Meta CAPI rejected event:", res.status, JSON.stringify(body).slice(0, 400));
      return { ok: false, status: res.status };
    }
    return { ok: true, received: body?.events_received ?? 0 };
  } catch (err) {
    console.error("Meta CAPI unreachable:", err?.message);
    return { ok: false, error: true };
  }
}
