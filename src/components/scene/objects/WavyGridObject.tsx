
import { useRef } from 'react';
import { MeshDistortMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

interface WavyGridObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
  isGrabMode: boolean; // unused but for API consistency
}

const WavyGridObject = ({ color, materialConfig, isLocked }: WavyGridObjectProps) => {
  const materialRef = useRef<any>(null!);

  useFrame((state) => {
    if (!isLocked && materialRef.current) {
      const time = state.clock.getElapsedTime();
      materialRef.current.distort = MathUtils.lerp(
        materialRef.current.distort,
        Math.sin(time * 0.5) * 0.2 + 0.3,
        0.02
      );
      materialRef.current.speed = MathUtils.lerp(
        materialRef.current.speed,
        1 + Math.sin(time * 0.3) * 2,
        0.02
      )
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} scale={2}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <MeshDistortMaterial
        // @ts-ignore
        ref={materialRef}
        color={color}
        speed={2}
        distort={0.5}
        {...materialConfig}
      />
    </mesh>
  );
};

export default WavyGridObject;
