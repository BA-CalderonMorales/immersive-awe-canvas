
import { useMemo, useRef } from 'react';
import { TorusKnot } from '@react-three/drei';
import { SceneThemeConfig } from '@/types/scene';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import DynamicMaterial from '../materials/DynamicMaterial';

interface TorusKnotObjectProps {
  themeConfig: SceneThemeConfig;
  isLocked: boolean;
}

const TorusKnotObject = ({ themeConfig, isLocked }: TorusKnotObjectProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  const { mainObjectColor, material: materialConfig, torusKnot } = themeConfig;

  const args = useMemo(() => [
      torusKnot?.radius ?? 1,
      torusKnot?.tube ?? 0.4,
      torusKnot?.tubularSegments ?? 256,
      torusKnot?.radialSegments ?? 32,
      torusKnot?.p ?? 2,
      torusKnot?.q ?? 3,
  ] as [number, number, number, number, number, number], [torusKnot]);

  useFrame((state, delta) => {
    if (ref.current && !isLocked) {
      // Gentle constant rotation only
      ref.current.rotation.z += delta * 0.1;

      // Add a subtle pulse
      const pulse = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05 + 1;
      ref.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <TorusKnot ref={ref} args={args}>
      <DynamicMaterial materialConfig={materialConfig} color={mainObjectColor} />
    </TorusKnot>
  );
};
export default TorusKnotObject;
