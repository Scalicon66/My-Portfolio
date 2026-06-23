import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const PREVIEW_COUNT = 3;

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const previewProjects = projects.slice(0, PREVIEW_COUNT);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">

        {/* ── Section header ── */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-white-50 text-sm uppercase tracking-widest mb-1">Portfolio</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Featured Work</h2>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15
                       bg-white/5 hover:bg-white/10 text-white-50 hover:text-white font-semibold
                       transition-all duration-300 hover:border-white/30 text-sm md:text-base"
          >
            View All Projects
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid-3-cols mt-2">
          {previewProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="project-card card-border rounded-xl overflow-hidden group flex flex-col"
            >
              <div className="image-wrapper w-full h-56 md:h-64 overflow-hidden relative bg-black-100">
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
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white text-xl font-semibold mb-1 group-hover:text-white-50 transition-colors duration-300">
                  {project.name}
                </h3>
                <p className="text-blue-50 text-sm italic mb-3">{project.sub}</p>
                <p className="text-white-50 text-sm line-clamp-3">{project.shortDesc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Bottom View All ── */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/15
                       bg-white/5 hover:bg-white/10 text-white-50 hover:text-white font-semibold
                       transition-all duration-300 hover:border-white/30"
          >
            View All {projects.length} Projects
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
