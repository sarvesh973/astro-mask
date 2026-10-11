# Vedic Astrology Landing Page

A one-page funnel built for Meta ads traffic:

**Date of birth (scroll wheels) → time & place → your question → pay as you wish → the reading.**

The chart is genuinely computed — sidereal positions, lagna, nakshatra and
Vimśottarī daśā are calculated from the ephemeris in
[`lib/jyotish.js`](lib/jyotish.js), with no external astrology API. Those real
placements are what gets handed to Gemini, so the answer is written against the
actual chart rather than a vague prompt.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

Open http://localhost:3000.

With `ALLOW_TEST_PAYMENTS=true` and no API keys at all, the whole funnel still
runs end to end: the payment step is skipped and the reading streams sample
text built from your real computed chart.

---

## Deploying to Vercel

Vercel builds from a Git repository — there is no zip upload in the dashboard.

1. Go to **vercel.com/new** and import this GitHub repo.
2. Framework preset is detected automatically (Next.js). Leave the build
   settings alone.
3. Add the environment variables below under **Settings → Environment
   Variables**, then **Deploy**.

### Environment variables

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | yes | From [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | no | Defaults to `gemini-2.5-flash`. Use `gemini-2.5-pro` for deeper readings. |
| `GEMINI_THINKING_BUDGET` | no | `0` streams fastest. Raise to ~1024 for more considered answers. |
| `RAZORPAY_KEY_ID` | yes | Razorpay Dashboard → Account & Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | yes | Keep secret. Never prefix with `NEXT_PUBLIC_`. |
| `APP_SECRET` | yes | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_META_PIXEL_ID` | no | Leave blank and no pixel code is injected at all. |
| `NEXT_PUBLIC_SITE_URL` | no | e.g. `https://yourdomain.com` — lets Meta resolve the OG image. |
| `ALLOW_TEST_PAYMENTS` | **no** | **Must be absent or `false` in production.** |

> ⚠️ `ALLOW_TEST_PAYMENTS=true` lets anyone unlock a reading without paying.
> It exists only for local development. Do not set it on Vercel.

After the first deploy, add your domain in Vercel, then go back to Razorpay and
whitelist it.

---

## Editing the content

Everything a non-developer needs is in **[`content/site.js`](content/site.js)** —
headlines, sub-headlines, trust badges, the FAQ, testimonials, suggested
questions, payment presets and footer links. Each slot is commented.

### Logos

Drop your files in `public/logos/`, then point to them:

```js
brand: {
  name: "Your Brand",
  logo: "/logos/logo.svg",        // header + footer, 44×44 box
},
logoWall: {
  logos: [{ name: "Forbes", src: "/logos/forbes.png" }, ...],  // 130×62 boxes
},
```

Anything left as `null` renders a dashed placeholder, so the layout never
breaks while you are still collecting assets.

### Social preview image

Add a 1200×630 image at `public/og.jpg`. Meta scrapes this for the ad preview
card, so it is worth doing before you spend money on traffic.

---

## How the money and the answer connect

```
browser                       server
───────                       ──────
pick amount  ──────────────►  POST /api/razorpay/order      creates the order
Razorpay checkout opens
payment succeeds ──────────►  POST /api/razorpay/verify     checks the HMAC
                              ◄── short-lived signed token
ask for reading ───────────►  POST /api/answer              verifies the token,
                                                            recomputes the chart,
                              ◄── streamed text             streams from Gemini
```

Two things worth knowing:

- **The chart is recomputed server-side.** The browser's copy is only for
  display, so the prompt cannot be spoofed from the client.
- **`/api/answer` refuses anything it did not sign.** Forged or tampered tokens
  get a 401 before Gemini is ever called. No database is involved; the token is
  a signed payload valid for two hours, which also means a follow-up question
  inside that window costs the visitor nothing extra.

---

## Meta ads setup

Do these in order. Steps 1–3 are required before a single rupee of spend.

### 1. Create the Pixel

Events Manager → **Connect data sources** → **Web** → **Meta Pixel**. Copy the
pixel ID into `NEXT_PUBLIC_META_PIXEL_ID`. That alone gets the browser Pixel
running; nothing is injected at all if the variable is blank.

### 2. Turn on the Conversions API

This is the part most landing pages skip, and it is why their reported ROAS
looks worse than reality. Between iOS tracking prevention, ad blockers and
Safari's ITP, **20–35% of browser Pixel events never arrive**. Meta then
optimises against incomplete data.

Every conversion here is sent **twice** — once from the browser, once from
the server — sharing one `event_id` so Meta collapses them into a single
conversion. The server copy cannot be blocked.

Events Manager → your pixel → **Settings** → **Conversions API** →
**Generate access token** → paste into `META_CAPI_ACCESS_TOKEN`.

Match quality is handled for you: when a payment succeeds the server pulls
the payer's email and phone from Razorpay (they already typed them into
checkout), SHA-256 hashes them, and sends those with the conversion. No extra
form fields, no plaintext identifiers leaving your server.

