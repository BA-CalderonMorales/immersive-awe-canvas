import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackgroundConfig } from "@/types/scene";
import * as THREE from "three";
import { ShaderLibrary, RenderLayers } from "@/lib/shaderUtils";

interface EnhancedAuroraBackgroundProps {
    config: BackgroundConfig;
}

const EnhancedAuroraBackground = ({
    config,
}: EnhancedAuroraBackgroundProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vElevation;
    varying float vDistanceFromCenter;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vElevation = sin(uv.y * 3.14159) * 0.5 + 0.5;
      vDistanceFromCenter = length(position);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float time;
    uniform float auroraSpeed;
    uniform float auroraIntensity;
    uniform float ionizationLevel;
    uniform float magneticFieldStrength;
    uniform float solarWindPressure;
    uniform float atmosphericDensity;
    uniform vec3 auroraColor1;
    uniform vec3 auroraColor2;
    uniform vec3 auroraColor3;
    uniform vec3 auroraColor4;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying float vElevation;
    varying float vDistanceFromCenter;
    
    ${ShaderLibrary.noise.hash3}
    ${ShaderLibrary.noise.simplex3d}
    ${ShaderLibrary.noise.fbmDefault}
    ${ShaderLibrary.atmospheric.rayleighScattering}
    ${ShaderLibrary.atmospheric.miePhase}
    ${ShaderLibrary.color.hsv2rgb}
    
    // Enhanced magnetic field simulation with dipole effects
    float magneticFieldDipole(vec3 pos, float time) {
      vec3 dipoleCenter = vec3(0.0, 0.1, 0.0);
      vec3 fieldVector = pos - dipoleCenter;
      float distance = length(fieldVector);
      
      // Magnetic dipole field strength (inverse cube law)
      float fieldStrength = magneticFieldStrength / (distance * distance * distance + 0.1);
      
      // Time-varying magnetic field with 11-year solar cycle
      float solarCycle = sin(time * 0.01) * 0.3 + 0.7;
      fieldStrength *= solarCycle;
      
      // Magnetic field lines bend toward poles
      float latitudeEffect = abs(pos.y) * 2.0 + 0.3;
      return fieldStrength * latitudeEffect;
    }
    
    // Advanced solar wind simulation with particle density
    vec3 solarWindParticles(vec3 pos, float time) {
      // Multiple solar wind streams with different velocities
      float fastWind = fbm(pos * 0.02 + vec3(time * 0.3, 0.0, time * 0.2), 6);
      float slowWind = fbm(pos * 0.05 + vec3(time * 0.1, time * 0.15, 0.0), 4);
      float corionalMassEjection = fbm(pos * 0.03 + vec3(time * 0.8, time * 0.4, time * 0.6), 3);
      
      // Solar wind pressure variation
      float pressure = solarWindPressure * (0.8 + sin(time * 0.05) * 0.2);
      
      return vec3(fastWind, slowWind, corionalMassEjection) * pressure;
    }
    
    // Atmospheric composition and density at different altitudes
    float atmosphericLayer(vec3 pos, float altitude) {
      // Different atmospheric layers: Thermosphere, Mesosphere, Stratosphere
      float thermosphere = smoothstep(0.8, 1.0, altitude) * 0.3; // 80-600km
      float mesosphere = smoothstep(0.5, 0.8, altitude) * smoothstep(0.8, 0.5, altitude) * 0.6; // 50-80km
      float stratosphere = smoothstep(0.1, 0.5, altitude) * smoothstep(0.5, 0.1, altitude) * 0.8; // 10-50km
      
      float baseAtmosphere = thermosphere + mesosphere + stratosphere;
      
      // Add atmospheric turbulence
      float turbulence = fbm(pos * 0.08 + time * auroraSpeed * 0.02, 4) * 0.2;
      
      return (baseAtmosphere + turbulence) * atmosphericDensity;
    }
    
    // Ionization process simulation
    float ionizationProcess(vec3 pos, float solarWind, float magneticField, float time) {
      // Energy transfer from solar wind to atmosphere
      float energyTransfer = solarWind * magneticField * 0.5;
      
      // Different gas ionization thresholds
      float oxygenIonization = smoothstep(0.3, 0.7, energyTransfer); // Green-red aurora
      float nitrogenIonization = smoothstep(0.5, 0.9, energyTransfer); // Blue-purple aurora
      
      // Time-varying ionization with solar activity
      float solarActivity = sin(time * 0.03) * cos(time * 0.07) * 0.3 + 0.7;
      
      return (oxygenIonization + nitrogenIonization) * solarActivity * ionizationLevel;
    }
    
    // Enhanced curtain generation with realistic physics
    float generateAuroraCurtains(vec3 pos, float time, float magneticField, vec3 solarWind) {
      // Magnetic field line following
      vec3 fieldDirection = normalize(vec3(sin(pos.y * 2.0), 1.0, cos(pos.x * 1.5)));
      vec3 curtainPos = pos + fieldDirection * magneticField * 0.3;
      
      // Multi-scale turbulence for realistic aurora structure
      float largeCurtains = fbm(curtainPos * 0.03 + vec3(time * auroraSpeed * 0.02, 0.0, time * auroraSpeed * 0.015), 6);
      float mediumCurtains = fbm(curtainPos * 0.08 + vec3(time * auroraSpeed * 0.04, time * auroraSpeed * 0.03, 0.0), 5);
      float smallCurtains = fbm(curtainPos * 0.15 + vec3(0.0, time * auroraSpeed * 0.06, time * auroraSpeed * 0.08), 4);
      float fineCurtains = fbm(curtainPos * 0.3 + solarWind * 0.5, 3);
      
      // Combine curtains with different weights
      float totalCurtains = largeCurtains * 0.4 + mediumCurtains * 0.3 + smallCurtains * 0.2 + fineCurtains * 0.1;
      
      // Create curtain boundaries with smooth transitions
      float curtainMask = sin(vUv.y * 8.0 + totalCurtains * 3.0 + time * auroraSpeed);
      curtainMask = smoothstep(-0.1, 0.1, curtainMask) * smoothstep(0.1, -0.1, curtainMask - 0.2);
      
      return totalCurtains * curtainMask;
    }
    
    // Advanced spectral emission modeling
    vec3 spectralEmission(float ionization, float altitude, vec3 pos, float time) {
      // Oxygen emissions (green 557.7nm, red 630.0nm)
      float oxygenGreen = ionization * smoothstep(0.2, 0.6, altitude); // Lower altitude
      float oxygenRed = ionization * smoothstep(0.6, 1.0, altitude); // Higher altitude
      
      // Nitrogen emissions (blue 427.8nm, purple 391.4nm)
      float nitrogenBlue = ionization * smoothstep(0.4, 0.8, altitude);
      float nitrogenPurple = ionization * smoothstep(0.7, 1.0, altitude);
      
      // Rare gas emissions for color variation
      float helium = ionization * smoothstep(0.8, 1.0, altitude) * 0.3; // Pink
      
      // Mix colors based on emission strengths
      vec3 oxygenColor = mix(auroraColor1, auroraColor2, oxygenRed / (oxygenGreen + 0.1));
      vec3 nitrogenColor = mix(auroraColor3, auroraColor4, nitrogenPurple / (nitrogenBlue + 0.1));
      vec3 heliumColor = vec3(1.0, 0.3, 0.8); // Pink
      
      // Combine emissions with spectral realism
      vec3 totalEmission = oxygenColor * (oxygenGreen + oxygenRed) +
                          nitrogenColor * (nitrogenBlue + nitrogenPurple) +
                          heliumColor * helium;
      
      return totalEmission;
    }
    
    void main() {
      vec2 uv = vUv;
      vec3 pos = vWorldPosition * 0.001;
      float altitude = vElevation;
      
      // Advanced atmospheric and space physics simulation
      float magneticField = magneticFieldDipole(pos, time);
      vec3 solarWind = solarWindParticles(pos, time);
      float atmosphere = atmosphericLayer(pos, altitude);
      float ionization = ionizationProcess(pos, length(solarWind), magneticField, time);
      
      // Generate realistic aurora curtains
      float curtains = generateAuroraCurtains(pos, time, magneticField, solarWind);
      
      // Enhanced atmospheric scattering
      float scatteringHeight = altitude * 100.0; // Convert to km scale
      vec3 scattering = rayleighScattering(dot(normalize(pos), vec3(0.0, 1.0, 0.0)), vec3(700.0, 530.0, 440.0));
      float mieScatter = miePhase(dot(normalize(pos), normalize(solarWind)), 0.8);
      
      // Apply atmospheric effects to aurora
      float atmosphericEffect = atmosphere * (1.0 + scattering.g * 0.1 + mieScatter * 0.05);
      
      // Generate spectral emission colors
      vec3 emission = spectralEmission(ionization, altitude, pos, time);
      
      // Apply curtain patterns to emission
      emission *= curtains * atmosphericEffect;
      
      // Add aurora pillars (vertical structures)
      float pillars = sin(uv.x * 15.0 + fbm(vec3(uv.x * 5.0, time * auroraSpeed * 0.1, 0.0), 3) * 2.0);
      pillars = smoothstep(0.7, 1.0, pillars) * 0.3;
      emission += emission * pillars;
      
      // Atmospheric glow and corona effects
      float coronaGlow = pow(1.0 - vDistanceFromCenter * 0.1, 3.0) * 0.2;
      vec3 coronaColor = mix(auroraColor1, auroraColor3, 0.5);
      emission += coronaColor * coronaGlow * ionization;
      
      // Solar wind interaction brightness modulation
      float windModulation = dot(normalize(solarWind), vec3(0.0, 1.0, 0.0)) * 0.2 + 0.8;
      emission *= windModulation;
      
      // Apply overall intensity with realistic fluctuations
      float intensityFluctuation = sin(time * 0.08) * cos(time * 0.13) * 0.2 + 0.8;
      emission *= auroraIntensity * intensityFluctuation;
      
      // Calculate final alpha with depth and atmospheric effects
      float auroraAlpha = length(emission) * atmosphericEffect * 0.3;
      auroraAlpha += coronaGlow * 0.1;
      
      // Add subtle edge glow for realistic atmosphere
      float edgeGlow = pow(1.0 - abs(uv.y - 0.5) * 2.0, 4.0) * 0.05;
      auroraAlpha += edgeGlow;
      
      gl_FragColor = vec4(emission, clamp(auroraAlpha, 0.0, 0.95));
    }
  `;

    const defaultColors = config.auroraColors || [
        "#00ff88",
        "#ff4444",
        "#0088ff",
        "#aa44ff",
    ];
    const uniforms = {
        time: { value: 0 },
        auroraSpeed: { value: config.auroraSpeed || 0.4 },
        auroraIntensity: { value: config.auroraIntensity || 1.8 },
        ionizationLevel: { value: 1.2 },
        magneticFieldStrength: { value: 0.8 },
        solarWindPressure: { value: 1.0 },
        atmosphericDensity: { value: 1.0 },
        auroraColor1: { value: new THREE.Color(defaultColors[0]) }, // Oxygen green
        auroraColor2: { value: new THREE.Color(defaultColors[1]) }, // Oxygen red
        auroraColor3: { value: new THREE.Color(defaultColors[2]) }, // Nitrogen blue
        auroraColor4: { value: new THREE.Color(defaultColors[3]) }, // Nitrogen purple
    };

    useFrame(state => {
        if (uniforms.time) {
            uniforms.time.value = state.clock.getElapsedTime();
        }
    });

    return (
        <>
            <color attach="background" args={["#000008"]} />
            <mesh
                ref={meshRef}
                scale={[12000, 12000, 12000]}
                renderOrder={RenderLayers.BACKGROUND_FAR}
            >
                <sphereGeometry args={[1, 128, 64]} />
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

export default EnhancedAuroraBackground;
