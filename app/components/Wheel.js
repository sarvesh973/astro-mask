"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ITEM_H = 42;

/* Light haptic tick on supporting devices - makes the wheel feel physical. */
function tick() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try { navigator.vibrate(6); } catch {}
  }
}

/* ==========================================================================
   A single scroll-snap column.

   Three ways to move it, because people try all three:
     - touch / trackpad / mouse wheel  -> native scrolling does the physics
     - click and drag with a mouse     -> pointer handlers below, with flick
     - click an item, or arrow keys    -> jump straight to it

   Native scroll stays in charge on touch (it is smoother than anything we
   could write), and the drag path only engages for mouse and pen.
   ========================================================================== */
function Wheel({ items, index, onChange, label, format }) {
  const ref = useRef(null);
  const programmatic = useRef(false);
  const lastReported = useRef(index);
  const frame = useRef(0);
  const settleTimer = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(index);

  const clamp = useCallback(
    (i) => Math.max(0, Math.min(items.length - 1, i)),
    [items.length]
  );

  /* position on mount without animating */
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = index * ITEM_H;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* re-sync only when the value changed from OUTSIDE this wheel; repositioning
     after our own onChange would fight the scroll still in flight */
  useEffect(() => {
    setActive(index);
    if (lastReported.current === index) return;
    lastReported.current = index;

    const el = ref.current;
    if (!el) return;
    const target = index * ITEM_H;
    if (Math.abs(el.scrollTop - target) > 1) {
      programmatic.current = true;
      el.scrollTop = target;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => { programmatic.current = false; })
      );
    }
  }, [index]);

  const commit = useCallback((i) => {
    const c = clamp(i);
    setActive(c);
    if (c !== lastReported.current) {
      lastReported.current = c;
      onChange(c);
    }
  }, [clamp, onChange]);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // live visual feedback while the finger or wheel is still moving
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const i = clamp(Math.round(el.scrollTop / ITEM_H));
      setActive((prev) => {
        if (prev !== i && !programmatic.current) tick();
        return i;
      });
    });

    // commit once the scroll comes to rest
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      if (programmatic.current || drag.current) return;
      commit(Math.round(el.scrollTop / ITEM_H));
    }, 110);
  }, [clamp, commit]);

  /* ----------------------------------------------------------- dragging -- */

  const onPointerDown = (e) => {
    // touch keeps native scrolling; it is smoother than a JS drag
    if (e.pointerType === "touch") return;
    if (e.button !== undefined && e.button !== 0) return;

    const el = ref.current;
    if (!el) return;

    drag.current = {
      startY: e.clientY,
      startTop: el.scrollTop,
      lastY: e.clientY,
      lastT: performance.now(),
      velocity: 0,
      moved: false,
    };
    try { el.setPointerCapture(e.pointerId); } catch {}
    el.style.scrollSnapType = "none";   // follow the cursor exactly
    el.dataset.dragging = "true";
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    const el = ref.current;
    if (!d || !el) return;

    const dy = e.clientY - d.startY;
    if (Math.abs(dy) > 2) d.moved = true;
    el.scrollTop = d.startTop - dy;

    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.velocity = (e.clientY - d.lastY) / dt;  // px per ms
    d.lastY = e.clientY;
    d.lastT = now;

    e.preventDefault();
  };

  const endDrag = (e, cancelled = false) => {
    const d = drag.current;
    const el = ref.current;
    if (!d || !el) return;
    drag.current = null;

    try { el.releasePointerCapture(e.pointerId); } catch {}
    delete el.dataset.dragging;
    el.style.scrollSnapType = "";

    if (cancelled) return;

    // carry a little momentum, capped so it never spins away
    const flick = Math.max(-5, Math.min(5, Math.round(-d.velocity * 80)));
    const i = clamp(Math.round(el.scrollTop / ITEM_H) + flick);

    if (d.moved) {
      suppressClick.current = true;
      setTimeout(() => { suppressClick.current = false; }, 0);
    }

    el.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
    commit(i);
  };

  useEffect(() => () => {
    cancelAnimationFrame(frame.current);
    clearTimeout(settleTimer.current);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault(); commit(index + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault(); commit(index - 1);
    } else if (e.key === "PageDown") {
      e.preventDefault(); commit(index + 5);
    } else if (e.key === "PageUp") {
      e.preventDefault(); commit(index - 5);
    } else if (e.key === "Home") {
      e.preventDefault(); commit(0);
    } else if (e.key === "End") {
      e.preventDefault(); commit(items.length - 1);
    }
  };

  return (
    <div>
      {label ? <div className="wheel-cap">{label}</div> : null}
      <div
        ref={ref}
        className="wheel"
        onScroll={handleScroll}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e)}
        onPointerCancel={(e) => endDrag(e, true)}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`${label}-${active}`}
      >
        <div className="wheel-pad" aria-hidden="true" />
        {items.map((it, i) => {
          const dist = Math.abs(i - active);
          return (
            <div
              key={it.key ?? i}
              id={`${label}-${i}`}
              className="wheel-item"
              role="option"
              aria-selected={i === active}
              data-sel={i === active}
              data-near={dist === 0 ? "0" : dist === 1 ? "1" : "2"}
              onClick={() => { if (!suppressClick.current) commit(i); }}
            >
              {format ? format(it) : it.label}
            </div>
          );
        })}
        <div className="wheel-pad" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- dates */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const ordinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Three-column date-of-birth picker.
 * `value` = { day, month (0-11), year }
 */
