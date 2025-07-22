import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import type { Mesh } from "three";
import type { SceneObject } from "@/types/sceneObjects";

interface ObjectAnimationControllerProps {
    meshRef: React.MutableRefObject<Mesh>;
    object: SceneObject;
    isSelected: boolean;
    isLocked: boolean;
    isDragging: boolean;
    currentPosition: [number, number, number];
}

const ObjectAnimationController = ({
    meshRef,
    object,
    isSelected,
    isLocked,
    isDragging,
    currentPosition,
}: ObjectAnimationControllerProps) => {
    // Update position when object changes from outside
    useEffect(() => {
        if (!isDragging && meshRef.current) {
            meshRef.current.position.set(...object.position);
            meshRef.current.rotation.set(...object.rotation);
            meshRef.current.scale.set(...object.scale);
        }
    }, [
        object.position,
        object.rotation,
        object.scale,
        isDragging,
        meshRef.current,
    ]);

    useFrame(state => {
        if (!meshRef.current) return;

        if (!isLocked && !isSelected && !isDragging) {
            // Subtle rotation when not locked, selected, or being dragged
            meshRef.current.rotation.x += 0.001;
            meshRef.current.rotation.y += 0.002;
        }

        // Holographic floating effect for selected objects
        if (isSelected && !isDragging) {
            const time = state.clock.getElapsedTime();
            const baseY = currentPosition[1];
            meshRef.current.position.y = baseY + Math.sin(time * 2) * 0.1;
        }
    });

    return null;
};

export default ObjectAnimationController;
