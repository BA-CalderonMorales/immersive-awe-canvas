
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SceneConfig } from "@/types/scene";
import { SceneObjectsProvider } from "@/context/SceneObjectsContext";
import { useExperience } from "@/hooks/useExperience";
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
  const { theme } = useExperience();
  const themeConfig = editableSceneConfig[theme];
  const mainObjectColor = themeConfig?.mainObjectColor || '#ffffff';

  if (isMobile) {
    return (
      <SceneObjectsProvider mainObjectColor={mainObjectColor}>
        <div 
          className="w-full h-full"
          style={{ 
            position: 'absolute',
            inset: 0,
            overflow: 'hidden'
          }}
        >
          <WorldView 
            sceneConfig={editableSceneConfig} 
            isTransitioning={isTransitioning} 
            worldIndex={currentWorldIndex} 
            isLocked={isObjectLocked} 
            onToggleLock={onToggleObjectLock} 
          />
        </div>
      </SceneObjectsProvider>
    );
  }

  return (
    <SceneObjectsProvider mainObjectColor={mainObjectColor}>
      <ResizablePanelGroup 
        direction="horizontal" 
        className="w-full h-full"
        style={{ 
          position: 'absolute',
          inset: 0,
          overflow: 'hidden'
        }}
      >
        <ResizablePanel>
          <div className="w-full h-full relative overflow-hidden">
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
    </SceneObjectsProvider>
  );
};

export default ExperienceLayout;
