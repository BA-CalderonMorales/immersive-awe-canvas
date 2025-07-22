// Beautiful randomness engine that creates breathtaking, awe-inspiring effects
// This adds the magic that makes the experience truly immersive

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RandomnessConfig {
    globalIntensity: number;
    colorShifts: boolean;
    atmosphericVariations: boolean;
    geometryMorphing: boolean;
    lightingFluctuations: boolean;
    temporalHarmonics: boolean;
}

interface RandomnessEngineProps {
    config?: Partial<RandomnessConfig>;
    children?: React.ReactNode;
}

class AweRandomnessEngine {
    public time = 0;
    private goldenRatio = 1.618033988749;
    private fibonacciSequence = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
    private harmonicSeries = [
        1,
        1 / 2,
        1 / 3,
        1 / 4,
        1 / 5,
        1 / 6,
        1 / 7,
        1 / 8,
    ];

    // Natural beauty ratios found in nature
    private beautyRatios = {
        golden: this.goldenRatio,
        silver: 2.414213562373095, // √2 + 1
        bronze: 3.302775637731995, // (3 + √13) / 2
        spiral: 1.366025403784439, // Silver ratio - 1
        nautilus: 1.618033988749, // Golden ratio (repeated for emphasis)
    };

    // Generate beautiful random numbers using natural patterns
    public goldenNoise(seed: number): number {
        const x = Math.sin(seed * this.goldenRatio) * 43758.5453;
        return x - Math.floor(x);
    }

    public fibonacciNoise(seed: number, octave: number): number {
        const fibIndex = octave % this.fibonacciSequence.length;
        const fibValue = this.fibonacciSequence[fibIndex];
        return this.goldenNoise(seed * fibValue);
    }

    public harmonicNoise(seed: number): number {
        let value = 0;
        for (let i = 0; i < this.harmonicSeries.length; i++) {
            value += Math.sin(seed * (i + 1)) * this.harmonicSeries[i];
        }
        return (value + 1) / 2; // Normalize to 0-1
    }

    // Beautiful color generation using natural mathematical principles
    public generateAweColor(baseHue: number, variation: number): THREE.Color {
        const hueShift = this.goldenNoise(this.time + baseHue) * variation;
        const saturation = 0.7 + this.harmonicNoise(this.time * 0.5) * 0.3;
        const lightness = 0.6 + this.fibonacciNoise(this.time * 0.3, 3) * 0.4;

        // Convert HSL to RGB using golden ratio harmonics
        const h = (baseHue + hueShift) % 360;
        const s = Math.max(0, Math.min(1, saturation));
        const l = Math.max(0, Math.min(1, lightness));

        return new THREE.Color().setHSL(h / 360, s, l);
    }

    // Atmospheric breathing patterns
    public atmosphericBreathing(): number {
        const primaryBreath = Math.sin(this.time * 0.8);
        const secondaryBreath =
            Math.sin(this.time * this.goldenRatio * 0.3) * 0.5;
        const tertiaryBreath =
            Math.sin(this.time * this.beautyRatios.silver * 0.1) * 0.2;

        return (primaryBreath + secondaryBreath + tertiaryBreath) * 0.1 + 0.9;
    }

    // Geometry morphing using mathematical beauty
    public geometryMorphFactor(position: THREE.Vector3): number {
        const distance = position.length();
        const spiral = Math.atan2(position.y, position.x) + this.time * 0.1;

        const fibMorph = this.fibonacciNoise(distance * 0.1, 5);
        const spiralMorph = Math.sin(spiral * this.goldenRatio);
        const radialMorph = this.harmonicNoise(
            distance * 0.05 + this.time * 0.2
        );

        return (fibMorph + spiralMorph + radialMorph) / 3;
    }

    // Lighting fluctuations that feel natural and organic
    public lightingFluctuation(base: number): number {
        const flicker = this.goldenNoise(this.time * 5) * 0.1;
        const pulse = Math.sin(this.time * this.goldenRatio) * 0.05;
        const breath = this.atmosphericBreathing() * 0.1;

        return base * (1 + flicker + pulse + breath);
    }

    // Temporal harmonics that create musical-like rhythm in the experience
    public temporalHarmonic(frequency: number): number {
        let harmonic = 0;
        for (let i = 1; i <= 8; i++) {
            const amplitude = 1 / i; // Decreasing amplitude
            harmonic += Math.sin(this.time * frequency * i) * amplitude;
        }
        return harmonic / 8; // Normalize
    }

    public update(deltaTime: number): void {
        this.time += deltaTime;
    }
}

