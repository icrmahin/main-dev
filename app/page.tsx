import Hero from "./components/hero";
import Work from "./components/work";
import About from "./components/about";
import Cta from "./components/cta";

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Work />
      <About />
      <Cta />
    </main>
  );
}
