"use client";

/* ============================================================================
   Browser-side Meta tracking.

   Every conversion is sent twice - once from here (the Pixel) and once from
   the server (Conversions API) - sharing one event id so Meta collapses them
   into a single conversion. Without the server copy you silently lose the
   ~20-35% of events that iOS, ad blockers and ITP drop, which makes your ROAS
   look worse than it is and trains the algorithm on bad data.
   ========================================================================= */

/** Random id shared by the Pixel event and its server twin. */
export function newEventId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const hit = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.split("=").slice(1).join("=")) : null;
}

/**
 * _fbp / _fbc are what let Meta match a server event back to the click.
 * The Pixel normally sets both, but it only writes _fbc when it sees an
 * fbclid, so we write it ourselves if the Pixel has not yet loaded.
 */
export function getFbCookies() {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");

  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`;
      // 90 days, matching Meta's own click-attribution window
      document.cookie = `_fbc=${fbc}; max-age=${90 * 24 * 60 * 60}; path=/; SameSite=Lax`;
    }
  }
  return { fbp: fbp || null, fbc: fbc || null };
}

/**
 * Fire a Pixel event. Returns the event id so the caller can hand the same
 * one to the server for deduplication.
 */
export function track(eventName, params = {}, eventId = newEventId()) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, params, { eventID: eventId });
  }
  return eventId;
}

/** Keep utm_* and fbclid through the session so they survive the funnel. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const qs = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
    const found = {};
    for (const k of keys) {
      const v = qs.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    if (Object.keys(found).length) {
      sessionStorage.setItem("attribution", JSON.stringify(found));
    }
    getFbCookies(); // writes _fbc on first touch
  } catch {
    /* private mode - tracking is best-effort, never block the funnel */
  }
}

export function getAttribution() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("attribution") || "{}");
  } catch {
    return {};
  }
}
