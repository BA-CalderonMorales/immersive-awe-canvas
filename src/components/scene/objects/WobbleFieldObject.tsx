
import { useRef } from 'react';
import { MeshWobbleMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';

interface WobbleFieldObjectProps {
  color: string;
  materialConfig: MaterialConfig;
}

const WobbleFieldObject = ({ color, materialConfig }: WobbleFieldObjectProps) => {
  const materialRef = useRef<any>(null!);
  const { mouse } = useThree();

  useFrame(() => {
    if (materialRef.current) {
      // Wobble factor increases with distance from center
      const wobbleFactor = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.5 + 0.2;
      materialRef.current.factor = MathUtils.lerp(materialRef.current.factor, wobbleFactor, 0.1);
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshWobbleMaterial
        // @ts-ignore
        ref={materialRef}
        color={color}
        speed={1}
        factor={0.5}
        {...materialConfig}
      />
    </mesh>
  );
};

export default WobbleFieldObject;
