
import { KeyboardShortcutsProvider } from "@/context/KeyboardShortcutsContext";
import ExperienceLogic from "./ExperienceLogic";

interface ExperienceContentProps {
  initialSlug?: string;
}

const ExperienceContent = ({ initialSlug }: ExperienceContentProps) => {
  return (
    <KeyboardShortcutsProvider>
      <ExperienceLogic initialSlug={initialSlug} />
    </KeyboardShortcutsProvider>
  );
};

export default ExperienceContent;
