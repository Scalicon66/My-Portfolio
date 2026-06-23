import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { projects } from "../constants";

const ProjectsPage = () => {
  const pageRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-black-100 px-5 md:px-20 py-16">

      {/* ── Header ── */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white-50 hover:text-white
                     transition-colors duration-300 mb-6 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <h1 className="text-4xl md:text-6xl font-bold text-white">All Projects</h1>
        <p className="text-white-50 mt-2 text-lg">{projects.length} projects</p>
      </div>

      <div className="h-px bg-white/10 mb-10" />

      {/* ── All Projects Grid ── */}
      <div className="grid-3-cols">
        {projects.map((project) => (
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
    </div>
  );
};

export default ProjectsPage;
