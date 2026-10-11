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
    eyebrow: "ANCIENT VEDIC WISDOM · A NEW WAY TO SEEK GUIDANCE",
    headline: "Ask the Stars.",
    headlineAccent: "Choose Your Dakshina.",
    subheadline:
      "Your birth chart holds a story written in the language of the stars. Ask the questions that matter to you, receive a personalised Vedic astrology reading, and offer whatever dakshina feels right to you.",
    subheadlineTwo:
      "No fixed prices. No subscriptions. Just ancient wisdom, made accessible to everyone.",
    ctaLabel: "Begin My Reading",
    ctaSecondary: "Discover Our Philosophy",
    ctaSubtext:
      "Your journey begins with a question. Your dakshina is entirely your choice.",
  },

  trustBadges: [
    { icon: "lamp", label: "Rooted in Vedic Tradition" },
    { icon: "offering", label: "Pay What You Wish" },
    { icon: "sparkle", label: "Personalised Readings" },
  ],

  /* --- INTRODUCTION ------------------------------------------------------- */
  intro: {
    eyebrow: "A DIFFERENT KIND OF ASTROLOGY",
    title: "Wisdom Shouldn’t Have a Fixed Price.",
    body: [
      "For generations, people have turned to Vedic astrology to reflect on life’s biggest questions. But seeking guidance shouldn’t mean choosing between your beliefs and your budget.",
      "DakshAstro brings the traditional spirit of dakshina into the modern world. Share your birth details, ask what’s on your mind, and receive an astrology reading without a predetermined price.",
    ],
    emphasis: "You decide what the experience is worth to you.",
    cta: "Start Your Journey",
  },

  /* --- AS SEEN IN / PARTNER LOGOS ----------------------------------------- */
  // Leave `src: null` for a dashed placeholder you can fill later.
  // Set `logoWall: null` to hide the row entirely.
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
    eyebrow: "YOUR JOURNEY STARTS HERE",
    title: "Four Steps. One Personal Reading.",
    steps: [
      {
        icon: "lamp",
        title: "Share Your Birth Details",
        lead: "Every birth chart begins with the details of your birth.",
        body: "Enter your date, time, and place of birth to help us calculate the astrological placements used in your reading.",
      },
      {
        icon: "moon",
        title: "Ask Your Question",
        lead: "Love, career, marriage, finances, or your life’s direction.",
        body: "Choose a topic or write your own question. Tell us what’s on your mind.",
      },
      {
        icon: "offering",
        title: "Offer Your Dakshina",
        lead: "There is no fixed price for your reading.",
        body: "Choose an amount that feels right to you and offer your dakshina voluntarily. Every individual has the freedom to decide what they wish to give.",
      },
      {
        icon: "scroll",
        title: "Receive Your Reading",
        lead: "A reading written for your chart, not for everyone’s.",
        body: "Explore a personalised interpretation of your birth chart and the traditional astrological perspectives relevant to your question.",
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
        body: "Understand relationship dynamics, compatibility, and the traditional astrological interpretations associated with your romantic life.",
        button: "Explore Love",
        question: "What does my chart say about my love life and relationships?",
      },
      {
        icon: "sunrise",
        title: "Career & Ambitions",
        body: "Explore career-related planetary placements and traditional interpretations associated with professional growth.",
        button: "Explore Career",
        question: "What direction does my chart suggest for my career?",
      },
      {
        icon: "rings",
        title: "Marriage & Compatibility",
        body: "Explore traditional Vedic perspectives on marriage, compatibility, and the seventh house of your birth chart.",
        button: "Explore Marriage",
        question: "What does the seventh house of my chart say about marriage?",
      },
      {
        icon: "kalash",
        title: "Wealth & Prosperity",
        body: "Discover traditional interpretations of the second and eleventh houses and their associations with finances, resources, and gains.",
        button: "Explore Wealth",
        question: "What do the second and eleventh houses say about my finances?",
      },
      {
        icon: "chart",
        title: "Kundali & Planetary Influences",
        body: "Explore planetary placements, Mahadasha periods, and their traditional interpretations within Vedic astrology.",
        button: "Explore My Kundali",
        question: "Walk me through my kundali and the Mahadasha I am running.",
      },
      {
        icon: "ask",
        title: "Ask Your Own Question",
        body: "Some questions don’t fit into a category. Tell us what you want to understand, and receive a reading tailored to your question.",
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
      "In the Indian tradition, dakshina is an offering given willingly as a gesture of respect and appreciation.",
      "We believe access to an astrology reading shouldn’t depend on how much someone can afford to pay. That’s why DakshAstro doesn’t impose a fixed price on your reading.",
      "Whether you choose a small offering or something more, the decision is yours.",
    ],
    emphasis: "No pressure. No compulsory amount. Just a choice that belongs to you.",
    cta: "Offer My Dakshina",
  },

  /* --- QUESTION STEP ------------------------------------------------------ */
  question: {
    title: "What do you want to ask the stars?",
    subtitle: "One clear question gets the clearest answer.",
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
    subtitle:
      "There is no fixed price for your reading. Choose an amount that feels right to you.",
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
