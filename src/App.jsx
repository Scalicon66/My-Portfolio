import { useState, Suspense, lazy } from "react";
import Hero from "./sections/Hero";
import Navbar from "./components/NavBar";
import Preloader from "./components/Preloader";

// Lazy load below-the-fold sections
const ShowcaseSection = lazy(() => import("./sections/ShowcaseSection"));
const FeatureCards = lazy(() => import("./sections/FeatureCards"));
const Experience = lazy(() => import("./sections/Experience"));
const TechStack = lazy(() => import("./sections/TechStack"));
const Contact = lazy(() => import("./sections/Contact"));
const Footer = lazy(() => import("./sections/Footer"));

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <ShowcaseSection />
        <FeatureCards />
        <Experience />
        <TechStack />
        <Contact />
        <Footer />
      </Suspense>
    </>
  );
};

export default App;
