
import WorldContainer from "@/components/WorldContainer";
import KeyboardControls from "@/components/controls/KeyboardControls";
import DynamicWorld from "@/components/scene/DynamicWorld";
import { SceneConfig } from "@/types/scene";
import { motion, AnimatePresence } from "framer-motion";

interface WorldViewProps {
  sceneConfig: SceneConfig;
  isTransitioning: boolean;
  worldIndex: number;
  isLocked: boolean;
  onToggleLock: () => void;
}

const WorldView = ({ sceneConfig, isTransitioning, worldIndex, isLocked, onToggleLock }: WorldViewProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={worldIndex}
        className={`w-full h-full absolute inset-0 ${isTransitioning ? 'pointer-events-none' : ''}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8 }}
      >
        <WorldContainer onToggleLock={onToggleLock} isLocked={isLocked}>
          <KeyboardControls />
          <DynamicWorld sceneConfig={sceneConfig} isLocked={isLocked} />
        </WorldContainer>
      </motion.div>
    </AnimatePresence>
  );
};

export default WorldView;
