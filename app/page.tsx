import Herosection from "@/components/Herosection";
import Features from "@/components/Features";
import TemplatesSection from "@/components/TemplatesSection";
import HowToUse from "@/components/HowToUse";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <div>
      <Herosection />
      <Features />
      <TemplatesSection />
      <HowToUse />
      <CTASection />
      <Footer />
    </div>
  );
}
