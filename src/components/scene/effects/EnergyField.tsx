
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, DoubleSide } from 'three';

interface EnergyFieldProps {
  theme: 'day' | 'night';
}

const EnergyField = ({ theme }: EnergyFieldProps) => {
  const materialRef = useRef<ShaderMaterial>(null!);
  const timeRef = useRef(0);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      
      // Add gentle wave distortion
      pos.y += sin(pos.x * 0.5 + time * 0.8) * 0.1;
      pos.y += cos(pos.z * 0.3 + time * 0.6) * 0.08;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    uniform vec3 dayColor;
    uniform vec3 nightColor;
    uniform bool isDay;
    
    void main() {
      vec2 uv = vUv;
      
      // Create flowing energy patterns
      float wave1 = sin(uv.x * 8.0 + time * 1.2) * 0.5 + 0.5;
      float wave2 = cos(uv.y * 6.0 + time * 0.8) * 0.5 + 0.5;
      float wave3 = sin((uv.x + uv.y) * 4.0 + time * 1.5) * 0.5 + 0.5;
      
      float pattern = (wave1 + wave2 + wave3) / 3.0;
      
      // Distance from center for radial fade
      float dist = distance(uv, vec2(0.5));
      float fade = 1.0 - smoothstep(0.0, 0.8, dist);
      
      // Choose color based on theme
      vec3 color = isDay ? dayColor : nightColor;
      
      float alpha = pattern * fade * 0.15;
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame((state) => {
    if (!materialRef.current) return;
    
    timeRef.current = state.clock.getElapsedTime();
    materialRef.current.uniforms.time.value = timeRef.current;
  });

  return (
    <mesh position={[0, 0, 0]} scale={[15, 15, 15]}>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          dayColor: { value: [0.3, 0.7, 1.0] },
          nightColor: { value: [0.8, 0.3, 1.0] },
          isDay: { value: theme === 'day' }
        }}
        transparent
        side={DoubleSide}
      />
    </mesh>
  );
};

export default EnergyField;
