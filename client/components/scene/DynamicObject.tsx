
import { SceneConfig, SceneThemeConfig } from '@/types/scene';
import TorusKnotObject from './objects/TorusKnotObject';
import WobbleFieldObject from './objects/WobbleFieldObject';
import DistortionSphereObject from './objects/DistortionSphereObject';
import MorphingIcosahedronObject from './objects/MorphingIcosahedronObject';
import WavyGridObject from './objects/WavyGridObject';
import CrystallineSpireObject from './objects/CrystallineSpireObject';
import JellyTorusObject from './objects/JellyTorusObject';

interface DynamicObjectProps {
  type: SceneConfig['type'];
  themeConfig: SceneThemeConfig;
  isLocked: boolean;
  isMotionFrozen?: boolean;
}

const DynamicObject = ({ type, themeConfig, isLocked, isMotionFrozen }: DynamicObjectProps) => {
  const { mainObjectColor, material } = themeConfig;
  switch (type) {
    case 'TorusKnot':
      return <TorusKnotObject themeConfig={themeConfig} isLocked={isLocked} isMotionFrozen={isMotionFrozen} />;
    case 'WobbleField':
      return <WobbleFieldObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} isMotionFrozen={isMotionFrozen} />;
    case 'CrystallineSpire':
      return <CrystallineSpireObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} isMotionFrozen={isMotionFrozen} />;
    case 'DistortionSphere':
      return <DistortionSphereObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} isMotionFrozen={isMotionFrozen} />;
    case 'MorphingIcosahedron':
      return <MorphingIcosahedronObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} isMotionFrozen={isMotionFrozen} />;
    case 'WavyGrid':
      return <WavyGridObject color={mainObjectColor} materialConfig={material} isLocked={isLocked} isMotionFrozen={isMotionFrozen} />;
    case 'JellyTorus':
      return <JellyTorusObject isLocked={isLocked} isMotionFrozen={isMotionFrozen} />;
    default:
      return null;
  }
};

export default DynamicObject;
