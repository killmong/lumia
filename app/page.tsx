import HeroSection from "@/components/templates/HeroSection";
import ProjectsSection from "@/components/templates/ProjectsSection";
import AboutSection from "@/components/templates/Aboutsection";
import ContactSection from "@/components/templates/ContactSection"; // <-- Import
import ControlPanel from "@/components/ui/ControlPanel";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-[#0f172a]">
      {/* The UI Builder sidebar */}
      <ControlPanel />

      <div>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection /> {/* <-- Add it right here at the bottom */}
      </div>
    </main>
  );
}
