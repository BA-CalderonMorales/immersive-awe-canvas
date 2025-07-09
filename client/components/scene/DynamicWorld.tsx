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
  isMotionFrozen?: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

const DynamicWorld = ({ sceneConfig, isLocked, isDragEnabled: dragEnabled, isMotionFrozen, onDragStateChange }: DynamicWorldProps) => {
  const { isDragEnabled: contextDragEnabled, actions } = useSceneObjectsContext();
  const { theme } = useExperience();
  const actualDragEnabled = dragEnabled || contextDragEnabled;

  const themeConfig = theme === 'day' ? sceneConfig.day : sceneConfig.night;

  // Handle clicking on empty space to deselect objects when in drag mode
  const handleSceneClick = (e: ThreeEvent<MouseEvent>) => {
    // Only deselect if in drag mode and clicking on background (not on any mesh/object)
    if (actualDragEnabled && (!e.object || e.object.type === 'Scene' || e.object.name === '')) {
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
        isMotionFrozen={isMotionFrozen}
      />
      <ObjectManager 
        isDragEnabled={actualDragEnabled} 
        gizmoMode="translate"
        onDragStateChange={onDragStateChange}
      />
    </>
  );
};

export default DynamicWorld;