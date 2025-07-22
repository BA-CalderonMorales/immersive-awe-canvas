import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { BackgroundConfig } from "@/types/scene";

interface PlasmaBackgroundProps {
    config: BackgroundConfig;
}

const PlasmaBackground = ({ config }: PlasmaBackgroundProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float time;
    uniform float plasmaSpeed;
    uniform float plasmaIntensity;
    uniform vec3 plasmaColor1;
    uniform vec3 plasmaColor2;
    uniform vec3 plasmaColor3;
    uniform float turbulence;
    uniform float contrast;
    uniform float brightness;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Production-grade noise functions for cinematic quality
    vec3 hash3(vec3 p) {
      p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
               dot(p, vec3(269.5, 183.3, 246.1)),
               dot(p, vec3(113.5, 271.9, 124.6)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    
    float simplex3d(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      
      vec3 d1 = d0 - (i1 - 1.0 * K2);
      vec3 d2 = d0 - (i2 - 2.0 * K2);
      vec3 d3 = d0 - (1.0 - 3.0 * K2);
      
      vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
      vec4 n = h * h * h * h * vec4(dot(d0, hash3(i)), dot(d1, hash3(i + i1)),
                                    dot(d2, hash3(i + i2)), dot(d3, hash3(i + 1.0)));
      return dot(vec4(31.316), n);
    }
    
    float fbm(vec3 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 8; i++) {
        if(i >= octaves) break;
        value += amplitude * simplex3d(p * frequency);
        frequency *= 2.02;
        amplitude *= 0.485;
      }
      return value;
    }
    
    // Advanced color space conversions for richer palettes
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec2 uv = vUv;
      vec3 pos = vPosition * 0.1;
      vec2 center = vec2(0.5);
      float distance = length(uv - center);
      float sphereDistance = length(vPosition);
      
      // Advanced time-based motion with multiple frequencies
      float timeBase = time * plasmaSpeed;
      float slowTime = timeBase * 0.15;
      float fastTime = timeBase * 3.8;
      
      // Multi-dimensional noise layers for ultimate realism
      vec3 noisePos1 = pos + vec3(slowTime * 0.3, slowTime * 0.2, slowTime * 0.1);
      vec3 noisePos2 = pos * 2.1 + vec3(fastTime * 0.1, fastTime * 0.15, fastTime * 0.08);
      vec3 noisePos3 = pos * 4.3 + vec3(slowTime * 0.4, slowTime * 0.3, slowTime * 0.2);
      vec3 noisePos4 = pos * 8.7 + vec3(fastTime * 0.05, fastTime * 0.07, fastTime * 0.03);
      
      float noise1 = fbm(noisePos1, 6) * 0.8;
      float noise2 = fbm(noisePos2, 4) * 0.6;
      float noise3 = fbm(noisePos3, 3) * 0.4;
      float noise4 = fbm(noisePos4, 2) * 0.2;
      
      // Create organic plasma flows with turbulence
      float plasma1 = sin(uv.x * 15.0 + noise1 * turbulence + timeBase * 0.8) * 
                      cos(uv.y * 12.0 + noise2 * turbulence + timeBase * 1.1);
      
      float plasma2 = sin((uv.x + uv.y) * 18.0 + noise3 * turbulence + timeBase * 1.3) * 
                      cos((uv.x - uv.y) * 14.0 + noise4 * turbulence + timeBase * 0.9);
      
      float plasma3 = sin(distance * 25.0 + noise1 * turbulence * 2.0 + timeBase * 1.7) * 
                      cos(atan(uv.y - center.y, uv.x - center.x) * 8.0 + noise2 * turbulence + timeBase * 1.4);
      
      // Advanced spherical plasma with 3D awareness
      float spherePlasma = sin(sphereDistance * 12.0 + noise3 * turbulence + timeBase * 2.1) *
                          cos(vNormal.x * 20.0 + vNormal.y * 15.0 + noise4 * turbulence + timeBase * 1.6);
      
      // Combine all plasma layers with sophisticated blending
      float combinedPlasma = (
        plasma1 * 1.0 + 
        plasma2 * 0.8 + 
        plasma3 * 0.6 + 
        spherePlasma * 0.7 +
        (noise1 + noise2 + noise3 + noise4) * 0.3
      ) * plasmaIntensity;
      
      // Advanced depth and atmospheric effects
      float atmosphericDepth = 1.0 - pow(distance, 1.8) * 0.9;
      float energyField = pow(max(0.0, combinedPlasma), 2.2) * atmosphericDepth;
      
      // Sophisticated color space mixing with HSV interpolation
      float hue1 = 0.15 + sin(combinedPlasma * 0.4 + timeBase * 0.2) * 0.1;
      float hue2 = 0.65 + cos(combinedPlasma * 0.6 + timeBase * 0.3) * 0.15;
      float hue3 = 0.85 + sin(combinedPlasma * 0.8 + timeBase * 0.1) * 0.1;
      
      float saturation = 0.8 + sin(energyField * 2.0) * 0.2;
      float value = brightness * (0.7 + energyField * 0.3);
      
      vec3 color1 = hsv2rgb(vec3(hue1, saturation, value));
      vec3 color2 = hsv2rgb(vec3(hue2, saturation * 0.9, value * 1.1));
      vec3 color3 = hsv2rgb(vec3(hue3, saturation * 1.1, value * 0.8));
      
      // Advanced color blending with energy-based weights
      float weight1 = abs(sin(combinedPlasma * 0.3 + timeBase * 0.1));
      float weight2 = abs(cos(combinedPlasma * 0.5 + timeBase * 0.2));
      float weight3 = abs(sin(combinedPlasma * 0.7 + timeBase * 0.15));
      
      float totalWeight = weight1 + weight2 + weight3;
      weight1 /= totalWeight;
      weight2 /= totalWeight;
      weight3 /= totalWeight;
      
      vec3 baseColor = color1 * weight1 + color2 * weight2 + color3 * weight3;
      
      // Add cinematic energy highlights and color grading
      vec3 highlightColor = mix(plasmaColor1, plasmaColor2, 0.5) * 1.5;
      float highlight = pow(energyField, 4.0) * 0.4;
      
      vec3 finalColor = mix(baseColor, highlightColor, highlight);
      
      // Professional color grading with contrast and saturation
      finalColor = pow(finalColor, vec3(1.0 / 2.2)); // Gamma correction
      finalColor = mix(vec3(dot(finalColor, vec3(0.299, 0.587, 0.114))), finalColor, saturation * 1.2);
      finalColor = ((finalColor - 0.5) * contrast + 0.5) * brightness;
      finalColor = pow(finalColor, vec3(2.2)); // Back to linear
      
      // Add atmospheric bloom
      float bloom = smoothstep(0.3, 1.0, energyField) * 0.15;
      finalColor += bloom * mix(plasmaColor1, plasmaColor3, 0.6);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

    const uniforms = {
        time: { value: 0 },
        plasmaSpeed: { value: config.plasmaSpeed || 1.0 },
        plasmaIntensity: { value: config.plasmaIntensity || 0.8 },
        plasmaColor1: {
            value: new THREE.Color(config.plasmaColor1 || "#ff0066"),
        },
        plasmaColor2: {
            value: new THREE.Color(config.plasmaColor2 || "#0066ff"),
        },
        plasmaColor3: {
            value: new THREE.Color(config.plasmaColor3 || "#00ff66"),
        },
        turbulence: { value: config.turbulence || 3.5 },
        contrast: { value: config.contrast || 1.3 },
        brightness: { value: config.brightness || 1.1 },
    };

    useFrame(state => {
        if (uniforms.time) {
            uniforms.time.value =
                state.clock.getElapsedTime() * uniforms.plasmaSpeed.value;
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
