import { MaterialConfig } from "@/types/scene";
import { useExperience } from "@/hooks/useExperience";
import DynamicMaterial from "../../materials/DynamicMaterial";

interface EnergyWebProps {
    color: string;
    materialConfig: MaterialConfig;
}

const EnergyWeb = ({ color, materialConfig }: EnergyWebProps) => {
    const { theme } = useExperience();

    return (
        <group>
            {/* Simplified to just 3 energy lines connecting the satellites */}
            {Array.from({ length: 3 }, (_, i) => {
                const angle = (i / 3) * Math.PI * 2;
                const nextAngle = ((i + 1) / 3) * Math.PI * 2;
                const radius = 4;

                const start = [
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius,
                ];
                const end = [
                    Math.cos(nextAngle) * radius,
                    0,
                    Math.sin(nextAngle) * radius,
                ];
                const distance = Math.sqrt(
                    Math.pow(end[0] - start[0], 2) +
                        Math.pow(end[2] - start[2], 2)
                );

                return (
                    <mesh
                        key={`energy-line-${i}`}
                        position={[
                            (start[0] + end[0]) / 2,
                            0,
                            (start[2] + end[2]) / 2,
                        ]}
                        rotation={[0, angle + Math.PI / 3, 0]}
                    >
                        <cylinderGeometry args={[0.01, 0.01, distance, 6]} />
                        <DynamicMaterial
                            materialConfig={{
                                ...materialConfig,
                                transparent: true,
                                opacity: theme === "day" ? 0.3 : 0.5,
                                emissive: color,
                                emissiveIntensity: 0.6,
                            }}
                            color={color}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

export default EnergyWeb;
