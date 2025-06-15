export type LightConfig = {
  type: 'ambient' | 'directional' | 'point' | 'hemisphere';
  intensity?: number;
  color?: string;
  position?: [number, number, number];
  groundColor?: string;
  ref?: 'pulsing' | 'flicker' | 'swirl' | 'slowPulse';
};

export type BackgroundConfig = {
  type: 'sky' | 'stars' | 'fog' | 'sparkles';
  sunPosition?: [number, number, number];
  radius?: number;
  depth?: number;
  count?: number;
  factor?: number;
  saturation?: number;
  fade?: boolean;
  speed?: number;
  color?: string;
  near?: number;
  far?: number;
  scale?: number;
  size?: number;
};

export type ExtraConfig = {
    type: 'cloud';
    position: [number, number, number];
    speed: number;
    opacity: number;
    segments?: number;
}

export type MaterialConfig = {
    roughness?: number;
    metalness?: number;
    distort?: number;
    speed?: number;
    emissive?: string;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
}

export type SceneThemeConfig = {
  mainObjectColor: string;
  material: MaterialConfig;
  background: BackgroundConfig;
  lights: LightConfig[];
  extras?: ExtraConfig[];
};

export type SceneConfig = {
  type: 'TorusKnot' | 'WobbleField' | 'DistortionSphere';
  day: SceneThemeConfig;
  night: SceneThemeConfig;
};
