
import TransitionSplash from "@/components/TransitionSplash";
import WorldTransition from "@/components/transition/WorldTransition";

interface ExperienceTransitionsProps {
  showEntryTransition: boolean;
  showWorldTransition: boolean;
  theme: 'day' | 'night';
  onEntryTransitionEnd: () => void;
  onWorldTransitionEnd: () => void;
}

const ExperienceTransitions = ({
  showEntryTransition,
  showWorldTransition,
  theme,
  onEntryTransitionEnd,
  onWorldTransitionEnd,
}: ExperienceTransitionsProps) => {
  return (
    <>
      <TransitionSplash
        show={showEntryTransition}
        theme={theme}
        type="app-entry"
        onAnimationEnd={onEntryTransitionEnd}
      />
      <WorldTransition
        show={showWorldTransition && !showEntryTransition}
        theme={theme}
        onDone={onWorldTransitionEnd}
      />
    </>
  );
};

export default ExperienceTransitions;
