
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackgroundConfig } from '@/types/scene';
import * as THREE from 'three';

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
    
    // Simple noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 st = vUv * noiseScale;
      float n = noise(st + time);
      vec3 finalColor = color * (0.5 + n * noiseIntensity);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const uniforms = {
    time: { value: 0 },
    noiseScale: { value: config.noiseScale || 10.0 },
    noiseIntensity: { value: config.noiseIntensity || 0.5 },
    color: { value: new THREE.Color(config.color || '#1a1a2e') }
  };

  useFrame((state) => {
    if (uniforms.time) {
      uniforms.time.value = state.clock.getElapsedTime() * (config.noiseSpeed || 0.1);
    }
  });

  return (
    <>
      <color attach="background" args={[config.color || '#1a1a2e']} />
      <mesh ref={meshRef} scale={[100, 100, 1]} position={[0, 0, -30]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          opacity={0.8}
        />
      </mesh>
    </>
  );
};

export default NoiseBackground;
