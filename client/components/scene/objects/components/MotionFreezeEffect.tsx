import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D } from "three";

interface MotionFreezeEffectProps {
    isMotionFrozen?: boolean;
    targetRef: React.RefObject<Object3D>;
    children: React.ReactNode;
}

const MotionFreezeEffect = ({
    isMotionFrozen = false,
    targetRef,
    children,
}: MotionFreezeEffectProps) => {
    const frozenStateRef = useRef({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
    });

    // Capture state when freezing
    useEffect(() => {
        if (isMotionFrozen && targetRef.current) {
            const obj = targetRef.current;
            frozenStateRef.current = {
                position: {
                    x: obj.position.x,
                    y: obj.position.y,
                    z: obj.position.z,
                },
                rotation: {
                    x: obj.rotation.x,
                    y: obj.rotation.y,
                    z: obj.rotation.z,
                },
                scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z },
            };
        }
    }, [isMotionFrozen, targetRef]);

    // Apply frozen state continuously while frozen
    useFrame(() => {
        if (isMotionFrozen && targetRef.current) {
            const obj = targetRef.current;
            const frozen = frozenStateRef.current;

            // Only freeze if not being manually dragged
            if (!obj.userData?.isBeingDragged) {
                obj.position.set(
                    frozen.position.x,
                    frozen.position.y,
                    frozen.position.z
                );
                obj.rotation.set(
                    frozen.rotation.x,
                    frozen.rotation.y,
                    frozen.rotation.z
                );
                obj.scale.set(frozen.scale.x, frozen.scale.y, frozen.scale.z);
            }
        }
    });

    return <>{children}</>;
};

export default MotionFreezeEffect;
