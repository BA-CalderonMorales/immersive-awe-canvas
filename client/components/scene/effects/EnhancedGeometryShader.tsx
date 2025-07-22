import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface EnhancedGeometryShaderProps {
    color: string;
    geometry: THREE.BufferGeometry;
    materialConfig: any;
    complexity?: "low" | "medium" | "high" | "extreme";
    morphType?: "wave" | "noise" | "crystal" | "organic" | "flow";
}

const EnhancedGeometryShader = ({
    color,
    geometry,
    materialConfig,
    complexity = "high",
    morphType = "organic",
}: EnhancedGeometryShaderProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    // Determine shader complexity based on performance level
    const shaderComplexity = useMemo(() => {
        const complexityLevels = {
            low: { octaves: 3, morphStrength: 0.1, animationSpeed: 0.5 },
            medium: { octaves: 5, morphStrength: 0.2, animationSpeed: 0.8 },
            high: { octaves: 7, morphStrength: 0.3, animationSpeed: 1.0 },
            extreme: { octaves: 10, morphStrength: 0.5, animationSpeed: 1.2 },
        };
        return complexityLevels[complexity];
    }, [complexity]);

    const vertexShader = `
    precision mediump float;
    
    uniform float time;
    uniform float morphStrength;
    uniform float animationSpeed;
    uniform float morphType;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vMorphFactor;
    varying float vVertexRandom;
    
    // Simple noise function
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
    }
    
    // Simple wave morphing
    vec3 simpleMorph(vec3 pos, float time, float strength) {
      vec3 newPos = pos;
      
      // Basic wave deformation
      newPos.y += sin(pos.x * 3.0 + time * 2.0) * strength * 0.2;
      newPos.x += cos(pos.z * 2.0 + time * 1.5) * strength * 0.15;
      newPos.z += sin(pos.y * 2.5 + time * 1.8) * strength * 0.1;
      
      return newPos;
    }
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      vVertexRandom = noise(position);
      
      vec3 morphedPosition = position;
      float animTime = time * animationSpeed;
      
      // Simple morphing for all types
      morphedPosition = simpleMorph(position, animTime, morphStrength);
      
      // Calculate morph factor for fragment shader
      vMorphFactor = length(morphedPosition - position) / max(morphStrength, 0.001);
      
      vec4 worldPosition = modelMatrix * vec4(morphedPosition, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      vNormal = normalize(normalMatrix * normal);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPosition, 1.0);
    }
  `;

    const fragmentShader = `
    precision mediump float;
    
    uniform float time;
    uniform vec3 baseColor;
    uniform float morphVisualization;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vMorphFactor;
    varying float vVertexRandom;
    
    // Simple HSV to RGB conversion
    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec3 color = baseColor;
      vec3 normal = normalize(vNormal);
      
      // Simple lighting
      vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
      float NdotL = max(dot(normal, lightDir), 0.0);
      
      // Morph-based color variation
      if (morphVisualization > 0.5) {
        float hue = vMorphFactor * 0.3 + time * 0.05;
        color = mix(color, hsv2rgb(vec3(hue, 0.7, 1.0)), 0.3);
      }
      
      // Apply simple lighting
      vec3 finalColor = color * (0.3 + 0.7 * NdotL);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

    const morphTypeValue = useMemo(() => {
        const types = { wave: 0, noise: 1, crystal: 2, organic: 3, flow: 4 };
        return types[morphType] || 3;
    }, [morphType]);

    const uniforms = useMemo(
        () => ({
            time: { value: 0 },
            morphStrength: { value: shaderComplexity.morphStrength },
            animationSpeed: { value: shaderComplexity.animationSpeed },
            morphType: { value: morphTypeValue },
            baseColor: { value: new THREE.Color(color) },
            morphVisualization: { value: 1.0 },
        }),
        [color, shaderComplexity, morphTypeValue]
    );

    useFrame(state => {
        if (uniforms.time) {
            uniforms.time.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef}>
            <primitive object={geometry} attach="geometry" />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={materialConfig.transparent}
                opacity={materialConfig.opacity || 1.0}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

export default EnhancedGeometryShader;
