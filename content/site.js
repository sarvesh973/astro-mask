/* ============================================================================
   ✏️  EDIT EVERYTHING HERE
   This is the ONLY file you need to touch to change copy, headlines and logos.
   Every string below shows up somewhere on the page.
   ========================================================================= */

export const site = {
  /* --- BRAND -------------------------------------------------------------- */
  brand: {
    name: "YOUR BRAND",              // shown next to the logo in the header
    tagline: "वैदिक ज्योतिष",         // small text under the brand name
    // Drop your file in /public/logos/ and point to it, e.g. "/logos/logo.svg"
    // Leave as null to show the placeholder box instead.
    logo: null,
    logoDark: null,
  },

  /* --- HERO (top of page) ------------------------------------------------- */
  hero: {
    eyebrow: "ANCIENT WISDOM · INSTANT CLARITY",   // tiny caps line above headline
    headline: "Your Headline Goes Here",           // ⬅ MAIN HEADLINE
    headlineAccent: "In Saffron",                  // ⬅ highlighted part of headline
    subheadline:
      "Write your sub-headline here. Explain in one or two lines what the visitor gets — a real Vedic reading of their birth chart, answering the one question that matters most to them.",
    ctaLabel: "Begin My Reading",
    ctaSubtext: "Takes 60 seconds · Pay only what you feel it's worth",
  },

  /* --- TRUST STRIP (just under the hero CTA) ------------------------------ */
  trustBadges: [
    "Parāśara-based calculations",
    "Lahiri Ayanāṃśa",
    "No subscription",
    "Pay as you wish",
  ],

  /* --- "AS SEEN IN" / PARTNER LOGO ROW ------------------------------------ */
  // Leave `src: null` to render an empty dashed placeholder you can fill later.
  logoWall: {
    title: "FEATURED IN",
    logos: [
      { name: "Logo 1", src: null },
      { name: "Logo 2", src: null },
      { name: "Logo 3", src: null },
      { name: "Logo 4", src: null },
    ],
  },

  /* --- HOW IT WORKS ------------------------------------------------------- */
  howItWorks: {
    title: "How It Works",
    subtitle: "Write a supporting line about your process here.",
    steps: [
      {
        icon: "sun",
        title: "Your Birth Moment",
        body: "Date, time and place of birth. We compute your actual sidereal chart — Rāśi, Nakṣatra, Pada and running Daśā.",
      },
      {
        icon: "question",
        title: "Your One Question",
        body: "Career, marriage, money, health, timing — ask the thing you actually want to know.",
      },
      {
        icon: "lotus",
        title: "Pay As You Wish",
        body: "You decide what the reading is worth. Any amount unlocks the full answer.",
      },
      {
        icon: "scroll",
        title: "Your Reading",
        body: "A detailed, chart-specific answer grounded in classical Jyotiṣa — not a horoscope column.",
      },
    ],
  },

  /* --- QUESTION STEP ----------------------------------------------------- */
  question: {
    title: "What do you want to ask the stars?",
    subtitle: "One clear question gets the clearest answer.",
    placeholder: "e.g. When will I find stability in my career?",
    // Tap-to-fill suggestion chips
    suggestions: [
      "When will I get married?",
      "Is this the right time to change jobs?",
      "What does my chart say about money?",
      "Which career suits my chart?",
      "Will I settle abroad?",
      "What is my biggest karmic lesson?",
    ],
  },

  /* --- PAYMENT STEP ------------------------------------------------------ */
  payment: {
    title: "Pay As You Wish",
    subtitle:
      "This reading is yours regardless. Choose an amount that feels right — it keeps the lamp lit.",
    presets: [51, 101, 251, 501],
    defaultAmount: 101,
    minAmount: 11,
    maxAmount: 5001,
    note: "Secure payment via Razorpay · UPI, cards, netbanking",
    freeHint: null, // e.g. "Can't pay today? Write to us." — or leave null
  },

  /* --- TESTIMONIALS (placeholders — swap for real ones) ------------------ */
  testimonials: {
    title: "What People Say",
    items: [
      { quote: "Add a real testimonial here. Keep it short and specific.", name: "Name", meta: "City" },
      { quote: "Another testimonial goes here — mention the outcome they got.", name: "Name", meta: "City" },
      { quote: "A third one. Social proof does the heavy lifting on cold traffic.", name: "Name", meta: "City" },
    ],
  },

  /* --- FAQ --------------------------------------------------------------- */
  faq: {
    title: "Questions, Answered",
    items: [
      { q: "Is this a real astrological reading?", a: "Your sidereal chart is computed from your exact birth date, time and place using the Lahiri ayanāṃśa — the same reference used in classical Vedic practice. The interpretation is then written against those actual placements." },
      { q: "Why pay-as-you-wish?", a: "Write your own answer here. Explaining the philosophy behind the pricing builds a lot of trust on paid traffic." },
      { q: "What if I don't know my birth time?", a: "Enter the closest time you know. Moon-sign and Nakṣatra results stay reliable within a couple of hours; ascendant-based timing gets less precise." },
      { q: "Is my data stored?", a: "Edit this to match your actual privacy policy before running ads — Meta reviews landing pages for this." },
    ],
  },

  /* --- FOOTER ------------------------------------------------------------ */
  footer: {
    note: "Your footer note / disclaimer goes here. For entertainment and guidance purposes.",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Refund Policy", href: "#" },
      { label: "Contact", href: "#" },
    ],
    copyright: "© YOUR BRAND",
  },
};

export default site;
