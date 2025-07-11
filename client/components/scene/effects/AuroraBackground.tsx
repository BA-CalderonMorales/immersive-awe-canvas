
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
      
      // Create immersive aurora with depth
      float depth = 1.0 - length(uv - 0.5) * 1.5;
      depth = smoothstep(0.0, 1.0, depth);
      
      // Multiple wave layers for complexity
      float wave1 = sin(uv.x * 6.0 + time * auroraSpeed) * 0.15;
      float wave2 = sin(uv.x * 10.0 + time * auroraSpeed * 1.3) * 0.08;
      float wave3 = sin(uv.x * 14.0 + time * auroraSpeed * 1.7) * 0.05;
      
      // Add noise for organic movement
      float organicNoise = fbm(uv * 4.0 + time * 0.2) * 0.1;
      
      float totalWave = wave1 + wave2 + wave3 + organicNoise;
      
      // Create aurora bands with smooth transitions
      float aurora1 = smoothstep(0.2, 0.5, uv.y + totalWave);
      aurora1 *= smoothstep(0.7, 0.4, uv.y + totalWave);
      
      float aurora2 = smoothstep(0.4, 0.65, uv.y + totalWave * 0.7);
      aurora2 *= smoothstep(0.85, 0.6, uv.y + totalWave * 0.7);
      
      float aurora3 = smoothstep(0.6, 0.8, uv.y + totalWave * 0.5);
      aurora3 *= smoothstep(0.95, 0.75, uv.y + totalWave * 0.5);
      
      // Color mixing with atmospheric depth
      vec3 color1 = mix(auroraColor1, auroraColor2, sin(time * 0.3 + uv.x * 3.14159) * 0.5 + 0.5);
      vec3 color2 = mix(auroraColor2, auroraColor3, cos(time * 0.5 + uv.x * 2.0) * 0.5 + 0.5);
      vec3 color3 = mix(auroraColor3, auroraColor1, sin(time * 0.7 + uv.x * 1.5) * 0.5 + 0.5);
      
      // Blend aurora layers
      vec3 finalColor = color1 * aurora1 + color2 * aurora2 + color3 * aurora3;
      
      // Add atmospheric glow
      vec3 atmosphericGlow = mix(auroraColor1, auroraColor3, 0.5) * 0.1;
      finalColor += atmosphericGlow * (1.0 - depth);
      
      // Apply intensity and depth
      finalColor *= auroraIntensity;
      float totalAurora = max(aurora1, max(aurora2, aurora3));
      
      // Enhanced alpha for better blending
      float alpha = totalAurora * depth;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const defaultColors = config.auroraColors || ['#00ff88', '#0088ff', '#ff0088'];
  const uniforms = {
    time: { value: 0 },
    auroraSpeed: { value: config.auroraSpeed || 0.5 },
    auroraIntensity: { value: config.auroraIntensity || 2.0 },
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
