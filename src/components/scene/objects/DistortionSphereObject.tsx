
import { useRef } from 'react';
import { MeshDistortMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Mesh } from 'three';

interface DistortionSphereObjectProps {
  color: string;
  materialConfig: MaterialConfig;
}

const DistortionSphereObject = ({ color, materialConfig }: DistortionSphereObjectProps) => {
  const materialRef = useRef<any>(null!);
  const vortexRef = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Time-based wave for continuous motion only
      const timeDistort = Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
      materialRef.current.distort = MathUtils.lerp(materialRef.current.distort, 0.4 + timeDistort, 0.05);

      // Constant speed for the material
      materialRef.current.speed = MathUtils.lerp(materialRef.current.speed, 3, 0.05);
    }
    if (vortexRef.current) {
      vortexRef.current.rotation.x += delta * 0.3;
      vortexRef.current.rotation.y += delta * 0.5;
      vortexRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          // @ts-ignore
          ref={materialRef}
          color={color}
          speed={3}
          distort={0.8}
          {...materialConfig}
        />
      </mesh>
      <mesh ref={vortexRef} scale={1.2}>
        <torusGeometry args={[1.8, 0.1, 16, 100]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.5}
          wireframe
        />
      </mesh>
    </>
  );
};
export default DistortionSphereObject;
