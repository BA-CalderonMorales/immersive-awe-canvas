import { Physics, usePlane, useBox, useSphere } from '@react-three/cannon';
import { MeshWobbleMaterial } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

interface PhysicsPlaygroundObjectProps {
  isGrabMode: boolean;
  onToggleGrabMode?: () => void;
}

const DraggableJelly = ({ position, color, isGrabMode }: { position: [number, number, number]; color: string; isGrabMode: boolean; }) => {
  const [ref, api] = useSphere(() => ({ mass: 1, position }));
  const { size, camera } = useThree();
  const dragging = useRef(false);

  const handlePointerDown = (e: any) => {
    if (!isGrabMode) return;
    e.stopPropagation();
    dragging.current = true;
    api.mass.set(0); // hold in place
    api.velocity.set(0, 0, 0);
  };

  const handlePointerMove = (e: any) => {
    if (!dragging.current) return;
    const x = (e.clientX / size.width) * 2 - 1;
    const y = -(e.clientY / size.height) * 2 + 1;
    const vec = new Vector3(x, y, 0.5).unproject(camera);
    api.position.copy(vec);
  };

  const handlePointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    api.mass.set(1);
  };

  return (
    <mesh
      ref={ref as any}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      castShadow
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <MeshWobbleMaterial color={color} speed={2} factor={0.6} />
    </mesh>
  );
};

const PhysicsPlaygroundObject = ({ isGrabMode }: PhysicsPlaygroundObjectProps) => {
  const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24'];

  return (
    <Physics gravity={[0, -9.8, 0]}>
      <mesh ref={planeRef as any} receiveShadow position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {colors.map((c, i) => (
        <DraggableJelly key={i} position={[i - 1.5, 2 + i, 0]} color={c} isGrabMode={isGrabMode} />
      ))}
    </Physics>
  );
};

export default PhysicsPlaygroundObject;
