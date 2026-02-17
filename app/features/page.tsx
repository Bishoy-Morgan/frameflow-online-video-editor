import Navbar from "@/components/Navbar";
import FeaturesHero from "./components/FeaturesHero";
import CoresEditing from "./components/CoresEditing";
import Performance from "./components/Performance";
import Footer from "@/components/Footer";



export default function Home() {
    return (
        <>
            <main>
                <Navbar />
                <FeaturesHero />
                <CoresEditing />
                <Performance />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
