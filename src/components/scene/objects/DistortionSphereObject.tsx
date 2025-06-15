
import { MeshDistortMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';

interface DistortionSphereObjectProps {
  color: string;
  materialConfig: MaterialConfig;
}

const DistortionSphereObject = ({ color, materialConfig }: DistortionSphereObjectProps) => {
  return (
    <mesh>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={0.6}
        {...materialConfig}
      />
    </mesh>
  );
};
export default DistortionSphereObject;
