
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
      {/* Contemplative Thought Streams */}
      {[...Array(6)].map((_, i) => { // Reduced from 12 to 6
        const angle = (i / 6) * Math.PI * 2;
        const radius = 3 + Math.sin(i * 0.5) * 1; // Smaller, gentler movement
        return (
          <mesh 
            key={`thought-stream-${i}`}
            position={[
              Math.cos(angle + timeRef.current * 0.1) * radius, // Much slower rotation
              Math.sin(timeRef.current * 0.2 + i) * 1.5, // Gentler vertical movement
              Math.sin(angle + timeRef.current * 0.1) * radius
            ]}
            rotation={[timeRef.current * 0.3 + i, timeRef.current * 0.2, 0]} // Slower rotation
            scale={[0.08, 1.5 + Math.sin(timeRef.current * 0.8 + i) * 0.3, 0.08]} // Gentler scaling
          >
            <cylinderGeometry args={[0.05, 0.02, 1, 6]} />
            <DynamicMaterial 
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.4, // More subtle
                emissiveIntensity: 0.2,
                wireframe: false // Solid for contemplation
              }} 
              color={`hsl(${(i * 60 + timeRef.current * 20) % 360}, 60%, 65%)`} // Softer colors
            />
          </mesh>
        );
      })}
    </>
  );
};

export default EnergyStreams;
