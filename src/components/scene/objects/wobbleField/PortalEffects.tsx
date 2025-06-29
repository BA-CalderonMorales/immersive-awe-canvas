
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
      {/* Enlightenment Rings - representing expanding awareness */}
      {[...Array(3)].map((_, i) => (
        <mesh 
          key={`enlightenment-ring-${i}`}
          position={[
            Math.cos(i * Math.PI / 1.5 + timeRef.current * 0.02) * 5, // Very slow orbital motion
            Math.sin(timeRef.current * 0.08 + i * 2) * 0.8, // Gentle floating
            Math.sin(i * Math.PI / 1.5 + timeRef.current * 0.02) * 5
          ]}
          rotation={[
            Math.PI / 4 + Math.sin(timeRef.current * 0.1 + i) * 0.1, 
            timeRef.current * 0.3 + i * (Math.PI * 2 / 3), 
            Math.PI / 6
          ]}
          scale={0.8 + Math.sin(timeRef.current * 1.0 + i) * 0.15} // Subtle breathing scale
        >
          <ringGeometry args={[1.5, 2.2, 20]} />
          <DynamicMaterial 
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.12 + Math.sin(timeRef.current * 0.4 + i) * 0.03, // Very subtle presence
              emissiveIntensity: 0.08
            }} 
            color={`hsl(${(i * 120 + timeRef.current * 8) % 360}, 50%, 65%)`} // Wisdom colors
          />
        </mesh>
      ))}

      {/* Contemplation Spheres - representing deep states of meditation */}
      {[...Array(5)].map((_, i) => {
        const orbitRadius = 6 + i * 0.8;
        const orbitSpeed = 0.01 + i * 0.002;
        return (
          <mesh
            key={`contemplation-sphere-${i}`}
            position={[
              Math.cos(timeRef.current * orbitSpeed + i * (Math.PI * 2 / 5)) * orbitRadius,
              Math.sin(timeRef.current * 0.05 + i) * 2,
              Math.sin(timeRef.current * orbitSpeed + i * (Math.PI * 2 / 5)) * orbitRadius
            ]}
            scale={0.3 + Math.sin(timeRef.current * 0.6 + i) * 0.1}
          >
            <sphereGeometry args={[0.4, 12, 8]} />
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.2 + Math.sin(timeRef.current * 0.5 + i) * 0.05,
                emissiveIntensity: 0.1,
                wireframe: i % 2 === 0 // Alternating solid and wireframe
              }}
              color={`hsl(${(i * 72 + timeRef.current * 12) % 360}, 35%, 50%)`}
            />
          </mesh>
        );
      })}

      {/* Wisdom Fragments - floating pieces of understanding */}
      {[...Array(12)].map((_, i) => {
        const fragmentRadius = 4 + Math.sin(i * 0.5) * 2;
        const fragmentHeight = Math.sin(i * 0.7) * 3;
        return (
          <mesh
            key={`wisdom-fragment-${i}`}
            position={[
              Math.cos(i * (Math.PI * 2 / 12) + timeRef.current * 0.04) * fragmentRadius,
              fragmentHeight + Math.sin(timeRef.current * 0.3 + i) * 0.6,
              Math.sin(i * (Math.PI * 2 / 12) + timeRef.current * 0.04) * fragmentRadius
            ]}
            rotation={[
              timeRef.current * 0.15 + i * 0.2,
              timeRef.current * 0.1 + i * 0.3,
              timeRef.current * 0.2 + i * 0.1
            ]}
            scale={0.2 + Math.sin(timeRef.current * 0.8 + i) * 0.05}
          >
            <tetrahedronGeometry args={[0.3, 0]} />
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.15 + Math.sin(timeRef.current * 0.7 + i) * 0.05,
                emissiveIntensity: 0.05,
                wireframe: false
              }}
              color={`hsl(${(i * 30 + timeRef.current * 20) % 360}, 30%, 45%)`}
            />
          </mesh>
        );
      })}
    </>
  );
};

export default PortalEffects;
