import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BackgroundConfig } from '@/types/scene';
import * as THREE from 'three';

interface GradientBackgroundProps {
  config: BackgroundConfig;
}

const GradientBackground = ({ config }: GradientBackgroundProps) => {
  const { scene } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

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
      
      // Create smooth gradient with subtle animation
      float gradient = uv.y + sin(uv.x * 3.14159 + time) * 0.05;
      vec3 color = mix(colorBottom, colorTop, gradient);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = {
    colorTop: { value: new THREE.Color(config.colorTop || '#ff6b6b') },
    colorBottom: { value: new THREE.Color(config.colorBottom || '#4ecdc4') },
    time: { value: 0 }
  };

  useFrame((state) => {
    if (materialRef.current && config.speed) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime() * config.speed;
    }
  });

  return (
    <mesh scale={[1000, 1000, 1000]}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default GradientBackground;