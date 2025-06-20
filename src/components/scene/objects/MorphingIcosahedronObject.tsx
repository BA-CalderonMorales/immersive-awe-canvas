
import { useRef } from 'react';
import { MeshDistortMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

interface MorphingIcosahedronObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
  isGrabMode: boolean; // unused but for API consistency
}

const MorphingIcosahedronObject = ({ color, materialConfig, isLocked }: MorphingIcosahedronObjectProps) => {
  const materialRef = useRef<any>(null!);
  const meshRef = useRef<any>(null!);

  useFrame((state) => {
    if (!isLocked) {
      if (materialRef.current) {
        materialRef.current.distort = MathUtils.lerp(
          materialRef.current.distort,
          Math.sin(state.clock.getElapsedTime() * 0.5) * 0.25 + 0.25,
          0.02
        );
      }
      if (meshRef.current) {
          meshRef.current.rotation.x += 0.001;
          meshRef.current.rotation.y += 0.002;
      }
    }
  });

  return (
    <mesh ref={meshRef} scale={1.2}>
      <icosahedronGeometry args={[1.5, 0]} />
      <MeshDistortMaterial
        // @ts-ignore
        ref={materialRef}
        color={color}
        speed={1}
        distort={0.5}
        {...materialConfig}
      />
    </mesh>
  );
};
export default MorphingIcosahedronObject;
