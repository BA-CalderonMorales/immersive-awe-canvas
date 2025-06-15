
import { MeshWobbleMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';

interface WobbleFieldObjectProps {
  color: string;
  materialConfig: MaterialConfig;
}

const WobbleFieldObject = ({ color, materialConfig }: WobbleFieldObjectProps) => {
  return (
    <mesh>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshWobbleMaterial
        color={color}
        speed={1}
        factor={0.5}
        {...materialConfig}
      />
    </mesh>
  );
};

export default WobbleFieldObject;
