
import { TorusKnot } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';

interface TorusKnotObjectProps {
  color: string;
  materialConfig: MaterialConfig;
}

const TorusKnotObject = ({ color, materialConfig }: TorusKnotObjectProps) => {
  return (
    <TorusKnot args={[1, 0.4, 256, 32]}>
      <meshStandardMaterial color={color} {...materialConfig} />
    </TorusKnot>
  );
};
export default TorusKnotObject;
