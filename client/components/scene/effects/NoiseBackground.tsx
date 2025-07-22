import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { BackgroundConfig } from "@/types/scene";

interface NoiseBackgroundProps {
    config: BackgroundConfig;
}

const NoiseBackground = ({ config }: NoiseBackgroundProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float time;
    uniform float noiseScale;
    uniform float noiseIntensity;
    uniform vec3 color;
    varying vec2 vUv;
    
    // Advanced noise functions for cosmic depth
    float hash(float n) {
      return fract(sin(n) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      f = f * f * (3.0 - 2.0 * f);
      float n = i.x + i.y * 57.0;
      return mix(mix(hash(n), hash(n + 1.0), f.x),
                 mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
    }
    
    float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      vec2 freq = vec2(1.0);
      for(int i = 0; i < 4; i++) {
        value += amplitude * noise(st * freq);
        freq *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    // Create immersive cosmic nebula effect with depth
    vec3 cosmic(vec2 uv, float time) {
      vec2 st = uv * noiseScale;
      vec2 center = vec2(0.5);
      
      // Enhanced noise layers for depth and movement
      float noise1 = fbm(st + time * 0.08 + sin(time * 0.05) * 0.2);
      float noise2 = fbm(st * 1.8 + time * 0.12 + cos(time * 0.07) * 0.15);
      float noise3 = fbm(st * 3.2 + time * 0.04);
      float noise4 = fbm(st * 6.4 + time * 0.02);
      
      // Create complex nebula structure with swirling patterns
      float nebula = noise1 * 0.5 + noise2 * 0.25 + noise3 * 0.15 + noise4 * 0.1;
      
      // Add swirling motion
      float swirl = sin(atan(uv.y - center.y, uv.x - center.x) * 3.0 + time * 0.3) * 0.1;
      nebula += swirl;
      
      // Create multiple density layers
      float density1 = smoothstep(0.2, 0.7, nebula);
      float density2 = smoothstep(0.4, 0.9, nebula + noise2 * 0.2);
      float density3 = smoothstep(0.6, 1.0, nebula + noise3 * 0.3);
      
      // Enhanced depth with distance falloff
      float distance = length(uv - center);
      float depth = 1.0 - pow(distance * 1.8, 1.5);
      depth = smoothstep(0.0, 1.0, depth);
      
      // Dynamic color mixing with multiple layers
      vec3 baseColor = color;
      vec3 nebulaColor1 = mix(baseColor * 0.3, baseColor * 1.2, density1);
      vec3 nebulaColor2 = mix(baseColor * 0.6, baseColor * 1.8, density2);
      vec3 nebulaColor3 = mix(baseColor * 0.8, baseColor * 2.2, density3);
      
      // Blend layers with depth weighting
      vec3 finalNebula = nebulaColor1 * 0.5 + nebulaColor2 * 0.3 + nebulaColor3 * 0.2;
      
      // Add atmospheric glow and energy streams
      vec3 atmosphericGlow = baseColor * 0.4 * (1.0 - depth);
      vec3 energyStreams = baseColor * 1.5 * pow(density3, 2.0) * (sin(time * 0.5) * 0.5 + 0.5);
      
      return mix(finalNebula + atmosphericGlow + energyStreams, finalNebula, depth * 0.7);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create immersive cosmic environment
      vec3 finalColor = cosmic(uv, time);
      
      // Add subtle brightness variation
      float brightness = 0.7 + fbm(uv * 8.0 + time * 0.05) * 0.3;
      finalColor *= brightness;
      
      // Ensure minimum visibility
      finalColor = max(finalColor, color * 0.2);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

    const uniforms = {
        time: { value: 0 },
        noiseScale: {
            value: (config as any).noiseScale || config.noiseScale || 8.0,
        },
        noiseIntensity: {
            value:
                (config as any).noiseIntensity || config.noiseIntensity || 1.1,
        },
        color: { value: new THREE.Color(config.color || "#1a237e") },
    };

    useFrame(state => {
        if (uniforms.time) {
            uniforms.time.value =
                state.clock.getElapsedTime() *
                ((config as any).noiseSpeed || config.noiseSpeed || 0.08);
        }
    });

    return (
        <mesh ref={meshRef} scale={[10000, 10000, 10000]} renderOrder={-1000}>
            <sphereGeometry args={[1, 64, 32]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                side={THREE.BackSide}
                depthWrite={false}
                depthTest={false}
                fog={false}
            />
        </mesh>
    );
};

export default NoiseBackground;
