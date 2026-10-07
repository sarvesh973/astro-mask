import Funnel from "./components/Funnel";
import {
  ClosingCta, Faq, Footer, Header, Hero, HowItWorks,
  LogoWall, MandalaBg, RevealOnScroll, Testimonials,
} from "./components/Sections";

export default function Page() {
  return (
    <>
      <MandalaBg />
      <RevealOnScroll />

      <Header />

      <main>
        <Hero />

        {/* The funnel sits directly under the hero - no scrolling required
            before a visitor can start, which is what paid traffic needs. */}
        <Funnel />

        <LogoWall />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
