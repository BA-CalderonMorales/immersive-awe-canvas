
import { Suspense, useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitControlsRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{ 
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'pan-x pan-y'
      }}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Canvas
          camera={{ position: [0, 0, 20], fov: 75 }}
          onDoubleClick={onToggleLock}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            width: '100%',
            height: '100%',
            display: 'block',
            touchAction: 'none'
          }}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {children}
          </Suspense>

          <OrbitControls
            ref={orbitControlsRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            autoRotate={!isLocked}
            autoRotateSpeed={0.5}
            minDistance={8}
            maxDistance={50}
            onStart={() => setIsDragging(true)}
            onEnd={() => setIsDragging(false)}
            makeDefault
          />

          <EffectComposer>
            <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={0.7} />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
};

export default WorldContainer;
