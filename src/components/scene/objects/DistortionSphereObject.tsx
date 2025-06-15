
import { useRef } from 'react';
import { MeshDistortMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';

interface DistortionSphereObjectProps {
  color: string;
  materialConfig: MaterialConfig;
}

const DistortionSphereObject = ({ color, materialConfig }: DistortionSphereObjectProps) => {
  const materialRef = useRef<any>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      // Base distortion on distance from center
      const distortValue = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.4;
      // Add a time-based wave for continuous motion
      const timeDistort = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;

      materialRef.current.distort = MathUtils.lerp(materialRef.current.distort, 0.2 + distortValue + timeDistort, 0.05);

      const speedValue = Math.abs(mouse.y) * 3 + 1;
      materialRef.current.speed = MathUtils.lerp(materialRef.current.speed, speedValue, 0.05);
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshDistortMaterial
        // @ts-ignore
        ref={materialRef}
        color={color}
        speed={2}
        distort={0.6}
        {...materialConfig}
      />
    </mesh>
  );
};
export default DistortionSphereObject;
