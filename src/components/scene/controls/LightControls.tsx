
import GUI from 'lil-gui';
import { SceneConfig, LightConfig } from '@/types/scene';

interface LightControlsProps {
  gui: GUI;
  sceneConfig: SceneConfig;
  theme: 'day' | 'night';
  updateConfig: (updater: (config: SceneConfig) => void) => void;
}

const LightControls = ({ gui, sceneConfig, theme, updateConfig }: LightControlsProps) => {
  const themeConfig = sceneConfig[theme];

  // Lights Folder
  const lightsFolder = gui.addFolder('Lights');
  themeConfig.lights.forEach((light, index) => {
    const lightFolder = lightsFolder.addFolder(`Light ${index + 1} (${light.type})`);
    if (light.intensity !== undefined) {
      lightFolder.add(light, 'intensity', 0, 5).onChange(value => {
        updateConfig(c => { c[theme].lights[index].intensity = value; });
      });
    }
    if (light.color !== undefined) {
      lightFolder.addColor(light, 'color').onChange(value => {
        updateConfig(c => { c[theme].lights[index].color = value; });
      });
    }
    if (light.position) {
      const posFolder = lightFolder.addFolder('Position');
      posFolder.add(light.position, '0', -200, 200).name('x').onChange(v => updateConfig(c => { c[theme].lights[index].position![0] = v; }));
      posFolder.add(light.position, '1', -200, 200).name('y').onChange(v => updateConfig(c => { c[theme].lights[index].position![1] = v; }));
      posFolder.add(light.position, '2', -200, 200).name('z').onChange(v => updateConfig(c => { c[theme].lights[index].position![2] = v; }));
      posFolder.open();
    }
    if (light.groundColor !== undefined) {
      lightFolder.addColor(light, 'groundColor').name('Ground Color').onChange(value => {
        updateConfig(c => { c[theme].lights[index].groundColor = value; });
      });
    }
    lightFolder.open();
  });
  lightsFolder.open();

  return null;
};

export default LightControls;