> Your Privacy Policy must disclose that hashed contact details are shared
> with Meta for advertising measurement. This is standard, but it has to be
> written down.

### 3. Verify your domain

Business Manager → **Brand Safety** → **Domains** → add your domain → copy the
verification string into `NEXT_PUBLIC_META_DOMAIN_VERIFICATION`. It is
rendered into `<head>` automatically.

Required before you can configure Aggregated Event Measurement, which is what
lets iOS conversions attribute at all.

### 4. Check the events are landing

Set `META_TEST_EVENT_CODE` to the code shown in Events Manager → **Test
Events**, redeploy, and walk the funnel. You should see each event arrive
**once**, labelled as received from both Browser and Server — that is
deduplication working. Two separate rows for one purchase means the
`event_id` is not matching.

**Delete `META_TEST_EVENT_CODE` before going live.** Events sent with a test
code stay in test mode and never optimise delivery.

### 5. Configure Aggregated Event Measurement

Events Manager → **Aggregated Event Measurement** → **Configure web events**.
Rank your 8 events with `Purchase` first. This controls iOS attribution
priority.

### What fires, and when

| Event | Fires when | Sent via |
|---|---|---|
| `PageView` | page load | Pixel |
| `ViewContent` | the funnel is seen | Pixel |
| `Lead` | birth details submitted, or a category card tapped | Pixel |
| `AddToCart` | question written, moving to payment | Pixel |
| `InitiateCheckout` | payment started | Pixel |
| `Purchase` | payment verified, with value in INR | **Pixel + CAPI** |

Optimise your campaigns for **Purchase**. If volume is too low to exit the
learning phase (under ~50/week), optimise for `InitiateCheckout` first and
move to Purchase once volume supports it.

`utm_*` and `fbclid` are captured on landing and kept for the session, and
`_fbc` is written from `fbclid` on first touch so click attribution survives
even if the Pixel is slow to load.

### Before the first campaign

- [ ] `public/og.jpg` at 1200×630 — Meta scrapes this for the ad preview
- [ ] `NEXT_PUBLIC_SITE_URL` set, so that image resolves
- [ ] Privacy, Terms and Refund pages written and linked in the footer
- [ ] One live test purchase, confirmed deduplicated in Events Manager
- [ ] `META_TEST_EVENT_CODE` removed
- [ ] `ALLOW_TEST_PAYMENTS` removed or `false`

---

## Before you run ads

- [ ] Replace every placeholder string in `content/site.js`
- [ ] Write real Privacy, Terms and Refund pages — Meta reviews landing pages
      for these and will reject ads without them
- [ ] Add `public/og.jpg`
- [ ] Set `ALLOW_TEST_PAYMENTS=false` (or remove it)
- [ ] Switch Razorpay from `rzp_test_*` to live keys
- [ ] Fire a test purchase and confirm the Pixel receives `Purchase`

Pixel events already wired: `PageView`, `Lead` (birth details submitted),
`AddToCart` (question written), `InitiateCheckout`, `Purchase`.

---

## Accuracy notes

Sun and Moon are good to well under 0.05°; the five visible planets use the
JPL/Standish approximate elements, good to a fraction of a degree over
1800–2050. Both are far inside the 30° rāśi and 3°20′ pada boundaries the
reading depends on. Houses are whole-sign (Parāśarī), ayanāṃśa is Lahiri.

If you later want arc-second precision, swap `lib/jyotish.js` for the Swiss
Ephemeris — `computeChart()` is the only function the rest of the app calls.