export function DateWheels({ value, onChange }) {
  const thisYear = new Date().getFullYear();
  const minYear = thisYear - 100;

  const years = useMemo(
    () => Array.from({ length: thisYear - minYear + 1 }, (_, i) => ({
      key: minYear + i, label: String(minYear + i),
    })),
    [thisYear, minYear]
  );

  const months = useMemo(
    () => MONTHS.map((m, i) => ({ key: i, label: m, short: MONTHS_SHORT[i] })),
    []
  );

  const dayCount = daysInMonth(value.month, value.year);
  const days = useMemo(
    () => Array.from({ length: dayCount }, (_, i) => ({ key: i + 1, label: String(i + 1) })),
    [dayCount]
  );

  /* Feb 30 can't exist - pull the day back when the month shortens */
  useEffect(() => {
    if (value.day > dayCount) onChange({ ...value, day: dayCount });
  }, [dayCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="wheels" style={{ "--item-h": `${ITEM_H}px` }}>
        <div className="wheels-band" />
        <Wheel
          label="Day"
          items={days}
          index={value.day - 1}
          onChange={(i) => onChange({ ...value, day: i + 1 })}
        />
        <Wheel
          label="Month"
          items={months}
          index={value.month}
          onChange={(i) => onChange({ ...value, month: i })}
          format={(m) => m.short}
        />
        <Wheel
          label="Year"
          items={years}
          index={value.year - minYear}
          onChange={(i) => onChange({ ...value, year: minYear + i })}
        />
      </div>

      <div className="readout" aria-live="polite">
        {ordinal(value.day)} {MONTHS[value.month]} {value.year}
        <small>Date of birth</small>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- times */

/**
 * Hour / minute / meridiem picker.
 * `value` = { hour (0-23), minute }
 */
export function TimeWheels({ value, onChange }) {
  const hours12 = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({
      key: i, label: String(i === 0 ? 12 : i),
    })),
    []
  );
  const minutes = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ({
      key: i, label: String(i).padStart(2, "0"),
    })),
    []
  );
  const meridiem = useMemo(
    () => [{ key: "AM", label: "AM" }, { key: "PM", label: "PM" }],
    []
  );

  const isPM = value.hour >= 12;
  const h12 = value.hour % 12;

  const setH12 = (i) => onChange({ ...value, hour: i + (isPM ? 12 : 0) });
  const setPM = (i) => onChange({ ...value, hour: (value.hour % 12) + (i === 1 ? 12 : 0) });

  const display = `${h12 === 0 ? 12 : h12}:${String(value.minute).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;

  return (
    <div>
      <div className="wheels wheels--time" style={{ "--item-h": `${ITEM_H}px` }}>
        <div className="wheels-band" />
        <Wheel label="Hour" items={hours12} index={h12} onChange={setH12} />
        <Wheel
          label="Minute"
          items={minutes}
          index={value.minute}
          onChange={(i) => onChange({ ...value, minute: i })}
        />
        <Wheel label="AM/PM" items={meridiem} index={isPM ? 1 : 0} onChange={setPM} />
      </div>

      <div className="readout" aria-live="polite">
        {display}
        <small>Time of birth</small>
      </div>
    </div>
  );
}

export { MONTHS, ordinal };
