
import WorldContainer from "@/components/WorldContainer";
import KeyboardControls from "@/components/controls/KeyboardControls";
import DynamicWorld from "@/components/scene/DynamicWorld";
import { SceneConfig } from "@/types/scene";
import { useState } from "react";

interface WorldViewProps {
  sceneConfig: SceneConfig;
  isTransitioning: boolean;
  worldIndex: number;
  isLocked: boolean;
  onToggleLock: () => void;
}

const WorldView = ({ sceneConfig, isTransitioning, worldIndex, isLocked, onToggleLock }: WorldViewProps) => {
  const [isDragEnabled] = useState(false); // This will be controlled by the context

  const handleDragStateChange = (isDragging: boolean) => {
    console.log('Drag state changed:', isDragging);
  };

  return (
    <div
      key={worldIndex}
      className={`w-full h-full transition-all duration-1000 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      style={{ 
        position: 'absolute',
        inset: 0,
        overflow: 'hidden'
      }}
    >
      <WorldContainer 
        onToggleLock={onToggleLock} 
        isLocked={isLocked}
        isDragEnabled={isDragEnabled}
        onDragStateChange={handleDragStateChange}
      >
        <KeyboardControls />
        <DynamicWorld 
          sceneConfig={sceneConfig} 
          isLocked={isLocked} 
          onDragStateChange={handleDragStateChange}
        />
      </WorldContainer>
    </div>
  );
};

export default WorldView;
