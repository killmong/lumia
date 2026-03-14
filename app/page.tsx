import HeroSection from "@/components/templates/HeroSection";
import ProjectsSection from "@/components/templates/ProjectsSection";
import AboutSection from "@/components/templates/Aboutsection";
import ContactSection from "@/components/templates/ContactSection";
import ControlPanel from "@/components/ui/ControlPanel";
import OnboardingModal from "@/components/ui/OnboardingModal"; // <-- Import it

export default function Home() {
  return (
    <main className="min-h-screen relative bg-[#0f172a]">
      {/* 🛑 Block the screen if they haven't onboarded */}
      <OnboardingModal />

      <ControlPanel />

      <div>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </div>
    </main>
  );
}
