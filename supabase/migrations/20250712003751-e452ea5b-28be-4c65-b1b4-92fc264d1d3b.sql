-- Fix background configurations to use supported properties only
-- Remove unsupported properties that cause black screens

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'void'
)
WHERE name = 'Infinite Void';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'stars',
  'radius', 300,
  'depth', 80,
  'count', 8000,
  'factor', 6,
  'saturation', 0.1,
  'fade', true,
  'speed', 0.3
)
WHERE name = 'Starlit Expanse';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'sparkles',
  'count', 300,
  'scale', 25,
  'size', 3,
  'speed', 0.2,
  'opacity', 0.8,
  'color', '#e6f3ff'
)
WHERE name = 'Cosmic Sparkles';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'sky',
  'sunPosition', ARRAY[120, 25, 80]
)
WHERE name = 'Atmospheric Sky';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'fog',
  'color', '#f8fafc',
  'near', 5,
  'far', 200
)
WHERE name = 'Misty Depths';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'environment',
  'preset', 'city',
  'background', true,
  'blur', 0.1
)
WHERE name = 'Urban Environment';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'gradient',
  'speed', 0.3,
  'colorTop', '#667eea',
  'colorBottom', '#764ba2'
)
WHERE name = 'Ethereal Gradient';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'sunset'
)
WHERE name = 'Golden Sunset';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'plasma',
  'plasmaSpeed', 0.8,
  'plasmaIntensity', 1.2,
  'plasmaColor1', '#ff0066',
  'plasmaColor2', '#0066ff'
)
WHERE name = 'Plasma Storm';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'aurora',
  'auroraSpeed', 0.4,
  'auroraIntensity', 1.8,
  'auroraColors', ARRAY['#00ff88', '#0088ff', '#ff0088', '#88ff00']
)
WHERE name = 'Aurora Mystique';

UPDATE public.backgrounds 
SET background_config = jsonb_build_object(
  'type', 'noise',
  'noiseScale', 8.0,
  'noiseIntensity', 1.1,
  'noiseSpeed', 0.08,
  'color', '#1a237e'
)
WHERE name = 'Cosmic Noise';