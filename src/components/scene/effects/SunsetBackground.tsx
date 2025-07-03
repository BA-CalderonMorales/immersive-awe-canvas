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
    
    // Atmospheric scattering constants
    const vec3 rayleighScattering = vec3(0.0025, 0.0041, 0.0098);
    const float mieScattering = 0.004;
    const float turbidity = 2.0;
    const float luminance = 1.0;
    
    // Color palette for professional sunset
    const vec3 zenithColor = vec3(0.06, 0.12, 0.34);      // Deep twilight blue
    const vec3 horizonTopColor = vec3(0.95, 0.75, 0.42);  // Warm horizon glow
    const vec3 horizonColor = vec3(1.0, 0.55, 0.25);      // Orange horizon
    const vec3 sunColor = vec3(1.0, 0.95, 0.8);           // Warm sun
    const vec3 cloudHighlight = vec3(1.0, 0.8, 0.6);      // Cloud highlights
    const vec3 cloudShadow = vec3(0.3, 0.2, 0.4);         // Cloud shadows
    
    // Noise function for atmospheric effects
    float noise(vec2 uv) {
        return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float fbm(vec2 uv) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for(int i = 0; i < 4; i++) {
            value += amplitude * (noise(uv * frequency) - 0.5);
            frequency *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }
    
    vec3 getSunsetColor(vec2 uv, float t) {
        vec2 p = uv * 2.0 - 1.0;
        p.y = p.y * 0.8; // Slightly compress vertically for more horizon focus
        
        // Calculate angle from horizon
        float angle = atan(p.y, length(p));
        float height = p.y;
        float distance = length(p);
        
        // Sun position (slightly off-center for more natural look)
        vec2 sunPos = vec2(0.15, -0.1 + sin(t * 0.05) * 0.02);
        float sunDistance = length(p - sunPos);
        
        // Atmospheric layers
        float atmosphereHeight = smoothstep(-1.0, 0.3, height);
        float horizonBlend = 1.0 - smoothstep(-0.2, 0.4, height);
        
        // Base sky color - deep atmospheric scattering
        vec3 skyColor = mix(horizonColor, zenithColor, atmosphereHeight);
        
        // Enhanced horizon glow with realistic falloff
        float horizonGlow = exp(-abs(height + 0.1) * 8.0) * 0.8;
        skyColor = mix(skyColor, horizonTopColor, horizonGlow);
        
        // Sun disk with realistic corona
        float sunMask = 1.0 - smoothstep(0.03, 0.08, sunDistance);
        float sunGlow = exp(-sunDistance * 12.0) * 0.6;
        float sunCorona = exp(-sunDistance * 4.0) * 0.3;
        
        // Apply sun effects
        skyColor = mix(skyColor, sunColor, sunMask);
        skyColor += sunColor * sunGlow;
        skyColor += horizonTopColor * sunCorona;
        
        // Atmospheric scattering around sun
        float scatterAngle = dot(normalize(p), normalize(sunPos));
        float scattering = pow(max(0.0, scatterAngle), 8.0) * 0.4;
        skyColor += sunColor * scattering * horizonBlend;
        
        // Realistic cloud simulation
        vec2 cloudUv = p * 3.0 + vec2(t * 0.02, 0.0);
        float cloudNoise = fbm(cloudUv);
        float cloudDensity = smoothstep(0.1, 0.6, cloudNoise) * smoothstep(0.3, -0.3, height);
        
        // Cloud lighting based on sun position
        float cloudLight = max(0.3, dot(normalize(vec3(cloudUv, 0.1)), normalize(vec3(sunPos, 0.2))));
        vec3 cloudColor = mix(cloudShadow, cloudHighlight, cloudLight);
        
        // Blend clouds with sky
        skyColor = mix(skyColor, cloudColor, cloudDensity * 0.7);
        
        // Color temperature adjustment for time of day
        float timeWarmth = 0.9 + sin(t * 0.1) * 0.1;
        skyColor.r *= timeWarmth;
        skyColor.g *= mix(0.95, 1.0, timeWarmth);
        
        // Atmospheric perspective
        float perspective = 1.0 - distance * 0.1;
        skyColor *= perspective;
        
        // Subtle color enhancement for warmth
        skyColor = pow(skyColor, vec3(0.9, 1.0, 1.1));
        
        // Final exposure and tone mapping
        skyColor = skyColor / (skyColor + vec3(1.0));
        skyColor = pow(skyColor, vec3(1.0/2.2)); // Gamma correction
        
        return skyColor;
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
    <mesh scale={[2000, 2000, 2000]} renderOrder={-1}>
      <sphereGeometry args={[1, 64, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        depthTest={false}
        transparent={false}
      />
    </mesh>
  );
};

export default SunsetBackground;