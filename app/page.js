import Funnel from "./components/Funnel";
import {
  Categories, ClosingCta, Dakshina, Faq, Footer, Header, Hero, HowItWorks,
  Intro, LogoWall, MandalaBg, RevealOnScroll, Testimonials,
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
        <Intro />
        <HowItWorks />
        <Categories />
        <Dakshina />
        <Testimonials />
        <Faq />
        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
