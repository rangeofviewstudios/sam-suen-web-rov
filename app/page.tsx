import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Team from "./components/Team";
import MusicProjects from "./components/MusicProjects";
import Portfolio from "./components/Portfolio";
import MusicVideo from "./components/MusicVideo";
import ShowsGigs from "./components/ShowsGigs";
import SectionDivider from "./components/SectionDivider";
import PartnerStrip from "./components/PartnerStrip";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import FloatingListenPill from "./components/FloatingListenPill";
import MobileStreamingPopup from "./components/MobileStreamingPopup";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Team />
      <MusicProjects />
      <SectionDivider />
      <MusicVideo />
      <ShowsGigs />
      <SectionDivider />
      <Portfolio />
      <PartnerStrip />
      <Footer />
      <FloatingListenPill />
      <MobileStreamingPopup />
    </>
  );
}
