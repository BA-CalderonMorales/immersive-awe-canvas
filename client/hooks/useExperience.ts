import { useContext } from "react";
import { ExperienceContext } from "@/context/ExperienceContext";

export const useExperience = () => {
    const context = useContext(ExperienceContext);

    if (context === undefined) {
        throw new Error(
            "useExperience must be used within an ExperienceProvider"
        );
    }

    return context;
};
