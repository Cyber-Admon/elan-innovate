import Hero from "@/components/Hero";
import WhoItsFor from "@/components/WhoItsFor";
import Pillars from "@/components/Pillars";
import Program from "@/components/Program";
import Leadership from "@/components/LeadershipTeaser";
import Footer from "@/components/Footer";
import Story from "@/components/Story";
import ServicesBand from "@/components/ServicesBand";

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <WhoItsFor />
      <Pillars />
      <Program />
      <ServicesBand />
      <Leadership />
      <Footer />
    </main>
  );
}