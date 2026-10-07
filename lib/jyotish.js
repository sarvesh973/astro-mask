/* ============================================================================
   jyotish.js - sidereal (Vedic) chart computation, zero dependencies.

   Everything here is real astronomy, not decoration:
     - Sun / Moon longitudes   (Meeus, Astronomical Algorithms)
     - Mercury -> Saturn       (JPL/Standish approximate elements, 1800-2050)
     - Rahu / Ketu             (mean lunar node)
     - Lagna (ascendant)       from local sidereal time + geographic latitude
     - Lahiri ayanamsa         applied to convert tropical -> sidereal
     - Nakshatra + pada, Tithi, and full Vimshottari Dasha (maha + antara)

   Accuracy: Sun/Moon under 0.05 deg, planets under ~0.5 deg, node exact-mean.
   That is far inside the 30 deg rashi and 3 deg 20' pada boundaries used here.
   ========================================================================= */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

const norm360 = (d) => ((d % 360) + 360) % 360;
const sin = (d) => Math.sin(d * D2R);
const cos = (d) => Math.cos(d * D2R);
const tan = (d) => Math.tan(d * D2R);

export const RASHIS = [
  { name: "Mesha", en: "Aries", lord: "Mars", element: "Fire" },
  { name: "Vrishabha", en: "Taurus", lord: "Venus", element: "Earth" },
  { name: "Mithuna", en: "Gemini", lord: "Mercury", element: "Air" },
  { name: "Karka", en: "Cancer", lord: "Moon", element: "Water" },
  { name: "Simha", en: "Leo", lord: "Sun", element: "Fire" },
  { name: "Kanya", en: "Virgo", lord: "Mercury", element: "Earth" },
  { name: "Tula", en: "Libra", lord: "Venus", element: "Air" },
  { name: "Vrischika", en: "Scorpio", lord: "Mars", element: "Water" },
  { name: "Dhanu", en: "Sagittarius", lord: "Jupiter", element: "Fire" },
  { name: "Makara", en: "Capricorn", lord: "Saturn", element: "Earth" },
  { name: "Kumbha", en: "Aquarius", lord: "Saturn", element: "Air" },
  { name: "Meena", en: "Pisces", lord: "Jupiter", element: "Water" },
];

export const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras" },
  { name: "Bharani", lord: "Venus", deity: "Yama" },
  { name: "Krittika", lord: "Sun", deity: "Agni" },
  { name: "Rohini", lord: "Moon", deity: "Brahma" },
  { name: "Mrigashira", lord: "Mars", deity: "Soma" },
  { name: "Ardra", lord: "Rahu", deity: "Rudra" },
  { name: "Punarvasu", lord: "Jupiter", deity: "Aditi" },
  { name: "Pushya", lord: "Saturn", deity: "Brihaspati" },
  { name: "Ashlesha", lord: "Mercury", deity: "Nagas" },
  { name: "Magha", lord: "Ketu", deity: "Pitris" },
  { name: "Purva Phalguni", lord: "Venus", deity: "Bhaga" },
  { name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman" },
  { name: "Hasta", lord: "Moon", deity: "Savitar" },
  { name: "Chitra", lord: "Mars", deity: "Tvashtar" },
  { name: "Swati", lord: "Rahu", deity: "Vayu" },
  { name: "Vishakha", lord: "Jupiter", deity: "Indragni" },
  { name: "Anuradha", lord: "Saturn", deity: "Mitra" },
  { name: "Jyeshtha", lord: "Mercury", deity: "Indra" },
  { name: "Mula", lord: "Ketu", deity: "Nirriti" },
  { name: "Purva Ashadha", lord: "Venus", deity: "Apas" },
  { name: "Uttara Ashadha", lord: "Sun", deity: "Vishwadevas" },
  { name: "Shravana", lord: "Moon", deity: "Vishnu" },
  { name: "Dhanishta", lord: "Mars", deity: "Vasus" },
  { name: "Shatabhisha", lord: "Rahu", deity: "Varuna" },
  { name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada" },
  { name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahirbudhnya" },
  { name: "Revati", lord: "Mercury", deity: "Pushan" },
];

export const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
  "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
];

/* Vimshottari sequence - 120 years total */
const DASHA_SEQ = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

/* ---------------------------------------------------------------- time ---- */

/** Julian Day from a UTC calendar moment. */
export function julianDay(y, m, d, hoursUT = 0) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d + B - 1524.5 + hoursUT / 24
  );
}

