import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

type WorldContainerProps = {
  children: React.ReactNode;
  onToggleLock?: () => void;
  isLocked: boolean;
  isDragEnabled: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
};

const WorldContainer = ({ 
  children, 
  onToggleLock, 
  isLocked, 
  isDragEnabled,
  onDragStateChange 
}: WorldContainerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isObjectDragging, setIsObjectDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);
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

  const handleDragStateChange = (dragging: boolean) => {
    setIsObjectDragging(dragging);
    onDragStateChange?.(dragging);
  };

  // Clone children and pass drag state handler
  const childrenWithProps = typeof children === 'object' && children !== null && 'type' in children
    ? { ...children, props: { ...children.props, onDragStateChange: handleDragStateChange } }
    : children;

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
            cursor: isDragEnabled ? 'move' : (isDragging || isObjectDragging ? 'grabbing' : 'grab'),
            width: '100%',
            height: '100%',
            display: 'block',
            touchAction: 'none'
          }}
          onPointerDown={() => !isObjectDragging && setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {childrenWithProps}
          </Suspense>

          <OrbitControls
            ref={orbitControlsRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={!isDragEnabled && !isObjectDragging}
            autoRotate={!isLocked && !isDragEnabled && !isObjectDragging}
            autoRotateSpeed={0.5}
            minDistance={8}
            maxDistance={50}
            onStart={() => !isObjectDragging && setIsDragging(true)}
            onEnd={() => setIsDragging(false)}
            enabled={!isObjectDragging} // Completely disable when object is being dragged
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