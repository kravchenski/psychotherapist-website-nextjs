import About from "./components/About";
import Services from "./components/Services";
import Hero from "./components/Hero";
import Contacts from "./components/Contacts";
import { getHomeContent } from "./lib/contentStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getHomeContent();

  return (
    <main className="flex flex-col w-full flex-1">
      <Hero content={content.hero} />
      <About content={content.about} />
      <Services content={content.services} />
      <Contacts content={content.contacts} />
    </main>
  );
}