/**
 * Julian Day from a *local* birth moment plus the zone offset in hours.
 * e.g. India -> tzOffset 5.5
 */
export function julianDayFromLocal({ year, month, day, hour, minute, tzOffset }) {
  const localHours = hour + minute / 60;
  return julianDay(year, month, day, localHours - tzOffset);
}

/* ------------------------------------------------------------ ayanamsa ---- */

/** Lahiri (Chitrapaksha) ayanamsa in degrees. */
export function lahiriAyanamsa(jd) {
  const t = (jd - 2451545.0) / 365.25; // years from J2000
  return 23.853 + 0.0139604 * t + 3.08e-7 * t * t;
}

/* ----------------------------------------------------------- sun / moon --- */

export function sunLongitude(jd) {
  const n = jd - 2451545.0;
  const L = norm360(280.46646 + 0.9856474 * n);
  const g = norm360(357.52911 + 0.9856003 * n);
  return norm360(L + 1.914602 * sin(g) + 0.019993 * sin(2 * g) + 0.000289 * sin(3 * g));
}

export function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M  = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;

  const l =
    6.288774 * sin(Mp) +
    1.274027 * sin(2 * D - Mp) +
    0.658314 * sin(2 * D) +
    0.213618 * sin(2 * Mp) -
    0.185116 * sin(M) -
    0.114332 * sin(2 * F) +
    0.058793 * sin(2 * D - 2 * Mp) +
    0.057066 * sin(2 * D - M - Mp) +
    0.053322 * sin(2 * D + Mp) +
    0.045758 * sin(2 * D - M) -
    0.040923 * sin(M - Mp) -
    0.034720 * sin(D) -
    0.030383 * sin(M + Mp) +
    0.015327 * sin(2 * D - 2 * F) -
    0.012528 * sin(Mp + 2 * F) +
    0.010980 * sin(Mp - 2 * F) +
    0.010675 * sin(4 * D - Mp) +
    0.010034 * sin(3 * Mp) +
    0.008548 * sin(4 * D - 2 * Mp);

  return norm360(Lp + l);
}

/** Mean lunar node (Rahu), tropical. */
export function rahuLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  return norm360(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
}

