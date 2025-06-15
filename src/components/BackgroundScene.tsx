import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stars, Cloud, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Define a type for our cloud data
type CloudData = {
  id: number;
  position: [number, number, number];
  speed: number;
  opacity: number;
  segments: number;
}

const SceneContent = ({ theme, isLeaving }: { theme: 'day' | 'night', isLeaving: boolean }) => {
  const { camera, mouse, viewport } = useThree();
  const textRef = useRef<THREE.Group>(null!);
  const subtextRef = useRef<THREE.Group>(null!);
  const cloudsRef = useRef<THREE.Group>(null!);

  // Generate random clouds once
  const clouds = useMemo<CloudData[]>(() => {
    const cloudCount = theme === 'night' ? 20 : 10;
    return Array.from({ length: cloudCount }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * viewport.width * 2,
        (Math.random() - 0.5) * viewport.height,
        (Math.random() - 0.5) * 20 - 5,
      ],
      speed: Math.random() * 0.1 + 0.05,
      opacity: Math.random() * 0.3 + 0.2,
      segments: Math.floor(Math.random() * 20) + 10,
    }));
  }, [theme, viewport.width, viewport.height]);

  useFrame((state, delta) => {
    // Parallax effect for camera
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.5, 0.05);
    
    // Animate clouds
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.02;
    }

    // Interactive text
    if (textRef.current) {
        textRef.current.position.x = THREE.MathUtils.lerp(textRef.current.position.x, mouse.x * 0.2, 0.05);
        textRef.current.position.y = THREE.MathUtils.lerp(textRef.current.position.y, mouse.y * 0.2, 0.05);
        textRef.current.lookAt(camera.position);
    }
    if (subtextRef.current) {
        subtextRef.current.position.x = THREE.MathUtils.lerp(subtextRef.current.position.x, mouse.x * 0.1, 0.05);
        subtextRef.current.position.y = THREE.MathUtils.lerp(subtextRef.current.position.y, mouse.y * 0.1, 0.05);
        subtextRef.current.lookAt(camera.position);
    }

    // Leaving animation
    if (isLeaving) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, camera.position.z - 10, 0.025);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, 100, 0.025);
        camera.updateProjectionMatrix();
      }

      if (textRef.current) textRef.current.visible = false;
      if (subtextRef.current) subtextRef.current.visible = false;
    } else {
        camera.lookAt(0, 0, 0);
    }
  });

  const textColor = theme === 'day' ? '#383838' : '#FFFFFF';

  return (
    <>
      {theme === 'day' ? <color attach="background" args={['#87CEEB']} /> : <color attach="background" args={['#01010A']} />}
      
      <Suspense fallback={null}>
        {theme === 'night' && (
          <Stars radius={200} depth={50} count={5000} factor={5} saturation={0} fade speed={1.5} />
        )}
        <group ref={cloudsRef}>
          {clouds.map(({ id, ...props }) => <Cloud key={id} {...props} frustumCulled={false} />)}
        </group>

        {/* 3D Text */}
        <group ref={textRef}>
            <Text
              font="/fonts/Inter-Bold.ttf"
              fontSize={viewport.width / 8}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor={theme === 'day' ? '#FFFFFF' : '#000000'}
            >
              The Journey Awaits
              <meshBasicMaterial attach="material" color={textColor} toneMapped={false} />
            </Text>
        </group>
        <group ref={subtextRef} position-y={-viewport.width / 14}>
            <Text
              font="/fonts/Inter-Regular.ttf"
              fontSize={viewport.width / 35}
              anchorX="center"
              anchorY="middle"
              maxWidth={10}
              textAlign="center"
            >
              Click anywhere or press Enter to begin
              <meshBasicMaterial attach="material" color={new THREE.Color(textColor).multiplyScalar(0.8)} toneMapped={false} />
            </Text>
        </group>

      </Suspense>
      <ambientLight intensity={theme === 'day' ? 1.5 : 0.2} />
      <directionalLight position={[0, 5, 5]} intensity={theme === 'day' ? 1 : 0.5} color="white" />

      {theme === 'night' && (
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={0.2} luminanceSmoothing={0.9} height={600} intensity={1.5} />
        </EffectComposer>
      )}
    </>
  );
};

const BackgroundScene = ({ theme = 'night', isLeaving = false }: { theme?: 'day' | 'night', isLeaving?: boolean }) => {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
      <SceneContent theme={theme} isLeaving={isLeaving} />
    </Canvas>
  );
};

export default BackgroundScene;
