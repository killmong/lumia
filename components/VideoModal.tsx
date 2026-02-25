"use client";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { Video } from "@/lib/types";

export default function VideoModal({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/95"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-4 text-white/50 hover:text-white rounded-full"
      >
        <X className="w-8 h-8" />
      </button>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-7xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </motion.div>
    </motion.div>
  );
}
