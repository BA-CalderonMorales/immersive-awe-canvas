import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { BackgroundConfig } from "@/types/scene";

interface NebulaBackgroundProps {
    config: BackgroundConfig;
}

const NebulaBackground = ({ config }: NebulaBackgroundProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vDistanceToCenter;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vDistanceToCenter = length(position);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float time;
    uniform float nebulaSpeed;
    uniform float nebulaIntensity;
    uniform float gasDensity;
    uniform float dustDensity;
    uniform float stellarWindStrength;
    uniform vec3 nebulaColor1;
    uniform vec3 nebulaColor2;
    uniform vec3 nebulaColor3;
    uniform vec3 starColor;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vDistanceToCenter;
    
    // Advanced 3D noise for cosmic structures
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
        frequency *= 2.23;
        amplitude *= 0.43;
      }
      return value;
    }
    
    // Stellar wind simulation
    vec3 stellarWind(vec3 pos, float time) {
      float wind1 = fbm(pos * 0.03 + vec3(time * 0.1, 0.0, time * 0.08), 5);
      float wind2 = fbm(pos * 0.05 + vec3(0.0, time * 0.12, time * 0.06), 4);
      float wind3 = fbm(pos * 0.08 + vec3(time * 0.15, time * 0.09, 0.0), 3);
      return vec3(wind1, wind2, wind3) * stellarWindStrength;
    }
    
    // Gas and dust density modeling
    float gasCloud(vec3 pos, float time) {
      vec3 windOffset = stellarWind(pos, time) * 0.3;
      float density = fbm(pos * 0.02 + windOffset + time * nebulaSpeed * 0.05, 6);
      density += fbm(pos * 0.08 + windOffset + time * nebulaSpeed * 0.03, 4) * 0.5;
      density += fbm(pos * 0.15 + windOffset + time * nebulaSpeed * 0.08, 3) * 0.25;
      return density;
    }
    
    float dustLanes(vec3 pos, float time) {
      vec3 windOffset = stellarWind(pos, time) * 0.5;
      float lanes = fbm(pos * 0.04 + windOffset + time * nebulaSpeed * 0.02, 5);
      lanes *= fbm(pos * 0.12 + windOffset + time * nebulaSpeed * 0.04, 3);
      return pow(max(0.0, lanes), 2.5);
    }
    
    // Emission nebula modeling
    float emissionRegions(vec3 pos, float time) {
      float emission = fbm(pos * 0.06 + time * nebulaSpeed * 0.03, 4);
      emission = pow(max(0.0, emission * 0.8 + 0.2), 3.0);
      return emission;
    }
    
    // Star formation regions
    float starFormation(vec3 pos, float time) {
      float formation = fbm(pos * 0.1 + time * nebulaSpeed * 0.01, 3);
      formation = pow(max(0.0, formation * 0.6 + 0.4), 5.0);
      return formation;
    }
    
    // Generate background stars
    float stars(vec3 pos) {
      float starField = 0.0;
      
      // Multiple star layers with different sizes
      for(int i = 0; i < 3; i++) {
        vec3 starPos = pos * (10.0 + float(i) * 20.0);
        vec3 starGrid = floor(starPos);
        vec3 starLocal = fract(starPos);
        
        vec3 starHash = hash3(starGrid);
        float starProb = step(0.98 + float(i) * 0.005, starHash.x);
        
        vec2 starCenter = starLocal.xy - 0.5;
        float starDist = length(starCenter);
        float starRadius = (0.01 + starHash.y * 0.02) / (1.0 + float(i));
        
        float star = exp(-starDist * starDist / (starRadius * starRadius)) * starProb;
        starField += star * (1.0 - float(i) * 0.3);
      }
      
      return starField;
    }
    
    void main() {
      vec2 uv = vUv;
      vec3 pos = vWorldPosition * 0.001;
      
      // Atmospheric depth and distance effects
      float depth = 1.0 - vDistanceToCenter * 0.1;
      depth = smoothstep(0.0, 1.0, depth);
      
      // Create cosmic gas and dust structures
      float gas = gasCloud(pos, time) * gasDensity;
      float dust = dustLanes(pos, time) * dustDensity;
      float emission = emissionRegions(pos, time);
      float formation = starFormation(pos, time);
      
      // Background star field
      float starField = stars(pos) * 2.0;
      
      // Advanced nebula coloring based on temperature and composition
      // Hot emission regions (young stars)
      vec3 hotEmission = nebulaColor1 * emission * formation * 1.5;
      
      // Warm gas clouds (hydrogen alpha)
      vec3 warmGas = nebulaColor2 * gas * (1.0 - dust * 0.5) * 1.2;
      
      // Cool dust lanes and molecular clouds
      vec3 coolDust = nebulaColor3 * dust * (1.0 - emission * 0.3) * 0.8;
      
      // Stellar wind interactions
      vec3 wind = stellarWind(pos, time);
      float windTurbulence = length(wind) * 0.5;
      
      // Combine all nebula components
      vec3 nebulaColor = hotEmission + warmGas + coolDust;
      
      // Add wind-driven color variations
      float windHue = sin(windTurbulence * 3.14159 + time * 0.1) * 0.5 + 0.5;
      vec3 windColor = mix(nebulaColor1, nebulaColor3, windHue) * windTurbulence * 0.3;
      nebulaColor += windColor;
      
      // Add ionization fronts (sharp color transitions)
      float ionizationFront = smoothstep(0.3, 0.7, emission) * smoothstep(0.7, 0.3, gas);
      nebulaColor += nebulaColor1 * ionizationFront * 0.6;
      
      // Add background stars with realistic scattering
      vec3 starLight = starColor * starField * (1.0 - gas * 0.3 - dust * 0.6);
      
      // Combine nebula and stars
      vec3 finalColor = nebulaColor + starLight;
      
      // Apply atmospheric perspective and depth
      finalColor *= depth;
      
      // Add subtle color temperature variations
      float temperature = emission * 2.0 + gas * 1.5 + dust * 0.8;
      temperature = clamp(temperature, 0.0, 2.0);
      
      // Cool to warm color grading
      vec3 temperatureShift = mix(
        vec3(0.8, 0.9, 1.2), // Cool (blue shift)
        vec3(1.2, 1.0, 0.7), // Warm (red shift)
        temperature * 0.5
      );
      finalColor *= temperatureShift;
      
      // Apply overall intensity
      finalColor *= nebulaIntensity;
      
      // Add cosmic radiation glow
      float radiationGlow = pow(emission + formation * 0.5, 2.0) * 0.1;
      finalColor += radiationGlow * mix(nebulaColor1, nebulaColor2, 0.5);
      
      // Calculate alpha with layered transparency
      float nebulaAlpha = clamp(gas + dust * 0.8 + emission * 0.6, 0.0, 0.95);
      float starAlpha = starField * 0.8;
      float finalAlpha = max(nebulaAlpha, starAlpha);
      
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `;

    const uniforms = {
        time: { value: 0 },
        nebulaSpeed: { value: config.nebulaSpeed || 0.3 },
        nebulaIntensity: { value: config.nebulaIntensity || 1.4 },
        gasDensity: { value: config.gasDensity || 1.2 },
        dustDensity: { value: config.dustDensity || 0.8 },
        stellarWindStrength: { value: config.stellarWindStrength || 0.6 },
        nebulaColor1: {
            value: new THREE.Color(config.nebulaColor1 || "#ff6b35"),
        }, // Hot emission
        nebulaColor2: {
            value: new THREE.Color(config.nebulaColor2 || "#f7931e"),
        }, // Warm gas
        nebulaColor3: {
            value: new THREE.Color(config.nebulaColor3 || "#4ecdc4"),
        }, // Cool dust
        starColor: { value: new THREE.Color(config.starColor || "#ffffff") },
    };

    useFrame(state => {
        if (uniforms.time) {
            uniforms.time.value = state.clock.getElapsedTime();
        }
    });

    return (
        <>
            <color attach="background" args={["#000005"]} />
            <mesh
                ref={meshRef}
                scale={[15000, 15000, 15000]}
                renderOrder={-1000}
            >
                <sphereGeometry args={[1, 64, 32]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    side={THREE.BackSide}
                    depthWrite={false}
                    depthTest={false}
                    fog={false}
                    transparent
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </>
    );
};

export default NebulaBackground;
