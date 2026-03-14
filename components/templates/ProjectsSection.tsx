"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const { userData, aiConfig } = usePortfolioStore();

  const template = aiConfig?.templateName || "bold";
  const primaryColor = aiConfig?.primaryColor || "#3b82f6";
  const bgColor = aiConfig?.backgroundColor || "#0f172a";

  useGSAP(() => {
    // Clear old ScrollTriggers if the theme changes to prevent glitching
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const sections = gsap.utils.toArray(".project-card");
    if (sections.length === 0) return;

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + scrollWrapperRef.current?.offsetWidth,
      },
    });
  }, [template, userData.projects.length]); // Re-run if theme or project count changes

  return (
    <section
      ref={sectionRef}
      className="h-screen flex items-center overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <div className="pl-10 md:pl-20 pr-80">
        {" "}
        {/* pr-80 avoids the control panel */}
        <h2
          className={`mb-12 transition-all duration-700
          ${template === "minimal" ? "text-4xl font-light text-white" : ""}
          ${template === "bold" ? "text-6xl md:text-8xl font-black uppercase tracking-tighter text-white" : ""}
          ${template === "developer" ? "text-3xl font-mono text-green-400 border-b border-green-900 pb-4 inline-block" : ""}
        `}
        >
          {template === "developer"
            ? "./deployed_architecture"
            : "Selected Works."}
        </h2>
        <div
          ref={scrollWrapperRef}
          className="flex gap-10 flex-nowrap w-[300vw] md:w-[200vw]"
        >
          {userData.projects.map((project, index) => (
            <div
              key={index}
              className="project-card w-[80vw] md:w-[45vw] h-[55vh] shrink-0 group"
            >
              {/* =========================================
                  DEVELOPER THEME
                  ========================================= */}
              {template === "developer" && (
                <div className="h-full w-full border border-gray-700 bg-[#0a0a0a] p-8 font-mono flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-xs text-gray-600">
                    ID: 0x00{index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-200 mb-4 flex items-center gap-3">
                      <span style={{ color: primaryColor }}>{`>`}</span>{" "}
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed border-l border-gray-800 pl-4">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-6 text-sm">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                        style={{ color: primaryColor }}
                      >
                        [ src_code ]
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        [ execute_live ]
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* =========================================
                  BOLD THEME
                  ========================================= */}
              {template === "bold" && (
                <div
                  className="h-full w-full bg-[#111] p-10 flex flex-col justify-between relative overflow-hidden transform transition-transform group-hover:-skew-x-2 border-l-8"
                  style={{ borderColor: primaryColor }}
                >
                  <div
                    className="absolute -top-10 -right-4 text-[15rem] font-black opacity-10 pointer-events-none leading-none"
                    style={{ color: primaryColor }}
                  >
                    {index + 1}
                  </div>
                  <div className="z-10">
                    <h3 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-lg md:text-xl font-medium max-w-md">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-4 z-10">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-transform"
                      >
                        Launch
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-8 py-4 border-2 font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                        style={{
                          borderColor: primaryColor,
                          color: primaryColor,
                        }}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* =========================================
                  MINIMAL THEME
                  ========================================= */}
              {template === "minimal" && (
                <div className="h-full w-full bg-white/5 backdrop-blur-md rounded-3xl p-10 flex flex-col justify-between border border-white/10 shadow-2xl hover:bg-white/10 transition-colors">
                  <div>
                    <div
                      className="text-xs tracking-widest uppercase mb-4"
                      style={{ color: primaryColor }}
                    >
                      Project {index + 1}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-4">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed font-light">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2 rounded-full text-white text-sm tracking-wide transition-opacity hover:opacity-80"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2 rounded-full text-white text-sm tracking-wide border border-white/20 hover:bg-white/10 transition-colors"
                      >
                        Source
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
