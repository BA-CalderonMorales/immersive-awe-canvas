import { KeyboardShortcutsProvider } from "@/context/KeyboardShortcutsContext";
import ExperienceLogic from "./ExperienceLogic";

interface ExperienceContentProps {

  initialWorldSlug?: string;

}

const ExperienceContent = ({ initialWorldSlug }: ExperienceContentProps) => {

  return (

    <KeyboardShortcutsProvider>

      <ExperienceLogic initialWorldSlug={initialWorldSlug} />

    </KeyboardShortcutsProvider>

  );

};

export default ExperienceContent;
