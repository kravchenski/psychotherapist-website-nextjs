import About from "./components/About";
import Services from "./components/Services";
import Hero from "./components/Hero";
import Contacts from "./components/Contacts";
import homeContent from "@/content/home.json";
import type { HomeContent } from "./types/content";

const content = homeContent as HomeContent;

export default function Home() {
  return (
    <main className="flex flex-col w-full flex-1">
      <Hero content={content.hero} />
      <About content={content.about} />
      <Services content={content.services} />
      <Contacts content={content.contacts} />
    </main>
  );
}
