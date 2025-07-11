-- Update default geometries with more visually appealing configurations
UPDATE public.default_geometries 
SET 
  material_config = jsonb_build_object(
    'opacity', 1,
    'emissive', '#FF6B35',
    'metalness', 0.8,
    'roughness', 0.2,
    'wireframe', false,
    'transparent', false,
    'materialType', 'physical',
    'emissiveIntensity', 0.1,
    'clearcoat', 0.7,
    'clearcoatRoughness', 0.1,
    'ior', 1.5
  ),
  color_day = '#FFD700',
  color_night = '#dde2e4'
WHERE geometry_type = 'TorusKnot';

UPDATE public.default_geometries 
SET 
  material_config = jsonb_build_object(
    'opacity', 0.9,
    'emissive', '#FF4500',
    'metalness', 0.1,
    'roughness', 0.8,
    'wireframe', false,
    'transparent', true,
    'materialType', 'physical',
    'emissiveIntensity', 0.15,
    'clearcoat', 0.3,
    'clearcoatRoughness', 0.6,
    'ior', 1.8,
    'thickness', 2.0
  ),
  color_day = '#FF6347',
  color_night = '#4169E1'
WHERE geometry_type = 'DistortionSphere';

UPDATE public.default_geometries 
SET 
  material_config = jsonb_build_object(
    'opacity', 0.85,
    'emissive', '#00FF7F',
    'metalness', 0.6,
    'roughness', 0.3,
    'wireframe', false,
    'transparent', true,
    'materialType', 'physical',
    'emissiveIntensity', 0.12,
    'clearcoat', 0.9,
    'clearcoatRoughness', 0.05,
    'ior', 1.7,
    'specularIntensity', 1.2
  ),
  color_day = '#00CED1',
  color_night = '#32CD32'
WHERE geometry_type = 'WobbleField';

UPDATE public.default_geometries 
SET 
  material_config = jsonb_build_object(
    'opacity', 1,
    'emissive', '#8A2BE2',
    'metalness', 0.95,
    'roughness', 0.05,
    'wireframe', false,
    'transparent', false,
    'materialType', 'physical',
    'emissiveIntensity', 0.08,
    'clearcoat', 1.0,
    'clearcoatRoughness', 0.02,
    'ior', 2.4,
    'specularIntensity', 1.5
  ),
  color_day = '#DDA0DD',
  color_night = '#9370DB'
WHERE geometry_type = 'CrystallineSpire';

UPDATE public.default_geometries 
SET 
  material_config = jsonb_build_object(
    'opacity', 1,
    'emissive', '#4A90E2',
    'metalness', 0.9,
    'roughness', 0.1,
    'wireframe', false,
    'transparent', false,
    'materialType', 'physical',
    'emissiveIntensity', 0.15,
    'clearcoat', 0.8,
    'clearcoatRoughness', 0.08,
    'ior', 1.9,
    'specularIntensity', 1.3
  ),
  color_day = '#00BFFF',
  color_night = '#FF6347'
WHERE geometry_type = 'MorphingIcosahedron';

UPDATE public.default_geometries 
SET 
  material_config = jsonb_build_object(
    'opacity', 0.95,
    'emissive', '#32CD32',
    'metalness', 0.7,
    'roughness', 0.25,
    'wireframe', false,
    'transparent', true,
    'materialType', 'physical',
    'emissiveIntensity', 0.1,
    'clearcoat', 0.6,
    'clearcoatRoughness', 0.15,
    'ior', 1.6
  ),
  color_day = '#32CD32',
  color_night = '#FF69B4'
WHERE geometry_type = 'WavyGrid';

UPDATE public.default_geometries 
SET 
  material_config = jsonb_build_object(
    'opacity', 0.8,
    'emissive', '#FF1493',
    'metalness', 0.05,
    'roughness', 0.95,
    'wireframe', false,
    'transparent', true,
    'materialType', 'physical',
    'emissiveIntensity', 0.05,
    'clearcoat', 0.9,
    'clearcoatRoughness', 0.2,
    'ior', 1.4,
    'thickness', 1.5,
    'specularIntensity', 0.8
  ),
  color_day = '#FF1493',
  color_night = '#00CED1'
WHERE geometry_type = 'JellyTorus';