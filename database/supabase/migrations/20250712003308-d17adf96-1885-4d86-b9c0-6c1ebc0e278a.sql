-- Enhance all existing backgrounds to be more immersive and thought-provoking
-- Each background will feel minimalistic, realistic, and alive

-- 1. Void Background - Deep cosmic meditation space
UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'void',
  'particleDensity', 200,
  'atmosphericLayers', 4,
  'energyStreams', true,
  'cosmicDrift', 0.3,
  'depthVariation', 1.8
)
WHERE name = 'Infinite Void';

-- 2. Starfield - Living constellation breathing
UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'stars',
  'radius', 300,
  'depth', 80,
  'count', 8000,
  'factor', 6,
  'saturation', 0.1,
  'fade', true,
  'speed', 0.3,
  'twinkleIntensity', 0.4,
  'constellation', true,
  'atmosphericGlow', 0.2
)
WHERE name = 'Starlit Expanse';

-- 3. Cosmic Sparkles - Ethereal energy field
UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'sparkles',
  'count', 300,
  'scale', 25,
  'size', 3,
  'speed', 0.2,
  'opacity', 0.8,
  'color', '#e6f3ff',
  'energyFlow', true,
  'organicMovement', 0.6,
  'depthLayers', 3
)
WHERE name = 'Cosmic Sparkles';

-- 4. Sky - Living atmospheric dome
UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'sky',
  'sunPosition', ARRAY[120, 25, 80],
  'atmosphericDensity', 1.2,
  'cloudFormation', 0.7,
  'lightScattering', 1.5,
  'timeOfDay', 'golden',
  'visibility', 15000,
  'windPattern', 0.3
)
WHERE name = 'Atmospheric Sky';

-- 5. Fog - Mystical breathing atmosphere
UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'fog',
  'color', '#f8fafc',
  'near', 5,
  'far', 200,
  'density', 0.15,
  'movement', 0.4,
  'layering', 3,
  'organicFlow', true,
  'visibility', 80,
  'ambientGlow', 0.3
)
WHERE name = 'Misty Depths';

-- 6. Environment - Immersive HDRI atmosphere
UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'environment',
  'preset', 'city',
  'background', true,
  'blur', 0.1,
  'intensity', 1.2,
  'rotation', 0.5,
  'atmosphericPerspective', true,
  'dynamicRange', 2.0,
  'ambientOcclusion', 0.8
)
WHERE name = 'Urban Environment';

-- 7. Gradient - Living color symphony
UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'gradient',
  'speed', 0.3,
  'colorTop', '#667eea',
  'colorBottom', '#764ba2',
  'noiseIntensity', 0.4,
  'organicFlow', 1.2,
  'atmosphericDepth', 2.0,
  'energyStreams', true,
  'colorShifting', 0.6,
  'depthLayers', 4
)
WHERE name = 'Ethereal Gradient';

-- 8. Sunset - Cinematic atmospheric masterpiece
UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'sunset',
  'intensity', 1.3,
  'atmosphericScattering', 1.8,
  'cloudComplexity', 2.5,
  'colorTemperature', 3200,
  'lightRays', true,
  'timeProgression', 0.1,
  'cinematicGrade', true,
  'volumetricFog', 0.6,
  'horizonGlow', 1.4
)
WHERE name = 'Golden Sunset';

-- Add new immersive backgrounds for variety
INSERT INTO public.backgrounds (name, description, background_config, is_featured, sort_order)
VALUES 
('Plasma Storm', 'Dynamic energy plasma field', jsonb_build_object(
  'type', 'plasma',
  'plasmaSpeed', 0.8,
  'plasmaIntensity', 1.2,
  'plasmaColor1', '#ff0066',
  'plasmaColor2', '#0066ff',
  'organicFlow', 2.0,
  'energyDensity', 1.5,
  'electricField', true,
  'atmosphericCharge', 0.7
), true, 9),

('Aurora Mystique', 'Ethereal northern lights dance', jsonb_build_object(
  'type', 'aurora',
  'auroraSpeed', 0.4,
  'auroraIntensity', 1.8,
  'auroraColors', ARRAY['#00ff88', '#0088ff', '#ff0088', '#88ff00'],
  'atmosphericDepth', 2.2,
  'magneticField', true,
  'solarActivity', 1.3,
  'ionosphericGlow', 0.9
), true, 10),

('Cosmic Noise', 'Living nebula consciousness', jsonb_build_object(
  'type', 'noise',
  'noiseScale', 8.0,
  'noiseIntensity', 1.1,
  'noiseSpeed', 0.08,
  'color', '#1a237e',
  'organicMovement', 1.8,
  'nebulaComplexity', 2.5,
  'starFormation', true,
  'cosmicWind', 0.5
), true, 11);