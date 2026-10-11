import { NextResponse } from "next/server";
import { issueToken, verifyRazorpaySignature, testModeEnabled } from "@/lib/tokens";
import { sendCapiEvent, clientIpFrom } from "@/lib/metaCapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Razorpay already holds the payer's email and phone from its own checkout,
 * so we can hand Meta a well-matched conversion without asking the visitor
 * for anything extra. Returns {} on any failure - this is a nice-to-have.
 */
async function fetchPaymentContact(paymentId) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return {};

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) return {};
    const p = await res.json();
    return {
      email: p?.email || null,
      phone: p?.contact || null,
      amount: typeof p?.amount === "number" ? p.amount / 100 : null,
    };
  } catch {
    return {};
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  /* ---- test mode: no real payment happened, issue a token anyway -------- */
  if (body?.testMode === true) {
    if (!testModeEnabled()) {
      return NextResponse.json({ error: "Test payments are disabled." }, { status: 403 });
    }
    return NextResponse.json({
      ok: true,
      testMode: true,
      token: issueToken({ test: true, amount: Number(body.amount) || 0 }),
    });
  }

  const orderId = body?.razorpay_order_id;
  const paymentId = body?.razorpay_payment_id;
  const signature = body?.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  if (!verifyRazorpaySignature({ orderId, paymentId, signature })) {
    // Either a tampered callback or mismatched keys - never unlock on this path.
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  /* ---- the payment is real: unlock first, then report the conversion ---- */
  const token = issueToken({ paymentId, orderId });

  const contact = await fetchPaymentContact(paymentId);
  const value = contact.amount ?? Number(body?.amount) ?? 0;

  // Awaited so the serverless function is not torn down mid-request, but
  // never allowed to fail the response - the visitor has paid either way.
  await sendCapiEvent({
    eventName: "Purchase",
    eventId: body?.eventId,            // same id the Pixel used -> deduplicated
    eventSourceUrl: body?.sourceUrl || req.headers.get("referer") || undefined,
    email: contact.email,
    phone: contact.phone,
    clientIp: clientIpFrom(req),
    userAgent: req.headers.get("user-agent") || undefined,
    fbp: body?.fbp,
    fbc: body?.fbc,
    customData: {
      currency: "INR",
      value,
      content_name: "Vedic reading",
      content_category: "dakshina",
    },
  }).catch(() => {});

  return NextResponse.json({ ok: true, paymentId, token });
}
