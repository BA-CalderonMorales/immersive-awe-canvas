
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SceneConfig } from "@/types/scene";
import WorldView from "./WorldView";
import SceneSettingsPanel from "./SceneSettingsPanel";
import { AnimatePresence } from "framer-motion";

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
      <div className="w-full h-full">
        <AnimatePresence mode="wait">
          <WorldView
            sceneConfig={editableSceneConfig}
            isTransitioning={isTransitioning}
            worldIndex={currentWorldIndex}
            isLocked={isObjectLocked}
            onToggleLock={onToggleObjectLock}
          />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            <WorldView
              sceneConfig={editableSceneConfig}
              isTransitioning={isTransitioning}
              worldIndex={currentWorldIndex}
              isLocked={isObjectLocked}
              onToggleLock={onToggleObjectLock}
            />
          </AnimatePresence>
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
