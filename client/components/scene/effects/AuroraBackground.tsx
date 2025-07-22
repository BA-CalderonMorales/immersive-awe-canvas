import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { BackgroundConfig } from "@/types/scene";

interface AuroraBackgroundProps {
    config: BackgroundConfig;
}

const AuroraBackground = ({ config }: AuroraBackgroundProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vElevation = sin(uv.y * 3.14159) * 0.5 + 0.5;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float time;
    uniform float auroraSpeed;
    uniform float auroraIntensity;
    uniform vec3 auroraColor1;
    uniform vec3 auroraColor2;
    uniform vec3 auroraColor3;
    varying vec2 vUv;
    
    // Production-grade 3D noise functions for cinematic aurora
    vec3 hash3(vec3 p) {
      p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
               dot(p, vec3(269.5, 183.3, 246.1)),
               dot(p, vec3(113.5, 271.9, 124.6)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    
    float simplex3d(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      
      vec3 d1 = d0 - (i1 - 1.0 * K2);
      vec3 d2 = d0 - (i2 - 2.0 * K2);
      vec3 d3 = d0 - (1.0 - 3.0 * K2);
      
      vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
      vec4 n = h * h * h * h * vec4(dot(d0, hash3(i)), dot(d1, hash3(i + i1)),
                                    dot(d2, hash3(i + i2)), dot(d3, hash3(i + 1.0)));
      return dot(vec4(31.316), n);
    }
    
    float fbm(vec3 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 8; i++) {
        if(i >= octaves) break;
        value += amplitude * simplex3d(p * frequency);
        frequency *= 2.17;
        amplitude *= 0.47;
      }
      return value;
    }
    
    // Advanced atmospheric physics simulation
    float magneticField(vec3 pos, float time) {
      return sin(pos.x * 0.1 + time * 0.3) * cos(pos.z * 0.08 + time * 0.4) * 0.5 + 0.5;
    }
    
    vec3 solarWind(vec3 pos, float time) {
      float wind1 = fbm(pos * 0.05 + vec3(time * 0.2, 0.0, time * 0.15), 4);
      float wind2 = fbm(pos * 0.08 + vec3(time * 0.1, time * 0.25, 0.0), 3);
      return vec3(wind1, wind2, (wind1 + wind2) * 0.5);
    }
    
    void main() {
      vec2 uv = vUv;
      vec3 pos = vWorldPosition * 0.01;
      
      // Advanced atmospheric depth and perspective
      vec2 center = vec2(0.5);
      float distance = length(uv - center);
      float elevation = vElevation;
      float atmosphericDepth = pow(1.0 - distance * 0.8, 2.2) * elevation;
      
      // Simulate magnetic field interactions
      float magnetic = magneticField(pos, time);
      vec3 wind = solarWind(pos, time);
      
      // Multi-scale turbulence for realistic aurora curtains
      vec3 noisePos1 = pos + vec3(time * auroraSpeed * 0.05, time * auroraSpeed * 0.08, 0.0);
      vec3 noisePos2 = pos * 2.5 + vec3(time * auroraSpeed * 0.03, time * auroraSpeed * 0.12, time * auroraSpeed * 0.02);
      vec3 noisePos3 = pos * 6.0 + vec3(time * auroraSpeed * 0.08, time * auroraSpeed * 0.06, time * auroraSpeed * 0.04);
      vec3 noisePos4 = pos * 12.0 + vec3(time * auroraSpeed * 0.15, time * auroraSpeed * 0.1, time * auroraSpeed * 0.12);
      
      float largeTurbulence = fbm(noisePos1, 6) * 0.4;
      float mediumTurbulence = fbm(noisePos2, 5) * 0.3;
      float smallTurbulence = fbm(noisePos3, 4) * 0.2;
      float fineTurbulence = fbm(noisePos4, 3) * 0.1;
      
      float totalTurbulence = largeTurbulence + mediumTurbulence + smallTurbulence + fineTurbulence;
      
      // Advanced curtain generation with magnetic field influence
      float curtainBase = uv.y + totalTurbulence * 0.8 + magnetic * 0.3 + wind.y * 0.2;
      
      // Create multiple aurora curtains with varying intensities and heights
      float curtain1 = smoothstep(0.1, 0.4, curtainBase) * smoothstep(0.7, 0.4, curtainBase);
      float curtain2 = smoothstep(0.2, 0.5, curtainBase + largeTurbulence * 0.3) * smoothstep(0.8, 0.5, curtainBase + largeTurbulence * 0.3);
      float curtain3 = smoothstep(0.3, 0.6, curtainBase + mediumTurbulence * 0.5) * smoothstep(0.85, 0.6, curtainBase + mediumTurbulence * 0.5);
      float curtain4 = smoothstep(0.4, 0.7, curtainBase + smallTurbulence * 0.7) * smoothstep(0.9, 0.7, curtainBase + smallTurbulence * 0.7);
      float curtain5 = smoothstep(0.5, 0.75, curtainBase + fineTurbulence * 0.9) * smoothstep(0.95, 0.75, curtainBase + fineTurbulence * 0.9);
      
      // Add vertical columns and pillars
      float pillarNoise = fbm(vec3(uv.x * 8.0, pos.y * 0.1, time * auroraSpeed * 0.1), 4);
      float pillars = sin(uv.x * 25.0 + pillarNoise * 2.0 + time * auroraSpeed * 0.8) * 0.15 + 0.85;
      
      // Apply pillars to all curtains
      curtain1 *= pillars;
      curtain2 *= pillars * 0.9;
      curtain3 *= pillars * 0.8;
      curtain4 *= pillars * 0.7;
      curtain5 *= pillars * 0.6;
      
      // Advanced color temperature and spectral distribution
      float spectralShift = sin(time * 0.1 + distance * 3.0) * 0.3 + 0.7;
      float oxygenEmission = curtain1 * 1.2 + curtain2 * 0.8; // Green-red spectrum
      float nitrogenEmission = curtain3 * 1.0 + curtain4 * 0.9 + curtain5 * 0.7; // Blue-purple spectrum
      
      // Realistic aurora color mixing based on atmospheric physics
      vec3 oxygenColor = mix(auroraColor1, auroraColor2, spectralShift); // Typically green to red
      vec3 nitrogenColor = mix(auroraColor3, auroraColor2, 1.0 - spectralShift); // Typically blue to purple
      vec3 mixedColor = mix(auroraColor1, auroraColor3, 0.5); // Transition colors
      
      // Advanced atmospheric scattering
      float scattering = pow(atmosphericDepth, 1.5);
      float rayleighScatter = scattering * 0.1;
      float mieScatter = pow(scattering, 2.0) * 0.05;
      
      // Combine emissions with atmospheric effects
      vec3 finalColor = vec3(0.0);
      
      // Oxygen emissions (lower altitude)
      finalColor += oxygenColor * oxygenEmission * (1.0 + rayleighScatter);
      
      // Nitrogen emissions (higher altitude)
      finalColor += nitrogenColor * nitrogenEmission * (1.0 + mieScatter);
      
      // Add mixed transition zones
      float transitionZone = curtain2 * curtain3 * 0.5;
      finalColor += mixedColor * transitionZone;
      
      // Enhanced atmospheric glow and corona effects
      float coronaGlow = pow(atmosphericDepth, 3.0) * 0.2;
      vec3 coronaColor = mix(oxygenColor, nitrogenColor, 0.3) * 0.5;
      finalColor += coronaColor * coronaGlow;
      
      // Add solar wind interaction effects
      float windInteraction = dot(normalize(wind), vec3(0.0, 1.0, 0.0)) * 0.1 + 0.9;
      finalColor *= windInteraction;
      
      // Magnetic field brightness modulation
      float magneticModulation = magnetic * 0.3 + 0.85;
      finalColor *= magneticModulation;
      
      // Apply overall intensity with realistic fluctuations
      float fluctuation = sin(time * 0.15) * cos(time * 0.23) * 0.15 + 0.85;
      finalColor *= auroraIntensity * fluctuation;
      
      // Calculate final alpha with atmospheric depth and curtain visibility
      float totalCurtainIntensity = max(curtain1, max(curtain2, max(curtain3, max(curtain4, curtain5))));
      float alpha = totalCurtainIntensity * atmosphericDepth * (0.6 + sin(time * 0.2 + distance * 4.0) * 0.4);
      
      // Add subtle edge glow
      float edgeGlow = pow(1.0 - abs(uv.y - 0.5) * 2.0, 4.0) * 0.1;
      alpha += edgeGlow * atmosphericDepth;
      
      gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.95));
    }
  `;

    const defaultColors = (config as any).auroraColors ||
        config.auroraColors || ["#00ff88", "#0088ff", "#ff0088"];
    const uniforms = {
        time: { value: 0 },
        auroraSpeed: {
            value: (config as any).auroraSpeed || config.auroraSpeed || 0.4,
        },
        auroraIntensity: {
            value:
                (config as any).auroraIntensity ||
                config.auroraIntensity ||
                1.8,
        },
        auroraColor1: { value: new THREE.Color(defaultColors[0]) }, // Oxygen green
        auroraColor2: { value: new THREE.Color(defaultColors[1]) }, // Mixed blue
        auroraColor3: { value: new THREE.Color(defaultColors[2]) }, // Nitrogen purple
    };

    useFrame(state => {
        if (uniforms.time) {
            uniforms.time.value = state.clock.getElapsedTime();
        }
    });

    return (
        <>
            <color attach="background" args={["#000011"]} />
            <mesh
                ref={meshRef}
                scale={[10000, 10000, 10000]}
                renderOrder={-1000}
            >
                <sphereGeometry args={[1, 64, 32]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    side={THREE.BackSide}
                    depthWrite={false}
                    depthTest={false}
                    fog={false}
                    transparent
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </>
    );
};

export default AuroraBackground;
