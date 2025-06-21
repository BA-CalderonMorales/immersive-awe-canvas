
import WorldContainer from "@/components/WorldContainer";
import KeyboardControls from "@/components/controls/KeyboardControls";
import DynamicWorld from "@/components/scene/DynamicWorld";
import { SceneConfig } from "@/types/scene";
import { motion } from "framer-motion";

interface WorldViewProps {
  sceneConfig: SceneConfig;
  isTransitioning: boolean;
  worldIndex: number;
  isLocked: boolean;
  onToggleLock: () => void;
}

const WorldView = ({ sceneConfig, isTransitioning, worldIndex, isLocked, onToggleLock }: WorldViewProps) => {
  return (
    <motion.div
      key={worldIndex}
      className="w-full h-full absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WorldContainer onToggleLock={onToggleLock} isLocked={isLocked}>
        <KeyboardControls />
        <DynamicWorld sceneConfig={sceneConfig} isLocked={isLocked} />
      </WorldContainer>
    </motion.div>
  );
};

export default WorldView;
