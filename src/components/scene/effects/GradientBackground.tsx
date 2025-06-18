
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackgroundConfig } from '@/types/scene';
import * as THREE from 'three';

interface GradientBackgroundProps {
  config: BackgroundConfig;
}

const GradientBackground = ({ config }: GradientBackgroundProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current && config.speed) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * config.speed * 0.1;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 colorTop;
    uniform vec3 colorBottom;
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      vec3 color = mix(colorBottom, colorTop, uv.y + sin(uv.x * 3.14159 + time) * 0.1);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = {
    colorTop: { value: new THREE.Color(config.colorTop || '#ff6b6b') },
    colorBottom: { value: new THREE.Color(config.colorBottom || '#4ecdc4') },
    time: { value: 0 }
  };

  useFrame((state) => {
    if (uniforms.time) {
      uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} scale={[50, 50, 1]} position={[0, 0, -25]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default GradientBackground;
