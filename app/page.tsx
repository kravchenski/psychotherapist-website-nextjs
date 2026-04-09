import About from "./components/About";
import Services from "./components/Services";
import Hero from "./components/Hero";
import Contacts from "./components/Contacts";

export default function Home() {
  return (
    <main className="flex flex-col w-full flex-1">
      <Hero />
      <About />
      <Services />
      <Contacts />
    </main>
  );
}
