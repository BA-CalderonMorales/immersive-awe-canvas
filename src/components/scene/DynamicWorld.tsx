
import { useExperience } from '@/hooks/useExperience';
import { SceneConfig } from '@/types/scene';
import DynamicBackground from './DynamicBackground';
import DynamicLights from './DynamicLights';
import DynamicObject from './DynamicObject';

interface DynamicWorldProps {
  sceneConfig: SceneConfig;
  isLocked: boolean;
}

const DynamicWorld = ({ sceneConfig, isLocked }: DynamicWorldProps) => {
  const { theme } = useExperience();
  const { type, day, night } = sceneConfig;

  const themeConfig = theme === 'day' ? day : night;

  // Debug logging
  console.log('DynamicWorld render:', { 
    type, 
    theme, 
    themeConfig: !!themeConfig,
    sceneConfigKeys: Object.keys(sceneConfig)
  });

  if (!themeConfig) {
    console.error('No theme config found for theme:', theme);
    return null;
  }

  return (
    <>
      {/* Lighting System */}
      <DynamicLights lights={themeConfig.lights} />
      
      {/* Background Environment */}
      <DynamicBackground 
        background={themeConfig.background} 
        extras={themeConfig.extras} 
      />
      
      {/* Main Scene Object */}
      <DynamicObject 
        type={type} 
        themeConfig={themeConfig} 
        isLocked={isLocked} 
      />
    </>
  );
};

export default DynamicWorld;
