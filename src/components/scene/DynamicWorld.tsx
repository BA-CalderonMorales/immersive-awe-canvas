import ObjectManager from './ObjectManager';
import DynamicObject from './DynamicObject';
import DynamicLights from './DynamicLights';
import DynamicBackground from './DynamicBackground';
import { SceneConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { useExperience } from '@/hooks/useExperience';
import { ThreeEvent } from '@react-three/fiber';

interface DynamicWorldProps {
  sceneConfig: SceneConfig;
  isLocked: boolean;
  isDragEnabled?: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

const DynamicWorld = ({ sceneConfig, isLocked, isDragEnabled: dragEnabled, onDragStateChange }: DynamicWorldProps) => {
  const { isDragEnabled, actions } = useSceneObjectsContext();
  const { theme } = useExperience();
  
  const themeConfig = theme === 'day' ? sceneConfig.day : sceneConfig.night;

  // Handle clicking on empty space to deselect objects when in drag mode
  const handleSceneClick = (e: ThreeEvent<MouseEvent>) => {
    // Only deselect if in drag mode and clicking on background (not on any mesh/object)
    if (isDragEnabled && (!e.object || e.object.type === 'Scene' || e.object.name === '')) {
      console.log('🔍 DEBUG: Scene background clicked, deselecting');
      e.stopPropagation();
      actions.selectObject(null);
    }
  };

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
        isDragEnabled={dragEnabled || isDragEnabled} 
        gizmoMode="translate"
        onDragStateChange={onDragStateChange}
      />
    </>
  );
};

export default DynamicWorld;