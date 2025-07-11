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
    
    // Advanced noise function for atmospheric depth
    float hash(float n) {
      return fract(sin(n) * 43758.5453);
    }
    
    float noise(vec2 uv) {
      vec2 p = floor(uv);
      vec2 f = fract(uv);
      f = f * f * (3.0 - 2.0 * f);
      float n = p.x + p.y * 57.0;
      return mix(mix(hash(n), hash(n + 1.0), f.x),
                 mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
    }
    
    float fbm(vec2 uv) {
      float value = 0.0;
      float amplitude = 0.5;
      for(int i = 0; i < 3; i++) {
        value += amplitude * noise(uv);
        uv *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create immersive depth with atmospheric perspective
      float depth = 1.0 - length(uv - 0.5) * 1.4;
      depth = smoothstep(0.0, 1.0, depth);
      
      // Atmospheric noise for visual interest
      float atmosphere = fbm(uv * 4.0 + time * 0.1) * 0.1;
      
      // Enhanced gradient with depth and atmosphere
      float gradient = uv.y + sin(uv.x * 6.28318 + time) * 0.03 + atmosphere;
      gradient = smoothstep(0.0, 1.0, gradient);
      
      // Color mixing with atmospheric depth
      vec3 color = mix(colorBottom, colorTop, gradient);
      
      // Add subtle atmospheric glow
      vec3 atmosphericGlow = mix(colorBottom, colorTop, 0.5) * 0.2;
      color += atmosphericGlow * (1.0 - depth);
      
      // Depth fade for immersion
      color *= 0.8 + depth * 0.2;
      
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
    <mesh scale={[10000, 10000, 10000]} renderOrder={-1000}>
      <sphereGeometry args={[1, 64, 32]} />
      <shaderMaterial
        ref={materialRef}
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

export default GradientBackground;