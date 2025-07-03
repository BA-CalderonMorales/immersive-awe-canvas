-- Update default geometries to have white metallic materials
UPDATE default_geometries 
SET material_config = jsonb_build_object(
  'materialType', 'standard',
  'metalness', 0.8,
  'roughness', 0.2,
  'wireframe', false,
  'transparent', false,
  'opacity', 1.0
),
color_day = '#ffffff',
color_night = '#f8f9fa'
WHERE geometry_type IN ('TorusKnot', 'DistortionSphere', 'MorphingIcosahedron', 'WavyGrid', 'JellyTorus');