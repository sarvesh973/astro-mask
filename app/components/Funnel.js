"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/content/site";
import { DEFAULT_CITY } from "@/lib/cities";
import { computeChart } from "@/lib/jyotish";
import { DateWheels, TimeWheels, MONTHS } from "./Wheel";
import PlaceCombo from "./PlaceCombo";
import Reading from "./Reading";
import {
  Alert, ArrowLeft, ArrowRight, Calendar, Clock, Diya, Lock, Pin, Question, Sparkle,
} from "./Icons";

/* Meta Pixel helper - silently no-ops when the pixel isn't configured. */
const track = (event, params) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
};

const RAIL = ["Birth", "Question", "Offering", "Reading"];
const railFor = (step) => (step <= 1 ? 0 : step - 1);

export default function Funnel() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  /* ---- collected inputs ---- */
  const [date, setDate] = useState({ day: 15, month: 5, year: 1996 });
  const [time, setTime] = useState({ hour: 10, minute: 30 });
  const [timeKnown, setTimeKnown] = useState(true);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [question, setQuestion] = useState("");
  const [amount, setAmount] = useState(site.payment.defaultAmount);

  /* ---- payment ---- */
  const [paying, setPaying] = useState(false);
  const [token, setToken] = useState(null);

  const shellRef = useRef(null);
  const taRef = useRef(null);

  const birth = useMemo(() => ({
    year: date.year,
    month: date.month + 1,              // the API expects 1-12
    day: date.day,
    hour: timeKnown ? time.hour : 12,
    minute: timeKnown ? time.minute : 0,
    tz: city?.tz ?? 5.5,
    lat: city?.lat ?? 28.6139,
    lon: city?.lon ?? 77.209,
    place: city?.label ?? "Delhi, Delhi",
    timeKnown,
  }), [date, time, timeKnown, city]);

  /* Computed locally for instant display; the server recomputes it for the
     reading so the prompt can never be spoofed from the browser. */
  const chart = useMemo(() => {
    if (!city) return null;
    try {
      return computeChart({
        year: birth.year, month: birth.month, day: birth.day,
        hour: birth.hour, minute: birth.minute,
        tzOffset: birth.tz, lat: birth.lat, lon: birth.lon, place: birth.place,
      });
    } catch {
      return null;
    }
  }, [birth, city]);

  const go = (next) => {
    setError("");
    setStep(next);
    // keep the card in view when the step height changes
    requestAnimationFrame(() => {
      shellRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    if (step === 2) setTimeout(() => taRef.current?.focus(), 420);
  }, [step]);

  /* ==================================================== payment ========== */
  const startPayment = async () => {
    setError("");
    setPaying(true);
    track("InitiateCheckout", { value: amount, currency: "INR" });

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await orderRes.json();

      if (!orderRes.ok) {
        setError(order.error || "Could not start the payment.");
        setPaying(false);
        return;
      }

      /* --- test mode: skip Razorpay entirely (ALLOW_TEST_PAYMENTS=true) --- */
      if (order.testMode) {
        const vr = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testMode: true, amount }),
        });
        const v = await vr.json();
        if (!vr.ok) {
          setError(v.error || "Test payment failed.");
          setPaying(false);
          return;
        }
        setToken(v.token);
        setPaying(false);
        go(4);
        return;
      }

      if (typeof window.Razorpay !== "function") {
        setError("Payment window could not load. Please refresh and try again.");
        setPaying(false);
        return;
      }

      const rz = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: site.brand.name,
        description: "Vedic chart reading",
        theme: { color: "#F26419" },
        notes: { question: question.slice(0, 120) },
        modal: {
          ondismiss: () => {
            setPaying(false);
            setError("Payment window closed. Nothing was charged.");
          },
        },
        handler: async (resp) => {
          try {
            const vr = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
            const v = await vr.json();
            if (!vr.ok || !v.token) {
              setError(v.error || "We could not verify the payment. Please contact us.");
              setPaying(false);
              return;
            }
            track("Purchase", { value: amount, currency: "INR" });
            setToken(v.token);
            setPaying(false);
            go(4);
          } catch {
            setError("Verification failed. Please contact us with your payment id.");
            setPaying(false);
          }
        },
      });

      rz.on("payment.failed", (resp) => {
        setError(resp?.error?.description || "The payment did not go through.");
        setPaying(false);
      });

      rz.open();
    } catch {
      setError("Something went wrong starting the payment.");
      setPaying(false);
    }
  };

  /* ================================================== step renderers ===== */

  const Birth = (
    <div className="step">
      <div className="step-head">
        <span className="eyebrow">Step One</span>
        <h2 className="step-title" style={{ marginTop: 10 }}>When were you born?</h2>
        <p className="step-sub">Scroll to your date of birth.</p>
      </div>

      <DateWheels value={date} onChange={setDate} />

      <div className="step-actions step-actions--end">
        <button className="btn btn-primary btn-lg" onClick={() => go(1)}>
          Continue
          <ArrowRight width={17} height={17} />
        </button>
      </div>
    </div>
  );

  const Place = (
    <div className="step">
      <div className="step-head">
        <span className="eyebrow">Step One</span>
        <h2 className="step-title" style={{ marginTop: 10 }}>And where?</h2>
        <p className="step-sub">
          Your rising sign changes every two hours — this is what makes the
          reading yours and not your birthday&rsquo;s.
        </p>
      </div>

      <div className="field-row">
        <div>
          <label className="field-label">
            <Clock width={13} height={13} style={{ display: "inline", verticalAlign: -2, marginRight: 6 }} />
            Time of birth
          </label>

          {timeKnown ? (
            <TimeWheels value={time} onChange={setTime} />
          ) : (
            <p className="field-hint" style={{ marginTop: 0 }}>
              We&rsquo;ll use noon and lean on your Moon&rsquo;s nakshatra, which
              stays reliable without an exact time.
            </p>
          )}

          <label style={{
            display: "flex", alignItems: "center", gap: 9,
            marginTop: 12, fontSize: 13.5, color: "var(--ink-2)", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={!timeKnown}
              onChange={(e) => setTimeKnown(!e.target.checked)}
              style={{ accentColor: "var(--saffron-500)", width: 16, height: 16 }}
            />
            I don&rsquo;t know my birth time
          </label>
        </div>

        <div>
          <label className="field-label">
            <Pin width={13} height={13} style={{ display: "inline", verticalAlign: -2, marginRight: 6 }} />
            Place of birth
          </label>
          <PlaceCombo value={city} onChange={setCity} />
        </div>
      </div>

      {/* a live peek at the computed chart - proof that something real is happening */}
      {chart ? (
        <div className="facts" style={{ marginTop: 26 }}>
          <div className="fact">
            <dt>Your Lagna</dt>
            <dd>{chart.lagna.rashi}<small>{chart.lagna.rashiEn} rising</small></dd>
          </div>
          <div className="fact">
            <dt>Moon Sign</dt>
            <dd>{chart.chandra.rashi}<small>{chart.chandra.rashiEn}</small></dd>
          </div>
          <div className="fact">
            <dt>Nakshatra</dt>
            <dd>{chart.chandra.nakshatra}<small>pada {chart.chandra.pada}</small></dd>
          </div>
        </div>
      ) : null}

      <div className="step-actions">
        <button className="btn btn-ghost" onClick={() => go(0)}>
          <ArrowLeft width={16} height={16} />
          Back
        </button>
        <button
          className="btn btn-primary btn-lg"
          disabled={!city}
          onClick={() => { track("Lead", { content_name: "birth_details" }); go(2); }}
        >
          My chart is ready
          <ArrowRight width={17} height={17} />
        </button>
      </div>
    </div>
  );

  const [focused, setFocused] = useState(false);
  const qLen = question.trim().length;

  const Ask = (
    <div className="step">
      <div className="step-head">
        <span className="eyebrow">Step Two</span>
        <h2 className="step-title" style={{ marginTop: 10 }}>{site.question.title}</h2>
        <p className="step-sub">{site.question.subtitle}</p>
      </div>

      <div className="qbar-wrap">
        <div className="qbar" data-focus={focused}>
          <div className="qbar-inner">
            <Question width={22} height={22} className="qbar-icon" />
            <textarea
              ref={taRef}
              value={question}
              maxLength={500}
              placeholder={site.question.placeholder}
              onChange={(e) => setQuestion(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 220) + "px";
              }}
            />
            <div className="qbar-foot">
              <span className="qbar-count" data-warn={qLen > 440}>{qLen} / 500</span>
              <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                {chart ? `${chart.lagna.rashi} lagna · ${chart.chandra.nakshatra}` : null}
              </span>
            </div>
          </div>
        </div>

        <p className="chips-label">Or tap one to start</p>
        <div className="chips">
          {site.question.suggestions.map((s, i) => (
            <button
              key={s}
              className="chip"
              style={{ animationDelay: `${i * 55}ms` }}
              onClick={() => {
                setQuestion(s);
                taRef.current?.focus();
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn-ghost" onClick={() => go(1)}>
          <ArrowLeft width={16} height={16} />
          Back
        </button>
        <button
          className="btn btn-primary btn-lg"
          disabled={qLen < 5}
          onClick={() => {
            track("AddToCart", { content_name: "question_asked" });
            // a follow-up inside the token window skips the payment step
            go(token ? 4 : 3);
          }}
        >
          {qLen < 5 ? "Write your question" : token ? "Reveal the answer" : "Continue"}
          {qLen >= 5 ? <ArrowRight width={17} height={17} /> : null}
        </button>
      </div>
    </div>
  );

  const { minAmount, maxAmount, presets, note, freeHint } = site.payment;
  const pct = ((amount - minAmount) / (maxAmount - minAmount)) * 100;
  const intensity = Math.min(1, Math.log10(Math.max(amount, 1)) / Math.log10(maxAmount));

  const Pay = (
    <div className="step">
      <div className="step-head">
        <span className="eyebrow">Step Three</span>
        <h2 className="step-title" style={{ marginTop: 10 }}>{site.payment.title}</h2>
        <p className="step-sub">{site.payment.subtitle}</p>
      </div>

      <div className="pay">
        <div
          className="diya"
          style={{ "--glow-scale": 0.6 + intensity * 0.75, "--glow-op": 0.28 + intensity * 0.6 }}
        >
          <div className="diya-glow" />
          <Diya size={96} />
        </div>

        <div className="amount-display">
          <div className="amount-value"><sup>₹</sup>{amount.toLocaleString("en-IN")}</div>
          <div className="amount-caption">Your offering</div>
        </div>

        <div className="presets">
          {presets.map((p) => (
            <button
              key={p}
              className="preset"
              aria-pressed={amount === p}
              onClick={() => setAmount(p)}
            >
              ₹{p}
            </button>
          ))}
        </div>

        <div className="slider-wrap">
          <input
            className="slider"
            type="range"
            min={minAmount}
            max={maxAmount}
            step={10}
            value={amount}
            style={{ "--pct": `${pct}%` }}
            onChange={(e) => setAmount(Number(e.target.value))}
            aria-label="Choose your amount"
          />
          <div className="slider-scale">
            <span>₹{minAmount}</span>
            <span>Slide to choose</span>
            <span>₹{maxAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <dl className="pay-summary" style={{ marginTop: 26 }}>
          <div className="pay-summary-row">
            <dt>Chart</dt>
            <dd>{chart ? `${chart.lagna.rashi} lagna · ${chart.chandra.nakshatra} ${chart.chandra.pada}` : "—"}</dd>
          </div>
          <div className="pay-summary-row">
            <dt>Born</dt>
            <dd>
              {date.day} {MONTHS[date.month].slice(0, 3)} {date.year}
              {timeKnown ? `, ${String(time.hour % 12 || 12)}:${String(time.minute).padStart(2, "0")} ${time.hour >= 12 ? "PM" : "AM"}` : ""}
            </dd>
          </div>
          <div className="pay-summary-row">
            <dt>Question</dt>
            <dd>{question}</dd>
          </div>
        </dl>

        {error ? (
          <div className="alert">
            <Alert width={17} height={17} />
            <span>{error}</span>
          </div>
        ) : null}

        <button
          className="btn btn-primary btn-lg btn-block"
          disabled={paying}
          onClick={startPayment}
        >
          {paying ? <span className="spinner" /> : <Lock width={17} height={17} />}
          {paying ? "Opening payment…" : `Pay ₹${amount.toLocaleString("en-IN")} & reveal`}
        </button>

        <p className="pay-note">
          <Lock width={13} height={13} />
          {note}
        </p>
        {freeHint ? <p className="pay-note">{freeHint}</p> : null}

        <div className="step-actions" style={{ paddingTop: 18 }}>
          <button className="btn btn-ghost" onClick={() => go(2)}>
            <ArrowLeft width={16} height={16} />
            Change my question
          </button>
        </div>
      </div>
    </div>
  );

  /* ========================================================== render ===== */
  const activeRail = railFor(step);

  return (
    <section className="funnel wrap-narrow" id="start" ref={shellRef}>
      <div className="card funnel-card">
        <div className="rail" aria-label="Progress">
          {RAIL.map((label, i) => (
            <div key={label} style={{ display: "contents" }}>
              <div
                className="rail-step"
                data-state={i < activeRail ? "done" : i === activeRail ? "active" : "todo"}
              >
                <span className="rail-dot">{i < activeRail ? "✓" : i + 1}</span>
                <span className="rail-label">{label}</span>
              </div>
              {i < RAIL.length - 1 ? (
                <span className="rail-line" data-filled={i < activeRail} />
              ) : null}
            </div>
          ))}
        </div>

        {step === 0 ? Birth : null}
        {step === 1 ? Place : null}
        {step === 2 ? Ask : null}
        {step === 3 ? Pay : null}
        {step === 4 && chart && token ? (
          <Reading
            key={question}
            chart={chart}
            birth={birth}
            question={question}
            token={token}
            amount={amount}
            onFollowUp={() => { setQuestion(""); go(2); }}
          />
        ) : null}
      </div>
    </section>
  );
}
