import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BackgroundConfig } from '@/types/scene';
import * as THREE from 'three';

interface SunsetBackgroundProps {
  config: BackgroundConfig;
}

const SunsetBackground = ({ config }: SunsetBackgroundProps) => {
  const { scene, camera } = useThree();
  const geometryRef = useRef<THREE.SphereGeometry>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    vec3 getSunsetColor(vec2 uv, float t) {
      // Normalize UV to -1 to 1 range
      vec2 p = uv * 2.0 - 1.0;
      
      // Create horizon line
      float horizon = 0.1 + sin(t * 0.1) * 0.05;
      float height = p.y;
      
      // Sunset color palette
      vec3 sunColor = vec3(1.0, 0.8, 0.3);
      vec3 orangeColor = vec3(1.0, 0.4, 0.1);
      vec3 pinkColor = vec3(1.0, 0.3, 0.6);
      vec3 purpleColor = vec3(0.6, 0.2, 0.8);
      vec3 skyColor = vec3(0.2, 0.4, 0.8);
      vec3 nightColor = vec3(0.05, 0.05, 0.2);
      
      vec3 color;
      
      if (height > horizon + 0.3) {
        // Upper sky - transition to night
        float t = smoothstep(horizon + 0.3, 1.0, height);
        color = mix(skyColor, nightColor, t);
      } else if (height > horizon) {
        // Sky zone
        float t = smoothstep(horizon, horizon + 0.3, height);
        color = mix(purpleColor, skyColor, t);
      } else if (height > horizon - 0.1) {
        // Sunset zone
        float t = smoothstep(horizon - 0.1, horizon, height);
        color = mix(orangeColor, pinkColor, t);
      } else {
        // Lower horizon
        float t = smoothstep(-1.0, horizon - 0.1, height);
        color = mix(nightColor, orangeColor, t);
      }
      
      // Add sun disk
      vec2 sunPos = vec2(0.2, horizon + 0.05);
      float sunDist = distance(p, sunPos);
      float sunMask = 1.0 - smoothstep(0.05, 0.15, sunDist);
      color = mix(color, sunColor, sunMask * 0.8);
      
      // Add subtle clouds
      float cloudNoise = sin(p.x * 3.0 + t * 0.1) * sin(p.y * 5.0 + t * 0.05);
      cloudNoise = pow(max(0.0, cloudNoise), 2.0) * 0.1;
      color += cloudNoise;
      
      return color;
    }
    
    void main() {
      vec3 color = getSunsetColor(vUv, time);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = {
    time: { value: 0 }
  };

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[1000, 1000, 1000]}>
      <sphereGeometry ref={geometryRef} args={[1, 32, 32]} />
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

export default SunsetBackground;