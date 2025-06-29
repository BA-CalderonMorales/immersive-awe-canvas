
import { useRef } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame } from '@react-three/fiber';
import DynamicMaterial from '../../materials/DynamicMaterial';

interface EnergyStreamsProps {
  materialConfig: MaterialConfig;
}

const EnergyStreams = ({ materialConfig }: EnergyStreamsProps) => {
  const timeRef = useRef(0);

  useFrame((state) => {
    timeRef.current = state.clock.getElapsedTime();
  });

  return (
    <>
      {/* Streams of Consciousness - flowing energy ribbons */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 3 + Math.sin(i * 0.5) * 0.5;
        return (
          <mesh 
            key={`consciousness-stream-${i}`}
            position={[
              Math.cos(angle + timeRef.current * 0.03) * radius,
              Math.sin(timeRef.current * 0.1 + i * 1.2) * 1.5,
              Math.sin(angle + timeRef.current * 0.03) * radius
            ]}
            rotation={[
              timeRef.current * 0.15 + i * 0.5, 
              timeRef.current * 0.1, 
              timeRef.current * 0.08 + i * 0.3
            ]}
            scale={[0.05, 1.8 + Math.sin(timeRef.current * 0.5 + i) * 0.3, 0.05]}
          >
            <cylinderGeometry args={[0.02, 0.01, 1, 8]} />
            <DynamicMaterial 
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.4 + Math.sin(timeRef.current * 0.4 + i) * 0.1,
                emissiveIntensity: 0.2,
                wireframe: false
              }} 
              color={`hsl(${(i * 60 + timeRef.current * 8) % 360}, 60%, 70%)`}
            />
          </mesh>
        );
      })}

      {/* Interconnected Thought Nodes */}
      {[...Array(12)].map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * i;
        const radius = 4;
        return (
          <mesh
            key={`thought-node-${i}`}
            position={[
              radius * Math.sin(phi) * Math.cos(theta + timeRef.current * 0.02),
              radius * Math.cos(phi) + Math.sin(timeRef.current * 0.15 + i) * 0.4,
              radius * Math.sin(phi) * Math.sin(theta + timeRef.current * 0.02)
            ]}
            rotation={[
              timeRef.current * 0.08 + i * 0.2,
              timeRef.current * 0.06 + i * 0.3,
              timeRef.current * 0.1 + i * 0.15
            ]}
            scale={0.3 + Math.sin(timeRef.current * 0.6 + i) * 0.08}
          >
            <octahedronGeometry args={[0.12, 0]} />
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.3 + Math.sin(timeRef.current * 0.7 + i) * 0.1,
                emissiveIntensity: 0.15,
                wireframe: true
              }}
              color={`hsl(${(i * 30 + timeRef.current * 12) % 360}, 50%, 65%)`}
            />
          </mesh>
        );
      })}
    </>
  );
};

export default EnergyStreams;
