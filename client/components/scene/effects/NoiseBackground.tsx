
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
    
    // Advanced noise functions for cosmic depth
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
      vec2 freq = vec2(1.0);
      for(int i = 0; i < 4; i++) {
        value += amplitude * noise(st * freq);
        freq *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    // Create cosmic nebula effect
    vec3 cosmic(vec2 uv, float time) {
      vec2 st = uv * noiseScale;
      
      // Multiple noise layers for depth
      float noise1 = fbm(st + time * 0.1);
      float noise2 = fbm(st * 2.0 + time * 0.05);
      float noise3 = fbm(st * 4.0 + time * 0.02);
      
      // Create nebula structure
      float nebula = noise1 * 0.6 + noise2 * 0.3 + noise3 * 0.1;
      
      // Add cosmic density variation
      float density = smoothstep(0.3, 0.8, nebula);
      
      // Create depth with radial falloff
      float depth = 1.0 - length(uv - 0.5) * 1.2;
      depth = smoothstep(0.0, 1.0, depth);
      
      // Color mixing with cosmic atmosphere
      vec3 baseColor = color;
      vec3 nebulaColor = mix(baseColor * 0.5, baseColor * 1.5, density);
      
      // Add atmospheric glow
      vec3 glow = baseColor * 0.3 * (1.0 - depth);
      
      return mix(nebulaColor, nebulaColor + glow, depth);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create immersive cosmic environment
      vec3 finalColor = cosmic(uv, time);
      
      // Add subtle brightness variation
      float brightness = 0.7 + fbm(uv * 8.0 + time * 0.05) * 0.3;
      finalColor *= brightness;
      
      // Ensure minimum visibility
      finalColor = max(finalColor, color * 0.2);
      
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

export default NoiseBackground;
