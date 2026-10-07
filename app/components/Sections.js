"use client";

import { useEffect } from "react";
import { site } from "@/content/site";
import { MandalaBg } from "./Ornaments";
import { Check, ICON_MAP, Lotus, Star } from "./Icons";
import Cta from "./Cta";

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

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Cta href="#start">{hero.ctaLabel}</Cta>
          <span className="cta-note">{hero.ctaSubtext}</span>
        </div>

        <div className="trust">
          {trustBadges.map((t) => (
            <span className="trust-item" key={t}>
              <Check width={13} height={13} />
              {t}
            </span>
          ))}
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
    <section className="section reveal">
      <div className="wrap">
        <div className="section-head">
          <span className="divider"><Lotus width={18} height={18} /></span>
          <h2 className="section-title">{howItWorks.title}</h2>
          <p className="section-sub">{howItWorks.subtitle}</p>
        </div>

        <div className="steps-grid">
          {howItWorks.steps.map((s, i) => {
            const Icon = ICON_MAP[s.icon] || ICON_MAP.sun;
            return (
              <article className="how-card" key={s.title}>
                <span className="how-card-n">{i + 1}</span>
                <span className="how-icon"><Icon width={22} height={22} /></span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
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
    <section className="section reveal">
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
  const { hero } = site;
  return (
    <section className="section reveal" style={{ paddingTop: 0 }}>
      <div className="wrap-narrow">
        <div className="card card-pad" style={{ textAlign: "center" }}>
          <span className="eyebrow">One Question. One Reading.</span>
          <h2 className="section-title" style={{ margin: "14px 0 12px" }}>
            {/* ---- HEADLINE SLOT: closing CTA ---- */}
            Ready when you are
          </h2>
          <p className="section-sub" style={{ margin: "0 auto 24px" }}>
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
        <div style={{ maxWidth: 420 }}>
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