/* -------------------------------------------------------------- planets --- */
/* JPL approximate elements: a, e, I, L, longPeri, longNode (+ per-century rates) */
const PLANETS = {
  Mercury: [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593,
            0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
  Venus:   [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255,
            0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418],
  Earth:   [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0,
            0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
  Mars:    [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891,
            0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
  Jupiter: [5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909,
            -0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
  Saturn:  [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448,
            -0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
};

function heliocentric(name, T) {
  const p = PLANETS[name];
  const a = p[0] + p[6] * T;
  const e = p[1] + p[7] * T;
  const I = p[2] + p[8] * T;
  const L = p[3] + p[9] * T;
  const wbar = p[4] + p[10] * T;
  const O = p[5] + p[11] * T;

  const w = wbar - O;                 // argument of perihelion
  let M = norm360(L - wbar);
  if (M > 180) M -= 360;

  // Kepler equation, Newton-Raphson
  let E = M * D2R;
  const Mr = M * D2R;
  for (let i = 0; i < 12; i++) {
    const dE = (E - e * Math.sin(E) - Mr) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-12) break;
  }

  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cw = cos(w), sw = sin(w), cO = cos(O), sO = sin(O), cI = cos(I), sI = sin(I);
  return {
    x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
    y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
    z: (sw * sI) * xp + (cw * sI) * yp,
  };
}

/** Geocentric apparent ecliptic longitude of a planet, tropical degrees. */
export function planetLongitude(name, jd) {
  const T = (jd - 2451545.0) / 36525;
  const pl = heliocentric(name, T);
  const ea = heliocentric("Earth", T);
  return norm360(Math.atan2(pl.y - ea.y, pl.x - ea.x) * R2D);
}

/* --------------------------------------------------------------- lagna ---- */

/** Greenwich mean sidereal time in degrees. */
export function gmst(jd) {
  const T = (jd - 2451545.0) / 36525;
  return norm360(
    280.46061837 + 360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T - (T * T * T) / 38710000
  );
}

/** Tropical ascendant for a moment and place. lonEast positive. */
export function ascendantLongitude(jd, latDeg, lonEastDeg) {
  const T = (jd - 2451545.0) / 36525;
  const eps = 23.439291 - 0.0130042 * T;
  const ramc = norm360(gmst(jd) + lonEastDeg);

  const y = cos(ramc);
  const x = -(sin(eps) * tan(latDeg) + cos(eps) * sin(ramc));
  return norm360(Math.atan2(y, x) * R2D);
}

/* ------------------------------------------------------------- helpers ---- */

export function toRashi(siderealLon) {
  const idx = Math.floor(norm360(siderealLon) / 30);
  const deg = norm360(siderealLon) - idx * 30;
  return { index: idx, ...RASHIS[idx], degree: deg };
}

export function toNakshatra(siderealLon) {
  const lon = norm360(siderealLon);
  const span = 360 / 27;
  const idx = Math.floor(lon / span);
  const within = lon - idx * span;
  const pada = Math.floor(within / (span / 4)) + 1;
  return {
    index: idx,
    ...NAKSHATRAS[idx],
    pada,
    fractionElapsed: within / span,
  };
}

export function fmtDeg(d) {
  const deg = Math.floor(d);
  const mf = (d - deg) * 60;
  const min = Math.floor(mf);
  const sec = Math.round((mf - min) * 60);
  return deg + "°" + String(min).padStart(2, "0") + "'" + String(sec).padStart(2, "0") + '"';
}

/* ---------------------------------------------------------- vimshottari -- */

function dashaTimeline(moonSidereal, birthJD) {
  const nk = toNakshatra(moonSidereal);
  const startIdx = DASHA_SEQ.findIndex(([l]) => l === nk.lord);
  const periods = [];
  let cursor = birthJD - nk.fractionElapsed * DASHA_SEQ[startIdx][1] * 365.2425;

  for (let i = 0; i < 9; i++) {
    const [lord, years] = DASHA_SEQ[(startIdx + i) % 9];
    const days = years * 365.2425;
    periods.push({ lord, years, startJD: cursor, endJD: cursor + days });
    cursor += days;
  }
  return periods;
}

function antardashas(maha) {
  const startIdx = DASHA_SEQ.findIndex(([l]) => l === maha.lord);
  const out = [];
  let cursor = maha.startJD;
  for (let i = 0; i < 9; i++) {
    const [lord, years] = DASHA_SEQ[(startIdx + i) % 9];
    const days = (maha.years * years / 120) * 365.2425;
    out.push({ lord, startJD: cursor, endJD: cursor + days });
    cursor += days;
  }
  return out;
}

function jdToISO(jd) {
  const ms = (jd - 2440587.5) * 86400000;
  return new Date(ms).toISOString().slice(0, 10);
}

/* ==========================================================================
   computeChart - the single entry point used by the API and the UI.
   ========================================================================= */
export function computeChart({
  year, month, day, hour = 12, minute = 0,
  tzOffset = 5.5, lat = 28.6139, lon = 77.2090,
  place = "",
  nowJD = null,
}) {
  const jd = julianDayFromLocal({ year, month, day, hour, minute, tzOffset });
  const ayan = lahiriAyanamsa(jd);
  const sid = (tropical) => norm360(tropical - ayan);

  const tropSun = sunLongitude(jd);
  const tropMoon = moonLongitude(jd);
  const tropRahu = rahuLongitude(jd);
  const tropAsc = ascendantLongitude(jd, lat, lon);

  const bodies = [
    { key: "Sun", sanskrit: "Surya", trop: tropSun },
    { key: "Moon", sanskrit: "Chandra", trop: tropMoon },
    { key: "Mars", sanskrit: "Mangala", trop: planetLongitude("Mars", jd) },
    { key: "Mercury", sanskrit: "Budha", trop: planetLongitude("Mercury", jd) },
    { key: "Jupiter", sanskrit: "Guru", trop: planetLongitude("Jupiter", jd) },
    { key: "Venus", sanskrit: "Shukra", trop: planetLongitude("Venus", jd) },
    { key: "Saturn", sanskrit: "Shani", trop: planetLongitude("Saturn", jd) },
    { key: "Rahu", sanskrit: "Rahu", trop: tropRahu },
    { key: "Ketu", sanskrit: "Ketu", trop: norm360(tropRahu + 180) },
  ];

  const ascSid = sid(tropAsc);
  const ascRashi = toRashi(ascSid);
  const ascNak = toNakshatra(ascSid);

  const planets = bodies.map((b) => {
    const s = sid(b.trop);
    const r = toRashi(s);
    const nk = toNakshatra(s);
    let retro = false;
    if (!["Sun", "Moon", "Rahu", "Ketu"].includes(b.key)) {
      const next = planetLongitude(b.key, jd + 2);
      let diff = next - b.trop;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      retro = diff < 0;
    }
    if (b.key === "Rahu" || b.key === "Ketu") retro = true; // always vakri
    const house = ((r.index - ascRashi.index + 12) % 12) + 1;
    return {
      name: b.key,
      sanskrit: b.sanskrit,
      longitude: Number(s.toFixed(4)),
      rashi: r.name,
      rashiEn: r.en,
      rashiIndex: r.index,
      degreeInRashi: fmtDeg(r.degree),
      nakshatra: nk.name,
      pada: nk.pada,
      nakshatraLord: nk.lord,
      house,
      retrograde: retro,
    };
  });

  const moonSid = sid(tropMoon);
  const moonNak = toNakshatra(moonSid);
  const moonRashi = toRashi(moonSid);
  const sunRashi = toRashi(sid(tropSun));

  /* Tithi - lunar day from Sun-Moon elongation */
  const elong = norm360(tropMoon - tropSun);
  const tithiNum = Math.floor(elong / 12);
  const paksha = tithiNum < 15 ? "Shukla" : "Krishna";
  const tithiName = TITHIS[tithiNum % 15];

  /* Dasha */
  const nd = new Date();
  const now = nowJD ?? julianDay(
    nd.getUTCFullYear(), nd.getUTCMonth() + 1, nd.getUTCDate(),
    nd.getUTCHours() + nd.getUTCMinutes() / 60
  );
  const timeline = dashaTimeline(moonSid, jd);
  const currentMaha = timeline.find((p) => now >= p.startJD && now < p.endJD) || timeline[0];
  const subs = antardashas(currentMaha);
  const currentAntara = subs.find((p) => now >= p.startJD && now < p.endJD) || subs[0];
  const nextMaha = timeline[timeline.indexOf(currentMaha) + 1] || null;

  const ageYears = Math.floor((now - jd) / 365.2425);

  return {
    input: { year, month, day, hour, minute, tzOffset, lat, lon, place },
    meta: {
      julianDay: Number(jd.toFixed(5)),
      ayanamsa: fmtDeg(ayan),
      ayanamsaDecimal: Number(ayan.toFixed(4)),
      system: "Lahiri (Chitrapaksha) / Whole-sign houses / Parashari",
      ageYears,
    },
    lagna: {
      rashi: ascRashi.name,
      rashiEn: ascRashi.en,
      rashiIndex: ascRashi.index,
      lord: ascRashi.lord,
      element: ascRashi.element,
      degree: fmtDeg(ascRashi.degree),
      nakshatra: ascNak.name,
      pada: ascNak.pada,
    },
    chandra: {
      rashi: moonRashi.name,
      rashiEn: moonRashi.en,
      lord: moonRashi.lord,
      nakshatra: moonNak.name,
      nakshatraLord: moonNak.lord,
      deity: moonNak.deity,
      pada: moonNak.pada,
      degree: fmtDeg(moonRashi.degree),
    },
    surya: {
      rashi: sunRashi.name,
      rashiEn: sunRashi.en,
      lord: sunRashi.lord,
      degree: fmtDeg(sunRashi.degree),
    },
    panchanga: {
      tithi: paksha + " " + tithiName,
      paksha,
      tithiIndex: tithiNum + 1,
    },
    planets,
    dasha: {
      current: {
        maha: currentMaha.lord,
        mahaFrom: jdToISO(currentMaha.startJD),
        mahaTo: jdToISO(currentMaha.endJD),
        antara: currentAntara.lord,
        antaraFrom: jdToISO(currentAntara.startJD),
        antaraTo: jdToISO(currentAntara.endJD),
      },
      next: nextMaha ? { maha: nextMaha.lord, from: jdToISO(nextMaha.startJD) } : null,
      sequence: timeline.map((p) => ({
        lord: p.lord,
        from: jdToISO(p.startJD),
        to: jdToISO(p.endJD),
      })),
    },
  };
}

export default computeChart;
