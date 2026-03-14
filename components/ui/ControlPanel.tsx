"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import {
  Sparkles,
  Edit3,
  X,
  Plus,
  FolderGit2,
  User,
  Mail,
  Settings,
  MousePointer2,
  Trash2,
} from "lucide-react";

export default function ControlPanel() {
  const {
    userData,
    setUserData,
    isGenerating,
    setIsGenerating,
    setAiConfig,
    cursorSettings,
    setCursorSettings,
    resetStore,
  } = usePortfolioStore();

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "about" | "contact">(
    "projects",
  );

  const handleGenerateAI = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      });
      if (!response.ok) throw new Error("Failed to fetch AI config");
      const data = await response.json();
      setAiConfig(data.config);
    } catch (error) {
      console.error(error);
      alert("Error generating theme. Check your console and API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddProject = () => {
    setUserData({
      projects: [
        ...userData.projects,
        {
          title: "New Project",
          description: "",
          deepContent: "",
          githubUrl: "",
          liveUrl: "",
        },
      ],
    });
  };

  return (
    <>
      {/* 🔘 FLOATING TOGGLE BUTTON */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="fixed top-6 right-6 z-[60] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full shadow-2xl hover:scale-110 transition-all text-white group"
        aria-label={
          isSidebarVisible ? "Close control panel" : "Open control panel"
        }
      >
        {isSidebarVisible ? (
          <X size={24} />
        ) : (
          <Settings
            size={24}
            className="group-hover:rotate-90 transition-transform duration-500"
          />
        )}
      </button>

      {/* ⚡ THE SIDEBAR (Now sliding) */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-[#0f172a]/90 backdrop-blur-2xl border-l border-white/10 p-6 shadow-2xl z-50 flex flex-col gap-6 text-white transform transition-transform duration-500 ease-in-out overflow-y-auto custom-scrollbar ${
          isSidebarVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-1">AI Designer</h3>
          <p className="text-xs text-gray-400 mb-4">Live Portfolio Editor</p>
        </div>

        {/* Quick Identity Inputs */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Name</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ name: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Role</label>
            <input
              type="text"
              value={userData.role}
              onChange={(e) => setUserData({ role: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Deep Editor Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-between w-full bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 rounded-xl px-4 py-4 text-sm transition-all text-blue-400 font-bold mt-2"
        >
          Edit Deep Content <Edit3 size={16} />
        </button>

        <hr className="border-white/10 my-2" />

        {/* 🖱️ UI Settings: Custom Cursor */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <MousePointer2 size={16} /> Cursor Style
          </label>

          <div className="flex gap-2">
            {["circle", "ring", "square"].map((shape) => (
              <button
                key={shape}
                onClick={() => setCursorSettings({ shape: shape as any })}
                className={`flex-1 py-2 text-xs capitalize font-bold rounded-lg border transition-all ${
                  cursorSettings.shape === shape
                    ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {shape}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-1 bg-black/20 p-2 rounded-lg border border-white/5">
            <span className="text-xs text-gray-400">Override Theme Color</span>
            <div className="flex items-center gap-3">
              {cursorSettings.colorOverride && (
                <button
                  onClick={() => setCursorSettings({ colorOverride: "" })}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear
                </button>
              )}
              <input
                type="color"
                value={cursorSettings.colorOverride || "#ffffff"}
                onChange={(e) =>
                  setCursorSettings({ colorOverride: e.target.value })
                }
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions Area */}
        <div className="mt-auto flex flex-col gap-3 pt-6">
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            <Sparkles
              size={18}
              className={isGenerating ? "animate-spin" : ""}
            />
            {isGenerating ? "Analyzing..." : "Regenerate AI Theme"}
          </button>

          {/* 🚨 DANGER ZONE */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to reset all data? This will clear your Local Storage and reset the builder to its default state.",
                )
              ) {
                resetStore();
                window.location.reload(); // Force a hard refresh to wipe everything clean
              }
            }}
            className="flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 py-3 rounded-xl text-sm font-bold transition-all"
          >
            <Trash2 size={16} /> Factory Reset
          </button>
        </div>
      </aside>

      {/* =========================================
          THE MEGA MODAL (Deep Content)
          ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
          <div className="bg-[#0f172a] border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
            {/* Modal Header & Tabs */}
            <div className="bg-black/40 border-b border-white/10 flex flex-col">
              <div className="px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Content Editor</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex px-6 gap-6">
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === "projects"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <FolderGit2 size={16} /> Projects
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === "about"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <User size={16} /> About & Integrations
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === "contact"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Mail size={16} /> Let&apos;s Connect
                </button>
              </div>
            </div>

            {/* Modal Body (Dynamic based on Active Tab) */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#0f172a]">
              {/* TAB 1: PROJECTS */}
              {activeTab === "projects" && (
                <div className="flex flex-col gap-8">
                  {userData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-4 relative"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            const newP = [...userData.projects];
                            newP[index] = {
                              ...newP[index],
                              title: e.target.value,
                            };
                            setUserData({ projects: newP });
                          }}
                          className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">
                          Short Description (For Cards)
                        </label>
                        <textarea
                          value={project.description}
                          rows={2}
                          onChange={(e) => {
                            const newP = [...userData.projects];
                            newP[index] = {
                              ...newP[index],
                              description: e.target.value,
                            };
                            setUserData({ projects: newP });
                          }}
                          className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>

                      {/* NEW: Deep Content Field */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-blue-400 uppercase tracking-wider">
                          Deep Case Study / Content
                        </label>
                        <textarea
                          placeholder="Write the full story of this project here..."
                          value={project.deepContent || ""}
                          rows={4}
                          onChange={(e) => {
                            const newP = [...userData.projects];
                            newP[index] = {
                              ...newP[index],
                              deepContent: e.target.value,
                            };
                            setUserData({ projects: newP });
                          }}
                          className="bg-blue-900/10 border border-blue-500/30 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none custom-scrollbar"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-400 uppercase tracking-wider">
                            GitHub URL
                          </label>
                          <input
                            type="text"
                            value={project.githubUrl || ""}
                            onChange={(e) => {
                              const newP = [...userData.projects];
                              newP[index] = {
                                ...newP[index],
                                githubUrl: e.target.value,
                              };
                              setUserData({ projects: newP });
                            }}
                            className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-400 uppercase tracking-wider">
                            Live URL
                          </label>
                          <input
                            type="text"
                            value={project.liveUrl || ""}
                            onChange={(e) => {
                              const newP = [...userData.projects];
                              newP[index] = {
                                ...newP[index],
                                liveUrl: e.target.value,
                              };
                              setUserData({ projects: newP });
                            }}
                            className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddProject}
                    className="py-4 rounded-xl border-2 border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={20} /> Add Project
                  </button>
                </div>
              )}

              {/* TAB 2: ABOUT & INTEGRATIONS */}
              {activeTab === "about" && (
                <div className="flex flex-col gap-8">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                      Deep Bio
                    </h3>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">
                        Full About Story
                      </label>
                      <textarea
                        value={userData.aboutText}
                        rows={6}
                        onChange={(e) =>
                          setUserData({ aboutText: e.target.value })
                        }
                        className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none custom-scrollbar"
                        placeholder="Tell your full story here..."
                      />
                    </div>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                      Resume Upload
                    </h3>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">
                        Resume URL
                      </label>
                      <input
                        type="text"
                        placeholder="Link to PDF"
                        value={userData.resumeUrl}
                        onChange={(e) =>
                          setUserData({ resumeUrl: e.target.value })
                        }
                        className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-900/10 p-6 rounded-xl border border-blue-500/30 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-blue-400 border-b border-blue-500/20 pb-2">
                      API Integrations
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      These handles will be used to fetch live data (like GitHub
                      commits or YouTube videos) depending on the AI theme.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">
                          GitHub Username
                        </label>
                        <input
                          type="text"
                          value={userData.integrations.githubUsername || ""}
                          onChange={(e) =>
                            setUserData({
                              integrations: {
                                ...userData.integrations,
                                githubUsername: e.target.value,
                              },
                            })
                          }
                          className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          placeholder="e.g. killmong"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">
                          YouTube Handle / ID
                        </label>
                        <input
                          type="text"
                          value={userData.integrations.youtubeChannelId || ""}
                          onChange={(e) =>
                            setUserData({
                              integrations: {
                                ...userData.integrations,
                                youtubeChannelId: e.target.value,
                              },
                            })
                          }
                          className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          placeholder="e.g. GOuravSharmaVLogD or UC..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CONTACT */}
              {activeTab === "contact" && (
                <div className="flex flex-col gap-8">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                      Let&apos;s Connect Info
                    </h3>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={userData.contactEmail}
                        onChange={(e) =>
                          setUserData({ contactEmail: e.target.value })
                        }
                        className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">
                        Footer Message
                      </label>
                      <textarea
                        value={userData.contactMessage}
                        rows={3}
                        onChange={(e) =>
                          setUserData({ contactMessage: e.target.value })
                        }
                        className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-md font-semibold transition-colors shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
