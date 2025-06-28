
import { useSceneObjects } from '@/hooks/useSceneObjects';
import { SceneConfig } from '@/types/scene';
import DynamicSceneObject from './objects/DynamicSceneObject';
import { useExperience } from '@/hooks/useExperience';

interface ObjectManagerProps {
  sceneConfig: SceneConfig;
  isLocked: boolean;
}

const ObjectManager = ({ sceneConfig, isLocked }: ObjectManagerProps) => {
  const { theme } = useExperience();
  const themeConfig = sceneConfig[theme];
  const mainObjectColor = themeConfig?.mainObjectColor || '#ffffff';
  
  const { objects, selectedObjectId, actions } = useSceneObjects(mainObjectColor);

  return (
    <>
      {objects.map((object) => (
        <DynamicSceneObject
          key={object.id}
          object={object}
          isSelected={object.id === selectedObjectId}
          onSelect={() => actions.selectObject(object.id)}
          isLocked={isLocked}
        />
      ))}
    </>
  );
};

export default ObjectManager;
