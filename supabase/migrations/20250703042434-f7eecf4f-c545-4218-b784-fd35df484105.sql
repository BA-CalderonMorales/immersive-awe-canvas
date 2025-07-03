-- Update Genesis Torus to use beautiful sunset background instead of blinding sky
UPDATE worlds 
SET scene_config = jsonb_set(
  scene_config,
  '{day,background}',
  '{"type": "sunset", "speed": 0.3, "colorTop": "#87CEEB", "colorMiddle": "#FFA500", "colorBottom": "#FF6347"}'::jsonb
)
WHERE name = 'Genesis Torus';