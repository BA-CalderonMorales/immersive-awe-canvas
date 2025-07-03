import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackgroundConfig } from '@/types/scene';
import * as THREE from 'three';

interface SunsetBackgroundProps {
  config: BackgroundConfig;
}

const SunsetBackground = ({ config }: SunsetBackgroundProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current && config.speed) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * config.speed * 0.02;
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
    uniform vec3 colorMiddle;
    uniform vec3 colorBottom;
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Create sunset gradient layers
      float horizon = 0.4 + sin(time * 0.1) * 0.05;
      float skyMask = smoothstep(horizon - 0.1, horizon + 0.1, uv.y);
      float sunMask = smoothstep(horizon - 0.2, horizon + 0.2, uv.y);
      
      // Sunset colors
      vec3 sunsetOrange = vec3(1.0, 0.4, 0.1);
      vec3 sunsetPink = vec3(1.0, 0.6, 0.8);
      vec3 sunsetPurple = vec3(0.6, 0.3, 0.8);
      vec3 skyBlue = vec3(0.4, 0.7, 1.0);
      
      // Mix colors based on height
      vec3 color = mix(sunsetOrange, sunsetPink, uv.y);
      color = mix(color, sunsetPurple, smoothstep(0.3, 0.7, uv.y));
      color = mix(color, skyBlue, smoothstep(0.6, 1.0, uv.y));
      
      // Add subtle movement and warmth
      float warmth = sin(uv.x * 3.14159 + time * 0.5) * 0.1 + 0.9;
      color *= warmth;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = {
    colorTop: { value: new THREE.Color('#87CEEB') },
    colorMiddle: { value: new THREE.Color('#FFA500') },
    colorBottom: { value: new THREE.Color('#FF6347') },
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

export default SunsetBackground;