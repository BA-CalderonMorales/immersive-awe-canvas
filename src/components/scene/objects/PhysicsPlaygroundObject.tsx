import { Physics, useBox, usePlane } from '@react-three/cannon';
import { MeshWobbleMaterial } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import { Vector3, Plane as ThreePlane } from 'three';

interface PhysicsPlaygroundObjectProps {
  isGrabMode: boolean;
}

const Jelly = ({ position, isGrabMode }: { position: [number, number, number]; isGrabMode: boolean }) => {
  const [ref, api] = useBox(() => ({ mass: 1, position }));
  const plane = useMemo(() => new ThreePlane(new Vector3(0, 1, 0), 0), []);
  const intersection = useMemo(() => new Vector3(), []);
  const offset = useRef(new Vector3());
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: any) => {
    if (!isGrabMode) return;
    e.stopPropagation();
    e.ray.intersectPlane(plane, intersection);
    offset.current.copy(intersection).sub(ref.current.position);
    setDragging(true);
  };

  const onPointerUp = () => {
    setDragging(false);
  };

  const onPointerMove = (e: any) => {
    if (!dragging) return;
    e.ray.intersectPlane(plane, intersection);
    api.position.set(
      intersection.x - offset.current.x,
      ref.current.position.y,
      intersection.z - offset.current.z
    );
    api.velocity.set(0, 0, 0);
  };

  return (
    <mesh
      ref={ref}
      castShadow
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <boxGeometry args={[1, 1, 1]} />
      <MeshWobbleMaterial color="#ff69b4" speed={2} factor={0.6} />
    </mesh>
  );
};

const Floor = () => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0] }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  );
};

const PhysicsPlaygroundObject = ({ isGrabMode }: PhysicsPlaygroundObjectProps) => {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <Floor />
      {Array.from({ length: 5 }).map((_, i) => (
        <Jelly key={i} position={[i - 2, 2 + i * 0.5, 0]} isGrabMode={isGrabMode} />
      ))}
    </Physics>
  );
};

export default PhysicsPlaygroundObject;
