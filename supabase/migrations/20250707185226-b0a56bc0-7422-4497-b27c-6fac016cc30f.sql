-- Update TorusKnot default geometry with specified configuration
UPDATE default_geometries 
SET 
  material_config = '{
    "materialType": "standard",
    "metalness": 0.3,
    "roughness": 0.4,
    "emissive": "#FF6B35",
    "emissiveIntensity": 0.05,
    "wireframe": false,
    "transparent": false,
    "opacity": 1
  }'::jsonb,
  color_day = '#FFD700',
  color_night = '#87CEEB'
WHERE geometry_type = 'TorusKnot';

-- Enhanced background configurations for better visual impact
UPDATE backgrounds 
SET background_config = '{
  "type": "stars",
  "radius": 120,
  "depth": 80,
  "count": 4000,
  "factor": 5.5,
  "saturation": 0.9,
  "fade": true,
  "speed": 0.4,
  "color": "#FFFFFF"
}'::jsonb
WHERE name = 'Starry Night';

UPDATE backgrounds 
SET background_config = '{
  "type": "sunset",
  "colorTop": "#FF4500",
  "colorMiddle": "#FF8C00", 
  "colorBottom": "#FFD700",
  "speed": 0.2,
  "intensity": 1.3,
  "noiseScale": 2.0
}'::jsonb
WHERE name = 'Sunset Glory';

UPDATE backgrounds 
SET background_config = '{
  "type": "environment",
  "preset": "forest",
  "blur": 0.3,
  "intensity": 1.1
}'::jsonb
WHERE name = 'Forest Environment';

UPDATE backgrounds 
SET background_config = '{
  "type": "aurora",
  "auroraSpeed": 0.8,
  "auroraIntensity": 1.5,
  "auroraColors": ["#00FF7F", "#7B68EE", "#FF69B4", "#00CED1"],
  "noiseScale": 1.5,
  "opacity": 0.9
}'::jsonb
WHERE name = 'Aurora Dreams';

UPDATE backgrounds 
SET background_config = '{
  "type": "void",
  "intensity": 0.95,
  "contrast": 1.2
}'::jsonb
WHERE name = 'Void Space';

-- Add new vibrant backgrounds
INSERT INTO backgrounds (name, description, background_config, is_featured, sort_order) VALUES
('Cosmic Plasma', 'Dynamic plasma field with electric colors', '{
  "type": "plasma",
  "plasmaSpeed": 1.2,
  "plasmaIntensity": 0.8,
  "plasmaColor1": "#FF0080",
  "plasmaColor2": "#00FFFF"
}'::jsonb, true, 6),

('Ethereal Gradient', 'Smooth animated gradient backdrop', '{
  "type": "gradient", 
  "colorTop": "#667eea",
  "colorBottom": "#764ba2",
  "speed": 0.5,
  "noiseIntensity": 0.3
}'::jsonb, true, 7),

('Crystal Sparkles', 'Magical sparkle field effect', '{
  "type": "sparkles",
  "count": 150,
  "scale": 12,
  "size": 3,
  "speed": 0.6,
  "opacity": 0.8,
  "color": "#FFD700"
}'::jsonb, true, 8);

-- Add new enhanced geometries
INSERT INTO default_geometries (name, description, geometry_type, material_config, color_day, color_night, is_featured, sort_order) VALUES
('Morphing Icosahedron', 'Dynamic morphing geometric form', 'MorphingIcosahedron', '{
  "materialType": "physical",
  "metalness": 0.8,
  "roughness": 0.2,
  "clearcoat": 0.5,
  "clearcoatRoughness": 0.1,
  "emissive": "#4A90E2",
  "emissiveIntensity": 0.1
}'::jsonb, '#00BFFF', '#FF6347', true, 5),

('Wavy Grid', 'Undulating grid surface', 'WavyGrid', '{
  "materialType": "standard",
  "metalness": 0.4,
  "roughness": 0.6,
  "emissive": "#32CD32", 
  "emissiveIntensity": 0.08
}'::jsonb, '#32CD32', '#FF69B4', true, 6),

('Jelly Torus', 'Soft gelatinous torus shape', 'JellyTorus', '{
  "materialType": "physical", 
  "metalness": 0.1,
  "roughness": 0.9,
  "clearcoat": 0.8,
  "ior": 1.4,
  "thickness": 0.5,
  "emissive": "#FF1493",
  "emissiveIntensity": 0.03
}'::jsonb, '#FF1493', '#00CED1', true, 7);