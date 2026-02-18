import Navbar from "@/components/Navbar";
import FeaturesHero from "./components/FeaturesHero";
import Footer from "@/components/Footer";
import FastByDesign from "./components/FastByDesign";
import BuiltForRealWorkflows from "./components/BuiltForRealWorkflows";
import ReliableAtEveryStep from "./components/ReliableAtEveryStep";
import DesignedToGrow from "./components/DesignedToGrow";
import ReadyWhenYouAre from "./components/ReadyWhenYouAre";



export default function FeaturesPage() {
    return (
        <>
            <main>
                <Navbar />
                <FeaturesHero />
                <FastByDesign />
                <BuiltForRealWorkflows />
                <ReliableAtEveryStep />
                <DesignedToGrow />
                <ReadyWhenYouAre />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
