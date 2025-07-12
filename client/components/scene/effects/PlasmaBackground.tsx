
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
    
    // Enhanced noise function for organic plasma movement
    float hash(float n) {
      return fract(sin(n) * 43758.5453123);
    }
    
    float noise(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      f = f * f * (3.0 - 2.0 * f);
      float n = i.x + i.y * 57.0;
      return mix(mix(hash(n), hash(n + 1.0), f.x),
                 mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 center = vec2(0.5);
      float distance = length(uv - center);
      
      // Multi-layered plasma with organic movement
      float plasma1 = sin(uv.x * 12.0 + time * 0.8) + 
                      sin(uv.y * 10.0 + time * 1.2) + 
                      sin((uv.x + uv.y) * 8.0 + time * 1.5);
      
      float plasma2 = sin(uv.x * 16.0 + time * 1.1) + 
                      sin(uv.y * 14.0 + time * 0.9) + 
                      sin((uv.x - uv.y) * 12.0 + time * 1.8);
      
      float plasma3 = sin(sqrt(uv.x * uv.x + uv.y * uv.y) * 18.0 + time * 2.5) +
                      sin(atan(uv.y - center.y, uv.x - center.x) * 6.0 + time * 1.3);
      
      // Add organic noise for natural movement
      float organicNoise = noise(uv * 8.0 + time * 0.2) * 2.0;
      
      // Combine plasma layers with depth
      float combinedPlasma = (plasma1 + plasma2 * 0.7 + plasma3 * 0.5 + organicNoise) * plasmaIntensity;
      
      // Create depth-based intensity variation
      float depthIntensity = 1.0 - distance * 0.8;
      combinedPlasma *= depthIntensity;
      
      // Enhanced color mixing with multiple transitions
      float colorMix1 = (sin(combinedPlasma * 0.8) + 1.0) * 0.5;
      float colorMix2 = (cos(combinedPlasma * 1.2 + time * 0.5) + 1.0) * 0.5;
      float colorMix3 = (sin(combinedPlasma * 1.5 + distance * 10.0) + 1.0) * 0.5;
      
      vec3 color1 = mix(plasmaColor1, plasmaColor2, colorMix1);
      vec3 color2 = mix(plasmaColor2, plasmaColor1 * 1.2, colorMix2);
      vec3 color3 = mix(plasmaColor1 * 0.8, plasmaColor2 * 1.3, colorMix3);
      
      // Blend colors based on plasma intensity and distance
      vec3 finalColor = mix(color1, color2, abs(sin(combinedPlasma * 0.3)));
      finalColor = mix(finalColor, color3, abs(cos(combinedPlasma * 0.2)) * 0.5);
      
      // Add energy glow effect
      float energyGlow = pow(abs(sin(combinedPlasma * 0.1)), 3.0) * 0.3;
      finalColor += energyGlow * mix(plasmaColor1, plasmaColor2, 0.5);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const uniforms = {
    time: { value: 0 },
    plasmaSpeed: { value: config.plasmaSpeed || 1.0 },
    plasmaIntensity: { value: config.plasmaIntensity || 0.8 },
    plasmaColor1: { value: new THREE.Color(config.plasmaColor1 || '#ff0066') },
    plasmaColor2: { value: new THREE.Color(config.plasmaColor2 || '#0066ff') }
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
