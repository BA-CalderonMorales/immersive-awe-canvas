
import { useExperience } from '@/hooks/useExperience';
import { SceneConfig } from '@/types/scene';
import DynamicBackground from './DynamicBackground';
import DynamicLights from './DynamicLights';
import DynamicObject from './DynamicObject';
import ObjectManager from './ObjectManager';

interface DynamicWorldProps {
  sceneConfig: SceneConfig;
  isLocked: boolean;
}

const DynamicWorld = ({ sceneConfig, isLocked }: DynamicWorldProps) => {
  const { theme } = useExperience();
  const { type, day, night } = sceneConfig;

  const themeConfig = theme === 'day' ? day : night;

  if (!themeConfig) {
    return null;
  }

  return (
    <>
      <DynamicLights lights={themeConfig.lights} />
      <DynamicBackground background={themeConfig.background} extras={themeConfig.extras} />
      <DynamicObject type={type} themeConfig={themeConfig} isLocked={isLocked} />
      <ObjectManager />
    </>
  );
};

export default DynamicWorld;
