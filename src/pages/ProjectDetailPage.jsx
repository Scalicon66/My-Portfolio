import { useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { projects } from "../constants";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const project = projects.find((p) => p.id === id);

  // Fade in on mount
  useGSAP(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
    );
  }, []);

  // 404 — project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-black-100 flex-col-center gap-4 px-5">
        <h1 className="text-4xl font-bold text-white">Project not found</h1>
        <Link to="/projects" className="text-white-50 hover:text-white underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-black-100 px-5 md:px-20 py-16">

      {/* ── Breadcrumb nav ── */}
      <nav className="flex items-center gap-2 text-sm text-white-50 mb-10 flex-wrap">
        <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
        <span className="opacity-40">/</span>
        <Link to="/projects" className="hover:text-white transition-colors duration-200">Projects</Link>
        <span className="opacity-40">/</span>
        <span className="text-white truncate max-w-[200px]">{project.name}</span>
      </nav>

      {/* ── Main Detail Layout ── */}
      <div className="grid-12-cols items-start gap-10 md:gap-16">

        {/* Left: Image */}
        <div className="xl:col-span-7 w-full rounded-2xl overflow-hidden border border-white/10 bg-black-100 relative shadow-2xl shadow-black/60">
          <img
            src={project.imgPath}
            alt={project.name}
            className="w-full h-auto object-cover max-h-[55vh] xl:max-h-[65vh]"
          />
          {project.isPlaceholder && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex-center">
              <span className="text-white-50 text-3xl font-bold tracking-widest opacity-60">
                Coming Soon
              </span>
            </div>
          )}
        </div>

        {/* Right: Info panel */}
        <div className="xl:col-span-5 flex flex-col gap-6">

          {/* Title + tag */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
              {project.name}
            </h1>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-white-50 border border-white/10 text-sm font-semibold">
              {project.sub}
            </span>
          </div>

          <div className="h-px bg-white/10" />

          {/* Description */}
          <div className="space-y-4 text-white-50 text-base md:text-lg leading-relaxed whitespace-pre-line">
            {project.longDesc}
          </div>

          {/* CTA */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            {project.isPlaceholder ? (
              <button
                disabled
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 font-bold text-xl
                           text-zinc-400 bg-zinc-800 border border-zinc-700
                           rounded-xl px-10 py-5 opacity-50 cursor-not-allowed"
              >
                Coming Soon
              </button>
            ) : (
              <a
                href={project.visitUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 font-bold text-xl
                           text-black bg-emerald-500 hover:bg-emerald-600
                           border border-emerald-400 rounded-xl px-10 py-5
                           transition-all duration-300 hover:scale-[1.02]
                           shadow-lg shadow-emerald-950/40"
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

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-semibold text-base
                         text-white-50 hover:text-white border border-white/15 hover:border-white/30
                         bg-white/5 hover:bg-white/10 rounded-xl px-8 py-5
                         transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </div>

      {/* ── Other Projects ── */}
      <div className="mt-24">
        <div className="h-px bg-white/10 mb-10" />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">More Projects</h2>
        <div className="grid-3-cols">
          {projects
            .filter((p) => p.id !== project.id)
            .slice(0, 3)
            .map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="project-card card-border rounded-xl overflow-hidden group flex flex-col"
              >
                <div className="image-wrapper w-full h-48 overflow-hidden relative bg-black-100">
                  <img
                    src={p.imgPath}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {p.isPlaceholder && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex-center">
                      <span className="text-white-50 text-sm font-bold tracking-wider opacity-60">Coming Soon</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-white font-semibold mb-1 group-hover:text-white-50 transition-colors duration-300">
                    {p.name}
                  </h3>
                  <p className="text-blue-50 text-xs italic">{p.sub}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
