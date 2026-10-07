"use client";

import { useEffect, useRef, useState } from "react";
import { Kundali, ZodiacWheel } from "./Ornaments";
import Markdown from "./Markdown";
import {
  Alert, ArrowRight, Check, Copy, Moon, Scroll, Sparkle, Sun,
} from "./Icons";

/* The casting sequence shows REAL computed values as they land. It runs while
   the model is already generating, so it costs no extra waiting time. */
function castSteps(chart) {
  return [
    { icon: Sparkle, label: "Sidereal correction applied", value: chart.meta.ayanamsa },
    { icon: Sun, label: "Ascendant at your birth minute", value: `${chart.lagna.rashi} ${chart.lagna.degree}` },
    { icon: Moon, label: "Janma nakshatra", value: `${chart.chandra.nakshatra} · pada ${chart.chandra.pada}` },
    { icon: Scroll, label: "Running mahadasha", value: `${chart.dasha.current.maha} / ${chart.dasha.current.antara}` },
    { icon: Check, label: "Bhavas and lords mapped", value: `${chart.planets.length} grahas` },
  ];
}

export default function Reading({ chart, birth, question, token, amount, onFollowUp }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [streaming, setStreaming] = useState(true);
  const [cast, setCast] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);
  const steps = castSteps(chart);

  /* ---- fire the request immediately, in parallel with the animation ---- */
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = async () => {
      try {
        const res = await fetch("/api/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, question, birth }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "The reading could not be generated.");
          setStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const dec = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          setText((t) => t + dec.decode(value, { stream: true }));
        }
      } catch {
        setError("Connection interrupted. Your payment is safe — please retry.");
      } finally {
        setStreaming(false);
      }
    };

    run();
  }, [token, question, birth]);

  /* ---- advance the casting log ---- */
  useEffect(() => {
    if (cast >= steps.length) return;
    const t = setTimeout(() => setCast((c) => c + 1), cast === 0 ? 420 : 560);
    return () => clearTimeout(t);
  }, [cast, steps.length]);

  /* ---- reveal once the chart is cast AND there is something to show ---- */
  useEffect(() => {
    if (cast >= steps.length && (text.length > 0 || error)) {
      const t = setTimeout(() => setRevealed(true), 350);
      return () => clearTimeout(t);
    }
  }, [cast, steps.length, text, error]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked - ignore */ }
  };

  /* ====================================================== casting view === */
  if (!revealed) {
    return (
      <div className="step">
        <div className="casting">
          <ZodiacWheel />
          <h2 className="step-title">Casting your chart</h2>
          <p className="step-sub" style={{ marginBottom: 24 }}>
            Computing sidereal positions for {birth.place}
          </p>

          <div className="cast-log">
            {steps.slice(0, cast).map((s, i) => {
              const Icon = s.icon;
              return (
                <div className="cast-row" key={i} style={{ animationDelay: `${i * 40}ms` }}>
                  <Icon width={16} height={16} />
                  {s.label}
                  <b>{s.value}</b>
                </div>
              );
            })}
            {cast < steps.length ? <div className="shimmer" style={{ marginTop: 2 }} /> : null}
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================= reading view == */
  return (
    <div className="step">
      <div className="answer">
        <div className="step-head">
          <span className="eyebrow">Your Reading</span>
          <h2 className="step-title" style={{ marginTop: 10 }}>
            {chart.lagna.rashi} Lagna · {chart.chandra.nakshatra} Nakshatra
          </h2>
          <p className="step-sub">
            {String(birth.day).padStart(2, "0")}/{String(birth.month).padStart(2, "0")}/{birth.year}
            {birth.timeKnown
              ? ` · ${String(birth.hour).padStart(2, "0")}:${String(birth.minute).padStart(2, "0")}`
              : " · time approximate"}
            {" · "}{birth.place}
          </p>
        </div>

        {/* --- the actual chart, drawn from computed positions --- */}
        <Kundali chart={chart} />

        <dl className="facts">
          <div className="fact">
            <dt>Lagna</dt>
            <dd>{chart.lagna.rashi}<small>{chart.lagna.rashiEn} · lord {chart.lagna.lord}</small></dd>
          </div>
          <div className="fact">
            <dt>Chandra Rashi</dt>
            <dd>{chart.chandra.rashi}<small>{chart.chandra.rashiEn} · lord {chart.chandra.lord}</small></dd>
          </div>
          <div className="fact">
            <dt>Nakshatra</dt>
            <dd>{chart.chandra.nakshatra}<small>pada {chart.chandra.pada} · {chart.chandra.nakshatraLord}</small></dd>
          </div>
          <div className="fact">
            <dt>Mahadasha</dt>
            <dd>{chart.dasha.current.maha}<small>till {chart.dasha.current.mahaTo}</small></dd>
          </div>
        </dl>

        <details className="details">
          <summary>Show the full planetary table and dasha sequence</summary>
          <div className="details-body">
            <div className="table-scroll">
              <table className="ptable">
                <thead>
                  <tr>
                    <th>Graha</th><th>Rashi</th><th>Degree</th>
                    <th>Bhava</th><th>Nakshatra</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.planets.map((p) => (
                    <tr key={p.name}>
                      <td className="pl-name">
                        {p.name}
                        {p.retrograde ? <span className="pl-retro">R</span> : null}
                      </td>
                      <td>{p.rashi}</td>
                      <td>{p.degreeInRashi}</td>
                      <td>{p.house}</td>
                      <td>{p.nakshatra} ({p.pada})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 14 }}>
              {chart.meta.system} · ayanamsa {chart.meta.ayanamsa} · JD {chart.meta.julianDay}
            </p>

            <div className="table-scroll" style={{ marginTop: 14 }}>
              <table className="ptable">
                <thead>
                  <tr><th>Mahadasha</th><th>From</th><th>To</th></tr>
                </thead>
                <tbody>
                  {chart.dasha.sequence.map((d) => (
                    <tr key={d.lord}
                        style={d.lord === chart.dasha.current.maha
                          ? { background: "rgba(255,183,3,0.16)", fontWeight: 600 }
                          : undefined}>
                      <td>{d.lord}</td><td>{d.from}</td><td>{d.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </details>

        {/* --- the question and the answer --- */}
        <blockquote style={{
          margin: "28px 0 22px",
          padding: "16px 20px",
          background: "var(--cream-2)",
          borderLeft: "3px solid var(--saffron-500)",
          borderRadius: "0 14px 14px 0",
          fontFamily: "var(--font-display), serif",
          fontSize: 19,
          color: "var(--ink)",
        }}>
          {question}
        </blockquote>

        {error ? (
          <div className="alert">
            <Alert width={17} height={17} />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="answer-body">
          <Markdown text={text} />
          {streaming ? <span className="caret" /> : null}
          {streaming && !text ? (
            <div style={{ display: "grid", gap: 10 }}>
              <div className="shimmer" style={{ width: "92%" }} />
              <div className="shimmer" style={{ width: "100%" }} />
              <div className="shimmer" style={{ width: "78%" }} />
            </div>
          ) : null}
        </div>

        {!streaming ? (
          <div className="answer-actions">
            <button className="btn btn-ghost" onClick={copy}>
              {copied ? <Check width={16} height={16} /> : <Copy width={16} height={16} />}
              {copied ? "Copied" : "Copy reading"}
            </button>
            <button className="btn btn-ghost" onClick={() => window.print()}>
              <Scroll width={16} height={16} />
              Save as PDF
            </button>
            <button className="btn btn-primary" onClick={onFollowUp}>
              Ask a follow-up
              <ArrowRight width={16} height={16} />
            </button>
          </div>
        ) : null}

        {!streaming && !error ? (
          <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 16 }}>
            Your follow-up is included — no further payment for the next two hours.
          </p>
        ) : null}
      </div>
    </div>
  );
}
