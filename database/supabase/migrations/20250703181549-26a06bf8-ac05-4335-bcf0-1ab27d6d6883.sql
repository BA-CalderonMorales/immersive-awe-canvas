-- Update default geometries to pure white
UPDATE default_geometries 
SET color_day = '#ffffff',
    color_night = '#ffffff'
WHERE geometry_type IN ('TorusKnot', 'DistortionSphere', 'MorphingIcosahedron', 'WavyGrid', 'JellyTorus');