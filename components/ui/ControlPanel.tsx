"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { Sparkles, Edit3, X, Plus, FolderGit2, User, Mail } from "lucide-react";

export default function ControlPanel() {
  const { userData, setUserData, isGenerating, setIsGenerating, setAiConfig } =
    usePortfolioStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  // NEW: State to track which tab is currently active
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
      {/* =========================================
          THE SIDEBAR (Quick Edits)
          ========================================= */}
      <aside className="fixed top-0 right-0 h-full w-80 bg-white/10 backdrop-blur-lg border-l border-white/20 p-6 shadow-2xl z-50 flex flex-col gap-6 text-white overflow-y-auto custom-scrollbar">
        <div>
          <h3 className="text-xl font-bold mb-1">Portfolio Data</h3>
          <p className="text-xs text-gray-400 mb-4">Quick overview.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ name: e.target.value })}
            className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Role</label>
          <input
            type="text"
            value={userData.role}
            onChange={(e) => setUserData({ role: e.target.value })}
            className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Short Bio</label>
          <textarea
            value={userData.bio}
            onChange={(e) => setUserData({ bio: e.target.value })}
            rows={4}
            className="bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none custom-scrollbar"
          />
        </div>

        <hr className="border-white/10 my-2" />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300 mb-1">
            Deep Content & Integrations
          </label>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-between w-full bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/40 rounded-md px-4 py-3 text-sm transition-colors text-blue-200"
          >
            <span className="font-semibold">Open Editor</span>
            <Edit3 size={16} />
          </button>
        </div>

        <button
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white py-3 rounded-md font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={18} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating ? "Analyzing..." : "Generate AI Theme"}
        </button>
      </aside>

      {/* =========================================
          THE MEGA MODAL (Deep Content)
          ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
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
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === "projects" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
                >
                  <FolderGit2 size={16} /> Projects
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === "about" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
                >
                  <User size={16} /> About & Integrations
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === "contact" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
                >
                  <Mail size={16} /> Let's Connect
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
                          placeholder="e.g., killmong"
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
                          placeholder="e.g., GOuravSharmaVLogD"
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
                      Let's Connect Info
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
