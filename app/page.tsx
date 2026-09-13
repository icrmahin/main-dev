import Hero from "./components/hero";
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
      <Work />
      <CaseStudies />
      <SelectedInterfaces />
      <About />
      <Cta />
      <Footer />
    </main>
  );
}
