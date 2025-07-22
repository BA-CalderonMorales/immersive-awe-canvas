import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ShaderLibrary } from "@/lib/shaderUtils";

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
    uniform float time;
    uniform float morphStrength;
    uniform float animationSpeed;
    uniform int morphOctaves;
    uniform float morphType;
    
    attribute vec3 offset;
    attribute float random;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vMorphFactor;
    varying float vVertexRandom;
    
    ${ShaderLibrary.noise.hash3}
    ${ShaderLibrary.noise.simplex3d}
    ${ShaderLibrary.noise.fbmDefault}
    
    // Advanced morphing functions for different types
    vec3 waveMorph(vec3 pos, float time, float strength) {
      vec3 newPos = pos;
      
      // Sine wave deformation
      newPos.y += sin(pos.x * 5.0 + time * 2.0) * strength * 0.2;
      newPos.x += cos(pos.z * 3.0 + time * 1.5) * strength * 0.15;
      newPos.z += sin(pos.y * 4.0 + time * 1.8) * strength * 0.1;
      
      return newPos;
    }
    
    vec3 noiseMorph(vec3 pos, float time, float strength) {
      vec3 noisePos = pos * 2.0 + vec3(time * 0.3, time * 0.4, time * 0.2);
      vec3 displacement = vec3(
        fbm(noisePos, morphOctaves),
        fbm(noisePos + vec3(17.3, 21.7, 33.1), morphOctaves),
        fbm(noisePos + vec3(91.2, 13.9, 71.4), morphOctaves)
      );
      
      return pos + displacement * strength * 0.3;
    }
    
    vec3 crystalMorph(vec3 pos, float time, float strength) {
      vec3 newPos = pos;
      
      // Crystal growth along vertex normals
      float growthFactor = sin(time * 0.5 + length(pos) * 3.0) * 0.5 + 0.5;
      newPos += normal * strength * growthFactor * 0.4;
      
      // Fractal crystal spikes
      float spikeNoise = fbm(pos * 8.0 + time * 0.2, 4);
      newPos += normal * spikeNoise * strength * 0.2;
      
      return newPos;
    }
    
    vec3 organicMorph(vec3 pos, float time, float strength) {
      vec3 newPos = pos;
      
      // Breathing effect
      float breathing = sin(time * 0.8) * 0.1 + 0.9;
      newPos *= breathing;
      
      // Organic flow deformation
      vec3 flowField = vec3(
        sin(pos.y * 2.0 + time * 0.6) * cos(pos.z * 1.5 + time * 0.4),
        cos(pos.x * 1.8 + time * 0.5) * sin(pos.z * 2.2 + time * 0.7),
        sin(pos.x * 1.3 + time * 0.3) * cos(pos.y * 1.9 + time * 0.8)
      );
      
      newPos += flowField * strength * 0.2;
      
      // Add noise for organic irregularity
      vec3 organicNoise = vec3(
        fbm(pos * 3.0 + time * 0.1, 5),
        fbm(pos * 3.0 + time * 0.15, 5),
        fbm(pos * 3.0 + time * 0.2, 5)
      );
      
      newPos += organicNoise * strength * 0.1;
      
      return newPos;
    }
    
    vec3 flowMorph(vec3 pos, float time, float strength) {
      vec3 newPos = pos;
      
      // Fluid flow simulation
      float flowSpeed = time * animationSpeed;
      vec3 velocity = vec3(
        sin(pos.y * 0.5 + flowSpeed * 0.3),
        cos(pos.x * 0.4 + flowSpeed * 0.2),
        sin(pos.z * 0.6 + flowSpeed * 0.4)
      );
      
      // Apply flow displacement
      newPos += velocity * strength * 0.3;
      
      // Add turbulence
      vec3 turbulence = vec3(
        fbm(pos * 1.5 + velocity + time * 0.2, 6),
        fbm(pos * 1.5 + velocity + time * 0.25, 6),
        fbm(pos * 1.5 + velocity + time * 0.18, 6)
      );
      
      newPos += turbulence * strength * 0.15;
      
      return newPos;
    }
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      vVertexRandom = random;
      
      vec3 morphedPosition = position;
      float animTime = time * animationSpeed;
      
      // Apply morphing based on type
      if (morphType < 1.0) {
        morphedPosition = waveMorph(position, animTime, morphStrength);
      } else if (morphType < 2.0) {
        morphedPosition = noiseMorph(position, animTime, morphStrength);
      } else if (morphType < 3.0) {
        morphedPosition = crystalMorph(position, animTime, morphStrength);
      } else if (morphType < 4.0) {
        morphedPosition = organicMorph(position, animTime, morphStrength);
      } else {
        morphedPosition = flowMorph(position, animTime, morphStrength);
      }
      
      // Calculate morph factor for fragment shader
      vMorphFactor = length(morphedPosition - position) / morphStrength;
      
      vec4 worldPosition = modelMatrix * vec4(morphedPosition, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      // Update normal for lighting
      vec3 morphedNormal = normal;
      if (morphType >= 2.0) { // For crystal and organic types
        vec3 epsilon = vec3(0.001, 0.0, 0.0);
        vec3 tangent1 = normalize(morphedPosition + epsilon.xyy - (morphedPosition - epsilon.xyy));
        vec3 tangent2 = normalize(morphedPosition + epsilon.yxy - (morphedPosition - epsilon.yxy));
        morphedNormal = normalize(cross(tangent1, tangent2));
      }
      vNormal = normalize(normalMatrix * morphedNormal);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPosition, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float time;
    uniform vec3 baseColor;
    uniform float metalness;
    uniform float roughness;
    uniform float emissiveIntensity;
    uniform float morphVisualization;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vMorphFactor;
    varying float vVertexRandom;
    
    ${ShaderLibrary.color.hsv2rgb}
    ${ShaderLibrary.color.colorGrading}
    
    // Enhanced material properties
    vec3 computeEnhancedMaterial(vec3 color, vec3 normal, vec3 viewDir, vec3 lightDir) {
      float NdotL = max(dot(normal, lightDir), 0.0);
      float NdotV = max(dot(normal, viewDir), 0.0);
      
      // Fresnel effect
      float fresnel = pow(1.0 - NdotV, 5.0);
      
      // Enhanced metallic reflection
      vec3 reflectDir = reflect(-viewDir, normal);
      float metallic = metalness;
      
      // Subsurface scattering approximation
      float subsurface = pow(max(0.0, dot(-lightDir, normal)), 2.0);
      
      // Energy-based emission from morphing
      float energyEmission = vMorphFactor * emissiveIntensity;
      vec3 emissiveColor = hsv2rgb(vec3(time * 0.1 + vVertexRandom, 0.8, energyEmission));
      
      // Combine all lighting effects
      vec3 diffuse = color * NdotL * (1.0 - metallic);
      vec3 specular = mix(vec3(0.04), color, metallic) * pow(NdotL, 1.0 / (roughness * roughness + 0.001));
      vec3 fresnelColor = mix(color, vec3(1.0), fresnel * metallic);
      vec3 subsurfaceColor = color * subsurface * 0.3 * (1.0 - metallic);
      
      return diffuse + specular + fresnelColor * 0.3 + subsurfaceColor + emissiveColor;
    }
    
    void main() {
      vec3 color = baseColor;
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
      
      // Morph-based color variation
      if (morphVisualization > 0.5) {
        float hue = vMorphFactor * 0.3 + time * 0.05;
        color = mix(color, hsv2rgb(vec3(hue, 0.7, 1.0)), 0.3);
      }
      
      // Apply enhanced material computation
      vec3 finalColor = computeEnhancedMaterial(color, normal, viewDir, lightDir);
      
      // Professional color grading
      finalColor = colorGrade(finalColor, 1.2, 1.0, 1.1);
      
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
            morphOctaves: { value: shaderComplexity.octaves },
            morphType: { value: morphTypeValue },
            baseColor: { value: new THREE.Color(color) },
            metalness: { value: materialConfig.metalness || 0.5 },
            roughness: { value: materialConfig.roughness || 0.5 },
            emissiveIntensity: {
                value: materialConfig.emissiveIntensity || 0.1,
            },
            morphVisualization: { value: 1.0 },
        }),
        [color, materialConfig, shaderComplexity, morphTypeValue]
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
