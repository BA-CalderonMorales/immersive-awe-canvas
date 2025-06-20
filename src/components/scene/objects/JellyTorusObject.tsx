import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshPhysicalMaterial } from 'three';

interface JellyTorusObjectProps {
  count?: number;
  isLocked: boolean;
}

interface JellyTorus {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
}

const JellyTorusObject = ({ count = 3, isLocked }: JellyTorusObjectProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { size, camera } = useThree();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const torusList = useMemo<JellyTorus[]>(() => {
    const list: JellyTorus[] = [];
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.TorusGeometry(0.5, 0.2, 32, 64);
      const material = new MeshPhysicalMaterial({
        color: '#ff8cf7',
        transparent: true,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((i - count / 2) * 1.5, 0, 0);
      list.push({ mesh, velocity: new THREE.Vector3() });
    }
    return list;
  }, [count]);

  useFrame((_, delta) => {
    if (isLocked) return;
    const limit = 3;
    torusList.forEach((torus, idx) => {
      if (dragIndex === idx) return;
      torus.mesh.position.addScaledVector(torus.velocity, delta);
      (['x', 'y'] as const).forEach((axis) => {
        if (torus.mesh.position[axis] > limit) {
          torus.mesh.position[axis] = limit;
          torus.velocity[axis] *= -0.8;
        } else if (torus.mesh.position[axis] < -limit) {
          torus.mesh.position[axis] = -limit;
          torus.velocity[axis] *= -0.8;
        }
      });
      torus.velocity.multiplyScalar(0.99);
      const s = THREE.MathUtils.lerp(torus.mesh.scale.x, 1, 0.1);
      torus.mesh.scale.setScalar(s);
    });
    for (let i = 0; i < torusList.length; i++) {
      for (let j = i + 1; j < torusList.length; j++) {
        const a = torusList[i];
        const b = torusList[j];
        const dist = a.mesh.position.distanceTo(b.mesh.position);
        if (dist < 1) {
          const dir = b.mesh.position.clone().sub(a.mesh.position).normalize();
          const force = 1 - dist;
          a.velocity.addScaledVector(dir.clone().negate(), force * 2);
          b.velocity.addScaledVector(dir, force * 2);
          a.mesh.scale.setScalar(1.2);
          b.mesh.scale.setScalar(1.2);
        }
      }
    }
  });

  const getPointerPosition = (event: any) => {
    const x = (event.clientX / size.width) * 2 - 1;
    const y = -(event.clientY / size.height) * 2 + 1;
    const vec = new THREE.Vector3(x, y, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    return camera.position.clone().add(dir.multiplyScalar(distance));
  };

  return (
    <group ref={groupRef}>
      {torusList.map((torus, idx) => (
        <primitive
          key={idx}
          object={torus.mesh}
          onPointerDown={(e) => {
            e.stopPropagation();
            setDragIndex(idx);
          }}
          onPointerUp={() => setDragIndex(null)}
          onPointerMove={(e) => {
            if (dragIndex === idx) {
              e.stopPropagation();
              const pos = getPointerPosition(e);
              torus.mesh.position.copy(pos);
              torus.velocity.set(0, 0, 0);
            }
          }}
        />
      ))}
    </group>
  );
};

export default JellyTorusObject;
