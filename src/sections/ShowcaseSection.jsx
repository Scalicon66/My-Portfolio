import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const rydeRef = useRef(null);
  const project2Ref = useRef(null);
  const project3Ref = useRef(null);

  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    const cards = [rydeRef.current, project2Ref.current, project3Ref.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          <div ref={rydeRef} className="first-project-wrapper">
            <div className="image-wrapper">
              <img src="/images/project1.png" alt="Ryde App Interface" />
            </div>
            <div className="text-content">
              <h2>
                Minimal E-Commerce Experience Built with PHP
              </h2>
              <p className="text-white-50 md:text-xl">
                A clean and responsive shopping platform focused on simplicity, performance, and elegant 
                product browsing.
              </p>
            </div>
          </div>

          <div className="project-list-wrapper">
            <div ref={project2Ref} className="h-full flex flex-col">
              <div className="image-wrapper flex-center border border-black-50 bg-black-100 flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white-50 opacity-50">Coming Soon</h3>
              </div>
            </div>
            
            <div ref={project3Ref} className="h-full flex flex-col mt-10 xl:mt-0">
              <div className="image-wrapper flex-center border border-black-50 bg-black-100 flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white-50 opacity-50">Coming Soon</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
