import { NextResponse } from "next/server";
import { testModeEnabled } from "@/lib/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Server-side guard rails. Never trust the amount the browser sends. */
const MIN_RUPEES = 1;
const MAX_RUPEES = 100000;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rupees = Math.round(Number(body?.amount));
  if (!Number.isFinite(rupees) || rupees < MIN_RUPEES || rupees > MAX_RUPEES) {
    return NextResponse.json(
      { error: `Amount must be between Rs.${MIN_RUPEES} and Rs.${MAX_RUPEES}.` },
      { status: 400 }
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  /* ---- no keys configured: allow a click-through run if explicitly enabled */
  if (!keyId || !keySecret) {
    if (testModeEnabled()) {
      return NextResponse.json({
        testMode: true,
        amount: rupees * 100,
        currency: "INR",
      });
    }
    return NextResponse.json(
      { error: "Payments are not configured yet. Add your Razorpay keys to .env.local." },
      { status: 503 }
    );
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  try {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: rupees * 100,          // Razorpay works in paise
        currency: "INR",
        receipt: `jyotish_${Date.now()}`,
        notes: { product: "Vedic reading", pricing: "pay-as-you-wish" },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Razorpay order failed:", data);
      return NextResponse.json(
        { error: data?.error?.description || "Could not start the payment." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,                            // publishable - safe to send to the browser
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Payment service unreachable." }, { status: 502 });
  }
}
