import Hero from "./components/hero";
import HeroWorkTransition from "./components/hero-work-transition";
import CompanyMarquee from "./components/company-marquee";
import Work from "./components/work";
import CaseStudies from "./components/case-studies";
import SelectedInterfaces from "./components/selected-interfaces";
import About from "./components/about";
import Cta from "./components/cta";
import Footer from "./components/footer";

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <HeroWorkTransition />
      <CompanyMarquee />
      <Work />
      <CaseStudies />
      <SelectedInterfaces />
      <About />
      <Cta />
      <Footer />
    </main>
  );
}
