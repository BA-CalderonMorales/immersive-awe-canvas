import { SceneConfig, BackgroundConfig, MaterialConfig } from '@/types/scene';
import type { Database } from "@database/supabase/types";

type DefaultGeometry = Database['public']['Tables']['default_geometries']['Row'];
type Background = Database['public']['Tables']['backgrounds']['Row'];

export const createSceneConfigFromGeometry = (
  geometry: DefaultGeometry,
  background?: Background
): SceneConfig => {
  const materialConfig = (geometry.material_config as MaterialConfig) || {
    materialType: 'standard',
    metalness: 0.3,
    roughness: 0.4
  };

  const backgroundConfig = background?.background_config as BackgroundConfig || { type: 'void' };

  return {
    type: geometry.geometry_type as SceneConfig['type'],
    day: {
      lights: [
        { type: 'ambient', intensity: 1.5 },
        { type: 'directional', position: [10, 10, 5], intensity: 1 }
      ],
      material: materialConfig,
      background: backgroundConfig,
      mainObjectColor: geometry.color_day || '#ffffff'
    },
    night: {
      lights: [
        { type: 'ambient', intensity: 0.8 },
        { type: 'directional', position: [10, 10, 5], intensity: 0.5 }
      ],
      material: materialConfig,
      background: backgroundConfig,
      mainObjectColor: geometry.color_night || '#ffffff'
    }
  };
};

export const updateSceneConfigBackground = (
  sceneConfig: SceneConfig,
  background: Background
): SceneConfig => {
  const backgroundConfig = background.background_config as BackgroundConfig;
  
  return {
    ...sceneConfig,
    day: {
      ...sceneConfig.day,
      background: backgroundConfig
    },
    night: {
      ...sceneConfig.night,
      background: backgroundConfig
    }
  };
};

export const updateSceneConfigGeometry = (
  sceneConfig: SceneConfig,
  geometry: DefaultGeometry
): SceneConfig => {
  const materialConfig = (geometry.material_config as MaterialConfig) || {
    materialType: 'standard',
    metalness: 0.3,
    roughness: 0.4
  };

  return {
    ...sceneConfig,
    type: geometry.geometry_type as SceneConfig['type'],
    day: {
      ...sceneConfig.day,
      material: materialConfig,
      mainObjectColor: geometry.color_day || '#ffffff'
    },
    night: {
      ...sceneConfig.night,
      material: materialConfig,
      mainObjectColor: geometry.color_night || '#ffffff'
    }
  };
};

// Available geometry types for default scene assignment
const GEOMETRY_TYPES: SceneConfig['type'][] = [
  'TorusKnot',
  'WobbleField', 
  'CrystallineSpire',
  'DistortionSphere',
  'MorphingIcosahedron',
  'WavyGrid',
  'JellyTorus'
];

/**
 * Gets a unique default geometry type for each background ID
 * This ensures each scene has a different default main object
 */
export const getDefaultGeometryForBackground = (
  backgroundId: number,
  availableGeometries?: DefaultGeometry[]
): SceneConfig['type'] => {
  // If we have actual geometry data, use the mapped approach
  if (availableGeometries && availableGeometries.length > 0) {
    const geometryIndex = (backgroundId - 1) % availableGeometries.length;
    const selectedGeometry = availableGeometries[geometryIndex];
    return selectedGeometry.geometry_type as SceneConfig['type'];
  }
  
  // Fallback to hardcoded types based on background ID
  const geometryIndex = (backgroundId - 1) % GEOMETRY_TYPES.length;
  return GEOMETRY_TYPES[geometryIndex];
};