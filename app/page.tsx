import Herosection from "@/components/Herosection";
import Features from "@/components/Features";
import TemplatesSection from "@/components/TemplatesSection";
import HowToUse from "@/components/HowToUse";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <Herosection />
        <Features />
        <TemplatesSection />
        <HowToUse />
        <CTASection />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
