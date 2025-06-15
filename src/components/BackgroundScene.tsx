
import { Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stars, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const SceneContent = ({ theme }: { theme: 'day' | 'night' }) => {
  const { camera, mouse } = useThree();

  useFrame(() => {
    // Parallax effect based on mouse position
    const targetX = mouse.x * 0.5;
    const targetY = mouse.y * 0.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {theme === 'day' && <color attach="background" args={['#87CEEB']} />}
      
      <Suspense fallback={null}>
        {theme === 'night' && (
          <>
            <Stars radius={200} depth={50} count={5000} factor={5} saturation={0} fade speed={1.5} />
            {/* Added more clouds for night theme */}
            <Cloud position={[-15, 0, -15]} speed={0.1} opacity={0.4} segments={25} />
            <Cloud position={[15, 5, -20]} speed={0.1} opacity={0.3} segments={20} />
          </>
        )}
        <Cloud
          position-z={-10}
          opacity={theme === 'day' ? 0.5 : 0.3}
          speed={0.1}
          segments={20}
        />
        <Cloud
          position-z={5}
          position-x={-10}
          opacity={theme === 'day' ? 0.3 : 0.2}
          speed={0.1}
          segments={15}
        />
        <Cloud
          position-z={10}
          position-x={10}
          opacity={theme === 'day' ? 0.3 : 0.2}
          speed={0.1}
          segments={15}
        />
      </Suspense>
      <ambientLight intensity={theme === 'day' ? 1 : 0.1} />
      <directionalLight position={[0, 0, 5]} intensity={theme === 'day' ? 1 : 0.5} color="white" />

      {theme === 'night' && (
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={400} intensity={0.8} />
        </EffectComposer>
      )}
    </>
  );
};

const BackgroundScene = ({ theme = 'night' }: { theme?: 'day' | 'night' }) => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
      <SceneContent theme={theme} />
    </Canvas>
  );
};

export default BackgroundScene;
