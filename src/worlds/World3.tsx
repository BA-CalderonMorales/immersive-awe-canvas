
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const World3 = () => {
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = (Math.sin(clock.getElapsedTime() * 2) + 1.5) * 2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <hemisphereLight groundColor="black" intensity={0.5} />
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={2} color="#ff4500" />
      <Stars radius={200} depth={60} count={3000} factor={5} saturation={1} fade speed={1.5} />
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#ff4500"
          distort={0.8}
          speed={3}
          roughness={0}
        />
      </Sphere>
    </>
  );
};

export default World3;
