
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackgroundConfig } from '@/types/scene';
import * as THREE from 'three';

interface AuroraBackgroundProps {
  config: BackgroundConfig;
}

const AuroraBackground = ({ config }: AuroraBackgroundProps) => {
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
    uniform float auroraSpeed;
    uniform float auroraIntensity;
    uniform vec3 auroraColor1;
    uniform vec3 auroraColor2;
    uniform vec3 auroraColor3;
    varying vec2 vUv;
    
    // Advanced noise for realistic aurora
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
      for(int i = 0; i < 3; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create immersive aurora with enhanced depth and movement
      vec2 center = vec2(0.5);
      float distance = length(uv - center);
      float depth = 1.0 - pow(distance * 1.3, 1.1);
      depth = smoothstep(0.0, 1.0, depth);
      
      // Enhanced wave layers with varying frequencies and amplitudes
      float wave1 = sin(uv.x * 8.0 + time * auroraSpeed * 0.8) * 0.18;
      float wave2 = sin(uv.x * 12.0 + time * auroraSpeed * 1.1) * 0.12;
      float wave3 = sin(uv.x * 16.0 + time * auroraSpeed * 1.4) * 0.08;
      float wave4 = sin(uv.x * 20.0 + time * auroraSpeed * 1.8) * 0.04;
      
      // Add complex organic movement with multiple noise layers
      float organicNoise1 = fbm(uv * 6.0 + time * 0.15) * 0.12;
      float organicNoise2 = fbm(uv * 12.0 + time * 0.08) * 0.06;
      float organicNoise3 = fbm(uv * 24.0 + time * 0.04) * 0.03;
      
      // Create swirling motion
      float swirl = sin(atan(uv.y - center.y, uv.x - center.x) * 1.5 + time * auroraSpeed * 0.3) * 0.08;
      
      float totalWave = wave1 + wave2 + wave3 + wave4 + organicNoise1 + organicNoise2 + organicNoise3 + swirl;
      
      // Create multiple aurora layers with enhanced transitions
      float aurora1 = smoothstep(0.15, 0.45, uv.y + totalWave * 1.2);
      aurora1 *= smoothstep(0.65, 0.35, uv.y + totalWave * 1.2);
      
      float aurora2 = smoothstep(0.3, 0.6, uv.y + totalWave * 0.8);
      aurora2 *= smoothstep(0.8, 0.5, uv.y + totalWave * 0.8);
      
      float aurora3 = smoothstep(0.45, 0.75, uv.y + totalWave * 0.6);
      aurora3 *= smoothstep(0.9, 0.65, uv.y + totalWave * 0.6);
      
      float aurora4 = smoothstep(0.6, 0.85, uv.y + totalWave * 0.4);
      aurora4 *= smoothstep(0.95, 0.75, uv.y + totalWave * 0.4);
      
      // Enhanced color mixing with atmospheric depth and movement
      vec3 color1 = mix(auroraColor1, auroraColor2, sin(time * 0.25 + uv.x * 4.0 + distance * 8.0) * 0.5 + 0.5);
      vec3 color2 = mix(auroraColor2, auroraColor3, cos(time * 0.35 + uv.x * 3.0 + distance * 6.0) * 0.5 + 0.5);
      vec3 color3 = mix(auroraColor3, auroraColor1, sin(time * 0.45 + uv.x * 2.0 + distance * 4.0) * 0.5 + 0.5);
      vec3 color4 = mix(auroraColor1 * 1.2, auroraColor3 * 0.8, cos(time * 0.55 + uv.x * 1.5 + distance * 3.0) * 0.5 + 0.5);
      
      // Blend aurora layers with enhanced weighting
      vec3 finalColor = color1 * aurora1 * 1.2 + color2 * aurora2 * 1.0 + color3 * aurora3 * 0.8 + color4 * aurora4 * 0.6;
      
      // Add enhanced atmospheric effects
      vec3 atmosphericGlow = mix(auroraColor1, auroraColor3, 0.5) * 0.15;
      vec3 depthGlow = mix(auroraColor2, auroraColor1, 0.3) * 0.1 * depth;
      vec3 energyStreams = mix(auroraColor1, auroraColor2, sin(time * 0.8) * 0.5 + 0.5) * 0.05;
      
      finalColor += atmosphericGlow * (1.0 - depth) + depthGlow + energyStreams;
      
      // Apply intensity with dynamic enhancement
      finalColor *= auroraIntensity * (0.8 + sin(time * 0.2) * 0.2);
      float totalAurora = max(aurora1, max(aurora2, max(aurora3, aurora4)));
      
      // Enhanced alpha with depth and movement
      float alpha = totalAurora * depth * (0.7 + sin(time * 0.3 + distance * 5.0) * 0.3);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const defaultColors = (config as any).auroraColors || config.auroraColors || ['#00ff88', '#0088ff', '#ff0088'];
  const uniforms = {
    time: { value: 0 },
    auroraSpeed: { value: (config as any).auroraSpeed || config.auroraSpeed || 0.4 },
    auroraIntensity: { value: (config as any).auroraIntensity || config.auroraIntensity || 1.8 },
    auroraColor1: { value: new THREE.Color(defaultColors[0]) },
    auroraColor2: { value: new THREE.Color(defaultColors[1]) },
    auroraColor3: { value: new THREE.Color(defaultColors[2]) }
  };

  useFrame((state) => {
    if (uniforms.time) {
      uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <>
      <color attach="background" args={['#000011']} />
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
          transparent
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
};

export default AuroraBackground;
