
import { KeyboardShortcutsProvider } from "@/context/KeyboardShortcutsContext";
import ExperienceLogic from "./ExperienceLogic";

const ExperienceContent = () => {
  return (
    <KeyboardShortcutsProvider>
      <ExperienceLogic />
    </KeyboardShortcutsProvider>
  );
};

export default ExperienceContent;
