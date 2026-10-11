"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { MandalaBg } from "./Ornaments";
import { Diya, ICON_MAP, Lotus, Star } from "./Icons";
import Cta from "./Cta";

/* Send a question into the funnel and scroll the visitor to it. The funnel
   listens for this on the window, which keeps the two independent. */
export function askInFunnel(question = "") {
  window.dispatchEvent(
    new CustomEvent("dakshastro:ask", { detail: { question } })
  );
  document.getElementById("start")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/* --------------------------------------------------------- icon helpers */

/** Gold-ringed medallion. Reads as traditional without being literal. */
function Medallion({ name, className, size = 22 }) {
  const Icon = ICON_MAP[name] || ICON_MAP.sparkle;
  return (
    <span className={className} aria-hidden="true">
      <Icon width={size} height={size} />
    </span>
  );
}

const TrustIcon = ({ item }) => (
  <span className="trust-item">
    <Medallion name={item.icon} className="trust-ico" size={14} />
    {item.label}
  </span>
);

const StepIcon = ({ name }) => <Medallion name={name} className="how-ico" size={22} />;
const CatIcon = ({ name }) => <Medallion name={name} className="cat-ico" size={24} />;

/* ---------------------------------------------------------------- header */

export function Header() {
  const { brand } = site;
  return (
    <header className="header">
      <div className="wrap header-in">
        <a href="#top" className="brand" style={{ textDecoration: "none" }}>
          {brand.logo ? (
            <span className="logo-slot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logo} alt={brand.name} />
            </span>
          ) : (
            /* ---- LOGO PLACEHOLDER: set brand.logo in content/site.js ---- */
            <span className="logo-slot logo-slot--ph">LOGO<br />44px</span>
          )}
          <span>
            <span className="brand-name">{brand.name}</span>
            <span className="brand-tag deva" style={{ display: "block" }}>{brand.tagline}</span>
          </span>
        </a>

        <Cta href="#start" size="sm" variant="ghost">Start</Cta>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ hero */

export function Hero() {
  const { hero, trustBadges } = site;
  return (
    <section className="hero" id="top">
      <div className="wrap hero-in">
        <span className="eyebrow">{hero.eyebrow}</span>

        <h1>
          {hero.headline}{" "}
          <span className="gradient-text">{hero.headlineAccent}</span>
        </h1>

        <p className="hero-sub">{hero.subheadline}</p>
        {hero.subheadlineTwo ? (
          <p className="hero-sub hero-sub--tight">{hero.subheadlineTwo}</p>
        ) : null}

        <div className="hero-actions">
          <Cta href="#start">{hero.ctaLabel}</Cta>
          {hero.ctaSecondary ? (
            <a className="cta-text" href="#philosophy">
              {hero.ctaSecondary}
            </a>
          ) : null}
        </div>

        <span className="cta-note">{hero.ctaSubtext}</span>

        <div className="trust">
          {trustBadges.map((t) => (
            <TrustIcon key={t.label} item={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- introduction */

export function Intro() {
  const { intro } = site;
  if (!intro) return null;

  return (
    <section className="section reveal" id="philosophy">
      <div className="wrap-narrow">
        <div className="intro-card">
          <span className="eyebrow">{intro.eyebrow}</span>
          <h2 className="section-title" style={{ margin: "16px 0 20px" }}>
            {intro.title}
          </h2>

          {intro.body.map((p, i) => (
            <p className="intro-body" key={i}>{p}</p>
          ))}

          {intro.emphasis ? (
            <p className="intro-emphasis">{intro.emphasis}</p>
          ) : null}

          <div style={{ marginTop: 28 }}>
            <Cta href="#start">{intro.cta}</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- logo wall */

export function LogoWall() {
  const { logoWall } = site;
  if (!logoWall?.logos?.length) return null;

  return (
    <section className="logo-wall reveal">
      <div className="wrap">
        <p className="logo-wall-title">{logoWall.title}</p>
        <div className="logo-grid">
          {logoWall.logos.map((l, i) => (
            <div className={`logo-box ${l.src ? "logo-box--filled" : ""}`} key={i}>
              {l.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={l.src} alt={l.name} />
              ) : (
                /* ---- LOGO PLACEHOLDER: fill logoWall.logos in content/site.js ---- */
                <span>{l.name}<br />130&times;62</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- how it works */

export function HowItWorks() {
  const { howItWorks } = site;
  return (
    <section className="section reveal" id="how">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">{howItWorks.eyebrow}</span>
          <h2 className="section-title">{howItWorks.title}</h2>
        </div>

        <div className="steps-grid">
          {howItWorks.steps.map((s, i) => (
            <article className="how-card" key={s.title}>
              <span className="how-card-n">{String(i + 1).padStart(2, "0")}</span>
              <StepIcon name={s.icon} />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>

        <div className="section-foot">
          <Cta href="#start">{howItWorks.cta}</Cta>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- categories */

export function Categories() {
  const { categories } = site;
  if (!categories?.items?.length) return null;

  return (
    <section className="section reveal" id="categories">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">{categories.eyebrow}</span>
          <h2 className="section-title">{categories.title}</h2>
        </div>

        <div className="cat-grid">
          {categories.items.map((c) => (
            <article className="cat-card" key={c.title}>
              <CatIcon name={c.icon} />
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <button
                type="button"
                className="cat-btn"
                onClick={() => askInFunnel(c.question)}
              >
                {c.button}
                <span className="cat-btn-arrow" aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- dakshina */

export function Dakshina() {
  const { dakshina } = site;
  if (!dakshina) return null;

  return (
    <section className="section reveal" id="dakshina">
      <div className="wrap-narrow">
        <div className="daksh-band">
          <div className="daksh-lamp" aria-hidden="true">
            <span className="daksh-glow" />
            <Diya size={92} />
          </div>

          <span className="eyebrow">{dakshina.eyebrow}</span>
          <h2 className="section-title" style={{ margin: "16px 0 20px" }}>
            {dakshina.title}
          </h2>

          {dakshina.body.map((p, i) => (
            <p className="daksh-body" key={i}>{p}</p>
          ))}

          {dakshina.emphasis ? (
            <p className="daksh-emphasis">{dakshina.emphasis}</p>
          ) : null}

          {dakshina.cta ? (
            <div style={{ marginTop: 30 }}>
              <Cta href="#start">{dakshina.cta}</Cta>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ sticky CTA */

/**
 * Slides up once the funnel has scrolled out of view, so there is always a
 * way back into it. Hides again whenever the funnel itself is on screen -
 * two competing CTAs on one screen is worse than none.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      const target = document.getElementById("start");
      if (!target) return;
      const { bottom } = target.getBoundingClientRect();
      // show once the funnel has passed above the viewport
      setShow(bottom < 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="sticky-cta" data-show={show} aria-hidden={!show}>
      <div className="sticky-cta-in">
        <span className="sticky-cta-text">
          <strong>Ask the stars.</strong>
          <span>Your dakshina, your choice.</span>
        </span>
        <Cta href="#start" size="sm">{site.hero.ctaLabel}</Cta>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ testimonials */

export function Testimonials() {
  const { testimonials } = site;
  if (!testimonials?.items?.length) return null;

  return (
    <section className="section reveal">
      <div className="wrap">
        <div className="section-head">
          <span className="divider"><Lotus width={18} height={18} /></span>
          <h2 className="section-title">{testimonials.title}</h2>
        </div>

        <div className="tgrid">
          {testimonials.items.map((t, i) => (
            <figure className="tcard" key={i} style={{ margin: 0 }}>
              <span className="stars" aria-label="5 out of 5">
                {[0, 1, 2, 3, 4].map((n) => <Star key={n} />)}
              </span>
              <blockquote className="tcard-quote" style={{ margin: 0 }}>{t.quote}</blockquote>
              <figcaption className="tcard-by">
                <span className="tcard-av">{t.name?.[0] || "?"}</span>
                <span>
                  <span className="tcard-name" style={{ display: "block" }}>{t.name}</span>
                  <span className="tcard-meta">{t.meta}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- faq */

export function Faq() {
  const { faq } = site;
  return (
    <section className="section reveal" id="faq">
      <div className="wrap">
        <div className="section-head">
          <span className="divider"><Lotus width={18} height={18} /></span>
          <h2 className="section-title">{faq.title}</h2>
        </div>

        <div className="faq-list">
          {faq.items.map((f, i) => (
            <details className="faq-item" key={i}>
              <summary>{f.q}</summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- closing */

export function ClosingCta() {
  const { closing, hero } = site;
  return (
    <section className="section reveal" style={{ paddingTop: 0 }}>
      <div className="wrap-narrow">
        <div className="card card-pad" style={{ textAlign: "center" }}>
          <span className="eyebrow">{closing.eyebrow}</span>
          <h2 className="section-title" style={{ margin: "14px 0 12px" }}>
            {closing.title}
          </h2>
          <p className="section-sub" style={{ margin: "0 auto 26px" }}>
            {hero.ctaSubtext}
          </p>
          <Cta href="#start">{hero.ctaLabel}</Cta>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- footer */

export function Footer() {
  const { footer, brand } = site;
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div style={{ maxWidth: 440 }}>
          <div className="brand" style={{ marginBottom: 6 }}>
            {brand.logo ? (
              <span className="logo-slot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.logo} alt={brand.name} />
              </span>
            ) : (
              <span className="logo-slot logo-slot--ph">LOGO</span>
            )}
            <span className="brand-name">{brand.name}</span>
          </div>
          <p className="footer-note">{footer.note}</p>
          <p className="footer-note">{footer.copyright} {new Date().getFullYear()}</p>
        </div>

        <nav className="footer-links" aria-label="Footer">
          {footer.links.map((l) => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/* --------------------------------------------------- scroll-reveal helper */

export function RevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return null;
}

export { MandalaBg };
