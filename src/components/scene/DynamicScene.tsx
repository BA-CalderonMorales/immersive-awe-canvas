import { useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SceneConfig } from '@/types/scene';
import { motion, AnimatePresence } from "framer-motion";
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicWorld from './DynamicWorld';

interface DynamicSceneProps {
  currentBackground: { type: string; [key: string]: unknown };
  currentGeometry: { type: string; [key: string]: unknown };
  editableSceneConfig?: SceneConfig; // User's modified scene config
  theme: 'day' | 'night';
  isLocked: boolean;
  isDragEnabled?: boolean;
  isMotionFrozen?: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

const DynamicScene = ({ 
  currentBackground, 
  currentGeometry, 
  editableSceneConfig,
  theme, 
  isLocked, 
  isDragEnabled, 
  isMotionFrozen, 
  onDragStateChange 
}: DynamicSceneProps) => {
  const orbitControlsRef = useRef<any>(null);
  const { isDragging } = useSceneObjectsContext();

  // Update orbit controls based on drag state
  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = !isDragging && !isDragEnabled;
    }
  }, [isDragging, isDragEnabled]);
  const dynamicSceneConfig = useMemo<SceneConfig>(() => {
    // CRITICAL FIX: Use editableSceneConfig (user's changes) when available
    if (editableSceneConfig) {
      console.log('🎯 Using editableSceneConfig (user changes):', editableSceneConfig);
      return editableSceneConfig;
    }

    // Fallback: Create config from database defaults only when no user config exists
    if (!currentBackground || !currentGeometry) {
      return {
        type: 'TorusKnot',
        day: {
          lights: [{ type: 'ambient', intensity: 1 }],
          material: { materialType: 'standard' },
          background: { type: 'void' },
          mainObjectColor: '#ffffff'
        },
        night: {
          lights: [{ type: 'ambient', intensity: 0.5 }],
          material: { materialType: 'standard' },
          background: { type: 'void' },
          mainObjectColor: '#ffffff'
        }
      };
    }

    const materialConfig = currentGeometry.material_config || {
      materialType: 'standard' as const,
      metalness: 0.3,
      roughness: 0.5
    };

    const backgroundConfig = currentBackground.background_config || { type: 'void' };
    
    console.log('🎯 Using database defaults (no user config):', currentGeometry);

    // Create a complete scene config from database defaults
    const sceneConfig: SceneConfig = {
      type: (currentGeometry.geometry_type as any) || 'TorusKnot',
      day: {
        lights: [
          { type: 'ambient', intensity: 1.5 },
          { type: 'directional', position: [10, 10, 5], intensity: 1 }
        ],
        material: materialConfig,
        background: backgroundConfig,
        mainObjectColor: (currentGeometry.color_day as string) || '#ffffff'
      },
      night: {
        lights: [
          { type: 'ambient', intensity: 0.8 },
          { type: 'directional', position: [10, 10, 5], intensity: 0.5 }
        ],
        material: materialConfig,
        background: backgroundConfig,
        mainObjectColor: (currentGeometry.color_night as string) || '#ffffff'
      }
    };

    return sceneConfig;
  }, [editableSceneConfig, currentBackground, currentGeometry, theme]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${currentBackground?.id}-${currentGeometry?.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <Canvas
          camera={{ position: [0, 0, 12], fov: 75 }}
          className="w-full h-full"
        >
          <OrbitControls 
            ref={orbitControlsRef}
            enabled={!isDragging && !isDragEnabled}
            enableZoom={true}
            enablePan={false}
            enableRotate={!isDragging && !isDragEnabled}
            enableDamping={true}
            dampingFactor={0.1}
            maxDistance={20}
            minDistance={2}
            makeDefault
          />
          <DynamicWorld 
            sceneConfig={dynamicSceneConfig}
            isLocked={isLocked}
            isDragEnabled={isDragEnabled}
            isMotionFrozen={isMotionFrozen}
            onDragStateChange={onDragStateChange}
          />
        </Canvas>
      </motion.div>
    </AnimatePresence>
  );
};

export default DynamicScene;