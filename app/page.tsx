"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/layout/Sidebar";
import DashboardView from "@/components/DashBoardView";
import PortfolioView from "@/components/PortfolioView";
import VideoModal from "@/components/VideoModal";
import { Video } from "@/lib/types";
import { Film, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [view, setView] = useState<"login" | "dashboard" | "portfolio">(
    "login",
  );
  const [videos, setVideos] = useState<Video[]>([]);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  // Fetch logic goes here (abstracted for brevity)
  const fetchVideos = async () => {
    /* ... fetch logic ... */
  };

  useEffect(() => {
    if (view !== "login") fetchVideos();
  }, [view]);

  if (view === "login") {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-orange-600/20 rounded-full blur-[120px]" />

        {/* Animated Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full bg-stone-900/50 backdrop-blur-xl border border-stone-800 p-8 rounded-3xl shadow-2xl z-10 text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-linear-to-tr from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Film className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Directly
          </h1>
          <p className="text-stone-400 mb-8">Connected to MongoDB.</p>
          <button
            onClick={() => setView("dashboard")}
            className="w-full bg-white text-black py-4 px-4 rounded-2xl font-semibold hover:bg-stone-200 transition-all flex items-center justify-center gap-2 group"
          >
            Enter Directly
            <ArrowRight className="w-5 h-5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col md:flex-row">
      <Sidebar view={view} setView={setView} />

      <main className="flex-1 h-screen overflow-y-auto relative bg-stone-50">
        <AnimatePresence mode="wait">
          {view === "dashboard" && (
            <DashboardView
              videos={videos}
              setVideos={setVideos}
              fetchVideos={fetchVideos}
            />
          )}
          {view === "portfolio" && (
            <PortfolioView
              key="portfolio"
              videos={videos}
              setPlayingVideo={setPlayingVideo}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {playingVideo && (
            <VideoModal
              video={playingVideo}
              onClose={() => setPlayingVideo(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
