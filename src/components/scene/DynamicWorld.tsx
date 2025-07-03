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
  onDragStateChange?: (isDragging: boolean) => void;
}

const DynamicWorld = ({ sceneConfig, isLocked, onDragStateChange }: DynamicWorldProps) => {
  const { isDragEnabled, actions } = useSceneObjectsContext();
  const { theme } = useExperience();
  
  const themeConfig = theme === 'day' ? sceneConfig.day : sceneConfig.night;

  // Handle clicking on empty space to deselect objects when in drag mode
  const handleSceneClick = (e: ThreeEvent<MouseEvent>) => {
    // Only deselect if in drag mode and clicking on background/non-mesh objects
    if (isDragEnabled && (!e.object || e.object.type === 'Scene' || !e.object.userData?.objectId)) {
      e.stopPropagation();
      actions.selectObject(null);
    }
  };

  return (
    <group onClick={handleSceneClick}>
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
    </group>
  );
};

export default DynamicWorld;