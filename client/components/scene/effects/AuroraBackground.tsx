
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
    
    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 uv = vUv;
      float wave1 = sin(uv.x * 8.0 + time * auroraSpeed) * 0.1;
      float wave2 = sin(uv.x * 12.0 + time * auroraSpeed * 1.5) * 0.05;
      float wave3 = sin(uv.x * 16.0 + time * auroraSpeed * 2.0) * 0.03;
      
      float totalWave = wave1 + wave2 + wave3;
      float aurora = smoothstep(0.3, 0.7, uv.y + totalWave);
      aurora *= smoothstep(0.8, 0.2, uv.y + totalWave);
      aurora *= auroraIntensity;
      
      vec3 color1 = mix(auroraColor1, auroraColor2, sin(time + uv.x * 3.14159) * 0.5 + 0.5);
      vec3 color2 = mix(auroraColor2, auroraColor3, cos(time * 0.7 + uv.x * 2.0) * 0.5 + 0.5);
      vec3 finalColor = mix(color1, color2, uv.y);
      
      gl_FragColor = vec4(finalColor * aurora, aurora);
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
      <mesh ref={meshRef} scale={[50, 50, 1]} position={[0, 0, -25]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
};

export default AuroraBackground;
