import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Team from "./components/Team";
import NextShow from "./components/NextShow";
import Portfolio from "./components/Portfolio";
import MusicVideo from "./components/MusicVideo";
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
      <NextShow />
      <MusicVideo />
      <Portfolio />
      <Footer />
      <FloatingListenPill />
      <MobileStreamingPopup />
    </>
  );
}
