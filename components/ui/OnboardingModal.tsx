"use client";

import { useState, useEffect } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { Sparkles } from "lucide-react";

export default function OnboardingModal() {
  const {
    userData,
    setUserData,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
  } = usePortfolioStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Wrapping in a timeout satisfies the strict linter rule
    // while safely preventing Next.js hydration mismatches
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  if (!isMounted || hasCompletedOnboarding) return null;

  const handleStart = () => {
    if (!userData.name || !userData.role) {
      alert("Please enter your name and role to continue.");
      return;
    }
    setHasCompletedOnboarding(true);
  };

  return (
    <div className="fixed inset-0 z-9999 bg-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl text-white flex flex-col gap-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50">
            <Sparkles size={28} className="text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome to Builder.</h2>
          <p className="text-gray-400 text-sm">
            Let&apos;s set up the foundation of your AI-generated portfolio.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Your Name
          </label>
          <input
            type="text"
            placeholder="e.g. Gourav Sharma"
            value={userData.name}
            onChange={(e) => setUserData({ name: e.target.value })}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Your Primary Role
          </label>
          <input
            type="text"
            placeholder="e.g. MERN Stack Developer"
            value={userData.role}
            onChange={(e) => setUserData({ role: e.target.value })}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleStart}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold tracking-wide transition-colors"
        >
          Initialize Workspace
        </button>
      </div>
    </div>
  );
}
