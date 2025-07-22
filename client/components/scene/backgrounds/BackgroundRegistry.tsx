// Ruby-like elegant background registry system
// Replaces the massive switch statement with extensible, self-registering patterns

import { Cloud, Environment, Sky, Sparkles, Stars } from "@react-three/drei";
import { useExperience } from "@/hooks/useExperience";
import type { BackgroundConfig, ExtraConfig } from "@/types/scene";
import CinematicBackground from "../effects/CinematicBackground";
import EnhancedAuroraBackground from "../effects/EnhancedAuroraBackground";
import GradientBackground from "../effects/GradientBackground";
import NebulaBackground from "../effects/NebulaBackground";
import NoiseBackground from "../effects/NoiseBackground";
import PlasmaBackground from "../effects/PlasmaBackground";
import SunsetBackground from "../effects/SunsetBackground";
import VoidBackground from "../effects/VoidBackground";

interface BackgroundRendererProps {
    background: BackgroundConfig;
    extras?: ExtraConfig[];
    theme?: "day" | "night";
}

interface BackgroundRenderer {
    render: (props: BackgroundRendererProps) => JSX.Element | null;
    supportsExtras?: boolean;
    description?: string;
}

// Elegant background registry with fluent API
class BackgroundRegistryClass {
    private renderers = new Map<string, BackgroundRenderer>();

    register(type: string, renderer: BackgroundRenderer): this {
        this.renderers.set(type, renderer);
        return this;
    }

    get(type: string): BackgroundRenderer | null {
        return this.renderers.get(type) || null;
    }

    render(type: string, props: BackgroundRendererProps): JSX.Element | null {
        const renderer = this.get(type);
        return renderer ? renderer.render(props) : null;
    }

    getAvailableTypes(): string[] {
        return Array.from(this.renderers.keys());
    }

    // Ruby-like method for getting description
    describe(type: string): string {
        const renderer = this.get(type);
        return renderer?.description || `${type} background`;
    }
}

// Shared cloud rendering utility
const renderClouds = (extras?: ExtraConfig[]) => {
    if (!extras?.length) {
        return (
            <>
                <Cloud
                    position={[-15, -8, -20]}
                    speed={0.1}
                    opacity={0.2}
                    segments={30}
                    frustumCulled={false}
                />
                <Cloud
                    position={[12, 6, -25]}
                    speed={0.08}
                    opacity={0.18}
                    segments={25}
                    frustumCulled={false}
                />
                <Cloud
                    position={[0, 0, -35]}
                    speed={0.12}
                    opacity={0.15}
                    segments={35}
                    frustumCulled={false}
                />
            </>
        );
    }

    return extras.map((extra, i) => {
        if (extra.type !== "cloud") return null;
        return <Cloud key={`cloud-${i}`} {...extra} frustumCulled={false} />;
    });
};

// Atmospheric layer component for reuse
const AtmosphericLayer = ({
    color,
    opacity,
    scale,
    renderOrder,
}: {
    color: string;
    opacity: number;
    scale: number;
    renderOrder: number;
}) => (
    <mesh scale={[scale, scale, scale]} renderOrder={renderOrder}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            side={2}
            depthWrite={false}
            fog={false}
        />
    </mesh>
);

