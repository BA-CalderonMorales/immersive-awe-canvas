
UPDATE public.worlds
SET scene_config = jsonb_set(
  scene_config,
  '{night,background}',
  '{
    "type": "sparkles",
    "count": 200,
    "scale": 40,
    "size": 1,
    "speed": 0.2,
    "color": "#1e1b4b",
    "opacity": 0.3
  }'::jsonb
)
WHERE name = 'Wobble Field';
