"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { GitHubCalendar } from "react-github-calendar";
import {
  Terminal,
  User,
  Activity,
  Youtube,
  PlayCircle,
  Play,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { userData, aiConfig } = usePortfolioStore();

  const template = aiConfig?.templateName || "bold";
  const primaryColor = aiConfig?.primaryColor || "#3b82f6";
  const bgColor =
    aiConfig?.backgroundColor === "#171717" ? "#1a1a1a" : "#020617"; // A slightly contrasting background

  useGSAP(() => {
    // Reset animations on theme change
    gsap.killTweensOf(".about-animate");
    gsap.set(".about-animate", { clearProps: "all" });

    // Scroll-triggered animations
    gsap.from(".about-animate", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%", // Triggers when the top of the section hits 75% down the viewport
        toggleActions: "play none none reverse", // Reverses animation if you scroll back up
      },
    });
  }, [template]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-32 px-6 md:px-20 relative overflow-hidden transition-colors duration-1000 flex items-center pr-80"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* =========================================
            THE DEVELOPER THEME (Terminal & GitHub)
            ========================================= */}
        {template === "developer" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
            {/* Left side: Terminal Bio */}
            <div className="font-mono text-left bg-[#0a0a0a] border border-gray-700 p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
                <Terminal size={24} className="text-gray-500" />
                <h2 className="about-animate text-2xl font-bold text-gray-300">
                  ~/system/about.md
                </h2>
              </div>
              <p className="about-animate text-gray-400 leading-relaxed mb-8 whitespace-pre-wrap pl-4 border-l border-gray-800">
                {userData.aboutText}
              </p>
              <div className="about-animate">
                <h3 className="text-green-400 mb-4">
                  $ installed_dependencies
                </h3>
                <div className="flex flex-wrap gap-3">
                  {userData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-900/20 border border-green-900/50 text-green-400 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: GitHub Integration */}
            {userData.integrations.githubUsername && (
              <div className="font-mono bg-[#0a0a0a] border border-gray-700 p-8 shadow-2xl flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-8 border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <Activity size={24} className="text-gray-500" />
                    <h2 className="about-animate text-lg font-bold text-gray-300">
                      Live Commit Graph
                    </h2>
                  </div>
                  <span style={{ color: primaryColor }}>
                    @{userData.integrations.githubUsername}
                  </span>
                </div>

                <div className="about-animate overflow-x-auto w-full custom-scrollbar pb-4">
                  <GitHubCalendar
                    username={userData.integrations.githubUsername}
                    colorScheme="dark"
                    theme={{
                      dark: [
                        "#161b22",
                        "#0e4429",
                        "#006d32",
                        "#26a641",
                        "#39d353",
                      ], // Classic GitHub Green
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {/* =========================================
            THE CREATOR THEME (Cinematic & Video)
            ========================================= */}
        {template === "creator" && (
          <div className="flex flex-col gap-12 w-full">
            {/* Cinematic Header */}
            <div
              className="flex flex-col md:flex-row justify-between items-end border-b-2 pb-6"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <h2 className="about-animate text-5xl md:text-7xl font-black uppercase text-white tracking-tighter">
                Behind The <span style={{ color: primaryColor }}>Lens.</span>
              </h2>

              {userData.integrations.youtubeChannelId && (
                <a
                  href={`https://youtube.com/${userData.integrations.youtubeChannelId.startsWith("@") ? "" : "@"}${userData.integrations.youtubeChannelId.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="about-animate flex items-center gap-2 px-8 py-4 rounded-full text-white font-black tracking-widest uppercase hover:scale-105 transition-transform mt-6 md:mt-0 shadow-[0_0_30px_rgba(255,0,0,0.3)]"
                  style={{ backgroundColor: "#FF0000" }}
                >
                  <Youtube size={24} /> Subscribe
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
              {/* Creator Bio */}
              <div className="about-animate text-xl md:text-3xl font-medium text-gray-300 leading-relaxed">
                <p
                  className="border-l-4 pl-6"
                  style={{ borderColor: primaryColor }}
                >
                  {userData.aboutText}
                </p>

                <div className="mt-12 flex flex-wrap gap-3">
                  {userData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-5 py-2 rounded-full bg-white/10 text-white font-bold tracking-wider text-sm backdrop-blur-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Latest Drop / Video Player UI */}
              <div className="about-animate flex flex-col gap-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <PlayCircle size={28} style={{ color: primaryColor }} />{" "}
                  Latest Drop
                </h3>

                {/* Simulated Video Player */}
                <div
                  className="w-full aspect-video rounded-3xl overflow-hidden border-2 shadow-2xl relative group cursor-pointer bg-black flex items-center justify-center"
                  style={{ borderColor: primaryColor }}
                >
                  {/* Dark Overlay that fades on hover */}
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-500 z-10 flex items-center justify-center">
                    {/* Play Button */}
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                      <Play
                        size={48}
                        className="text-white ml-2"
                        fill="white"
                      />
                    </div>
                  </div>

                  {/* You can replace this gradient with an actual <img> thumbnail later! */}
                  <div className="w-full h-full bg-linear-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest">
                    [ Fetching Latest YouTube Video... ]
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* =========================================
            THE BOLD THEME (Agency / Creative)
            ========================================= */}
        {template === "bold" && (
          <div className="flex flex-col items-start relative">
            <h2 className="about-animate text-6xl md:text-[8rem] font-black uppercase tracking-tighter text-white mb-12 leading-none">
              The <br />
              <span style={{ color: primaryColor }}>Architect.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full">
              <div className="md:col-span-8">
                <p className="about-animate text-2xl md:text-4xl font-medium text-gray-300 leading-tight">
                  {userData.aboutText}
                </p>
              </div>

              <div className="md:col-span-4 flex flex-col gap-6 pt-4">
                <div
                  className="about-animate w-full h-1"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                <h3 className="about-animate text-xl font-bold text-white uppercase tracking-widest">
                  Arsenal
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-white/10 text-white font-bold uppercase text-sm tracking-wider"
                      style={{ borderLeft: `4px solid ${primaryColor}` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            THE MINIMAL THEME (Corporate)
            ========================================= */}
        {template === "minimal" && (
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="about-animate mb-8">
              <User
                size={48}
                style={{ color: primaryColor }}
                className="mx-auto mb-6 opacity-80"
              />
              <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400 mb-4">
                Background & Expertise
              </h2>
            </div>

            <p className="about-animate text-xl md:text-3xl font-light text-white leading-relaxed mb-16">
              {userData.aboutText}
            </p>

            <div className="about-animate w-full bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-8">
                Core Competencies
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {userData.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-6 py-3 rounded-full text-sm tracking-wide text-white border border-white/20 transition-colors hover:bg-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
