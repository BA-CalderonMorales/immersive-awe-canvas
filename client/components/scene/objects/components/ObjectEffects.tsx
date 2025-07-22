import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

interface ObjectEffectsProps {
    isSelected: boolean;
    isHovered: boolean;
    objectType: string;
    meshRef: React.RefObject<Mesh>;
    showLongPressEffect: boolean;
}

const ObjectEffects = ({
    isSelected,
    isHovered,
    objectType,
    meshRef,
    showLongPressEffect,
}: ObjectEffectsProps) => {
    const outlineRef = useRef<Mesh>(null!);
    const hologramRef = useRef<Mesh>(null!);

    useFrame(state => {
        const time = state.clock.getElapsedTime();

        // iPhone-style selection outline effect
        if (outlineRef.current) {
            outlineRef.current.visible = isSelected || isHovered;
            if (isSelected || isHovered) {
                // Pulsing scale effect for selection
                const pulse = Math.sin(time * 4) * 0.02;
                outlineRef.current.scale.setScalar(1.1 + pulse);

                // Copy position and rotation from main mesh
                if (meshRef.current) {
                    outlineRef.current.position.copy(meshRef.current.position);
                    outlineRef.current.rotation.copy(meshRef.current.rotation);
                }
            }
        }

        // Enhanced holographic long-press effect
        if (hologramRef.current) {
            hologramRef.current.visible = showLongPressEffect;
            if (showLongPressEffect) {
                // Pulsing holographic effect with smooth transitions
                const pulse = Math.sin(time * 8) * 0.5 + 0.5;
                const scale = 1.2 + pulse * 0.3;
                hologramRef.current.scale.setScalar(scale);

                // Add rotation to the hologram for dynamic effect
                hologramRef.current.rotation.y = time * 2;
                hologramRef.current.rotation.x = Math.sin(time * 3) * 0.2;

                // Copy position from main mesh
                if (meshRef.current) {
                    hologramRef.current.position.copy(meshRef.current.position);
                    // Slight vertical float for hologram
                    hologramRef.current.position.y += Math.sin(time * 6) * 0.1;
                }
            }
        }
    });

    const renderGeometry = () => {
        switch (objectType) {
            case "box":
                return <boxGeometry args={[1, 1, 1]} />;
            case "sphere":
                return <sphereGeometry args={[0.5, 32, 32]} />;
            case "cylinder":
                return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
            case "cone":
                return <coneGeometry args={[0.5, 1, 32]} />;
            case "torus":
                return <torusGeometry args={[0.4, 0.1, 16, 100]} />;
            case "dodecahedron":
                return <dodecahedronGeometry args={[0.5, 0]} />;
            case "icosahedron":
                return <icosahedronGeometry args={[0.5, 0]} />;
            case "octahedron":
                return <octahedronGeometry args={[0.5, 0]} />;
            case "tetrahedron":
                return <tetrahedronGeometry args={[0.5, 0]} />;
            case "plane":
                return <planeGeometry args={[1, 1]} />;
            case "ring":
                return <ringGeometry args={[0.2, 0.5, 32]} />;
            case "torusKnot":
                return <torusKnotGeometry args={[0.4, 0.15, 128, 16]} />;
            default:
                return <boxGeometry args={[1, 1, 1]} />;
        }
    };

    return (
        <>
            {/* iPhone-style Selection/Hover Outline */}
            <mesh ref={outlineRef} visible={false}>
                {renderGeometry()}
                <meshBasicMaterial
                    color={isSelected ? "#00ff00" : "#ffff00"} // Green for selected, yellow for hovered
                    wireframe={true}
                    transparent={true}
                    opacity={isSelected ? 0.8 : 0.6}
                />
            </mesh>

            {/* Enhanced Holographic Long-Press Effect */}
            <mesh ref={hologramRef} visible={false}>
                {renderGeometry()}
                <meshBasicMaterial
                    color="#00aaff"
                    transparent={true}
                    opacity={0.4}
                    wireframe={true}
                />
            </mesh>

            {/* Additional glow effect for selected objects */}
            {isSelected && (
                <mesh ref={hologramRef} visible={true}>
                    {renderGeometry()}
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent={true}
                        opacity={0.1}
                        wireframe={false}
                    />
                </mesh>
            )}
        </>
    );
};

export default ObjectEffects;
