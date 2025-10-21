-- Add new sophisticated geometry types with advanced materials
-- These geometries feature physical materials, transmission, clearcoat for depth and immersion

-- Insert FibonacciSphere: Golden ratio-based sphere with glass-like properties
INSERT INTO public.default_geometries (
  name, 
  description, 
  geometry_type, 
  material_config, 
  color_day, 
  color_night, 
  is_featured, 
  sort_order
) VALUES (
  'Fibonacci Sphere',
  'Mathematical perfection: 1000 points arranged in golden ratio spiral',
  'FibonacciSphere',
  '{
    "materialType": "physical",
    "metalness": 0.1,
    "roughness": 0.05,
    "transmission": 0.95,
    "thickness": 0.5,
    "clearcoat": 1.0,
    "clearcoatRoughness": 0.1,
    "ior": 1.5,
    "emissive": "#4db8ff",
    "emissiveIntensity": 0.3,
    "transparent": true,
    "opacity": 0.6
  }'::jsonb,
  '#4db8ff',
  '#ff6b9d',
  true,
  5
);

-- Insert SacredGeometry: Metatron's Cube with metallic nested platonic solids
INSERT INTO public.default_geometries (
  name,
  description,
  geometry_type,
  material_config,
  color_day,
  color_night,
  is_featured,
  sort_order
) VALUES (
  'Sacred Geometry',
  'Ancient wisdom: Nested platonic solids forming Metatron''s Cube',
  'SacredGeometry',
  '{
    "materialType": "standard",
    "metalness": 0.8,
    "roughness": 0.2,
    "emissive": "#ffd700",
    "emissiveIntensity": 0.5,
    "transparent": false,
    "opacity": 1.0
  }'::jsonb,
  '#ffd700',
  '#9370db',
  true,
  6
);

-- Insert MandalaFlower: 21 petals in golden spiral with luminescent effects
INSERT INTO public.default_geometries (
  name,
  description,
  geometry_type,
  material_config,
  color_day,
  color_night,
  is_featured,
  sort_order
) VALUES (
  'Mandala Flower',
  'Natural beauty: 21 petals arranged in fibonacci golden spiral',
  'MandalaFlower',
  '{
    "materialType": "physical",
    "metalness": 0.3,
    "roughness": 0.4,
    "clearcoat": 0.6,
    "clearcoatRoughness": 0.3,
    "emissive": "#ff1493",
    "emissiveIntensity": 0.4,
    "transparent": true,
    "opacity": 0.85
  }'::jsonb,
  '#ff1493',
  '#00ced1',
  true,
  7
);

-- Update CrystallineSpire with enhanced physical materials for glass-like depth
UPDATE public.default_geometries 
SET 
  material_config = '{
    "materialType": "physical",
    "metalness": 0.1,
    "roughness": 0.05,
    "transmission": 0.7,
    "thickness": 0.8,
    "clearcoat": 1.0,
    "clearcoatRoughness": 0.05,
    "ior": 2.4,
    "emissive": "#4db8ff",
    "emissiveIntensity": 0.2,
    "transparent": true,
    "opacity": 0.9
  }'::jsonb,
  color_day = '#e0ffff',
  color_night = '#9370db',
  description = 'Crystalline monument with prismatic glass-like surfaces'
WHERE geometry_type = 'CrystallineSpire';

-- Update TorusKnot with warm metallic materials for day/night contrast
UPDATE public.default_geometries 
SET 
  material_config = '{
    "materialType": "standard",
    "metalness": 0.9,
    "roughness": 0.1,
    "emissive": "#ff6b35",
    "emissiveIntensity": 0.15,
    "transparent": false,
    "opacity": 1.0
  }'::jsonb,
  color_day = '#ffd700',
  color_night = '#87ceeb',
  description = 'Primordial torus knot with warm metallic finish'
WHERE geometry_type = 'TorusKnot';

-- Update DistortionSphere with vibrant emissive properties
UPDATE public.default_geometries 
SET 
  material_config = '{
    "materialType": "physical",
    "metalness": 0.7,
    "roughness": 0.2,
    "emissive": "#ff4500",
    "emissiveIntensity": 0.25,
    "clearcoat": 0.5,
    "clearcoatRoughness": 0.2,
    "transparent": false,
    "opacity": 1.0
  }'::jsonb,
  color_day = '#ff6347',
  color_night = '#4169e1',
  description = 'Chaotic spherical form with pulsing energy'
