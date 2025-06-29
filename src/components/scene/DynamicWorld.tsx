
import ObjectManager from './ObjectManager';
import DynamicObject from './DynamicObject';
import DynamicLights from './DynamicLights';
import DynamicBackground from './DynamicBackground';
import { SceneConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';

interface DynamicWorldProps {
  sceneConfig: SceneConfig;
  isLocked: boolean;
}

const DynamicWorld = ({ sceneConfig, isLocked }: DynamicWorldProps) => {
  const { isDragEnabled } = useSceneObjectsContext();

  return (
    <>
      <DynamicBackground sceneConfig={sceneConfig} />
      <DynamicLights sceneConfig={sceneConfig} />
      <DynamicObject sceneConfig={sceneConfig} isLocked={isLocked} />
      <ObjectManager isDragEnabled={isDragEnabled} />
    </>
  );
};

export default DynamicWorld;
