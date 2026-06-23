import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Animation for mounting the section
  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );
  }, []);

  // Animations when switching selectedProject
  useGSAP(() => {
    if (selectedProject) {
      gsap.fromTo(
        ".project-detail-layout",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    } else {
      gsap.fromTo(
        ".showcaselayout",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, { dependencies: [selectedProject] });

  const handleProjectSelect = (project) => {
    gsap.to(".showcaselayout", {
      opacity: 0,
      y: -20,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        setSelectedProject(project);
        document.getElementById("work").scrollIntoView({ behavior: "smooth" });
      },
    });
  };

  const handleBack = () => {
    gsap.to(".project-detail-layout", {
      opacity: 0,
      y: 20,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        setSelectedProject(null);
        document.getElementById("work").scrollIntoView({ behavior: "smooth" });
      },
    });
  };

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        {!selectedProject ? (
          /* Grid View (Roblox Home page) */
          <div className="showcaselayout grid-3-cols mt-10">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card card-border rounded-xl p-5 hover:cursor-pointer group flex flex-col justify-between"
                onClick={() => handleProjectSelect(project)}
              >
                <div className="image-wrapper w-full h-64 overflow-hidden rounded-lg mb-4 relative bg-black-100">
                  <img
                    src={project.imgPath}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {project.isPlaceholder && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex-center">
                      <span className="text-white-50 text-xl font-bold tracking-wider opacity-60">Coming Soon</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-1 group-hover:text-white-50 transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="text-blue-50 text-sm italic mb-3">{project.sub}</p>
                  <p className="text-white-50 text-sm line-clamp-3">
                    {project.shortDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Details View (Roblox Game Details Page) */
          <div className="project-detail-layout">
            {/* Back Button */}
            <button
              className="back-btn group mb-10 flex items-center gap-2 text-white-50 hover:text-white transition-colors duration-300 cursor-pointer"
              onClick={handleBack}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold text-lg">Back to Projects</span>
            </button>

            {/* Details Layout */}
            <div className="grid-12-cols items-start gap-10">
              {/* Left Column: Game Image */}
              <div className="xl:col-span-6 w-full rounded-2xl overflow-hidden border border-white/10 bg-black-100 relative">
                <img
                  src={selectedProject.imgPath}
                  alt={selectedProject.name}
                  className="w-full h-auto object-cover max-h-[50vh] xl:max-h-[60vh]"
                />
                {selectedProject.isPlaceholder && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex-center">
                    <span className="text-white-50 text-3xl font-bold tracking-widest opacity-60">Coming Soon</span>
                  </div>
                )}
              </div>

              {/* Right Column: Game Info & Visit Button */}
              <div className="xl:col-span-6 flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                    {selectedProject.name}
                  </h1>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-white-50 border border-white/10 text-sm font-semibold">
                    {selectedProject.sub}
                  </span>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-4 text-white-50 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {selectedProject.longDesc}
                </div>

                <div className="mt-8">
                  {selectedProject.isPlaceholder ? (
                    <button
                      disabled
                      className="visit-btn disabled opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-400 border border-zinc-700 font-bold text-xl py-4 px-10 rounded-xl"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <a
                      href={selectedProject.visitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="visit-btn inline-flex items-center justify-center gap-3 font-bold text-xl text-black bg-[#10b981] hover:bg-[#059669] border border-[#34d399] rounded-xl px-12 py-5 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-emerald-950/40"
                    >
                      <span>Visit</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppShowcase;
