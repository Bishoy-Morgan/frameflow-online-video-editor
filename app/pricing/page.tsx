import Navbar from "@/components/Navbar";
import PricingHero from "./components/PricingHero";
import Footer from "@/components/Footer";
import PricingPlans from "./components/PricingPlans";
import PricingPhilosophy from "./components/PricingPhilosophy";
import PricingFAQ from "./components/PricingFAQ";
import PricingEnterprise from "./components/PricingEnterprise";
import PricingCTA from "./components/PricingCTA";




export default function PricingPage() {
    return (
        <>
            <main>
                <Navbar />
                <PricingHero />
                <PricingPlans />
                <PricingPhilosophy />
                <PricingFAQ />
                <PricingEnterprise />
                <PricingCTA />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
