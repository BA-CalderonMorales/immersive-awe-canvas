import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { BackgroundConfig } from "@/types/scene";

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
      vec2 center = vec2(0.5);
      
      // Create immersive depth with enhanced atmospheric perspective
      float distance = length(uv - center);
      float depth = 1.0 - pow(distance * 1.6, 1.2);
      depth = smoothstep(0.0, 1.0, depth);
      
      // Multi-layered atmospheric noise for rich detail
      float atmosphere1 = fbm(uv * 6.0 + time * 0.08) * 0.15;
      float atmosphere2 = fbm(uv * 12.0 + time * 0.05) * 0.08;
      float atmosphere3 = fbm(uv * 24.0 + time * 0.03) * 0.04;
      float totalAtmosphere = atmosphere1 + atmosphere2 + atmosphere3;
      
      // Dynamic gradient with swirling motion
      float swirl = sin(atan(uv.y - center.y, uv.x - center.x) * 2.0 + time * 0.2) * 0.05;
      float gradient = uv.y + sin(uv.x * 8.0 + time * 0.5) * 0.04 + totalAtmosphere + swirl;
      gradient = smoothstep(0.1, 0.9, gradient);
      
      // Enhanced color mixing with energy layers
      vec3 baseColor = mix(colorBottom, colorTop, gradient);
      
      // Add dynamic atmospheric effects
      vec3 atmosphericGlow = mix(colorBottom, colorTop, 0.5);
      vec3 energyLayer = atmosphericGlow * 0.3 * (1.0 - depth);
      vec3 depthGlow = atmosphericGlow * 0.2 * depth * sin(time * 0.3 + distance * 10.0);
      
      // Combine all layers
      vec3 color = baseColor + energyLayer + depthGlow;
      
      // Add subtle color shifting over time
      color.r += sin(time * 0.2 + uv.x * 3.0) * 0.02;
      color.g += cos(time * 0.25 + uv.y * 4.0) * 0.02;
      color.b += sin(time * 0.3 + distance * 8.0) * 0.02;
      
      // Enhanced depth fade for immersion
      color *= 0.7 + depth * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

    const uniforms = {
        colorTop: { value: new THREE.Color(config.colorTop || "#667eea") },
        colorBottom: {
            value: new THREE.Color(config.colorBottom || "#764ba2"),
        },
        time: { value: 0 },
    };

    useFrame(state => {
        if (materialRef.current && (config.speed || (config as any).speed)) {
            materialRef.current.uniforms.time.value =
                state.clock.getElapsedTime() *
                (config.speed || (config as any).speed || 0.3);
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
