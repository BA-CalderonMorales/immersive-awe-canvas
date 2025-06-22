
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SceneConfig } from "@/types/scene";
import WorldView from "./WorldView";
import SceneSettingsPanel from "./SceneSettingsPanel";

interface ExperienceLayoutProps {
  editableSceneConfig: SceneConfig;
  isTransitioning: boolean;
  currentWorldIndex: number;
  isObjectLocked: boolean;
  onToggleObjectLock: () => void;
  isSettingsOpen: boolean;
  isMobile: boolean;
  onUpdateSceneConfig: (config: SceneConfig) => void;
}

const ExperienceLayout = ({
  editableSceneConfig,
  isTransitioning,
  currentWorldIndex,
  isObjectLocked,
  onToggleObjectLock,
  isSettingsOpen,
  isMobile,
  onUpdateSceneConfig,
}: ExperienceLayoutProps) => {

  if (isMobile) {
    return (
      <div className="absolute inset-0 w-full h-full">
        <WorldView 
          sceneConfig={editableSceneConfig} 
          isTransitioning={isTransitioning} 
          worldIndex={currentWorldIndex} 
          isLocked={isObjectLocked} 
          onToggleLock={onToggleObjectLock} 
        />
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="absolute inset-0 w-full h-full">
      <ResizablePanel>
        <div className="w-full h-full relative">
          <WorldView 
            sceneConfig={editableSceneConfig} 
            isTransitioning={isTransitioning} 
            worldIndex={currentWorldIndex} 
            isLocked={isObjectLocked} 
            onToggleLock={onToggleObjectLock} 
          />
        </div>
      </ResizablePanel>

      {isSettingsOpen && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <SceneSettingsPanel sceneConfig={editableSceneConfig} onUpdate={onUpdateSceneConfig} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default ExperienceLayout;
