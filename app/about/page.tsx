import Navbar from "@/components/Navbar";
import AboutHero from "./components/AboutHero";
import FrameflowChallenges from "./components/FrameflowChallenges";
import EditingReimagined from "./components/EditingReimagined";
import ProductPhilosophy from "./components/ProductPhilosophy";
import CoreCapabilities from "./components/CoreCapabilities";
import FounderStory from "./components/FounderStory";
import CTA from "./components/CTA";
import Footer from "@/components/Footer";


export default function AboutPage() {
    return (
        <>
            <main>
                <Navbar />
                <AboutHero />
                <FrameflowChallenges />
                <EditingReimagined />
                <ProductPhilosophy />
                <CoreCapabilities />
                <FounderStory />
                <CTA />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}