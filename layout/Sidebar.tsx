import React from "react";
import { Film, LayoutDashboard, MonitorPlay, LogIn } from "lucide-react";
import { motion } from "motion/react";
type SidebarProps = {
  view: "dashboard" | "portfolio"; // Or string if you haven't strictly typed your views yet
  setView: (view: "dashboard" | "portfolio") => void;
};

const Sidebar = ({ view, setView }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-6 flex flex-col z-20"
    >
      <div className="flex items-center gap-3 mb-10">
        <motion.div
          whileHover={{ rotate: 15 }}
          className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center"
        >
          <Film className="w-4 h-4 text-white" />
        </motion.div>
        <span className="text-xl font-bold tracking-tight">DIRECTLY</span>
      </div>

      <nav className="flex-1 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm bg-stone-900 text-white shadow-md"
        >
          <LayoutDashboard className="w-5 h-5" /> Dashboard & DB
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-stone-600 hover:bg-stone-100"
        >
          <MonitorPlay className="w-5 h-5" /> Live Showcase
        </motion.button>
      </nav>

      <div className="mt-auto pt-6 border-t border-stone-100">
        <motion.button
          whileHover={{ x: -5, color: "#000" }}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          <LogIn className="w-4 h-4 rotate-180" /> Sign Out
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
