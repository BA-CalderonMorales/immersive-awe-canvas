
import { useRef } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame } from '@react-three/fiber';
import DynamicMaterial from '../../materials/DynamicMaterial';

interface PortalEffectsProps {
  materialConfig: MaterialConfig;
}

const PortalEffects = ({ materialConfig }: PortalEffectsProps) => {
  const timeRef = useRef(0);

  useFrame((state) => {
    timeRef.current = state.clock.getElapsedTime();
  });

  return (
    <>
      {/* Dimensional Portal Effects */}
      {[...Array(6)].map((_, i) => (
        <mesh 
          key={`portal-${i}`}
          position={[
            Math.cos(i * Math.PI / 3) * 6,
            Math.sin(timeRef.current * 0.4 + i) * 2,
            Math.sin(i * Math.PI / 3) * 6
          ]}
          rotation={[0, timeRef.current * 2 + i, Math.PI / 2]}
          scale={1 + Math.sin(timeRef.current * 4 + i) * 0.5}
        >
          <ringGeometry args={[1, 1.5, 16]} />
          <DynamicMaterial 
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.3,
              emissiveIntensity: 0.6
            }} 
            color={`hsl(${(i * 60 + timeRef.current * 30) % 360}, 90%, 70%)`} 
          />
        </mesh>
      ))}
    </>
  );
};

export default PortalEffects;
