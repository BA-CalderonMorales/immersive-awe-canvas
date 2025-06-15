
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const BackgroundExperience = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Suspense>
    </>
  );
};

const BackgroundScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <BackgroundExperience />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={0.7} />
      </EffectComposer>
    </Canvas>
  );
};

export default BackgroundScene;
