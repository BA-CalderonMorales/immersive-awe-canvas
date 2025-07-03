import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SceneConfig } from "@/types/scene";
import { SceneObjectsProvider } from "@/context/SceneObjectsContext";
import { useExperience } from "@/hooks/useExperience";
import DynamicScene from "../scene/DynamicScene";
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
  isDragEnabled: boolean;
  isMotionFrozen?: boolean;
  onToggleMotion?: () => void;
  currentBackground?: any;
  currentGeometry?: any;
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
  isDragEnabled,
  isMotionFrozen,
  onToggleMotion,
  currentBackground,
  currentGeometry,
}: ExperienceLayoutProps) => {
  const { theme } = useExperience();
  const themeConfig = editableSceneConfig[theme];
  const mainObjectColor = themeConfig?.mainObjectColor || '#ffffff';

  if (isMobile) {
    return (
      <SceneObjectsProvider mainObjectColor={mainObjectColor} isDragEnabled={isDragEnabled}>
        <div 
          className="w-full h-full"
          style={{ 
            position: 'absolute',
            inset: 0,
            overflow: 'hidden'
          }}
        >
          <DynamicScene 
            currentBackground={currentBackground}
            currentGeometry={currentGeometry}
            theme={theme}
            isLocked={isObjectLocked}
          />
        </div>
      </SceneObjectsProvider>
    );
  }

  return (
    <SceneObjectsProvider mainObjectColor={mainObjectColor} isDragEnabled={isDragEnabled}>
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
            <DynamicScene 
              currentBackground={currentBackground}
              currentGeometry={currentGeometry}
              theme={theme}
              isLocked={isObjectLocked}
              isDragEnabled={isDragEnabled}
              isMotionFrozen={isMotionFrozen}
            />
          </div>
        </ResizablePanel>

        {isSettingsOpen && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <SceneSettingsPanel
                sceneConfig={editableSceneConfig}
                onUpdate={onUpdateSceneConfig}
                isMotionFrozen={isMotionFrozen}
                onToggleMotion={onToggleMotion}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </SceneObjectsProvider>
  );
};

export default ExperienceLayout;