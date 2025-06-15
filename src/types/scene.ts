export type LightConfig = {
  type: 'ambient' | 'directional' | 'point' | 'hemisphere';
  intensity?: number;
  color?: string;
  position?: [number, number, number];
  groundColor?: string;
  ref?: 'pulsing' | 'flicker' | 'swirl' | 'slowPulse';
};

export type EnvironmentPreset = 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';

export type BackgroundConfig = {
  type: 'sky' | 'stars' | 'fog' | 'sparkles' | 'color' | 'environment';
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
  opacity?: number;
  preset?: EnvironmentPreset;
  blur?: number;
};

export type ExtraConfig = {
    type: 'cloud';
    position: [number, number, number];
    speed: number;
    opacity: number;
    segments?: number;
}

export type MaterialConfig = {
    materialType?: 'standard' | 'physical' | 'toon' | 'lambert' | 'phong' | 'normal' | 'basic' | 'matcap';
    wireframe?: boolean;
    // Common properties
    roughness?: number;
    metalness?: number;
    emissive?: string;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    // For MeshDistortMaterial, often used with standard
    distort?: number;
    speed?: number; // also for distort
    // Physical material properties
    clearcoat?: number;
    clearcoatRoughness?: number;
    ior?: number; // index of refraction
    thickness?: number;
    specularIntensity?: number;
    specularColor?: string;
    // Phong material properties
    shininess?: number;
    // Toon material properties
    gradientMap?: 'three' | 'five';
    // Matcap material properties
    matcapTexture?: 'chrome' | 'purple' | 'gold';
}

export type TorusKnotConfig = {
    p?: number;
    q?: number;
    radius?: number;
    tube?: number;
    tubularSegments?: number;
    radialSegments?: number;
}

export type SceneThemeConfig = {
  mainObjectColor: string;
  material: MaterialConfig;
  background: BackgroundConfig;
  lights: LightConfig[];
  extras?: ExtraConfig[];
  torusKnot?: TorusKnotConfig;
};

export type SceneConfig = {
  type: 'TorusKnot' | 'WobbleField' | 'DistortionSphere' | 'MorphingIcosahedron' | 'WavyGrid';
  day: SceneThemeConfig;
  night: SceneThemeConfig;
};
