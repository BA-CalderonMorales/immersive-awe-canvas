
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackgroundConfig } from '@/types/scene';
import * as THREE from 'three';

interface PlasmaBackgroundProps {
  config: BackgroundConfig;
}

const PlasmaBackground = ({ config }: PlasmaBackgroundProps) => {
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
    uniform float plasmaSpeed;
    uniform float plasmaIntensity;
    uniform vec3 plasmaColor1;
    uniform vec3 plasmaColor2;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      float plasma = sin(uv.x * 10.0 + time) + 
                     sin(uv.y * 8.0 + time * 1.5) + 
                     sin((uv.x + uv.y) * 6.0 + time * 2.0) +
                     sin(sqrt(uv.x * uv.x + uv.y * uv.y) * 12.0 + time * 3.0);
      
      plasma = plasma * plasmaIntensity;
      vec3 color = mix(plasmaColor1, plasmaColor2, (sin(plasma) + 1.0) * 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = {
    time: { value: 0 },
    plasmaSpeed: { value: config.plasmaSpeed || 1.0 },
    plasmaIntensity: { value: config.plasmaIntensity || 0.5 },
    plasmaColor1: { value: new THREE.Color(config.plasmaColor1 || '#ff0080') },
    plasmaColor2: { value: new THREE.Color(config.plasmaColor2 || '#0080ff') }
  };

  useFrame((state) => {
    if (uniforms.time) {
      uniforms.time.value = state.clock.getElapsedTime() * uniforms.plasmaSpeed.value;
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

export default PlasmaBackground;
