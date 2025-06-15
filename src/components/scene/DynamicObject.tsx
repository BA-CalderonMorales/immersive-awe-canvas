
import { SceneConfig, SceneThemeConfig } from '@/types/scene';
import TorusKnotObject from './objects/TorusKnotObject';
import WobbleFieldObject from './objects/WobbleFieldObject';
import DistortionSphereObject from './objects/DistortionSphereObject';

interface DynamicObjectProps {
  type: SceneConfig['type'];
  themeConfig: SceneThemeConfig;
}

const DynamicObject = ({ type, themeConfig }: DynamicObjectProps) => {
  const { mainObjectColor, material } = themeConfig;
  switch (type) {
    case 'TorusKnot':
      return <TorusKnotObject color={mainObjectColor} materialConfig={material} />;
    case 'WobbleField':
      return <WobbleFieldObject color={mainObjectColor} materialConfig={material} />;
    case 'DistortionSphere':
      return <DistortionSphereObject color={mainObjectColor} materialConfig={material} />;
    default:
      return null;
  }
};

export default DynamicObject;
