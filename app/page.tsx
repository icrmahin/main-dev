import Hero from "./components/hero";
import HeroWorkTransition from "./components/hero-work-transition";
import CompanyMarquee from "./components/company-marquee";
import SelectedWork from "./components/work/SelectedWork";
import CaseStudies from "./components/case-studies";
import About from "./components/about";
import Cta from "./components/cta";
import Footer from "./components/footer";

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <HeroWorkTransition />
      <CompanyMarquee />
      <SelectedWork />
      <CaseStudies />
      <About />
      <Cta />
      <Footer />
    </main>
  );
}
