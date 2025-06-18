
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3, Color } from 'three';

interface VoidBackgroundProps {
  theme: 'day' | 'night';
}

const VoidBackground = ({ theme }: VoidBackgroundProps) => {
  const meshRef = useRef<InstancedMesh>(null!);
  const dummy = useRef(new Object3D());
  const timeRef = useRef(0);

  const fragments = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      temp.push({
        position: new Vector3(
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 80
        ),
        velocity: new Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.005
        ),
        scale: Math.random() * 0.8 + 0.2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    timeRef.current = state.clock.getElapsedTime();

    fragments.forEach((fragment, i) => {
      // Slow drift
      fragment.position.add(fragment.velocity);
      
      // Reset fragments that drift too far
      if (fragment.position.length() > 100) {
        fragment.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
      }
      
      // Gentle rotation and scale pulsing
      const pulsingScale = fragment.scale * (1 + Math.sin(timeRef.current * 0.3 + fragment.phase) * 0.1);
      
      dummy.current.position.copy(fragment.position);
      dummy.current.scale.setScalar(pulsingScale);
      dummy.current.rotation.x += fragment.rotationSpeed;
      dummy.current.rotation.y += fragment.rotationSpeed * 0.7;
      dummy.current.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
      
      // Subtle color variation
      const baseHue = theme === 'day' ? 220 : 280;
      const color = new Color().setHSL(
        baseHue / 360,
        theme === 'day' ? 0.2 : 0.4,
        theme === 'day' ? 0.8 : 0.3
      );
      
      meshRef.current.setColorAt(i, color);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Void gradient background */}
      <color attach="background" args={[theme === 'day' ? '#f8fafc' : '#0f0f23']} />
      
      {/* Floating geometric fragments */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, 40]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial 
          transparent 
          opacity={theme === 'day' ? 0.15 : 0.25}
        />
      </instancedMesh>
    </>
  );
};

export default VoidBackground;
