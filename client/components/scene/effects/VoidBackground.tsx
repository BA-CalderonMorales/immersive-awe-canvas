import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type InstancedMesh, Object3D, Vector3 } from "three";

interface VoidBackgroundProps {
    theme: "day" | "night";
}

const VoidBackground = ({ theme }: VoidBackgroundProps) => {
    const meshRef = useRef<InstancedMesh>(null!);
    const dummy = useRef(new Object3D());
    const timeRef = useRef(0);

    const fragments = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 150; i++) {
            temp.push({
                position: new Vector3(
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 150,
                    (Math.random() - 0.5) * 200
                ),
                velocity: new Vector3(
                    (Math.random() - 0.5) * 0.002,
                    (Math.random() - 0.5) * 0.001,
                    (Math.random() - 0.5) * 0.002
                ),
                scale: Math.random() * 1.5 + 0.3,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                phase: Math.random() * Math.PI * 2,
                type: Math.floor(Math.random() * 3), // Different fragment types
                energy: Math.random(),
            });
        }
        return temp;
    }, []);

    useFrame(state => {
        if (!meshRef.current) return;

        timeRef.current = state.clock.getElapsedTime();

        fragments.forEach((fragment, i) => {
            // Mystical drift with orbital patterns
            const _orbital =
                Math.sin(timeRef.current * 0.1 + fragment.phase) * 5;
            fragment.position.add(fragment.velocity);
            fragment.position.x +=
                Math.sin(timeRef.current * 0.05 + fragment.phase) * 0.01;
            fragment.position.y +=
                Math.cos(timeRef.current * 0.03 + fragment.phase * 2) * 0.008;

            // Reset fragments that drift too far with more dramatic respawn
            if (fragment.position.length() > 150) {
                fragment.position.set(
                    (Math.random() - 0.5) * 50,
                    (Math.random() - 0.5) * 50,
                    (Math.random() - 0.5) * 50
                );
                fragment.energy = Math.random();
            }

            // Dynamic scaling with energy pulsing
            const energyPulse =
                1 + Math.sin(timeRef.current * 0.5 + fragment.phase) * 0.3;
            const distanceScale = 1 + (fragment.position.length() / 100) * 0.2;
            const pulsingScale =
                fragment.scale *
                energyPulse *
                distanceScale *
                (0.5 + fragment.energy * 0.5);

            dummy.current.position.copy(fragment.position);
            dummy.current.scale.setScalar(pulsingScale);
            dummy.current.rotation.x +=
                fragment.rotationSpeed * (1 + fragment.energy);
            dummy.current.rotation.y +=
                fragment.rotationSpeed * 0.7 * (1 + fragment.energy);
            dummy.current.rotation.z += fragment.rotationSpeed * 0.3;
            dummy.current.updateMatrix();

            meshRef.current.setMatrixAt(i, dummy.current.matrix);

            // Enhanced color variation with energy and distance
            const distance = fragment.position.length() / 100;
            const energy = fragment.energy;
            const timeColor =
                Math.sin(timeRef.current * 0.2 + fragment.phase) * 0.5 + 0.5;

            let color;
            if (theme === "day") {
                // Day: ethereal blues and whites with golden accents
                const hue = (200 + timeColor * 40 + energy * 30) / 360;
                const saturation = 0.3 + energy * 0.4 + distance * 0.2;
                const lightness =
                    0.7 +
                    energy * 0.2 +
                    Math.sin(timeRef.current + fragment.phase) * 0.1;
                color = new Color().setHSL(hue, saturation, lightness);
            } else {
                // Night: cosmic purples and blues with stellar whites
                const hue = (250 + timeColor * 60 + energy * 40) / 360;
                const saturation = 0.4 + energy * 0.5 + distance * 0.3;
                const lightness =
                    0.2 +
                    energy * 0.6 +
                    Math.sin(timeRef.current * 0.3 + fragment.phase) * 0.2;
                color = new Color().setHSL(hue, saturation, lightness);
            }

            meshRef.current.setColorAt(i, color);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <>
            {/* Deep void gradient sphere with mystical atmosphere */}
            <mesh scale={[15000, 15000, 15000]} renderOrder={-1000}>
                <sphereGeometry args={[1, 128, 64]} />
                <meshBasicMaterial
                    color={theme === "day" ? "#f8fafc" : "#020617"}
                    side={2}
                    depthWrite={false}
                    depthTest={false}
                    fog={false}
                />
            </mesh>

            {/* Multiple atmospheric depth layers for immersion */}
            <mesh scale={[12000, 12000, 12000]} renderOrder={-999}>
                <sphereGeometry args={[1, 64, 32]} />
                <meshBasicMaterial
                    color={theme === "day" ? "#e1e7ef" : "#0f172a"}
                    transparent
                    opacity={0.4}
                    side={2}
                    depthWrite={false}
                    depthTest={false}
                    fog={false}
                />
            </mesh>

            <mesh scale={[9000, 9000, 9000]} renderOrder={-998}>
                <sphereGeometry args={[1, 32, 16]} />
                <meshBasicMaterial
                    color={theme === "day" ? "#cbd5e1" : "#1e293b"}
                    transparent
                    opacity={0.2}
                    side={2}
                    depthWrite={false}
                    depthTest={false}
                    fog={false}
                />
            </mesh>

            {/* Enhanced floating geometric fragments */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, 150]}>
                <octahedronGeometry args={[0.4, 1]} />
                <meshBasicMaterial
                    transparent
                    opacity={theme === "day" ? 0.2 : 0.4}
                />
            </instancedMesh>

            {/* Additional layer of smaller particles */}
            <instancedMesh args={[undefined, undefined, 80]}>
                <sphereGeometry args={[0.1, 8, 6]} />
                <meshBasicMaterial
                    transparent
                    opacity={theme === "day" ? 0.1 : 0.2}
                    color={theme === "day" ? "#64748b" : "#8b5cf6"}
                />
            </instancedMesh>
        </>
    );
};

export default VoidBackground;
