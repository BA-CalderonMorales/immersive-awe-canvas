
import { SceneConfig, SceneThemeConfig } from '@/types/scene';
import TorusKnotObject from './objects/TorusKnotObject';
import WobbleFieldObject from './objects/WobbleFieldObject';
import DistortionSphereObject from './objects/DistortionSphereObject';
import MorphingIcosahedronObject from './objects/MorphingIcosahedronObject';
import WavyGridObject from './objects/WavyGridObject';
import CrystallineSpireObject from './objects/CrystallineSpireObject';

interface DynamicObjectProps {
  type: SceneConfig['type'];
  themeConfig: SceneThemeConfig;
  isLocked: boolean;
}

const DynamicObject = ({ type, themeConfig, isLocked }: DynamicObjectProps) => {
  const { mainObjectColor, material } = themeConfig;
  switch (type) {
    case 'TorusKnot':
      return <TorusKnotObject themeConfig={themeConfig} isLocked={isLocked} />;
    case 'WobbleField':
      return <WobbleFieldObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} />;
    case 'CrystallineSpire':
      return <CrystallineSpireObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} />;
    case 'DistortionSphere':
      return <DistortionSphereObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} />;
    case 'MorphingIcosahedron':
      return <MorphingIcosahedronObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} />;
    case 'WavyGrid':
      return <WavyGridObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} />;
    default:
      return null;
  }
};

export default DynamicObject;
