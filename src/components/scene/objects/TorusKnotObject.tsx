
import { useMemo, useRef } from 'react';
import { TorusKnot } from '@react-three/drei';
import { SceneThemeConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface TorusKnotObjectProps {
  themeConfig: SceneThemeConfig;
}

const TorusKnotObject = ({ themeConfig }: TorusKnotObjectProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  const { viewport, mouse } = useThree();
  const { mainObjectColor: color, material: materialConfig, torusKnot } = themeConfig;

  const args = useMemo(() => [
      torusKnot?.radius ?? 1,
      torusKnot?.tube ?? 0.4,
      torusKnot?.tubularSegments ?? 256,
      torusKnot?.radialSegments ?? 32,
      torusKnot?.p ?? 2,
      torusKnot?.q ?? 3,
  ], [torusKnot]);

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
    <TorusKnot ref={ref} args={args}>
      <meshStandardMaterial color={color} {...materialConfig} />
    </TorusKnot>
  );
};
export default TorusKnotObject;