const RandomnessEngine = ({ config = {}, children }: RandomnessEngineProps) => {
    const engineRef = useRef(new AweRandomnessEngine());
    const uniformsRef = useRef<{ [key: string]: THREE.IUniform }>({});

    const defaultConfig: RandomnessConfig = {
        globalIntensity: 1.0,
        colorShifts: true,
        atmosphericVariations: true,
        geometryMorphing: true,
        lightingFluctuations: true,
        temporalHarmonics: true,
    };

    const finalConfig = { ...defaultConfig, ...config };

    useEffect(() => {
        // Initialize global uniforms for randomness
        uniformsRef.current = {
            uRandomnessTime: { value: 0 },
            uGlobalRandomness: { value: finalConfig.globalIntensity },
            uAtmosphericBreathing: { value: 1.0 },
            uColorShiftIntensity: {
                value: finalConfig.colorShifts ? 0.1 : 0.0,
            },
            uGeometryMorphIntensity: {
                value: finalConfig.geometryMorphing ? 0.2 : 0.0,
            },
            uLightingFluctuation: {
                value: finalConfig.lightingFluctuations ? 0.1 : 0.0,
            },
            uTemporalHarmonic: { value: 0.0 },
        };
    }, [finalConfig]);

    useFrame((state, deltaTime) => {
        const engine = engineRef.current;
        engine.update(deltaTime);

        // Update global uniforms
        const uniforms = uniformsRef.current;
        if (uniforms.uRandomnessTime)
            uniforms.uRandomnessTime.value = engine.time;
        if (uniforms.uAtmosphericBreathing)
            uniforms.uAtmosphericBreathing.value =
                engine.atmosphericBreathing();
        if (uniforms.uTemporalHarmonic)
            uniforms.uTemporalHarmonic.value = engine.temporalHarmonic(0.5);

        // Apply randomness to scene lighting
        if (finalConfig.lightingFluctuations && state.scene) {
            state.scene.traverse(object => {
                if (object.type.includes("Light")) {
                    const light = object as THREE.Light;
                    const baseIntensity =
                        light.userData.baseIntensity || light.intensity;
                    light.userData.baseIntensity = baseIntensity;
                    light.intensity = engine.lightingFluctuation(baseIntensity);
                }
            });
        }

        // Apply atmospheric color variations to background
        if (
            finalConfig.colorShifts &&
            state.scene.background instanceof THREE.Color
        ) {
            const baseColor =
                state.scene.userData.baseBackgroundColor ||
                state.scene.background;
            state.scene.userData.baseBackgroundColor = baseColor;

            const hue = baseColor.getHSL({ h: 0, s: 0, l: 0 }).h * 360;
            const newColor = engine.generateAweColor(hue, 10);
            state.scene.background = newColor.lerp(baseColor, 0.95); // Subtle shift
        }
    });

    // Provide randomness context to children
    return (
        <primitive
            object={{
                randomnessEngine: engineRef.current,
                uniforms: uniformsRef.current,
            }}
        >
            {children}
        </primitive>
    );
};

// Global randomness uniforms that can be used in shaders
export const RandomnessShaderUniforms = `
  uniform float uRandomnessTime;
  uniform float uGlobalRandomness;
  uniform float uAtmosphericBreathing;
  uniform float uColorShiftIntensity;
  uniform float uGeometryMorphIntensity;
  uniform float uLightingFluctuation;
  uniform float uTemporalHarmonic;
  
  // Beautiful noise functions for shaders
  float goldenNoise(float seed) {
    float x = sin(seed * 1.618033988749) * 43758.5453;
    return x - floor(x);
  }
  
  float fibonacciNoise(float seed, float octave) {
    float fibValues[8] = float[8](1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0);
    int fibIndex = int(mod(octave, 8.0));
    float fibValue = fibValues[fibIndex];
    return goldenNoise(seed * fibValue);
  }
  
  vec3 generateAweColor(float baseHue, float variation) {
    float hueShift = goldenNoise(uRandomnessTime + baseHue) * variation;
    float saturation = 0.7 + sin(uRandomnessTime * 0.5) * 0.3;
    float lightness = 0.6 + fibonacciNoise(uRandomnessTime * 0.3, 3.0) * 0.4;
    
    float h = mod(baseHue + hueShift, 360.0) / 360.0;
    float s = clamp(saturation, 0.0, 1.0);
    float l = clamp(lightness, 0.0, 1.0);
    
    // HSL to RGB conversion
    vec3 rgb = vec3(l);
    if (s > 0.0) {
      vec3 p = abs(fract(h + vec3(1.0, 2.0/3.0, 1.0/3.0)) * 6.0 - 3.0);
      rgb = l + s * (clamp(p - 1.0, 0.0, 1.0) - 0.5) * (1.0 - abs(2.0 * l - 1.0));
    }
    return rgb;
  }
`;

export default RandomnessEngine;
