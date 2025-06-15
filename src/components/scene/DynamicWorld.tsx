
import { useExperience } from '@/hooks/useExperience';
import { SceneConfig } from '@/types/scene';
import DynamicBackground from './DynamicBackground';
import DynamicLights from './DynamicLights';
import DynamicObject from './DynamicObject';
import SceneControls from './SceneControls';

interface DynamicWorldProps {
  sceneConfig: SceneConfig;
  setSceneConfig: React.Dispatch<React.SetStateAction<SceneConfig | null>>;
}

const DynamicWorld = ({ sceneConfig, setSceneConfig }: DynamicWorldProps) => {
  const { theme } = useExperience();
  const { type, day, night } = sceneConfig;

  const themeConfig = theme === 'day' ? day : night;

  if (!themeConfig) {
    return null;
  }

  const handleUpdate = (newConfig: SceneConfig) => {
    setSceneConfig(newConfig);
  };

  return (
    <>
      <SceneControls sceneConfig={sceneConfig} onUpdate={handleUpdate} />
      <DynamicLights lights={themeConfig.lights} />
      <DynamicBackground background={themeConfig.background} extras={themeConfig.extras} />
      <DynamicObject type={type} themeConfig={themeConfig} />
    </>
  );
};

export default DynamicWorld;
