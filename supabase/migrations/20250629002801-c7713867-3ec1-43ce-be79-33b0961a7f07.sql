
-- Comprehensive fix for UI colors to ensure proper contrast in both day and night modes
UPDATE public.worlds 
SET 
  ui_day_color = '#000000',    -- Black for day theme (good contrast on light backgrounds)
  ui_night_color = '#FFFFFF'   -- White for night theme (good contrast on dark backgrounds)  
WHERE ui_day_color IS NULL OR ui_night_color IS NULL OR ui_day_color = '' OR ui_night_color = '';

-- Also ensure existing worlds with potentially poor contrast colors are fixed
UPDATE public.worlds 
SET 
  ui_day_color = CASE 
    WHEN slug = 'genesis-torus' THEN '#000000'
    WHEN slug = 'distortion-sphere' THEN '#000000'
    WHEN slug = 'wobble-field' THEN '#000000'
    WHEN slug = 'crystalline-spire' THEN '#000000'
    WHEN slug = 'quantum-foam' THEN '#000000'
    WHEN slug = 'echoing-void' THEN '#000000'
    WHEN slug = 'solar-flare' THEN '#000000'
    WHEN slug = 'gravity-well' THEN '#000000'
    WHEN slug = 'chromatic-nebula' THEN '#000000'
    WHEN slug = 'temporal-rift' THEN '#000000'
    WHEN slug = 'singularity-garden' THEN '#000000'
    WHEN slug = 'whispering-dunes' THEN '#000000'
    WHEN slug = 'celestial-weave' THEN '#000000'
    WHEN slug = 'mystic-forest' THEN '#000000'
    ELSE '#000000'  -- Default to black for day mode
  END,
  ui_night_color = '#FFFFFF'  -- White for all night themes
WHERE slug IS NOT NULL;
