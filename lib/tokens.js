import crypto from "node:crypto";

/* ============================================================================
   Payment -> answer handoff.

   After Razorpay confirms a payment we hand the browser a short-lived signed
   token. /api/answer will only generate a reading for a token it signed itself,
   so nobody can call the Gemini endpoint directly and skip the payment step.
   No database required.
   ========================================================================= */

const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours - plenty to read and retry

function secret() {
  const s = process.env.APP_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!s) throw new Error("APP_SECRET (or RAZORPAY_KEY_SECRET) is not set");
  return s;
}

const b64url = (buf) =>
  Buffer.from(buf).toString("base64url");

export function issueToken(payload) {
  const body = { ...payload, exp: Date.now() + TTL_MS };
  const data = b64url(JSON.stringify(body));
  const sig = crypto.createHmac("sha256", secret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = crypto.createHmac("sha256", secret()).update(data).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const body = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (!body.exp || Date.now() > body.exp) return null;
    return body;
  } catch {
    return null;
  }
}

/** Razorpay's own signature check: HMAC(order_id|payment_id, key_secret). */
export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Test mode lets you click through the whole funnel with no Razorpay keys. */
export const testModeEnabled = () =>
  process.env.ALLOW_TEST_PAYMENTS === "true";
