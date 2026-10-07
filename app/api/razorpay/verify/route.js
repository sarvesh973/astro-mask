import { NextResponse } from "next/server";
import { issueToken, verifyRazorpaySignature, testModeEnabled } from "@/lib/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  return NextResponse.json({
    ok: true,
    paymentId,
    token: issueToken({ paymentId, orderId }),
  });
}
