
import GUI from 'lil-gui';
import { SceneConfig, BackgroundConfig, EnvironmentPreset } from '@/types/scene';

interface BackgroundControlsProps {
  gui: GUI;
  sceneConfig: SceneConfig;
  theme: 'day' | 'night';
  updateConfig: (updater: (config: SceneConfig) => void) => void;
}

const BackgroundControls = ({ gui, sceneConfig, theme, updateConfig }: BackgroundControlsProps) => {
  const themeConfig = sceneConfig[theme];
  const backgroundConf = themeConfig.background;

  // Background Folder with ALL options
  const bgFolder = gui.addFolder('Background');
  
  // Add ALL background types for better visibility
  bgFolder.add(backgroundConf, 'type', [
    'color', 
    'sky', 
    'stars', 
    'fog', 
    'sparkles', 
    'environment'
  ]).name('Type').onChange(value => {
      updateConfig(c => {
          const bg = c[theme].background;
          const oldType = bg.type;
          bg.type = value as BackgroundConfig['type'];
          
          // Set sensible defaults for each background type
          if (value === 'environment') {
              if (bg.preset === undefined) bg.preset = 'studio';
              if (bg.blur === undefined) bg.blur = 0.3;
          } else if (value === 'color') {
              if (bg.color === undefined) bg.color = '#1a1a2e';
          } else if (value === 'sky') {
              if (bg.sunPosition === undefined) bg.sunPosition = [100, 20, 100];
          } else if (value === 'stars') {
              if (bg.radius === undefined) bg.radius = 100;
              if (bg.depth === undefined) bg.depth = 50;
              if (bg.count === undefined) bg.count = 5000;
              if (bg.factor === undefined) bg.factor = 4;
              if (bg.saturation === undefined) bg.saturation = 0;
              if (bg.fade === undefined) bg.fade = true;
              if (bg.speed === undefined) bg.speed = 1;
          } else if (value === 'fog') {
              if (bg.color === undefined) bg.color = '#16213e';
              if (bg.near === undefined) bg.near = 0.1;
              if (bg.far === undefined) bg.far = 100;
          } else if (value === 'sparkles') {
              if (bg.count === undefined) bg.count = 100;
              if (bg.speed === undefined) bg.speed = 1;
              if (bg.opacity === undefined) bg.opacity = 0.6;
              if (bg.color === undefined) bg.color = '#ffffff';
              if (bg.size === undefined) bg.size = 6;
              if (bg.scale === undefined) bg.scale = 1;
          }
      });
  });

  // Background-specific controls
  if (backgroundConf.type === 'environment') {
      const presets: EnvironmentPreset[] = [
          'studio', 'warehouse', 'apartment', 'forest', 'night', 
          'sunset', 'dawn', 'city', 'park', 'lobby', 'aircraft', 
          'venice', 'ocean', 'canyon', 'desert', 'mountain', 
          'space', 'arctic', 'urban', 'industrial'
      ];
      bgFolder.add(backgroundConf, 'preset', presets).onChange(v => updateConfig(c => {c[theme].background.preset = v as EnvironmentPreset}));
      if (backgroundConf.blur !== undefined) {
          bgFolder.add(backgroundConf, 'blur', 0, 1).onChange(v => updateConfig(c => {c[theme].background.blur = v}));
      }
  } else if (backgroundConf.type === 'color') {
      bgFolder.addColor(backgroundConf, 'color').onChange(v => updateConfig(c => {c[theme].background.color = v}));
  } else if (backgroundConf.type === 'sky' && backgroundConf.sunPosition) {
      const sunPosFolder = bgFolder.addFolder('Sun Position');
      sunPosFolder.add(backgroundConf.sunPosition, '0', -200, 200).name('x').onChange(v => updateConfig(c => {c[theme].background.sunPosition![0] = v}));
      sunPosFolder.add(backgroundConf.sunPosition, '1', -200, 200).name('y').onChange(v => updateConfig(c => {c[theme].background.sunPosition![1] = v}));
      sunPosFolder.add(backgroundConf.sunPosition, '2', -200, 200).name('z').onChange(v => updateConfig(c => {c[theme].background.sunPosition![2] = v}));
      sunPosFolder.open();
  } else if (backgroundConf.type === 'stars') {
      if (backgroundConf.radius !== undefined) bgFolder.add(backgroundConf, 'radius', 10, 2000).onChange(v => updateConfig(c => {c[theme].background.radius = v}));
      if (backgroundConf.count !== undefined) bgFolder.add(backgroundConf, 'count', 0, 10000).step(100).onChange(v => updateConfig(c => {c[theme].background.count = v}));
      if (backgroundConf.saturation !== undefined) bgFolder.add(backgroundConf, 'saturation', 0, 2).onChange(v => updateConfig(c => {c[theme].background.saturation = v}));
      if (backgroundConf.factor !== undefined) bgFolder.add(backgroundConf, 'factor', 0, 20).onChange(v => updateConfig(c => {c[theme].background.factor = v}));
      if (backgroundConf.speed !== undefined) bgFolder.add(backgroundConf, 'speed', 0, 5).onChange(v => updateConfig(c => {c[theme].background.speed = v}));
      if (backgroundConf.fade !== undefined) bgFolder.add(backgroundConf, 'fade').onChange(v => updateConfig(c => {c[theme].background.fade = v}));
  } else if (backgroundConf.type === 'sparkles') {
      if (backgroundConf.count !== undefined) bgFolder.add(backgroundConf, 'count', 0, 1000).step(10).onChange(v => updateConfig(c => {c[theme].background.count = v}));
      if (backgroundConf.speed !== undefined) bgFolder.add(backgroundConf, 'speed', 0, 5).onChange(v => updateConfig(c => {c[theme].background.speed = v}));
      if (backgroundConf.opacity !== undefined) bgFolder.add(backgroundConf, 'opacity', 0, 1).onChange(v => updateConfig(c => {c[theme].background.opacity = v}));
      if (backgroundConf.color !== undefined) bgFolder.addColor(backgroundConf, 'color').onChange(v => updateConfig(c => {c[theme].background.color = v}));
      if (backgroundConf.size !== undefined) bgFolder.add(backgroundConf, 'size', 0, 20).onChange(v => updateConfig(c => {c[theme].background.size = v}));
      if (backgroundConf.scale !== undefined) bgFolder.add(backgroundConf, 'scale', 0, 50).onChange(v => updateConfig(c => {c[theme].background.scale = v}));
  } else if (backgroundConf.type === 'fog') {
      if (backgroundConf.color !== undefined) bgFolder.addColor(backgroundConf, 'color').onChange(v => updateConfig(c => {c[theme].background.color = v}));
      if (backgroundConf.near !== undefined) bgFolder.add(backgroundConf, 'near', 0, 100).onChange(v => updateConfig(c => {c[theme].background.near = v}));
      if (backgroundConf.far !== undefined) bgFolder.add(backgroundConf, 'far', 0, 200).onChange(v => updateConfig(c => {c[theme].background.far = v}));
  }

  bgFolder.open();

  return null;
};

export default BackgroundControls;
