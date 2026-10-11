/* ============================================================================
   ✏️  ALL SITE COPY LIVES HERE
   Change any string below and it changes on the page. Nothing else to touch.
   ========================================================================= */

export const site = {
  /* --- BRAND -------------------------------------------------------------- */
  brand: {
    name: "DakshAstro",
    tagline: "वैदिक ज्योतिष",
    // Drop your file in /public/logos/ and point to it, e.g. "/logos/logo.svg"
    // Leave as null to show the placeholder box instead.
    logo: null,
  },

  /* --- HERO --------------------------------------------------------------- */
  hero: {
    eyebrow: "ANCIENT VEDIC WISDOM",
    headline: "Ask the Stars.",
    headlineAccent: "Choose Your Dakshina.",
    subheadline:
      "A personalised Vedic reading from your own birth chart. Ask one question, then offer whatever feels right.",
    subheadlineTwo: "No fixed price. No subscription.",
    ctaLabel: "Begin My Reading",
    ctaSecondary: "Discover Our Philosophy",
    ctaSubtext: "Start with your date of birth · About a minute",
  },

  trustBadges: [
    { icon: "lamp", label: "Rooted in Vedic Tradition" },
    { icon: "offering", label: "Pay What You Wish" },
    { icon: "sparkle", label: "Personalised Reading" },
  ],

  /* --- INTRODUCTION ------------------------------------------------------- */
  intro: {
    eyebrow: "A DIFFERENT KIND OF ASTROLOGY",
    title: "Wisdom Shouldn’t Have a Fixed Price.",
    body: [
      "Seeking guidance shouldn’t mean choosing between your beliefs and your budget. Share your birth details, ask what’s on your mind, and set your own price for the answer.",
    ],
    emphasis: "You decide what it was worth.",
    cta: "Start My Reading",
  },

  /* --- AS SEEN IN / PARTNER LOGOS ----------------------------------------- */
  // Leave `src: null` for a dashed placeholder you can fill later.
  // Set `logoWall: null` to hide the row entirely.
  logoWall: null,
  _logoWall: {
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
    eyebrow: "YOUR JOURNEY STARTS HERE",
    title: "Four Steps. One Reading.",
    steps: [
      {
        icon: "lamp",
        title: "Share Your Birth Details",
        body: "Date, time and place. That is your chart.",
      },
      {
        icon: "moon",
        title: "Ask Your Question",
        body: "Love, career, marriage, money — or your own.",
      },
      {
        icon: "offering",
        title: "Offer Your Dakshina",
        body: "Any amount you choose. No fixed price.",
      },
      {
        icon: "scroll",
        title: "Receive Your Reading",
        body: "Written for your chart, not for everyone’s.",
      },
    ],
    cta: "Get My Reading",
  },

  /* --- ASTROLOGY CATEGORIES ----------------------------------------------- */
  // `question` is dropped into the question box when the card is tapped.
  categories: {
    eyebrow: "WHAT’S WRITTEN IN YOUR STARS?",
    title: "Every Question Has a Story.",
    items: [
      {
        icon: "heart",
        title: "Love & Relationships",
        body: "Compatibility, timing, and the patterns you keep repeating.",
        button: "Explore Love",
        question: "What does my chart say about my love life and relationships?",
      },
      {
        icon: "sunrise",
        title: "Career & Ambitions",
        body: "The placements behind your work and your growth.",
        button: "Explore Career",
        question: "What direction does my chart suggest for my career?",
      },
      {
        icon: "rings",
        title: "Marriage & Compatibility",
        body: "What the seventh house says about marriage.",
        button: "Explore Marriage",
        question: "What does the seventh house of my chart say about marriage?",
      },
      {
        icon: "kalash",
        title: "Wealth & Prosperity",
        body: "The second and eleventh houses — money, resources, gains.",
        button: "Explore Wealth",
        question: "What do the second and eleventh houses say about my finances?",
      },
      {
        icon: "chart",
        title: "Kundali & Planetary Influences",
        body: "Your full chart, planet by planet, and the dasha you are running.",
        button: "Explore My Kundali",
        question: "Walk me through my kundali and the Mahadasha I am running.",
      },
      {
        icon: "ask",
        title: "Ask Your Own Question",
        body: "Anything that does not fit a category.",
        button: "Ask My Question",
        question: "", // leaves the box empty and focuses it
      },
    ],
  },

  /* --- DAKSHINA (the USP) -------------------------------------------------- */
  dakshina: {
    eyebrow: "ROOTED IN TRADITION",
    title: "Your Dakshina. Your Choice.",
    body: [
      "Dakshina is an offering given willingly, as a gesture of respect. A reading shouldn’t depend on what you can afford — so there is no fixed price.",
    ],
    emphasis: "No pressure. No set amount. Your choice.",
    cta: "Offer My Dakshina",
  },

  /* --- QUESTION STEP ------------------------------------------------------ */
  question: {
    title: "Ask your question",
    subtitle: "Write one clear question, or tap a suggestion below.",
    placeholder: "e.g. When will I find stability in my career?",
    suggestions: [
      "When will I get married?",
      "Is this the right time to change jobs?",
      "What does my chart say about money?",
      "Which career suits my chart?",
      "Will I settle abroad?",
      "What is my biggest karmic lesson?",
    ],
  },

  /* --- DAKSHINA / PAYMENT STEP -------------------------------------------- */
  payment: {
    title: "Offer Your Dakshina",
    subtitle: "Drag the slider or tap an amount. You choose.",
    presets: [51, 101, 251, 501],
    defaultAmount: 101,
    minAmount: 11,
    maxAmount: 5001,
    // ⚠️ Keep this honest and visible — your FAQ promises that any minimum is
    // disclosed before the visitor proceeds.
    minNote: "A minimum of ₹11 applies, set by the payment gateway.",
    note: "Secure payment via Razorpay · UPI, cards, netbanking",
  },

  /* --- TESTIMONIALS ------------------------------------------------------- */
  // Empty on purpose: invented testimonials are a real liability on paid
  // traffic. Add genuine ones here and the section appears automatically.
  // { quote: "…", name: "Ananya", meta: "Pune" }
  testimonials: {
    title: "What People Say",
    items: [],
  },

  /* --- FAQ ----------------------------------------------------------------- */
  faq: {
    title: "A Few Things You Should Know.",
    items: [
      {
        q: "What is DakshAstro?",
        a: "DakshAstro is a platform for personalised Vedic astrology readings inspired by the traditional concept of dakshina.",
      },
      {
        q: "What does pay-what-you-wish mean?",
        a: "It means you decide how much you want to offer for your reading instead of paying a predetermined price.",
      },
      {
        q: "Is dakshina compulsory?",
        a: "Our model is designed around voluntary contributions. Any minimum amount or payment requirement must be clearly disclosed before a user proceeds.",
      },
      {
        q: "How personalised is my reading?",
        a: "Your reading is based on the birth information and question you submit, along with the astrological calculations and interpretation capabilities supported by our platform.",
      },
      {
        q: "What if I don’t know my exact birth time?",
        a: "You can provide your closest known time. However, some astrological calculations, particularly those involving the Ascendant and houses, may be less reliable without an accurate birth time.",
      },
      {
        q: "Can astrology predict my future with certainty?",
        a: "No. Astrology cannot guarantee future events or outcomes. Our readings offer traditional interpretations for reflection and personal exploration.",
      },
      {
        q: "Is my personal information safe?",
        a: "We aim to handle your information responsibly. Please consult our Privacy Policy for details about data collection, processing, storage, and deletion.",
      },
      {
        q: "Do I need to purchase a subscription?",
        a: "The intended model does not require a subscription for each reading. Any additional paid features or services should be disclosed clearly.",
      },
    ],
  },

  /* --- CLOSING CTA --------------------------------------------------------- */
  closing: {
    eyebrow: "ONE QUESTION. ONE READING.",
    title: "Ready When You Are.",
  },

  /* --- FOOTER -------------------------------------------------------------- */
  footer: {
    note: "DakshAstro offers traditional Vedic astrological interpretations for reflection and personal exploration. Readings cannot guarantee future events or outcomes, and are not a substitute for professional medical, legal or financial advice.",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Refund Policy", href: "#" },
      { label: "Contact", href: "#" },
    ],
    copyright: "© DakshAstro",
  },
};

export default site;
