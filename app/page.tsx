import Hero from "./components/hero";
import Work from "./components/work";
import About from "./components/about";

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Work />
      <About />
    </main>
  );
}
