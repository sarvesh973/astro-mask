/* Inline SVG icon set - no icon library, no extra bytes over the wire. */

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const Check = (p) => (
  <svg {...base} {...p}><path d="M20 6 9 17l-5-5" /></svg>
);

export const ArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 5l7 7-7 7" /></svg>
);

export const ArrowLeft = (p) => (
  <svg {...base} {...p}><path d="M19 12H5M11 19l-7-7 7-7" /></svg>
);

export const Lock = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const Sparkle = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" />
    <circle cx="12" cy="12" r="2.3" />
  </svg>
);

export const Sun = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
  </svg>
);

export const Moon = (p) => (
  <svg {...base} {...p}>
    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z" />
  </svg>
);

export const Question = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M9.4 9.2a2.7 2.7 0 1 1 3.9 2.4c-.8.4-1.3 1-1.3 1.9v.4" />
    <circle cx="12" cy="17.4" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const Lotus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20c-4.2 0-7.6-2.6-8.5-5.4 1.6-.9 3.3-.7 4.6.1" />
    <path d="M12 20c4.2 0 7.6-2.6 8.5-5.4-1.6-.9-3.3-.7-4.6.1" />
    <path d="M12 20c-2.6-2-3.8-5-3.3-8.1.4-2.3 1.6-4.2 3.3-5.9 1.7 1.7 2.9 3.6 3.3 5.9.5 3.1-.7 6.1-3.3 8.1Z" />
  </svg>
);

export const Scroll = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3h11a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2Z" />
    <path d="M8 8h7M8 12h7M8 16h4" />
  </svg>
);

export const Calendar = (p) => (
  <svg {...base} {...p}>
    <rect x="3.2" y="5" width="17.6" height="16" rx="2.4" />
    <path d="M3.2 10h17.6M8 3v4M16 3v4" />
  </svg>
);

export const Clock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 7.2V12l3.2 2" />
  </svg>
);

export const Pin = (p) => (
  <svg {...base} {...p}>
    <path d="M20 10.5c0 5.6-8 11.5-8 11.5s-8-5.9-8-11.5a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10.3" r="2.8" />
  </svg>
);

export const X = (p) => (
  <svg {...base} width={14} height={14} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
);

export const Alert = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.6 2.6 20.4h18.8L12 3.6Z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const Star = (p) => (
  <svg {...base} width={14} height={14} fill="currentColor" stroke="none" {...p}>
    <path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9 2.9-6Z" />
  </svg>
);

export const Copy = (p) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2.2" />
    <path d="M15 9V5.2A2.2 2.2 0 0 0 12.8 3H5.2A2.2 2.2 0 0 0 3 5.2v7.6A2.2 2.2 0 0 0 5.2 15H9" />
  </svg>
);

export const Share = (p) => (
  <svg {...base} {...p}>
    <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
    <path d="M16 6l-4-4-4 4M12 2.5V15" />
  </svg>
);

export const Flame = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2.5s5 4.4 5 9.3a5 5 0 0 1-10 0c0-2 1.2-3.6 2.2-4.6.3 1 .9 1.8 1.6 2.1.5-2.3.9-4.6 1.2-6.8Z" />
  </svg>
);

/** The small diya (oil lamp) that brightens with the payment amount. */
export function Diya({ size = 86 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {/* flame */}
      <g className="diya-flame" style={{ transformBox: "fill-box" }}>
        <path
          d="M50 20c0 0 9 9.5 9 17.5a9 9 0 0 1-18 0C41 29.5 50 20 50 20Z"
          fill="url(#flameGrad)"
        />
        <path
          d="M50 29c0 0 4.4 5 4.4 9.1a4.4 4.4 0 0 1-8.8 0C45.6 34 50 29 50 29Z"
          fill="#FFF3C4"
        />
      </g>
      {/* wick */}
      <path d="M50 50v-8" stroke="#6B4A2E" strokeWidth="2.4" strokeLinecap="round" />
      {/* lamp bowl */}
      <path
        d="M20 52h60c0 11-13.4 19-30 19S20 63 20 52Z"
        fill="url(#bowlGrad)"
        stroke="#B23A00"
        strokeWidth="1.6"
      />
      <ellipse cx="50" cy="52" rx="30" ry="4.6" fill="#D94E00" opacity="0.55" />
      <defs>
        <linearGradient id="flameGrad" x1="50" y1="20" x2="50" y2="47" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF3C4" />
          <stop offset="0.45" stopColor="#FFB703" />
          <stop offset="1" stopColor="#F26419" />
        </linearGradient>
        <linearGradient id="bowlGrad" x1="20" y1="52" x2="80" y2="71" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7C948" />
          <stop offset="0.5" stopColor="#F26419" />
          <stop offset="1" stopColor="#B23A00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const ICON_MAP = { sun: Sun, question: Question, lotus: Lotus, scroll: Scroll, moon: Moon };
