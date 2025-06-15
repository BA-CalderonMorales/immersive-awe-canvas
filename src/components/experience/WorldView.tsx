
import WorldContainer from "@/components/WorldContainer";
import KeyboardControls from "@/components/controls/KeyboardControls";
import DynamicWorld from "@/components/scene/DynamicWorld";
import { SceneConfig } from "@/types/scene";

interface WorldViewProps {
  sceneConfig: SceneConfig;
  isTransitioning: boolean;
  worldIndex: number;
}

const WorldView = ({ sceneConfig, isTransitioning, worldIndex }: WorldViewProps) => {
  return (
    <div
      key={worldIndex}
      className={`w-full h-full absolute inset-0 transition-all duration-1000 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      <WorldContainer>
        <KeyboardControls />
        <DynamicWorld sceneConfig={sceneConfig} />
      </WorldContainer>
    </div>
  );
};

export default WorldView;
