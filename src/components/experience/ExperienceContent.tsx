
import { KeyboardShortcutsProvider } from "@/context/KeyboardShortcutsContext";
import ExperienceLogic from "./ExperienceLogic";

interface ExperienceContentProps {
  slug?: string;
}

const ExperienceContent = ({ slug }: ExperienceContentProps) => {
  return (
    <KeyboardShortcutsProvider>
      <ExperienceLogic slug={slug} />
    </KeyboardShortcutsProvider>
  );
};

export default ExperienceContent;
