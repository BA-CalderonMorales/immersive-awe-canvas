
import { SceneConfig, SceneThemeConfig } from '@/types/scene';
import TorusKnotObject from './objects/TorusKnotObject';
import WobbleFieldObject from './objects/WobbleFieldObject';
import DistortionSphereObject from './objects/DistortionSphereObject';
import MorphingIcosahedronObject from './objects/MorphingIcosahedronObject';
import WavyGridObject from './objects/WavyGridObject';
import CrystallineSpireObject from './objects/CrystallineSpireObject';
import PhysicsPlaygroundObject from './objects/PhysicsPlaygroundObject';

interface DynamicObjectProps {
  type: SceneConfig['type'];
  themeConfig: SceneThemeConfig;
  isLocked: boolean;
  isGrabMode?: boolean;
  onToggleGrabMode?: () => void;
}

const DynamicObject = ({ type, themeConfig, isLocked, isGrabMode = false, onToggleGrabMode }: DynamicObjectProps) => {
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
    case 'PhysicsPlayground':
      return <PhysicsPlaygroundObject isGrabMode={isGrabMode} onToggleGrabMode={onToggleGrabMode} />;
    default:
      return null;
  }
};

export default DynamicObject;