WHERE geometry_type = 'DistortionSphere';

-- Update WobbleField with enhanced luminous properties
UPDATE public.default_geometries 
SET 
  material_config = '{
    "materialType": "standard",
    "metalness": 0.3,
    "roughness": 0.4,
    "emissive": "#00ff7f",
    "emissiveIntensity": 0.3,
    "transparent": false,
    "opacity": 1.0
  }'::jsonb,
  color_day = '#00ced1',
  color_night = '#32cd32',
  description = 'Reality-bending field with ethereal glow'
WHERE geometry_type = 'WobbleField';

-- Enhance background configurations for richer visual experiences
-- Update Starry Night with deeper space and more stars
UPDATE public.backgrounds 
SET 
  background_config = '{
    "type": "stars",
    "radius": 150,
    "depth": 100,
    "count": 5000,
    "factor": 6.5,
    "saturation": 0.3,
    "fade": true,
    "speed": 0.4,
    "color": "#ffffff"
  }'::jsonb,
  description = 'Deep space star field with thousands of twinkling stars'
WHERE name = 'Starry Night';

-- Update Sunset Glory with more vibrant gradient colors
UPDATE public.backgrounds 
SET 
  background_config = '{
    "type": "sunset",
    "colorTop": "#ff4500",
    "colorMiddle": "#ff8c00",
    "colorBottom": "#ffd700",
    "speed": 0.25,
    "intensity": 1.4,
    "noiseScale": 2.5
  }'::jsonb,
  description = 'Vibrant sunset with rich golden-orange gradients'
WHERE name = 'Sunset Glory';

-- Update Aurora Dreams with more dynamic colors and movement
UPDATE public.backgrounds 
SET 
  background_config = '{
    "type": "aurora",
    "auroraSpeed": 0.9,
    "auroraIntensity": 1.6,
    "auroraColors": ["#00ff88", "#7b68ee", "#ff69b4", "#00ced1", "#ffd700"],
    "noiseScale": 1.8,
    "opacity": 0.95
  }'::jsonb,
  description = 'Mystical aurora with flowing multi-colored light waves'
WHERE name = 'Aurora Dreams';

-- Update Void Space with subtle depth
UPDATE public.backgrounds 
SET 
  background_config = '{
    "type": "void",
    "intensity": 1.0,
    "contrast": 1.1
  }'::jsonb,
  description = 'Minimalist void with subtle atmospheric depth'
WHERE name = 'Void Space';

-- Update Forest Environment with enhanced atmosphere
UPDATE public.backgrounds 
SET 
  background_config = '{
    "type": "environment",
    "preset": "forest",
    "blur": 0.4,
    "intensity": 1.2
  }'::jsonb,
  description = 'Peaceful forest environment with soft atmospheric blur'
WHERE name = 'Forest Environment';

-- Add new Plasma Storm background
INSERT INTO public.backgrounds (
  name,
  description,
  background_config,
  is_featured,
  sort_order
) VALUES (
  'Plasma Storm',
  'Electric plasma field with dynamic color shifts',
  '{
    "type": "plasma",
    "plasmaSpeed": 1.0,
    "plasmaIntensity": 1.3,
    "plasmaColor1": "#ff0080",
    "plasmaColor2": "#00ffff"
  }'::jsonb,
  true,
  6
);

-- Add new Nebula Cloud background
INSERT INTO public.backgrounds (
  name,
  description,
  background_config,
  is_featured,
  sort_order
) VALUES (
  'Nebula Cloud',
  'Cosmic nebula with swirling gases and deep colors',
  '{
    "type": "nebula",
    "nebulaSpeed": 0.3,
    "nebulaIntensity": 1.5,
    "nebulaColors": ["#8b00ff", "#ff1493", "#00bfff"],
    "noiseScale": 3.0,
    "opacity": 0.9
  }'::jsonb,
  true,
  7
);

-- Add new Ethereal Gradient background
INSERT INTO public.backgrounds (
  name,
  description,
  background_config,
  is_featured,
  sort_order
) VALUES (
  'Ethereal Gradient',
  'Smooth animated gradient with subtle color transitions',
  '{
    "type": "gradient",
    "colorTop": "#667eea",
    "colorBottom": "#764ba2",
    "speed": 0.4,
    "noiseIntensity": 0.4
  }'::jsonb,
  true,
  8
);
