
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
      {/* Chaotic Energy Streams */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 4 + Math.sin(i) * 2;
        return (
          <mesh 
            key={`energy-stream-${i}`}
            position={[
              Math.cos(angle + timeRef.current * 0.5) * radius,
              Math.sin(timeRef.current * 0.8 + i) * 3,
              Math.sin(angle + timeRef.current * 0.5) * radius
            ]}
            rotation={[timeRef.current * 2 + i, timeRef.current * 1.5, 0]}
            scale={[0.1, 2 + Math.sin(timeRef.current * 3 + i), 0.1]}
          >
            <cylinderGeometry args={[0.1, 0.05, 1, 6]} />
            <DynamicMaterial 
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.7,
                emissiveIntensity: 0.8,
                wireframe: true
              }} 
              color={`hsl(${(i * 30 + timeRef.current * 50) % 360}, 80%, 60%)`} 
            />
          </mesh>
        );
      })}
    </>
  );
};

export default EnergyStreams;
