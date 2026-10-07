"use client";

import { useRef } from "react";
import { ArrowRight } from "./Icons";

/* ============================================================================
   The call-to-action button.

   Four micro-interactions, all driven by one pointer handler:
     1. magnetic pull  - the button leans a few px toward the cursor
     2. spotlight      - a soft highlight tracks the cursor across the fill
     3. label swap     - the text slides up and a copy rises into its place
     4. arrow loop     - the arrow exits the badge right, a second enters left

   All of it is pointer-driven, so it sits still until someone reaches for it
   rather than animating on a loop in the corner of the eye.
   ========================================================================= */
export default function Cta({
  href,
  children,
  size = "lg",
  variant = "solid",
  onClick,
  className = "",
}) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onPointerMove = (e) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      // normalised -1..1, scaled down hard so it stays a hint, not a wobble
      el.style.setProperty("--tx", `${((x / r.width - 0.5) * 10).toFixed(2)}px`);
      el.style.setProperty("--ty", `${((y / r.height - 0.5) * 6).toFixed(2)}px`);
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  };

  const shared = {
    ref,
    className: `cta cta--${size} cta--${variant} ${className}`.trim(),
    onPointerMove,
    onPointerLeave: reset,
    onBlur: reset,
  };

  const inner = (
    <>
      <span className="cta-fill" aria-hidden="true" />
      <span className="cta-label">
        <span className="cta-label-a">{children}</span>
        <span className="cta-label-b" aria-hidden="true">{children}</span>
      </span>
      <span className="cta-badge" aria-hidden="true">
        <ArrowRight width={16} height={16} className="cta-arrow cta-arrow--out" />
        <ArrowRight width={16} height={16} className="cta-arrow cta-arrow--in" />
      </span>
    </>
  );

  if (href) {
    return <a href={href} {...shared}>{inner}</a>;
  }
  return <button type="button" onClick={onClick} {...shared}>{inner}</button>;
}
