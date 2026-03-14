"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export default function HeroSection() {
  const container = useRef<HTMLElement>(null);
  const { userData, aiConfig } = usePortfolioStore();

  const template = aiConfig?.templateName || "bold";
  const primaryColor = aiConfig?.primaryColor || "#3b82f6";
  const bgColor = aiConfig?.backgroundColor || "#0f172a";

  useGSAP(() => {
    // 1. Reset everything before animating the new layout
    gsap.killTweensOf(".animate-target");
    gsap.set(".animate-target", { clearProps: "all" });

    const tl = gsap.timeline({ delay: 0.2 });

    // 2. Drastically different animation styles
    if (template === "minimal") {
      // Smooth, floating glass card effect
      gsap.set(".animate-target", { y: 40, opacity: 0 });
      tl.to(".animate-target", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
      });
    } else if (template === "bold") {
      // Aggressive, fast slide-ins with a skew
      gsap.set(".animate-target", { x: -100, opacity: 0, skewX: 10 });
      tl.to(".animate-target", {
        x: 0,
        opacity: 1,
        skewX: 0,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
      });
    } else if (template === "developer") {
      // Choppy, line-by-line mechanical terminal print
      gsap.set(".animate-target", { opacity: 0 });
      tl.to(".animate-target", {
        opacity: 1,
        duration: 0.1,
        stagger: 0.25,
        ease: "steps(1)",
      });
    } else if (template === "creator") {
      // THE FIX: Changed from 'case' to 'else if'
      // Cinematic slow zoom and fade (like a movie trailer)
      gsap.set(".animate-target", { scale: 0.9, opacity: 0, y: 30 });
      tl.to(".animate-target", {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.out",
      });
    }
  }, [template]);

  return (
    <section
      ref={container}
      className="relative min-h-screen w-full overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      {/* =========================================
          THE DEVELOPER THEME (Terminal Window)
          ========================================= */}
      {template === "developer" && (
        <div className="flex h-screen items-center justify-center p-6 md:p-20 pr-80">
          <div className="w-full max-w-4xl bg-[#0a0a0a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden font-mono">
            {/* Terminal Header */}
            <div className="bg-[#1f1f1f] px-4 py-3 flex items-center gap-2 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs text-gray-400">
                bash - {userData.name.toLowerCase().replace(/\s+/g, "_")}
              </span>
            </div>
            {/* Terminal Body */}
            <div className="p-8 md:p-12 text-left">
              <p className="animate-target text-green-400 mb-2">$ whoami</p>
              <h1 className="animate-target text-4xl md:text-5xl font-bold text-white mb-6">
                {userData.name}
              </h1>

              <p className="animate-target text-green-400 mb-2">
                $ cat current_role.txt
              </p>
              <h2
                className="animate-target text-2xl md:text-3xl mb-8"
                style={{ color: primaryColor }}
              >
                {userData.role}
              </h2>

              <p className="animate-target text-gray-400 mb-10 leading-relaxed border-l-2 border-gray-700 pl-4">
                {userData.bio}
              </p>

              <button
                className="animate-target px-6 py-2 border border-dashed hover:bg-white/10 transition-colors"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                ./execute_work.sh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          THE BOLD THEME (Creative Agency)
          ========================================= */}
      {template === "bold" && (
        <div className="flex h-screen items-center px-10 md:px-32 relative pr-80">
          {/* Massive background text */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 opacity-5 pointer-events-none whitespace-nowrap">
            <h1
              className="text-[12rem] md:text-[20rem] font-black uppercase tracking-tighter"
              style={{ color: primaryColor }}
            >
              {userData.role}
            </h1>
          </div>

          <div className="max-w-5xl z-10 flex flex-col items-start text-left">
            <p className="animate-target text-sm md:text-xl font-bold mb-4 uppercase tracking-[0.3em] text-white">
              Incoming Transmission
            </p>
            <h1 className="animate-target text-6xl md:text-[8rem] font-black leading-none uppercase tracking-tighter text-white mb-6">
              {userData.name}.
            </h1>
            <div
              className="animate-target w-32 h-2 mb-8"
              style={{ backgroundColor: primaryColor }}
            ></div>
            <h2
              className="animate-target text-4xl md:text-6xl font-extrabold mb-8 italic"
              style={{ color: primaryColor }}
            >
              {userData.role}
            </h2>
            <p className="animate-target text-lg md:text-2xl text-gray-300 max-w-2xl mb-12 font-medium">
              {userData.bio}
            </p>
            <button
              className="animate-target px-10 py-5 text-lg font-black uppercase tracking-widest text-black hover:scale-105 transition-transform"
              style={{ backgroundColor: primaryColor }}
            >
              Launch Project
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          THE MINIMAL THEME (Corporate/Enterprise)
          ========================================= */}
      {template === "minimal" && (
        <div className="flex h-screen flex-col items-center justify-center px-6 text-center relative pr-80">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>

          {/* Glassmorphism Card */}
          <div className="max-w-3xl z-10 flex flex-col items-center bg-white/5 backdrop-blur-xl p-12 md:p-16 rounded-3xl border border-white/10 shadow-2xl">
            {/* Avatar Placeholder */}
            <div
              className="animate-target w-24 h-24 rounded-full mb-8 flex items-center justify-center text-4xl font-light shadow-lg"
              style={{ backgroundColor: primaryColor, color: bgColor }}
            >
              {userData.name.charAt(0)}
            </div>

            <p className="animate-target text-xs text-gray-400 mb-4 tracking-widest uppercase">
              Profile Overview
            </p>
            <h1 className="animate-target text-4xl md:text-6xl font-medium text-white mb-4 tracking-tight">
              {userData.name}
            </h1>
            <h2
              className="animate-target text-xl md:text-2xl font-light mb-8"
              style={{ color: primaryColor }}
            >
              {userData.role}
            </h2>
            <p className="animate-target text-base md:text-lg text-gray-400 leading-relaxed mb-10 font-light max-w-xl">
              {userData.bio}
            </p>
            <button
              className="animate-target px-8 py-3 rounded-full text-white text-sm tracking-wide shadow-xl hover:opacity-80 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              View Credentials
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          THE CREATOR THEME (Cinematic Hero)
          ========================================= */}
      {template === "creator" && (
        <div className="flex h-screen flex-col items-center justify-center text-center w-full px-4 relative z-10 pr-80">
          <span className="animate-target px-4 py-1 rounded-full bg-red-600/20 text-red-500 font-bold text-xs tracking-[0.2em] uppercase mb-6 border border-red-500/30 shadow-[0_0_20px_rgba(255,0,0,0.3)]">
            Now Streaming
          </span>

          <h1 className="animate-target text-6xl md:text-[7rem] font-black uppercase tracking-tighter text-white mb-4 leading-none drop-shadow-2xl">
            {userData.name}
          </h1>

          <h2 className="animate-target text-2xl md:text-4xl font-bold mb-8 uppercase tracking-widest text-gray-300">
            {userData.role}
          </h2>

          <p className="animate-target text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-medium">
            {userData.bio}
          </p>

          <button
            className="animate-target px-10 py-4 rounded-full text-white font-black tracking-widest uppercase transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,0,0,0.4)] flex items-center gap-3"
            style={{ backgroundColor: primaryColor }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Showreel
          </button>
        </div>
      )}
    </section>
  );
}
