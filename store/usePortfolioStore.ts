import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Interfaces
export interface Project {
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  deepContent?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  youtube?: string;
}

export interface Integrations {
  githubUsername?: string;
  youtubeChannelId?: string;
}

export interface UserData {
  name: string;
  role: string;
  bio: string;
  aboutText: string;
  skills: string[];
  projects: Project[];
  socialLinks: SocialLinks;
  integrations: Integrations;
  contactEmail: string;
  contactMessage: string;
  resumeUrl: string;
}

export interface AiConfig {
  templateName: "minimal" | "bold" | "developer" | "creator";
  primaryColor: string;
  backgroundColor: string;
  fontPairing: string;
  narrativeFlow: "chronological" | "skill-first" | "project-heavy";
}

export interface CursorSettings {
  shape: "circle" | "ring" | "square";
  colorOverride: string; // If empty, it uses the AI theme color
}

// 2. State Definition
interface PortfolioState {
  userData: UserData;
  aiConfig: AiConfig | null;
  cursorSettings: CursorSettings;
  isGenerating: boolean;
  hasCompletedOnboarding: boolean;

  setUserData: (data: Partial<UserData>) => void;
  setAiConfig: (config: AiConfig) => void;
  setCursorSettings: (settings: Partial<CursorSettings>) => void;
  setHasCompletedOnboarding: (status: boolean) => void;
  setIsGenerating: (status: boolean) => void;
  resetStore: () => void; // Clears everything back to zero
}

// 3. The BLANK Default State (No hardcoded data)
const emptyUserData: UserData = {
  name: "",
  role: "",
  bio: "",
  aboutText: "",
  skills: [],
  projects: [],
  socialLinks: {},
  integrations: {},
  contactEmail: "",
  contactMessage: "",
  resumeUrl: "",
};

// 4. Create the Persisted Store
export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      userData: emptyUserData,
      aiConfig: null,
      cursorSettings: { shape: "circle", colorOverride: "" },
      isGenerating: false,
      hasCompletedOnboarding: false,

      setUserData: (data) =>
        set((state) => ({
          userData: { ...state.userData, ...data },
        })),
      setAiConfig: (config) => set({ aiConfig: config }),
      setCursorSettings: (settings) =>
        set((state) => ({
          cursorSettings: { ...state.cursorSettings, ...settings },
        })),
      setHasCompletedOnboarding: (status) =>
        set({ hasCompletedOnboarding: status }),
      setIsGenerating: (status) => set({ isGenerating: status }),

      // Reset wipes the state AND clears the local storage
      resetStore: () =>
        set({
          userData: emptyUserData,
          aiConfig: null,
          hasCompletedOnboarding: false,
          cursorSettings: { shape: "circle", colorOverride: "" },
        }),
    }),
    {
      name: "portfolio-builder-storage", // The key used in localStorage
      storage: createJSONStorage(() => localStorage),
      // We don't want to save the 'isGenerating' loading state if they refresh
      partialize: (state) => ({
        userData: state.userData,
        aiConfig: state.aiConfig,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        cursorSettings: state.cursorSettings,
      }),
    },
  ),
);
