import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight, SpotLight } from "three";
import type { LightConfig } from "@/types/scene";
import AnimatedPointLight from "./lights/AnimatedPointLight";

const DynamicLights = ({ lights }: { lights: LightConfig[] }) => {
    const rimLightRef = useRef<PointLight>(null);
    const spotRef = useRef<SpotLight>(null);

    // Subtle light animation for atmosphere
    useFrame(state => {
        const time = state.clock.elapsedTime;
        if (rimLightRef.current) {
            rimLightRef.current.intensity = 0.5 + Math.sin(time * 0.5) * 0.2;
        }
        if (spotRef.current) {
            spotRef.current.intensity = 0.3 + Math.sin(time * 0.3) * 0.1;
        }
    });

    return (
        <>
            {lights.map((light, index) => {
                const { type, ref, ...props } = light;
                const key = `light-${index}`;

                if (type === "point" && ref) {
                    return (
                        <AnimatedPointLight
                            key={key}
                            animationType={ref}
                            {...props}
                        />
                    );
                }

                switch (type) {
                    case "ambient":
                        return <ambientLight key={key} {...props} />;
                    case "directional":
                        return <directionalLight key={key} {...props} castShadow />;
                    case "point":
                        return <pointLight key={key} {...props} />;
                    case "hemisphere":
                        return <hemisphereLight key={key} {...props} />;
                    default:
                        return null;
                }
            })}
            
            {/* Enhanced atmospheric lighting */}
            <pointLight
                ref={rimLightRef}
                position={[-5, 3, -5]}
                intensity={0.5}
                distance={20}
                decay={2}
                color="#4a90e2"
            />
            <pointLight
                position={[5, 3, 5]}
                intensity={0.3}
                distance={15}
                decay={2}
                color="#e24a90"
            />
            
            {/* Subtle fill light from below */}
            <pointLight
                position={[0, -5, 0]}
                intensity={0.2}
                distance={15}
                color="#ffffff"
            />
            
            {/* Dramatic spot for depth */}
            <spotLight
                ref={spotRef}
                position={[0, 10, 0]}
                angle={0.5}
                penumbra={0.8}
                intensity={0.3}
                distance={30}
                color="#ffffff"
                castShadow
            />
        </>
    );
};

export default DynamicLights;
