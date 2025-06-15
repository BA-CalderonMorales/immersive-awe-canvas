
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import InteractiveObject from './InteractiveObject';

const BackgroundExperience = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Stars radius={200} depth={50} count={5000} factor={5} saturation={0} fade speed={1.5} />
        <InteractiveObject />
      </Suspense>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 10]} intensity={1.5} color="white" />
    </>
  );
};

const BackgroundScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
      <BackgroundExperience />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={400} intensity={1.2} />
      </EffectComposer>
    </Canvas>
  );
};

export default BackgroundScene;
