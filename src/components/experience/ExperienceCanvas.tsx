
import { Canvas } from "@react-three/fiber";
import { SceneObjectsProvider } from "@/context/SceneObjectsContext";
import ExperienceContent from "./ExperienceContent";
import { WorldData, SceneConfig } from "@/types/scene";

interface ExperienceCanvasProps {
  worldData: WorldData;
  editableSceneConfig: SceneConfig;
  isObjectLocked: boolean;
  theme: 'day' | 'night';
  mainObjectColor: string;
}

const ExperienceCanvas = ({
  worldData,
  editableSceneConfig,
  isObjectLocked,
  theme,
  mainObjectColor,
}: ExperienceCanvasProps) => {
  return (
    <SceneObjectsProvider mainObjectColor={mainObjectColor}>
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ 
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        <ExperienceContent
          worldData={worldData}
          editableSceneConfig={editableSceneConfig}
          isObjectLocked={isObjectLocked}
          theme={theme}
        />
      </Canvas>
    </SceneObjectsProvider>
  );
};

export default ExperienceCanvas;
