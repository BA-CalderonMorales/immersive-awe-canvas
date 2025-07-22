import { useRef, useMemo } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ShaderLibrary } from "@/lib/shaderUtils";

// Extend THREE with custom volumetric material
class VolumetricMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vViewDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vViewDirection = normalize(cameraPosition - worldPosition.xyz);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float time;
        uniform vec3 lightPosition;
        uniform vec3 lightColor;
        uniform float lightIntensity;
        uniform float volumetricIntensity;
        uniform float raySteps;
        uniform float stepSize;
        uniform float scatteringCoeff;
        uniform float extinctionCoeff;
        uniform vec3 cameraPosition;
        
        varying vec3 vWorldPosition;
        varying vec3 vViewDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        ${ShaderLibrary.noise.hash3}
        ${ShaderLibrary.noise.simplex3d}
        ${ShaderLibrary.noise.fbmDefault}
        
        // God rays volumetric scattering
        float volumetricScattering(vec3 rayStart, vec3 rayDir, float rayLength) {
          float stepLength = rayLength / raySteps;
          vec3 step = rayDir * stepLength;
          vec3 currentPos = rayStart;
          float scattering = 0.0;
          
          for(float i = 0.0; i < raySteps; i++) {
            // Distance to light
            vec3 lightVector = lightPosition - currentPos;
            float lightDistance = length(lightVector);
            vec3 lightDir = lightVector / lightDistance;
            
            // Atmospheric density using noise
            float density = fbm(currentPos * 0.02 + time * 0.1, 6) * 0.5 + 0.5;
            density *= exp(-currentPos.y * 0.01); // Height-based falloff
            
            // Light attenuation
            float attenuation = lightIntensity / (1.0 + lightDistance * lightDistance * 0.001);
            
            // Phase function (Henyey-Greenstein)
            float cosTheta = dot(rayDir, lightDir);
            float g = 0.7; // Anisotropy factor
            float phaseFunction = (1.0 - g * g) / (4.0 * 3.14159 * pow(1.0 + g * g - 2.0 * g * cosTheta, 1.5));
            
            // Shadow sampling (simplified)
            float shadow = 1.0;
            vec3 shadowPos = currentPos + lightDir * 0.1;
            float shadowDensity = fbm(shadowPos * 0.03, 4);
            shadow = exp(-shadowDensity * extinctionCoeff);
            
            // Accumulate scattering
            scattering += density * attenuation * phaseFunction * shadow * scatteringCoeff * stepLength;
            
            currentPos += step;
          }
          
          return scattering;
        }
        
        void main() {
          vec3 rayStart = cameraPosition;
          vec3 rayEnd = vWorldPosition;
          vec3 rayDir = normalize(rayEnd - rayStart);
          float rayLength = length(rayEnd - rayStart);
          
          // Calculate volumetric scattering
          float scattering = volumetricScattering(rayStart, rayDir, rayLength);
          
          // Apply volumetric effect
          vec3 volumetricColor = lightColor * scattering * volumetricIntensity;
          
          // Add atmospheric perspective
          float distance = length(vWorldPosition - cameraPosition);
          float atmosphericFog = 1.0 - exp(-distance * 0.0001);
          
          gl_FragColor = vec4(volumetricColor, atmosphericFog * 0.3);
        }
      `,
            uniforms: {
                time: { value: 0 },
                lightPosition: { value: new THREE.Vector3(50, 100, 50) },
                lightColor: { value: new THREE.Color("#ffeb3b") },
                lightIntensity: { value: 100.0 },
                volumetricIntensity: { value: 0.3 },
                raySteps: { value: 32.0 },
                stepSize: { value: 1.0 },
                scatteringCoeff: { value: 0.1 },
                extinctionCoeff: { value: 0.05 },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }
}

extend({ VolumetricMaterial });

// Add volumetricMaterial to JSX.IntrinsicElements for TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            volumetricMaterial: React.DetailedHTMLProps<
                React.HTMLAttributes<any>,
                any
            > & {
                ref?: React.Ref<VolumetricMaterial>;
                attach?: string;
                [key: string]: any;
            };
        }
    }
}

const VolumetricLighting = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const materialRef = useRef<VolumetricMaterial>(null!);
    const { camera } = useThree();

    // Create massive volumetric geometry
    const volumetricGeometry = useMemo(() => {
        return new THREE.SphereGeometry(200, 64, 64);
    }, []);

    useFrame(state => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value =
                state.clock.getElapsedTime();

            // Dynamic light movement for dramatic effect
            const time = state.clock.getElapsedTime();
            materialRef.current.uniforms.lightPosition.value.set(
                Math.sin(time * 0.3) * 80,
                50 + Math.sin(time * 0.7) * 30,
                Math.cos(time * 0.3) * 80
            );
        }
    });

    return (
        <>
            {/* Volumetric atmosphere */}
            <mesh ref={meshRef} geometry={volumetricGeometry}>
                <volumetricMaterial ref={materialRef} />
            </mesh>

            {/* God rays light source */}
            <pointLight
                position={[50, 100, 50]}
                color="#ffeb3b"
                intensity={2}
                distance={500}
                decay={1}
            />

            {/* Additional dramatic lighting */}
            <directionalLight
                position={[100, 200, 100]}
                color="#ff6b35"
                intensity={1.5}
                castShadow
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-far={1000}
                shadow-camera-left={-200}
                shadow-camera-right={200}
                shadow-camera-top={200}
                shadow-camera-bottom={-200}
            />
        </>
    );
};

export default VolumetricLighting;
