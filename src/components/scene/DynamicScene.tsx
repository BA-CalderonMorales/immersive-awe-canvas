import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SceneConfig } from '@/types/scene';
import { motion, AnimatePresence } from "framer-motion";
import DynamicWorld from './DynamicWorld';

interface DynamicSceneProps {
  currentBackground: any;
  currentGeometry: any;
  theme: 'day' | 'night';
  isLocked: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

const DynamicScene = ({ currentBackground, currentGeometry, theme, isLocked, onDragStateChange }: DynamicSceneProps) => {
  const dynamicSceneConfig = useMemo<SceneConfig>(() => {
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
      materialType: 'standard',
      metalness: 0.3,
      roughness: 0.5
    };

    const backgroundConfig = currentBackground.background_config;
    
    const baseColor = theme === 'day' ? currentGeometry.color_day : currentGeometry.color_night;

    // Create a complete scene config
    const sceneConfig: SceneConfig = {
      type: currentGeometry.geometry_type as any,
      day: {
        lights: [
          { type: 'ambient', intensity: 1.5 },
          { type: 'directional', position: [10, 10, 5], intensity: 1 }
        ],
        material: materialConfig,
        background: backgroundConfig,
        mainObjectColor: currentGeometry.color_day
      },
      night: {
        lights: [
          { type: 'ambient', intensity: 0.8 },
          { type: 'point', color: '#ffffff', position: [5, 5, 5], intensity: 2 }
        ],
        material: materialConfig,
        background: backgroundConfig,
        mainObjectColor: currentGeometry.color_night
      }
    };

    return sceneConfig;
  }, [currentBackground, currentGeometry, theme]);

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
          camera={{ position: [0, 0, 5], fov: 75 }}
          className="w-full h-full"
        >
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.1}
            maxDistance={20}
            minDistance={2}
          />
          <DynamicWorld 
            sceneConfig={dynamicSceneConfig}
            isLocked={isLocked}
            onDragStateChange={onDragStateChange}
          />
        </Canvas>
      </motion.div>
    </AnimatePresence>
  );
};

export default DynamicScene;