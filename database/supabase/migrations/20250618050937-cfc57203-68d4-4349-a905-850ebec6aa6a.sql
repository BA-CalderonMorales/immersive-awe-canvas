
-- Update the Crystalline Spire world to use the correct scene type
UPDATE public.worlds 
SET scene_config = jsonb_set(
  scene_config, 
  '{type}', 
  '"CrystallineSpire"'
) 
WHERE name = 'Crystalline Spire';
