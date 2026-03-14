"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { aiConfig } = usePortfolioStore();

  // Use the AI generated color, or default to white
  const cursorColor = aiConfig?.primaryColor || "#ffffff";

  useGSAP(() => {
    if (!cursorRef.current) return;

    // 1. GSAP quickTo is significantly faster than standard gsap.to() for mouse tracking
    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.15,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.15,
      ease: "power3.out",
    });

    // 2. Track mouse movement
    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);

    // 3. Create the hover expansion effect
    const handleMouseEnter = () => {
      gsap.to(cursorRef.current, {
        scale: 3.5,
        backgroundColor: "transparent",
        border: `1px solid ${cursorColor}`,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursorRef.current, {
        scale: 1,
        backgroundColor: cursorColor,
        border: "none",
        duration: 0.3,
      });
    };

    // 4. Attach hover effects to interactive elements (buttons, links, and our project cards)
    const attachHoverEvents = () => {
      const interactives = document.querySelectorAll(
        "button, a, .project-card",
      );
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    // Run once on mount
    attachHoverEvents();

    // 5. Cleanup event listeners to prevent memory leaks
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      const interactives = document.querySelectorAll(
        "button, a, .project-card",
      );
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [cursorColor]); // Re-run the hook if the AI changes the theme color

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 hidden md:block mix-blend-difference"
      style={{ backgroundColor: cursorColor }}
    />
  );
}
