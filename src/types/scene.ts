
export type LightConfig = {
  type: 'ambient' | 'directional' | 'point' | 'hemisphere';
  intensity?: number;
  color?: string;
  position?: [number, number, number];
  groundColor?: string;
  ref?: 'pulsing' | 'flicker' | 'swirl' | 'slowPulse';
};

export type EnvironmentPreset = 'apartment' | 'city' | 'dawn' | 'forest' | 'lobby' | 'night' | 'park' | 'studio' | 'sunset' | 'warehouse';

export type BackgroundConfig = {
  type: 'sky' | 'stars' | 'fog' | 'sparkles' | 'color' | 'environment' | 'gradient' | 'noise' | 'plasma' | 'void' | 'aurora';
  // Sky properties
  sunPosition?: [number, number, number];
  
  // Stars properties
  radius?: number;
  depth?: number;
  count?: number;
  factor?: number;
  saturation?: number;
  fade?: boolean;
  speed?: number;
  
  // Fog properties
  color?: string;
  near?: number;
  far?: number;
  density?: number;
  
  // Sparkles properties
  size?: number;
  opacity?: number;
  scale?: number;
  
  // Color/Gradient properties
  colorTop?: string;
  colorBottom?: string;
  
  // Noise properties
  noiseScale?: number;
  noiseIntensity?: number;
  noiseSpeed?: number;
  
  // Plasma properties
  plasmaSpeed?: number;
  plasmaIntensity?: number;
  plasmaColor1?: string;
  plasmaColor2?: string;
  
  // Aurora properties
  auroraSpeed?: number;
  auroraIntensity?: number;
  auroraColors?: string[];
  
  // Environment properties
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
  type: 'TorusKnot' | 'WobbleField' | 'DistortionSphere' | 'MorphingIcosahedron' | 'WavyGrid' | 'CrystallineSpire' | 'JellyTorus';
  day: SceneThemeConfig;
  night: SceneThemeConfig;
};

export type WorldData = {
  id: string;
  slug: string;
  name: string;
  sceneConfig: SceneConfig;
  scene_config: any;
  cameraPosition: [number, number, number];
  ui_day_color: string;
  ui_night_color: string;
};

// Database type from Supabase
export type DatabaseWorld = {
  created_at: string;
  description: string;
  id: number;
  is_featured: boolean;
  name: string;
  scene_config: any;
  slug: string;
  ui_day_color: string;
  ui_night_color: string;
};
