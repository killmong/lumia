"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { Dispatch, SetStateAction } from "react";
import {
  Trash2,
  LogIn,
  LayoutDashboard,
  MonitorPlay,
  Film,
  Youtube,
  Loader2,
  Sparkles,
  Wand2,
  BarChart3,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";

interface Video {
  _id: string;
  youtubeId: string;
  url: string;
  title: string;
  category: string;
  views: number;
}

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

type DashboardViewProps = {
  videos?: Video[];
  fetchVideos?: () => Promise<void>;
  setVideos?: Dispatch<SetStateAction<Video[]>>;
};
const DashboardView = ({
  videos: initialVideos,
  fetchVideos: propFetchVideos,
  setVideos: propSetVideos,
}: DashboardViewProps) => {
  const [videos, setVideos] = useState<Video[]>(initialVideos || []);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [channelUrl, setChannelUrl] = useState<string>("");
  const [isFetchingChannel, setIsFetchingChannel] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const res = await fetch("/api/videos");
      const data: Video[] = await res.json();
      setVideos(data || []);
    } catch (err) {
      console.error("Failed to fetch videos from MongoDB", err);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (!initialVideos) {
      fetchVideos();
    }
  }, [initialVideos]);

  const callGeminiWithBackoff = async (prompt: string): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    if (!apiKey) return "Please add your Gemini API Key";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const handleAnalyzeChannel = async () => {
    if (videos.length === 0) return;
    setIsAnalyzing(true);
    const titlesList = videos.map((v) => v.title).join(" | ");
    const prompt = `You are a creative director. Based ONLY on these video titles: [${titlesList}], write a 2-sentence creative bio summarizing my specific niche and cinematic style.`;
    try {
      const analysis = await callGeminiWithBackoff(prompt);
      if (analysis) setAiAnalysis(analysis.trim());
    } catch (err) {
      setAiAnalysis("Oops, our AI director is currently busy on set.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleFetchChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsFetchingChannel(true);

    try {
      const ytResponse = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl }),
      });

      if (!ytResponse.ok) throw new Error("Failed to fetch channel data");

      const topVideos = await ytResponse.json();

      // Clear existing records
      for (const currentVideo of videos) {
        await fetch(`/api/videos?id=${currentVideo._id}`, { method: "DELETE" });
      }

      // Save new records
      for (const video of topVideos) {
        await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(video),
        });
      }

      setChannelUrl("");
      await fetchVideos();
    } catch (err) {
      setError(
        "Could not process the channel. Ensure the URL or Handle is correct.",
      );
    } finally {
      setIsFetchingChannel(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
      fetchVideos();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const totalViews = videos.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const topVideosList = [...videos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col md:flex-row">
      <main className="flex-1 h-screen overflow-y-auto relative bg-stone-50">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto p-6 md:p-12 space-y-8"
        >
          <motion.header variants={fadeUpVariant}>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Lumina Sync
            </h2>
            <p className="text-stone-500">
              Sync your YouTube channel and automatically highlight your most
              viewed work.
            </p>
          </motion.header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              variants={scaleUpVariant}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-2 text-stone-500 mb-6">
                <BarChart3 className="w-5 h-5" />
                <h3 className="font-semibold text-stone-900">Performance</h3>
              </div>
              <div className="flex items-end gap-4 mb-8">
                <div className="text-5xl font-bold tracking-tighter text-stone-900">
                  {formatNumber(totalViews)}
                </div>
                <div className="text-sm text-stone-500 pb-1 uppercase tracking-widest font-medium">
                  Total Gallery Views
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-2">
                  Top Performing
                </p>
                {topVideosList.map((v, i) => {
                  const percentage = Math.max(
                    10,
                    (v.views / (topVideosList[0]?.views || 1)) * 100,
                  );
                  return (
                    <div key={v._id} className="relative">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-stone-700 truncate pr-4">
                          {v.title}
                        </span>
                        <span className="text-stone-500">
                          {formatNumber(v.views)}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: 0.5 + i * 0.2,
                          }}
                          className={`h-full rounded-full ${i === 0 ? "bg-orange-500" : "bg-stone-300"}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              variants={scaleUpVariant}
              className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-3xl border border-orange-100 shadow-sm flex flex-col relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 z-10">
                <h3 className="text-lg font-semibold text-orange-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-600" /> AI Persona
                </h3>
              </div>
              <p className="text-sm text-orange-900/70 mb-6 z-10">
                Generate a creative bio based on your top synced videos.
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={aiAnalysis || "empty"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-200/50 p-5 text-orange-950 text-sm leading-relaxed mb-6 flex items-center justify-center text-center italic min-h-[100px] z-10"
                >
                  {aiAnalysis
                    ? `"${aiAnalysis}"`
                    : "Click generate to create your creative identity."}
                </motion.div>
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyzeChannel}
                disabled={isAnalyzing || videos.length === 0}
                className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 z-10"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                Generate Identity
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUpVariant}
            className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Youtube className="w-6 h-6 text-red-500" /> Sync Channel
            </h3>
            <form onSubmit={handleFetchChannel} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="e.g. https://youtube.com/@handle"
                  className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isFetchingChannel}
                  className="bg-stone-900 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 min-w-[200px]"
                >
                  {isFetchingChannel ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                  Sync Top Videos
                </motion.button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            {loadingVideos ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <AnimatePresence>
                  {videos.map((video) => (
                    <motion.div
                      key={video._id}
                      variants={fadeUpVariant}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{
                        y: -2,
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                      onClick={() => setPlayingVideo(video)}
                      className="bg-white p-3 rounded-2xl border border-stone-200 flex items-center gap-4 cursor-pointer"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        className="w-24 h-16 rounded-lg object-cover"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {video.title}
                        </h4>
                        <div className="flex gap-3 text-xs text-stone-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />{" "}
                            {formatNumber(video.views)}
                          </span>
                          <span className="text-orange-500 font-medium">
                            {video.category}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(video._id);
                        }}
                        className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {playingVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            >
              <button
                onClick={() => setPlayingVideo(null)}
                className="absolute top-6 right-6 p-4 text-white/50 hover:text-white"
              >
                <X className="w-8 h-8" />
              </button>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardView;
