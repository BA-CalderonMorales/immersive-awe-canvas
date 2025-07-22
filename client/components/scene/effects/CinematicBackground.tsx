import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RenderLayers } from "@/lib/shaderUtils";
import type { BackgroundConfig } from "@/types/scene";

interface CinematicBackgroundProps {
    config: BackgroundConfig;
}

const CinematicBackground = ({ config }: CinematicBackgroundProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const particleSystemRef = useRef<THREE.Points>(null!);

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vElevation = sin(uv.y * 3.14159) * 0.5 + 0.5;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    precision mediump float;
    
    uniform float time;
    uniform float speed;
    uniform float complexity;
    uniform float brightness;
    uniform vec3 colorPrimary;
    uniform vec3 colorSecondary;
    uniform vec3 colorAccent;
    
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying float vElevation;
    
    // Enhanced noise functions for cinematic quality
    float hash(float n) {
      return fract(sin(n) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      
      float res = mix(
        mix(hash(ip.x+ip.y*57.0), hash(ip.x+1.0+ip.y*57.0), u.x),
        mix(hash(ip.x+ip.y*57.0+57.0), hash(ip.x+1.0+(ip.y+1.0)*57.0), u.x), 
        u.y
      );
      return res*res;
    }
    
    // Fractal noise for complexity
    float fbm(vec2 p) {
      float f = 0.0;
      f += 0.5000 * noise(p); p *= 2.02;
      f += 0.2500 * noise(p); p *= 2.03;
      f += 0.1250 * noise(p); p *= 2.01;
      f += 0.0625 * noise(p);
      return f / 0.9375;
    }
    
    // HSV to RGB for dynamic color mixing
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    // Cinematic atmosphere with depth
    vec3 createAtmosphere(vec2 uv, float time) {
      vec2 p = uv * complexity + vec2(time * speed * 0.1);
      
      // Multiple layered noise for depth
      float n1 = fbm(p * 1.0);
      float n2 = fbm(p * 2.5 + vec2(time * 0.05));
      float n3 = fbm(p * 0.5 + vec2(time * 0.02));
      
      // Combine noise layers with dynamic weights
      float combined = n1 * 0.6 + n2 * 0.3 + n3 * 0.1;
      
      // Create flowing energy patterns
      float flow = sin(uv.x * 3.0 + time * 0.3) * cos(uv.y * 2.0 + time * 0.2);
      combined += flow * 0.2;
      
      // Dynamic color mixing based on noise patterns
      float hue = combined * 0.3 + time * 0.05;
      float saturation = 0.7 + combined * 0.3;
      float value = brightness * (0.3 + combined * 0.7);
      
      vec3 baseColor = hsv2rgb(vec3(hue, saturation, value));
      
      // Blend with configured colors
      vec3 color1 = mix(colorPrimary, baseColor, 0.6);
      vec3 color2 = mix(colorSecondary, baseColor, 0.4);
      vec3 color3 = mix(colorAccent, baseColor, 0.8);
      
      // Create depth-based color mixing
      float depthMix = smoothstep(0.2, 0.8, vElevation);
      vec3 finalColor = mix(color1, color2, depthMix);
      finalColor = mix(finalColor, color3, combined * 0.3);
      
      return finalColor;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create cinematic wide-screen effect
      float aspect = 2.0; // Wide cinematic aspect
      uv.x *= aspect;
      
      // Generate atmospheric background
      vec3 atmosphere = createAtmosphere(uv, time);
      
      // Add energetic particle-like effects
      vec2 particleUv = uv * 20.0;
      float particles = 0.0;
      for (int i = 0; i < 8; i++) {
        float fi = float(i);
        vec2 offset = vec2(sin(time * 0.1 + fi), cos(time * 0.15 + fi)) * 2.0;
        float dist = length(fract(particleUv + offset) - 0.5);
        particles += 1.0 / (dist * 50.0 + 1.0);
      }
      
      // Add glowing edge effects
      float edgeGlow = 1.0 - smoothstep(0.0, 0.3, min(uv.y, 1.0 - uv.y));
      atmosphere += colorAccent * edgeGlow * 0.5;
      
      // Add particle sparkles
      atmosphere += colorAccent * particles * 0.3;
      
      // Final atmospheric enhancement
      float centerGlow = 1.0 - length(uv - vec2(aspect * 0.5, 0.5)) * 0.8;
      atmosphere *= (0.7 + centerGlow * 0.3);
      
      gl_FragColor = vec4(atmosphere, 1.0);
    }
  `;

    const uniforms = useMemo(
        () => ({
            time: { value: 0 },
            speed: { value: config.speed || 1.0 },
            complexity: { value: config.complexity || 3.0 },
            brightness: { value: config.brightness || 1.2 },
            colorPrimary: { 
                value: new THREE.Color(config.colorPrimary || "#4a90ff") 
            },
            colorSecondary: { 
                value: new THREE.Color(config.colorSecondary || "#ff6b6b") 
            },
            colorAccent: { 
                value: new THREE.Color(config.colorAccent || "#ffd93d") 
            },
        }),
        [config]
    );

    // Create particle system for additional effects
    const particleGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const particleCount = 2000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Spread particles across a large area
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 1000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;

            // Random colors
            const color = new THREE.Color().setHSL(
                Math.random() * 0.3 + 0.6, // Blue-purple-pink range
                0.5 + Math.random() * 0.5,
                0.5 + Math.random() * 0.5
            );
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 4 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        return geometry;
    }, []);

    const particleMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pointTexture: { value: null }
            },
            vertexShader: `
                attribute float size;
                uniform float time;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Animate particles
                    mvPosition.x += sin(time * 0.5 + position.y * 0.01) * 20.0;
                    mvPosition.y += cos(time * 0.3 + position.x * 0.01) * 10.0;
                    
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                    if (distanceToCenter > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (uniforms.time) {
            uniforms.time.value = time;
        }
        if (particleMaterial.uniforms.time) {
            particleMaterial.uniforms.time.value = time;
        }

        // Rotate the background slowly for dynamic effect
        if (meshRef.current) {
            meshRef.current.rotation.z = time * 0.02;
        }

        // Animate particle system
        if (particleSystemRef.current) {
            particleSystemRef.current.rotation.y = time * 0.05;
        }
    });

    return (
        <group renderOrder={RenderLayers.BACKGROUND_FAR}>
            {/* Main atmospheric background */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[500, 64, 32]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    side={THREE.BackSide}
                    transparent
                />
            </mesh>
            
            {/* Particle system for added sparkle */}
            <points
                ref={particleSystemRef}
                geometry={particleGeometry}
                material={particleMaterial}
            />
        </group>
    );
};

export default CinematicBackground;