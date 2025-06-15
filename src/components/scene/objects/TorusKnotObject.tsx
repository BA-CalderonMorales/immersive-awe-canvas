
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
      // More responsive mouse following
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      ref.current.lookAt(x, y, 1);

      // Gentle constant rotation
      ref.current.rotation.z += delta * 0.1;

      // Add a subtle pulse
      const pulse = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05 + 1;
      ref.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <TorusKnot ref={ref} args={[1, 0.4, 256, 32]}>
      <meshStandardMaterial color={color} {...materialConfig} />
    </TorusKnot>
  );
};
export default TorusKnotObject;
