
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TorusKnot, MeshDistortMaterial, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const Experience = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Suspense fallback={null}>
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <TorusKnot args={[1, 0.4, 256, 32]}>
          <MeshDistortMaterial
            color="#f97316"
            attach="material"
            distort={0.5}
            speed={2}
            roughness={0.1}
            metalness={0.1}
          />
        </TorusKnot>
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Experience />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={0.7} />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
