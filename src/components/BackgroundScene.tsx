import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const BackgroundExperience = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Stars radius={200} depth={50} count={5000} factor={5} saturation={0} fade speed={1.5} />
        <Cloud
          position-z={-10}
          opacity={0.3}
          speed={0.1}
          depth={1.5}
          segments={20}
        />
        <Cloud
          position-z={5}
          position-x={-10}
          opacity={0.2}
          speed={0.1}
          depth={2}
          segments={15}
        />
        <Cloud
          position-z={10}
          position-x={10}
          opacity={0.2}
          speed={0.1}
          depth={2}
          segments={15}
        />
      </Suspense>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} color="white" />
    </>
  );
};

const BackgroundScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
      <BackgroundExperience />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={400} intensity={0.8} />
      </EffectComposer>
    </Canvas>
  );
};

export default BackgroundScene;
