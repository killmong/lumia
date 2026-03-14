"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import {
  Mail,
  Github,
  Youtube,
  Linkedin,
  Terminal,
  Send,
  Zap,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { userData, aiConfig } = usePortfolioStore();

  const template = aiConfig?.templateName || "bold";
  const primaryColor = aiConfig?.primaryColor || "#3b82f6";
  const bgColor = aiConfig?.backgroundColor || "#0f172a";

  useGSAP(() => {
    gsap.killTweensOf(".contact-animate");
    gsap.set(".contact-animate", { clearProps: "all" });

    gsap.from(".contact-animate", {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }, [template]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-1000 py-20 px-6 pr-80"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-7xl mx-auto z-10">
        {/* =========================================
            THE DEVELOPER THEME (Terminal Prompt)
            ========================================= */}
        {template === "developer" && (
          <div className="max-w-3xl font-mono">
            <div className="contact-animate text-green-400 mb-6 flex items-center gap-3 text-xl">
              <Terminal size={28} />
              <span>Initiate_Connection.sh</span>
            </div>

            <h2 className="contact-animate text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              Let&apos;s build something.
            </h2>

            <div className="contact-animate bg-[#0a0a0a] border border-gray-700 p-6 md:p-10 mb-10 relative">
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                <span className="text-green-400">$ echo</span> &quot;
                {userData.contactMessage}&quot;
              </p>

              <div className="flex flex-col gap-4 text-sm md:text-base">
                <a
                  href={`mailto:${userData.contactEmail}`}
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                >
                  <span className="text-gray-600 group-hover:text-white transition-colors">
                    {`>`} ping
                  </span>
                  <span style={{ color: primaryColor }}>
                    {userData.contactEmail}
                  </span>
                </a>

                {userData.socialLinks.github && (
                  <a
                    href={userData.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                  >
                    <span className="text-gray-600 group-hover:text-white transition-colors">
                      {`>`} ssh
                    </span>
                    <span>
                      github.com/
                      {userData.integrations.githubUsername || "profile"}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            THE BOLD THEME (Massive Typography)
            ========================================= */}
        {template === "bold" && (
          <div className="flex flex-col items-start">
            <p className="contact-animate text-xl font-bold uppercase tracking-[0.4em] text-gray-400 mb-6">
              Next Steps
            </p>
            <h2
              className="contact-animate text-[5rem] md:text-[10rem] font-black uppercase leading-[0.85] tracking-tighter text-white mb-10 transition-colors hover:text-transparent hover:text-stroke-2"
              style={{ WebkitTextStrokeColor: primaryColor }}
            >
              START A<br />
              PROJECT.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mt-8">
              <p className="contact-animate text-2xl md:text-3xl font-medium text-gray-300">
                {userData.contactMessage}
              </p>

              <div className="contact-animate flex flex-col items-start gap-8">
                <a
                  href={`mailto:${userData.contactEmail}`}
                  className="px-10 py-6 text-2xl font-black uppercase tracking-widest text-black hover:scale-105 transition-transform w-full md:w-auto text-center flex items-center justify-center gap-4"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send size={28} /> Hit Me Up
                </a>

                <div className="flex gap-6 mt-4">
                  {userData.socialLinks.github && (
                    <a
                      href={userData.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 border-2 border-white/20 rounded-full hover:border-white transition-colors text-white"
                    >
                      <Github size={24} />
                    </a>
                  )}
                  {userData.socialLinks.linkedin && (
                    <a
                      href={userData.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 border-2 border-white/20 rounded-full hover:border-white transition-colors text-white"
                    >
                      <Linkedin size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            THE MINIMAL THEME (Corporate Glass)
            ========================================= */}
        {template === "minimal" && (
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <Mail
              size={40}
              className="contact-animate mb-8 opacity-70"
              style={{ color: primaryColor }}
            />

            <h2 className="contact-animate text-5xl md:text-7xl font-light text-white mb-8 tracking-tight">
              Get in touch.
            </h2>

            <p className="contact-animate text-lg md:text-xl text-gray-400 font-light mb-16 leading-relaxed max-w-xl">
              {userData.contactMessage}
            </p>

            <div className="contact-animate w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col items-center">
              <p className="text-sm tracking-widest uppercase text-gray-500 mb-4">
                Direct Contact
              </p>
              <a
                href={`mailto:${userData.contactEmail}`}
                className="text-2xl md:text-4xl font-medium transition-opacity hover:opacity-70 mb-10"
                style={{ color: primaryColor }}
              >
                {userData.contactEmail}
              </a>

              <div className="flex gap-8 border-t border-white/10 pt-8 w-full justify-center">
                {userData.socialLinks.github && (
                  <a
                    href={userData.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Github size={20} />
                  </a>
                )}
                {userData.socialLinks.linkedin && (
                  <a
                    href={userData.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            THE CREATOR THEME (Cinematic & Neon)
            ========================================= */}
        {template === "creator" && (
          <div className="flex flex-col items-center text-center">
            <div className="contact-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold uppercase tracking-widest mb-8 border border-white/20">
              <Zap size={16} style={{ color: primaryColor }} /> Collab / Sponsor
            </div>

            <h2 className="contact-animate text-6xl md:text-[6rem] font-black uppercase tracking-tighter text-white mb-8 drop-shadow-2xl">
              Join The <span style={{ color: primaryColor }}>Network.</span>
            </h2>

            <p className="contact-animate text-xl md:text-2xl text-gray-300 font-medium max-w-2xl mb-12">
              {userData.contactMessage}
            </p>

            <div className="contact-animate flex flex-col md:flex-row gap-6">
              <a
                href={`mailto:${userData.contactEmail}`}
                className="px-10 py-5 rounded-full text-white font-black uppercase tracking-widest shadow-2xl transition-transform hover:scale-105 hover:shadow-[0_0_40px_rgba(255,0,0,0.4)]"
                style={{ backgroundColor: primaryColor }}
              >
                Business Inquiries
              </a>

              {userData.socialLinks.youtube && (
                <a
                  href={userData.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-10 py-5 rounded-full bg-[#111] text-white font-black uppercase tracking-widest border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                >
                  <Youtube size={24} style={{ color: primaryColor }} /> YouTube
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Background Decorative Blur */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      ></div>
    </section>
  );
}
