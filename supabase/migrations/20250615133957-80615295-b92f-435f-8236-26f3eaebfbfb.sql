
-- Step 1: Update 'Genesis Torus' with the new user-provided configuration, adding materialType.
UPDATE public.worlds SET scene_config = '{
  "type": "TorusKnot",
  "day": { "mainObjectColor": "#f97316", "material": { "materialType": "standard", "metalness": 0.3, "roughness": 0.5 }, "background": { "type": "sky", "sunPosition": [10, 10, 5] }, "lights": [{ "type": "ambient", "intensity": 1.5 }, { "type": "directional", "position": [10, 10, 5], "intensity": 1 }] },
  "night": { "mainObjectColor": "#189a62", "material": { "materialType": "standard", "metalness": 0.896, "roughness": 0.277 }, "background": { "type": "stars", "radius": 67.66, "depth": 50, "count": 2700, "factor": 4.04, "saturation": 0.014, "fade": true, "speed": 0.6 }, "lights": [{ "type": "ambient", "intensity": 4.025 }, { "type": "point", "position": [1.6, -44.4, 17.2], "intensity": 1.855, "color": "#e8e1de" }, { "type": "point", "position": [109.6, 95.6, 4], "intensity": 4.415, "color": "#e5e5f1" }] }
}'::jsonb WHERE name = 'Genesis Torus';

-- Step 2: Add materialType to all other worlds for compatibility with the new material system.
UPDATE public.worlds
SET scene_config = jsonb_set(
  jsonb_set(scene_config, '{day,material,materialType}', '"standard"', true), 
  '{night,material,materialType}', 
  '"standard"', 
  true
)
WHERE name != 'Genesis Torus' AND scene_config IS NOT NULL;
