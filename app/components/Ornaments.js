/* Decorative + diagrammatic SVG: mandala backdrop, spinning zodiac wheel,
   and a real North-Indian kundali rendered from computed chart data. */

/* ---------------------------------------------------------------- mandala */

function Mandala({ className }) {
  const petals = 24;
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1">
        <circle cx="200" cy="200" r="196" />
        <circle cx="200" cy="200" r="170" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="86" />
        <circle cx="200" cy="200" r="42" />
        {Array.from({ length: petals }, (_, i) => {
          const a = (i * 360) / petals;
          return (
            <g key={i} transform={`rotate(${a} 200 200)`}>
              <path d="M200 14 C 228 60, 228 96, 200 128 C 172 96, 172 60, 200 14 Z" />
              <line x1="200" y1="130" x2="200" y2="160" />
            </g>
          );
        })}
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 30} 200 200)`}>
            <path d="M200 160 L 216 200 L 200 240 L 184 200 Z" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function MandalaBg() {
  return (
    <div className="page-bg" aria-hidden="true">
      <Mandala className="mandala mandala--tr" />
      <Mandala className="mandala mandala--bl" />
    </div>
  );
}

/* ----------------------------------------------------------- zodiac wheel */

/** Spinning dial shown while the chart is being cast. */
export function ZodiacWheel() {
  const glyphs = ["♈", "♉", "♊", "♋", "♌", "♍",
                  "♎", "♏", "♐", "♑", "♒", "♓"];
  return (
    <div className="zodiac-wheel" aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none">
        {/* outer ring: 27 nakshatra ticks */}
        <g className="zw-ring" stroke="var(--gold)" strokeWidth="1">
          <circle cx="100" cy="100" r="94" />
          <circle cx="100" cy="100" r="84" />
          {Array.from({ length: 27 }, (_, i) => (
            <line
              key={i}
              x1="100" y1="6" x2="100" y2="16"
              transform={`rotate(${(i * 360) / 27} 100 100)`}
            />
          ))}
        </g>

        {/* middle ring: 12 rashi sectors with glyphs */}
        <g className="zw-ring2">
          <circle cx="100" cy="100" r="72" stroke="var(--saffron-500)" strokeWidth="1.2" opacity="0.6" />
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1="100" y1="28" x2="100" y2="172"
              stroke="var(--border)"
              strokeWidth="0.8"
              transform={`rotate(${i * 15} 100 100)`}
            />
          ))}
          {glyphs.map((g, i) => {
            const a = ((i * 30 + 15) - 90) * (Math.PI / 180);
            return (
              <text
                key={i}
                x={100 + 78 * Math.cos(a)}
                y={100 + 78 * Math.sin(a)}
                fontSize="11"
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--saffron-700)"
              >
                {g}
              </text>
            );
          })}
        </g>

        {/* core */}
        <g className="zw-core">
          <circle cx="100" cy="100" r="30" fill="url(#coreGrad)" />
          <circle cx="100" cy="100" r="30" stroke="var(--gold)" strokeWidth="1.4" />
          <path
            d="M100 80 L108 100 L100 120 L92 100 Z"
            fill="var(--surface)"
            opacity="0.85"
          />
        </g>

        <defs>
          <radialGradient id="coreGrad" cx="0.4" cy="0.35" r="0.75">
            <stop stopColor="#FFD166" />
            <stop offset="0.6" stopColor="#F26419" />
            <stop offset="1" stopColor="#B23A00" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------- kundali */

/* Fixed house slots of a North-Indian (diamond) chart, 400x400 box. */
const HOUSE_POS = [
  { x: 200, y: 74 },   // 1  top centre
  { x: 112, y: 32 },   // 2
  { x: 34,  y: 110 },  // 3
  { x: 74,  y: 200 },  // 4
  { x: 34,  y: 290 },  // 5
  { x: 112, y: 368 },  // 6
  { x: 200, y: 326 },  // 7
  { x: 288, y: 368 },  // 8
  { x: 366, y: 290 },  // 9
  { x: 326, y: 200 },  // 10
  { x: 366, y: 110 },  // 11
  { x: 288, y: 32 },   // 12
];

const ABBR = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
  Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
};

/**
 * Renders the actual birth chart. `planets` come straight from computeChart,
 * each already carrying its whole-sign house number.
 */
export function Kundali({ chart }) {
  if (!chart) return null;
  const lagnaIdx = chart.lagna.rashiIndex;

  const byHouse = {};
  for (const p of chart.planets) {
    (byHouse[p.house] ||= []).push(p);
  }

  return (
    <div className="kundali">
      <svg viewBox="-6 -6 412 412" role="img"
           aria-label={`Birth chart with ${chart.lagna.rashiEn} ascendant`}>
        {/* frame + the two diagonals + inner diamond */}
        <rect className="k-frame" x="0" y="0" width="400" height="400" rx="3" />
        <path className="k-line" d="M0 0 L400 400 M400 0 L0 400" />
        <path className="k-line" d="M200 0 L400 200 L200 400 L0 200 Z" />

        {HOUSE_POS.map((pos, i) => {
          const house = i + 1;
          const rashiNum = ((lagnaIdx + i) % 12) + 1;
          const list = byHouse[house] || [];

          // stack planets under the rashi number, 2 per row
          const rows = [];
          for (let k = 0; k < list.length; k += 2) rows.push(list.slice(k, k + 2));

          return (
            <g key={house}>
              <text className="k-num" x={pos.x} y={pos.y - 16} textAnchor="middle">
                {rashiNum}
              </text>
              {rows.map((row, r) => (
                <text
                  key={r}
                  className="k-pl"
                  x={pos.x}
                  y={pos.y + 2 + r * 15}
                  textAnchor="middle"
                >
                  {row.map((p) => ABBR[p.name] + (p.retrograde ? "ᴿ" : "")).join(" ")}
                </text>
              ))}
            </g>
          );
        })}

        {/* lagna marker on house 1 */}
        <text x="200" y="56" textAnchor="middle" fontSize="9"
              fill="var(--saffron-600)" fontWeight="700" letterSpacing="1">
          ASC
        </text>
      </svg>
    </div>
  );
}
