
import { useEffect } from "react";
import { ExperienceProvider } from "@/context/ExperienceContext";
import ExperienceContent from "@/components/experience/ExperienceContent";

const ExperiencePage = () => {
  useEffect(() => {
    document.body.style.opacity = '1';
  }, []);

  return (
    <ExperienceProvider>
      <ExperienceContent />
    </ExperienceProvider>
  );
};

export default ExperiencePage;
