import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type InstancedMesh, Object3D, Vector3 } from "three";

interface AtmosphericParticlesProps {
    theme: "day" | "night";
    count?: number;
}

const AtmosphericParticles = ({
    theme,
    count = 200,
}: AtmosphericParticlesProps) => {
    const meshRef = useRef<InstancedMesh>(null!);
    const dummy = useRef(new Object3D());
    const timeRef = useRef(0);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new Vector3(
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 40,
                    (Math.random() - 0.5) * 60
                ),
                velocity: new Vector3(
                    (Math.random() - 0.5) * 0.02,
                    Math.random() * 0.01 + 0.005,
                    (Math.random() - 0.5) * 0.02
                ),
                scale: Math.random() * 0.3 + 0.1,
                phase: Math.random() * Math.PI * 2,
            });
        }
        return temp;
    }, [count]);

    useFrame(state => {
        if (!meshRef.current) return;

        timeRef.current = state.clock.getElapsedTime();

        particles.forEach((particle, i) => {
            // Gentle floating motion
            particle.position.add(particle.velocity);

            // Reset particles that drift too far
            if (particle.position.y > 25) {
                particle.position.y = -25;
                particle.position.x = (Math.random() - 0.5) * 60;
                particle.position.z = (Math.random() - 0.5) * 60;
            }

            // Breathing scale animation
            const breathingScale =
                particle.scale *
                (1 + Math.sin(timeRef.current * 0.5 + particle.phase) * 0.3);

            dummy.current.position.copy(particle.position);
            dummy.current.scale.setScalar(breathingScale);
            dummy.current.updateMatrix();

            meshRef.current.setMatrixAt(i, dummy.current.matrix);

            // Dynamic coloring based on theme and time
            const baseHue = theme === "day" ? 200 : 260;
            const hueShift = (timeRef.current * 10 + i * 5) % 360;
            const finalHue = (baseHue + hueShift) % 360;

            const color = new Color().setHSL(
                finalHue / 360,
                theme === "day" ? 0.3 : 0.6,
                theme === "day" ? 0.7 : 0.4
            );

            meshRef.current.setColorAt(i, color);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.02, 6, 4]} />
            <meshBasicMaterial
                transparent
                opacity={theme === "day" ? 0.4 : 0.6}
            />
        </instancedMesh>
    );
};

export default AtmosphericParticles;
