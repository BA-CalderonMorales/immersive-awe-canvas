
import { SceneConfig } from '@/types/scene';

export const createConfigUpdater = (
  sceneConfig: SceneConfig,
  onUpdate: (config: SceneConfig) => void
) => {
  return (updater: (config: SceneConfig) => void) => {
    const newConfig = JSON.parse(JSON.stringify(sceneConfig));
    updater(newConfig);
    onUpdate(newConfig);
  };
};
