
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
  isGrabMode: boolean;
  onToggleGrabMode?: () => void;
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
  isGrabMode,
  onToggleGrabMode,
  isSettingsOpen,
  isMobile,
  onUpdateSceneConfig,
}: ExperienceLayoutProps) => {
  if (isMobile) {
    return (
      <div className="w-full h-full">
        <WorldView
          sceneConfig={editableSceneConfig}
          isTransitioning={isTransitioning}
          worldIndex={currentWorldIndex}
          isLocked={isObjectLocked}
          onToggleLock={onToggleObjectLock}
          isGrabMode={isGrabMode}
          onToggleGrabMode={onToggleGrabMode}
        />
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal">
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
