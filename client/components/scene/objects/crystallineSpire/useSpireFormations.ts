import { useMemo } from "react";

export interface SpireFormation {
    position: [number, number, number];
    height: number;
    radius: number;
    segments: number;
    rotation: number;
    scale: number;
    type: "main" | "satellite";
    orbitSpeed?: number;
    phaseOffset?: number;
}

export const useSpireFormations = () => {
    return useMemo(() => {
        const formations: SpireFormation[] = [];

        // Single central spire - minimalist approach
        formations.push({
            position: [0, 0, 0] as [number, number, number],
            height: 6,
            radius: 0.8,
            segments: 8,
            rotation: 0,
            scale: 1,
            type: "main",
        });

        // Just 3 satellite spires for clean composition
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const radius = 4;

            formations.push({
                position: [
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius,
                ] as [number, number, number],
                height: 3,
                radius: 0.4,
                segments: 6,
                rotation: angle,
                scale: 0.8,
                type: "satellite",
                orbitSpeed: 0.02,
                phaseOffset: i * 0.5,
            });
        }

        return formations;
    }, []);
};
