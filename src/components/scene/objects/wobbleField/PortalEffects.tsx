
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
      {/* Contemplative Awareness Rings */}
      {[...Array(3)].map((_, i) => ( // Reduced from 6 to 3
        <mesh 
          key={`awareness-ring-${i}`}
          position={[
            Math.cos(i * Math.PI / 1.5) * 4, // More spaced out
            Math.sin(timeRef.current * 0.15 + i) * 1, // Gentler movement
            Math.sin(i * Math.PI / 1.5) * 4
          ]}
          rotation={[0, timeRef.current * 0.5 + i, Math.PI / 2]} // Slower rotation
          scale={1 + Math.sin(timeRef.current * 1.5 + i) * 0.2} // Gentler breathing
        >
          <ringGeometry args={[1.2, 1.8, 16]} />
          <DynamicMaterial 
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.15, // Very subtle
              emissiveIntensity: 0.1
            }} 
            color={`hsl(${(i * 120 + timeRef.current * 15) % 360}, 70%, 75%)`} // Softer, warmer colors
          />
        </mesh>
      ))}
    </>
  );
};

export default PortalEffects;
