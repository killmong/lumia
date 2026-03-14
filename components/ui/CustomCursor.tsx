"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { aiConfig, cursorSettings } = usePortfolioStore();
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    // Wrapping in a timeout satisfies the strict linter rule
    // while safely preventing Next.js hydration mismatches
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Decide the color: Override beats AI theme, AI theme beats white default.
  const cursorColor =
    cursorSettings.colorOverride || aiConfig?.primaryColor || "#ffffff";
  const shape = cursorSettings.shape;

  useGSAP(() => {
    if (!cursorRef.current) return;

    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.15,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.15,
      ease: "power3.out",
    });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);

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
        backgroundColor: shape === "ring" ? "transparent" : cursorColor,
        border: shape === "ring" ? `2px solid ${cursorColor}` : "none",
        duration: 0.3,
      });
    };

    const interactives = document.querySelectorAll(
      "button, a, .project-card, input, textarea",
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [cursorColor, shape, isMounted]);

  if (!isMounted) return null;

  // Dynamically apply classes based on the chosen shape
  const shapeClasses = {
    circle: "w-4 h-4 rounded-full",
    ring: "w-6 h-6 rounded-full border-2 bg-transparent",
    square: "w-4 h-4 rounded-none",
  };

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 hidden md:block mix-blend-difference ${shapeClasses[shape]}`}
      style={{
        backgroundColor: shape === "ring" ? "transparent" : cursorColor,
        borderColor: shape === "ring" ? cursorColor : "transparent",
      }}
    />
  );
}
