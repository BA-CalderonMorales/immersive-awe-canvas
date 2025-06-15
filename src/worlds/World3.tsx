
import { Sphere, MeshDistortMaterial, Stars, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useExperience } from '@/hooks/useExperience';

const World3 = () => {
  const { theme } = useExperience();
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      if (theme === 'night') {
        lightRef.current.intensity = (Math.sin(clock.getElapsedTime() * 2) + 1.5) * 2;
      } else {
        lightRef.current.intensity = 0; // No point light in day
      }
    }
  });

  return (
    <>
      {theme === 'day' ? (
          <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[0, 10, 5]} intensity={2} color="white" />
            <Sparkles count={200} scale={5} size={3} speed={0.4} color="#ffd700" />
          </>
      ) : (
          <>
            <ambientLight intensity={0.1} />
            <hemisphereLight groundColor="black" intensity={0.5} />
            <pointLight ref={lightRef} position={[0, 0, 0]} intensity={2} color="#ff4500" />
            <Stars radius={200} depth={60} count={3000} factor={5} saturation={1} fade speed={1.5} />
          </>
      )}
      
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color={theme === 'day' ? '#ffff00' : '#ff4500'}
          distort={0.8}
          speed={3}
          roughness={0}
        />
      </Sphere>
    </>
  );
};

export default World3;
