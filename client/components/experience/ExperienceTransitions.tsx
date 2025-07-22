import TransitionSplash from "@/components/TransitionSplash";
import WorldTransition from "@/components/transition/WorldTransition";
import BlurTransition from "@/components/transition/BlurTransition";

interface ExperienceTransitionsProps {
    showEntryTransition: boolean;
    showWorldTransition: boolean;
    showBlurTransition?: boolean;
    theme: "day" | "night";
    onEntryTransitionEnd: () => void;
    onWorldTransitionEnd: () => void;
    onBlurTransitionEnd?: () => void;
}

const ExperienceTransitions = ({
    showEntryTransition,
    showWorldTransition,
    showBlurTransition = false,
    theme,
    onEntryTransitionEnd,
    onWorldTransitionEnd,
    onBlurTransitionEnd,
}: ExperienceTransitionsProps) => {
    return (
        <>
            <BlurTransition
                show={showBlurTransition}
                theme={theme}
                onComplete={onBlurTransitionEnd}
            />
            <TransitionSplash
                show={showEntryTransition && !showBlurTransition}
                theme={theme}
                type="app-entry"
                onAnimationEnd={onEntryTransitionEnd}
            />
            <WorldTransition
                show={
                    showWorldTransition &&
                    !showEntryTransition &&
                    !showBlurTransition
                }
                theme={theme}
                onDone={onWorldTransitionEnd}
            />
        </>
    );
};

export default ExperienceTransitions;
