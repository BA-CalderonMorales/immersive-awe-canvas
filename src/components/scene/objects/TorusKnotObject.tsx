
import { useRef } from 'react';
import { TorusKnot } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface TorusKnotObjectProps {
  color: string;
  materialConfig: MaterialConfig;
}

const TorusKnotObject = ({ color, materialConfig }: TorusKnotObjectProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  const { viewport, mouse } = useThree();

  useFrame((state, delta) => {
    if (ref.current) {
      const x = (mouse.x * viewport.width) / 2.5;
      const y = (mouse.y * viewport.height) / 2.5;

      // Rotate towards mouse
      const targetRotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(y * 0.1, x * 0.1, 0, 'XYZ')
      );
      ref.current.quaternion.slerp(targetRotation, 0.05);
      
      // Gentle constant rotation
      ref.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <TorusKnot ref={ref} args={[1, 0.4, 256, 32]}>
      <meshStandardMaterial color={color} {...materialConfig} />
    </TorusKnot>
  );
};
export default TorusKnotObject;
