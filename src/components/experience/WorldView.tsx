
import WorldContainer from "@/components/WorldContainer";
import KeyboardControls from "@/components/controls/KeyboardControls";
import DynamicWorld from "@/components/scene/DynamicWorld";
import { SceneConfig } from "@/types/scene";

interface WorldViewProps {
  sceneConfig: SceneConfig;
  isTransitioning: boolean;
  worldIndex: number;
  isLocked: boolean;
  onToggleLock: () => void;
  isGrabMode: boolean;
}

const WorldView = ({ sceneConfig, isTransitioning, worldIndex, isLocked, onToggleLock, isGrabMode }: WorldViewProps) => {
  return (
    <div
      key={worldIndex}
      className={`w-full h-full absolute inset-0 transition-all duration-1000 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      <WorldContainer onToggleLock={onToggleLock} isLocked={isLocked}>
        <KeyboardControls />
        <DynamicWorld sceneConfig={sceneConfig} isLocked={isLocked} isGrabMode={isGrabMode} />
      </WorldContainer>
    </div>
  );
};

export default WorldView;
