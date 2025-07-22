import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface KeyState {
    [key: string]: boolean;
}

interface CameraSettings {
    speed: number;
    acceleration: number;
    damping: number;
    boostMultiplier: number;
}

const useEnhancedKeyPress = () => {
    const keys = useRef<KeyState>({});
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const activeEl = document.activeElement;

            // Enhanced typing detection
            const typingElements = ["INPUT", "TEXTAREA", "BUTTON"];
            const isContentEditable =
                activeEl?.getAttribute("contenteditable") === "true";
            const isTypingNow =
                activeEl &&
                (typingElements.includes(activeEl.tagName) ||
                    isContentEditable);

            setIsTyping(!!isTypingNow);

            if (isTypingNow) return;

            keys.current[e.code] = true;

            // Prevent browser shortcuts for camera movement keys
            if (
                [
                    "KeyW",
                    "KeyA",
                    "KeyS",
                    "KeyD",
                    "ArrowUp",
                    "ArrowDown",
                    "ArrowLeft",
                    "ArrowRight",
                    "Space",
                    "KeyC",
                ].includes(e.code)
            ) {
                e.preventDefault();
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            keys.current[e.code] = false;
        };

        const onFocus = () => setIsTyping(false);
        const onBlur = () => {
            // Clear all keys when window loses focus
            keys.current = {};
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
    }, []);

    return { keys, isTyping };
};

const EnhancedKeyboardControls = () => {
    const { keys, isTyping } = useEnhancedKeyPress();
    const velocityRef = useRef(new THREE.Vector3());
    const [settings] = useState<CameraSettings>({
        speed: 8,
        acceleration: 15,
        damping: 0.85,
        boostMultiplier: 3,
    });

    useFrame(({ camera }, delta) => {
        if (isTyping) return;

        const velocity = velocityRef.current;
        const deltaTime = Math.min(delta, 1 / 30); // Cap delta for stability

        // Input vector
        const inputVector = new THREE.Vector3();

        // WASD + Arrow keys for movement
        if (keys.current.ArrowUp || keys.current.KeyW) inputVector.z -= 1;
        if (keys.current.ArrowDown || keys.current.KeyS) inputVector.z += 1;
        if (keys.current.ArrowLeft || keys.current.KeyA) inputVector.x -= 1;
        if (keys.current.ArrowRight || keys.current.KeyD) inputVector.x += 1;

        // Vertical movement
        if (keys.current.Space) inputVector.y += 1;
        if (keys.current.KeyC || keys.current.ControlLeft) inputVector.y -= 1;

        // Normalize input to prevent faster diagonal movement
        if (inputVector.length() > 0) {
            inputVector.normalize();
        }

        // Speed boost with Shift
        const speedMultiplier =
            keys.current.ShiftLeft || keys.current.ShiftRight
                ? settings.boostMultiplier
                : 1;

        // Apply acceleration
        const targetVelocity = inputVector.multiplyScalar(
            settings.speed * speedMultiplier
        );
        velocity.lerp(targetVelocity, settings.acceleration * deltaTime);

        // Apply damping when no input
        if (inputVector.length() === 0) {
            velocity.multiplyScalar(settings.damping ** (deltaTime * 60));
        }

        // Transform movement to camera's local space for intuitive controls
        const moveVector = new THREE.Vector3();
        moveVector.copy(velocity);
        moveVector.multiplyScalar(deltaTime);

        // Apply movement in camera's local coordinate system
        camera.translateX(moveVector.x);
        camera.translateY(moveVector.y);
        camera.translateZ(moveVector.z);

        // Optional: Add slight camera shake for organic feel during movement
        if (velocity.length() > 0.1) {
            const shakeIntensity = Math.min(velocity.length() * 0.001, 0.003);
            camera.position.x += (Math.random() - 0.5) * shakeIntensity;
            camera.position.y += (Math.random() - 0.5) * shakeIntensity;
            camera.position.z += (Math.random() - 0.5) * shakeIntensity;
        }
    });

    return null;
};

export default EnhancedKeyboardControls;
