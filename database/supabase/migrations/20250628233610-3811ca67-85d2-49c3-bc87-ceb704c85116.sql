
-- Fix UI colors for distortion-sphere and wobble-field to ensure proper contrast
UPDATE public.worlds 
SET 
  ui_day_color = CASE 
    WHEN slug = 'distortion-sphere' THEN '#000000'  -- Black for day theme
    WHEN slug = 'wobble-field' THEN '#000000'      -- Black for day theme  
    ELSE ui_day_color
  END,
  ui_night_color = CASE 
    WHEN slug = 'distortion-sphere' THEN '#FFFFFF'  -- White for night theme
    WHEN slug = 'wobble-field' THEN '#FFFFFF'       -- White for night theme
    ELSE ui_night_color
  END
WHERE slug IN ('distortion-sphere', 'wobble-field');
