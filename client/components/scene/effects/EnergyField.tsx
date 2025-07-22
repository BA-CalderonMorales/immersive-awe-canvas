import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D, Vector3, Color } from "three";

interface EnergyFieldProps {
    theme: "day" | "night";
}

const EnergyField = ({ theme }: EnergyFieldProps) => {
    const meshRef = useRef<InstancedMesh>(null!);
    const dummy = useRef(new Object3D());
    const timeRef = useRef(0);

    useFrame(state => {
        if (!meshRef.current) return;

        timeRef.current = state.clock.getElapsedTime();

        // Create 8 simple energy orbs around the main object
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 3 + Math.sin(timeRef.current * 0.5 + i) * 0.5;

            dummy.current.position.set(
                Math.cos(angle + timeRef.current * 0.1) * radius,
                Math.sin(timeRef.current * 0.3 + i) * 0.5,
                Math.sin(angle + timeRef.current * 0.1) * radius
            );

            const scale =
                0.1 + Math.sin(timeRef.current * 0.8 + i * 0.5) * 0.05;
            dummy.current.scale.setScalar(scale);
            dummy.current.updateMatrix();

            meshRef.current.setMatrixAt(i, dummy.current.matrix);

            const color = new Color().setHSL(
                (theme === "day" ? 240 : 280) / 360,
                0.6,
                theme === "day" ? 0.7 : 0.5
            );
            meshRef.current.setColorAt(i, color);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, 8]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial
                transparent
                opacity={theme === "day" ? 0.3 : 0.4}
            />
        </instancedMesh>
    );
};

export default EnergyField;