// Create and populate the registry
export const BackgroundRegistry = new BackgroundRegistryClass()
    .register("sky", {
        render: ({ background }) => (
            <>
                <Sky
                    sunPosition={background.sunPosition || [120, 25, 80]}
                    turbidity={(background as any).atmosphericDensity || 1.2}
                    rayleigh={(background as any).lightScattering || 1.5}
                />
                <AtmosphericLayer
                    color="#f0f4f8"
                    opacity={0.1}
                    scale={8000}
                    renderOrder={-995}
                />
            </>
        ),
        supportsExtras: false,
        description: "Realistic sky with sun and atmospheric scattering",
    })

    .register("stars", {
        render: ({ background }) => (
            <>
                <color attach="background" args={["#000008"]} />
                <Stars
                    radius={background.radius || 300}
                    depth={background.depth || 80}
                    count={background.count || 8000}
                    factor={background.factor || 6}
                    saturation={background.saturation || 0.1}
                    fade={background.fade !== false}
                    speed={background.speed || 0.3}
                />
                <AtmosphericLayer
                    color="#0a0f1a"
                    opacity={(background as any).atmosphericGlow || 0.2}
                    scale={5000}
                    renderOrder={-998}
                />
            </>
        ),
        description: "Animated starfield with atmospheric glow",
    })

    .register("sparkles", {
        render: ({ background, theme }) => (
            <>
                <VoidBackground theme={theme || "night"} />
                <Sparkles
                    count={background.count || 300}
                    scale={background.scale || 25}
                    size={background.size || 3}
                    speed={background.speed || 0.2}
                    opacity={background.opacity || 0.8}
                    color={background.color || "#e6f3ff"}
                />
                <AtmosphericLayer
                    color="#1a237e"
                    opacity={0.15}
                    scale={6000}
                    renderOrder={-997}
                />
            </>
        ),
        description: "Magical sparkles with energy field effects",
    })

    .register("color", {
        render: ({ background }) => (
            <>
                <color
                    attach="background"
                    args={[background.color || "#000000"]}
                />
                {background.colorTop && background.colorBottom && (
                    <GradientBackground config={background} />
                )}
            </>
        ),
        description: "Solid color or gradient background",
    })

    .register("gradient", {
        render: ({ background }) => (
            <>
                <color
                    attach="background"
                    args={[background.colorBottom || "#000000"]}
                />
                <GradientBackground config={background} />
            </>
        ),
        description: "Smooth color gradient transition",
    })

    .register("noise", {
        render: ({ background }) => (
            <>
                <color
                    attach="background"
                    args={[background.color || "#1a1a2e"]}
                />
                <NoiseBackground config={background} />
            </>
        ),
        description: "Procedural noise patterns",
    })

    .register("plasma", {
        render: ({ background }) => (
            <>
                <color attach="background" args={["#000011"]} />
                <PlasmaBackground config={background} />
            </>
        ),
        description: "Dynamic plasma energy effects",
    })

    .register("aurora", {
        render: ({ background }) => (
            <>
                <color attach="background" args={["#000011"]} />
                <EnhancedAuroraBackground config={background} />
            </>
        ),
        description: "Realistic aurora with atmospheric physics",
    })

    .register("sunset", {
        render: ({ background }) => (
            <>
                <color attach="background" args={["#1a1a2e"]} />
                <SunsetBackground config={background} />
            </>
        ),
        description: "Beautiful sunset atmosphere",
    })

    .register("nebula", {
        render: ({ background }) => (
            <>
                <color attach="background" args={["#000005"]} />
                <NebulaBackground config={background} />
            </>
        ),
        description: "Cosmic nebula with star formation",
    })

    .register("void", {
        render: ({ theme }) => <VoidBackground theme={theme || "night"} />,
        description: "Deep space void",
    })

    .register("cinematic", {
        render: ({ background }) => (
            <>
                <color attach="background" args={["#000008"]} />
                <CinematicBackground config={background} />
            </>
        ),
        description: "Epic cinematic atmosphere with particles and energy",
    })

    .register("fog", {
        render: ({ background, extras }) => (
            <>
                <fog
                    attach="fog"
                    args={[
                        background.color || "#f8fafc",
                        background.near || 5,
                        background.far || 200,
                    ]}
                />
                <color
                    attach="background"
                    args={[background.color || "#f8fafc"]}
                />
                <AtmosphericLayer
                    color={background.color || "#f8fafc"}
                    opacity={(background as any).ambientGlow || 0.3}
                    scale={12000}
                    renderOrder={-996}
                />
                {renderClouds(extras)}
            </>
        ),
        supportsExtras: true,
        description: "Atmospheric fog with cloud effects",
    })

    .register("environment", {
        render: ({ background, extras }) => (
            <>
                <Environment
                    preset={background.preset || "city"}
                    background
                    blur={background.blur || 0.1}
                />
                <AtmosphericLayer
                    color="#2a2a3a"
                    opacity={0.08}
                    scale={10000}
                    renderOrder={-994}
                />
                {renderClouds(extras)}
            </>
        ),
        supportsExtras: true,
        description: "HDR environment with realistic lighting",
    });

// Ruby-like convenience component
export const BackgroundRenderer = ({
    background,
    extras,
}: BackgroundRendererProps) => {
    const { theme } = useExperience();

    if (!background?.type) return null;

    return BackgroundRegistry.render(background.type, {
        background,
        extras,
        theme,
    });
};

export default BackgroundRegistry;
