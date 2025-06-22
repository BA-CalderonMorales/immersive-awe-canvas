
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

type WorldContainerProps = {
  children: React.ReactNode;
  onToggleLock?: () => void;
  isLocked: boolean;
};

const WorldContainer = ({ children, onToggleLock, isLocked }: WorldContainerProps) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      onDoubleClick={onToggleLock}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0
      }}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      className="fixed inset-0 w-screen h-screen"
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={!isLocked}
        autoRotateSpeed={0.5}
        minDistance={2}
        maxDistance={25}
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={0.7} />
      </EffectComposer>
    </Canvas>
  );
};

export default WorldContainer;
