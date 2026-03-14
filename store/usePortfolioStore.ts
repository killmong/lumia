import { create } from "zustand";

// 1. Define the shape of the user's input
export interface Project {
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  deepContent?: string; // For adding full case studies later
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
}

export interface Integrations {
  githubUsername?: string;
  youtubeChannelId?: string;
}

export interface UserData {
  name: string;
  role: string;
  bio: string;
  aboutText: string; // The deep dive details about the developer
  skills: string[];
  projects: Project[];
  socialLinks: SocialLinks;
  integrations: Integrations; // Used to fetch 3rd party API data
  contactEmail: string;
  contactMessage: string;
}

// 2. Define the shape of the AI's output
export interface AiConfig {
  templateName: "minimal" | "bold" | "developer" | "creator"; // Added 'creator' theme
  primaryColor: string;
  backgroundColor: string;
  fontPairing: string;
  narrativeFlow: "chronological" | "skill-first" | "project-heavy";
}

// 3. Define the store's state and actions
interface PortfolioState {
  userData: UserData;
  aiConfig: AiConfig | null;
  isGenerating: boolean;

  setUserData: (data: Partial<UserData>) => void;
  setAiConfig: (config: AiConfig) => void;
  setIsGenerating: (status: boolean) => void;
  resetStore: () => void;
}

// 4. Initial mock data ready for the new sections
const defaultUserData: UserData = {
  name: "Gourav Sharma",
  role: "Full Stack Developer & Content Creator",
  bio: "I build high-performance, interactive web applications with a focus on seamless user experiences and modern UI.",
  aboutText:
    "Currently pursuing my B.Tech in CSE. When I'm not debugging MERN stack apps, building fintech dashboards like Folio, or animating with GSAP, I'm likely playing Kabaddi, editing vlogs, or exploring new tech.",
  skills: ["Next.js", "GSAP", "Tailwind CSS", "MERN Stack", "Premiere Pro"],
  projects: [
    {
      title: "Folio",
      description:
        "A modern, interactive fintech dashboard built with Next.js and Framer Motion.",
      deepContent: "Built to handle complex financial data visualization...",
    },
    {
      title: "ByteStore",
      description: "A scalable cloud storage platform.",
      deepContent: "Architected using a scalable backend...",
    },
  ],
  socialLinks: {
    github: "https://github.com/killmong",
    youtube: "https://youtube.com/@GOuravSharmaVLogD",
  },
  integrations: {
    githubUsername: "killmong", // We will feed this into react-github-calendar
    youtubeChannelId: "GOuravSharmaVLogD", // We will use this for fetching top content
  },
  contactEmail: "hello@example.com",
  contactMessage:
    "Currently open for software engineering roles or creative collaborations. Let's build something great.",
};

// 5. Create the actual store
export const usePortfolioStore = create<PortfolioState>((set) => ({
  userData: defaultUserData,
  aiConfig: null,
  isGenerating: false,

  setUserData: (data) =>
    set((state) => ({
      userData: { ...state.userData, ...data },
    })),
  setAiConfig: (config) => set({ aiConfig: config }),
  setIsGenerating: (status) => set({ isGenerating: status }),
  resetStore: () =>
    set({ userData: defaultUserData, aiConfig: null, isGenerating: false }),
}));
