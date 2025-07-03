import ObjectManager from './ObjectManager';
import DynamicObject from './DynamicObject';
import DynamicLights from './DynamicLights';
import DynamicBackground from './DynamicBackground';
import { SceneConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { useExperience } from '@/hooks/useExperience';

interface DynamicWorldProps {
  sceneConfig: SceneConfig;
  isLocked: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

const DynamicWorld = ({ sceneConfig, isLocked, onDragStateChange }: DynamicWorldProps) => {
  const { isDragEnabled } = useSceneObjectsContext();
  const { theme } = useExperience();
  
  const themeConfig = theme === 'day' ? sceneConfig.day : sceneConfig.night;

  return (
    <>
      <DynamicBackground 
        background={themeConfig.background} 
        extras={themeConfig.extras} 
      />
      <DynamicLights lights={themeConfig.lights} />
      <DynamicObject 
        type={sceneConfig.type}
        themeConfig={themeConfig}
        isLocked={isLocked}
      />
      <ObjectManager 
        isDragEnabled={isDragEnabled} 
        gizmoMode="translate"
        onDragStateChange={onDragStateChange}
      />
    </>
  );
};

export default DynamicWorld;