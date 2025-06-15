
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

type WorldContainerProps = {
  children: React.ReactNode;
};

const WorldContainer = ({ children }: WorldContainerProps) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Suspense fallback={null}>
        {children}
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={0.7} />
      </EffectComposer>
    </Canvas>
  );
};

export default WorldContainer;
