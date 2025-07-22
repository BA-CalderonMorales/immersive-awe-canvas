import { useRef } from "react";
import { MaterialConfig } from "@/types/scene";
import { useFrame } from "@react-three/fiber";
import DynamicMaterial from "../../materials/DynamicMaterial";

interface EnergyStreamsProps {
    materialConfig: MaterialConfig;
}

const EnergyStreams = ({ materialConfig }: EnergyStreamsProps) => {
    const timeRef = useRef(0);

    useFrame(state => {
        timeRef.current = state.clock.getElapsedTime();
    });

    return (
        <>
            {/* Streams of Consciousness - flowing thoughts and connections */}
            {[...Array(4)].map((_, i) => {
                // Reduced to 4 for deeper focus
                const angle = (i / 4) * Math.PI * 2;
                const radius = 2.5 + Math.sin(i * 0.7) * 0.8;
                return (
                    <mesh
                        key={`consciousness-stream-${i}`}
                        position={[
                            Math.cos(angle + timeRef.current * 0.05) * radius, // Very slow, meditative flow
                            Math.sin(timeRef.current * 0.15 + i * 1.5) * 1.2, // Gentle vertical drift
                            Math.sin(angle + timeRef.current * 0.05) * radius,
                        ]}
                        rotation={[
                            timeRef.current * 0.2 + i,
                            timeRef.current * 0.15,
                            timeRef.current * 0.1,
                        ]} // Slow, contemplative rotation
                        scale={[
                            0.06,
                            2.0 + Math.sin(timeRef.current * 0.6 + i) * 0.4,
                            0.06,
                        ]} // Breathing length
                    >
                        <cylinderGeometry args={[0.03, 0.015, 1, 8]} />
                        <DynamicMaterial
                            materialConfig={{
                                ...materialConfig,
                                transparent: true,
                                opacity:
                                    0.3 +
                                    Math.sin(timeRef.current * 0.5 + i) * 0.1, // Pulsing visibility
                                emissiveIntensity: 0.15,
                                wireframe: false,
                            }}
                            color={`hsl(${(i * 90 + timeRef.current * 10) % 360}, 45%, 60%)`} // Philosophical color palette
                        />
                    </mesh>
                );
            })}

            {/* Interconnected Thoughts - representing the web of consciousness */}
            {[...Array(8)].map((_, i) => {
                const phi = Math.acos(-1 + (2 * i) / 8); // Golden ratio distribution
                const theta = Math.sqrt(8 * Math.PI) * i;
                const radius = 3.5;
                return (
                    <mesh
                        key={`thought-connection-${i}`}
                        position={[
                            radius *
                                Math.sin(phi) *
                                Math.cos(theta + timeRef.current * 0.03),
                            radius * Math.cos(phi) +
                                Math.sin(timeRef.current * 0.2 + i) * 0.5,
                            radius *
                                Math.sin(phi) *
                                Math.sin(theta + timeRef.current * 0.03),
                        ]}
                        rotation={[
                            timeRef.current * 0.1 + i * 0.3,
                            timeRef.current * 0.08 + i * 0.5,
                            timeRef.current * 0.12 + i * 0.2,
                        ]}
                        scale={0.4 + Math.sin(timeRef.current * 0.7 + i) * 0.1}
                    >
                        <octahedronGeometry args={[0.15, 0]} />
                        <DynamicMaterial
                            materialConfig={{
                                ...materialConfig,
                                transparent: true,
                                opacity:
                                    0.25 +
                                    Math.sin(timeRef.current * 0.8 + i) * 0.1,
                                emissiveIntensity: 0.1,
                                wireframe: true,
                            }}
                            color={`hsl(${(i * 45 + timeRef.current * 15) % 360}, 40%, 55%)`}
                        />
                    </mesh>
                );
            })}
        </>
    );
};

export default EnergyStreams;
