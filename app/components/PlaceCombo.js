"use client";

import { useEffect, useRef, useState } from "react";
import { searchCities } from "@/lib/cities";
import { Pin, X } from "./Icons";

/**
 * Birth-place combobox. Needed for a real ascendant - the lagna depends on
 * latitude, longitude and the zone offset, not just the calendar date.
 */
export default function PlaceCombo({ value, onChange }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const boxRef = useRef(null);

  const results = q.length >= 2 ? searchCities(q, 8) : [];

  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (city) => {
    onChange(city);
    setQ("");
    setOpen(false);
    setCursor(0);
  };

  const onKeyDown = (e) => {
    if (!open || !results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(results[cursor]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (value) {
    return (
      <div>
        <span className="city-chip">
          <Pin width={15} height={15} style={{ color: "var(--saffron-500)" }} />
          {value.label}
          <button type="button" onClick={() => onChange(null)} aria-label="Change birth place">
            <X />
          </button>
        </span>
        <p className="field-hint">
          {value.lat.toFixed(2)}&deg;{value.lat >= 0 ? "N" : "S"},{" "}
          {Math.abs(value.lon).toFixed(2)}&deg;{value.lon >= 0 ? "E" : "W"} &middot; UTC
          {value.tz >= 0 ? "+" : ""}{value.tz}
        </p>
      </div>
    );
  }

  return (
    <div className="combo" ref={boxRef}>
      <input
        className="input"
        type="text"
        value={q}
        placeholder="Start typing your birth city&hellip;"
        autoComplete="off"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls="city-list"
        aria-autocomplete="list"
        onChange={(e) => { setQ(e.target.value); setOpen(true); setCursor(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />

      {open && results.length > 0 ? (
        <div className="combo-list" id="city-list" role="listbox">
          {results.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className="combo-item"
              role="option"
              aria-selected={i === cursor}
              onMouseEnter={() => setCursor(i)}
              onClick={() => pick(c)}
            >
              <b>{c.name}</b>
              <span>{c.region}</span>
            </button>
          ))}
        </div>
      ) : null}

      {open && q.length >= 2 && results.length === 0 ? (
        <p className="field-hint">
          No match. Try the nearest large city &mdash; a few kilometres will not
          move your chart.
        </p>
      ) : (
        <p className="field-hint">Used to calculate your rising sign (lagna).</p>
      )}
    </div>
  );
}
