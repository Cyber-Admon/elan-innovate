import Hero from "@/components/Hero";
import WhoItsFor from "@/components/WhoItsFor";
import Pillars from "@/components/Pillars";
import Program from "@/components/Program";
import Leadership from "@/components/LeadershipTeaser";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhoItsFor />
      <Pillars />
      <Program />
      <Leadership />
      <Footer />
    </main>
  );
}