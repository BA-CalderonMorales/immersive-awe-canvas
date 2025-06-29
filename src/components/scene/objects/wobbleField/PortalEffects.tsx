
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
      {/* Enlightenment Rings - expanding awareness circles */}
      {[...Array(4)].map((_, i) => (
        <mesh 
          key={`enlightenment-ring-${i}`}
          position={[
            Math.cos(i * Math.PI / 2 + timeRef.current * 0.015) * (6 + i * 0.5),
            Math.sin(timeRef.current * 0.06 + i * 1.5) * 0.6,
            Math.sin(i * Math.PI / 2 + timeRef.current * 0.015) * (6 + i * 0.5)
          ]}
          rotation={[
            Math.PI / 4 + Math.sin(timeRef.current * 0.08 + i) * 0.1,
            timeRef.current * 0.2 + i * (Math.PI / 2),
            Math.PI / 8
          ]}
          scale={0.9 + Math.sin(timeRef.current * 0.8 + i) * 0.1}
        >
          <ringGeometry args={[1.2, 1.8, 16]} />
          <DynamicMaterial 
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.15 + Math.sin(timeRef.current * 0.3 + i) * 0.05,
              emissiveIntensity: 0.1
            }} 
            color={`hsl(${(i * 90 + timeRef.current * 6) % 360}, 60%, 70%)`}
          />
        </mesh>
      ))}

      {/* Contemplation Orbs - floating meditation spheres */}
      {[...Array(8)].map((_, i) => {
        const orbitRadius = 5 + i * 0.4;
        const orbitSpeed = 0.008 + i * 0.001;
        return (
          <mesh
            key={`contemplation-orb-${i}`}
            position={[
              Math.cos(timeRef.current * orbitSpeed + i * (Math.PI * 2 / 8)) * orbitRadius,
              Math.sin(timeRef.current * 0.04 + i) * 1.5,
              Math.sin(timeRef.current * orbitSpeed + i * (Math.PI * 2 / 8)) * orbitRadius
            ]}
            scale={0.25 + Math.sin(timeRef.current * 0.5 + i) * 0.08}
          >
            <sphereGeometry args={[0.3, 8, 6]} />
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.25 + Math.sin(timeRef.current * 0.4 + i) * 0.08,
                emissiveIntensity: 0.12,
                wireframe: i % 3 === 0
              }}
              color={`hsl(${(i * 45 + timeRef.current * 10) % 360}, 45%, 60%)`}
            />
          </mesh>
        );
      })}

      {/* Wisdom Crystals - geometric understanding forms */}
      {[...Array(6)].map((_, i) => {
        const crystalRadius = 4.5 + Math.sin(i * 0.8) * 1.5;
        const crystalHeight = Math.sin(i * 1.2) * 2;
        return (
          <mesh
            key={`wisdom-crystal-${i}`}
            position={[
              Math.cos(i * (Math.PI * 2 / 6) + timeRef.current * 0.03) * crystalRadius,
              crystalHeight + Math.sin(timeRef.current * 0.25 + i) * 0.5,
              Math.sin(i * (Math.PI * 2 / 6) + timeRef.current * 0.03) * crystalRadius
            ]}
            rotation={[
              timeRef.current * 0.12 + i * 0.3,
              timeRef.current * 0.08 + i * 0.4,
              timeRef.current * 0.15 + i * 0.2
            ]}
            scale={0.18 + Math.sin(timeRef.current * 0.6 + i) * 0.04}
          >
            <tetrahedronGeometry args={[0.25, 0]} />
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.2 + Math.sin(timeRef.current * 0.6 + i) * 0.08,
                emissiveIntensity: 0.08,
                wireframe: false
              }}
              color={`hsl(${(i * 60 + timeRef.current * 15) % 360}, 40%, 55%)`}
            />
          </mesh>
        );
      })}
    </>
  );
};

export default PortalEffects;
