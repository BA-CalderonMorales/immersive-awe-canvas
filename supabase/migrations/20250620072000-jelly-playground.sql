INSERT INTO public.worlds (name, description, scene_config)
VALUES (
  'Jelly Playground',
  'A bouncy field of shapes you can grab and toss.',
  '{
    "type": "PhysicsPlayground",
    "day": {
      "mainObjectColor": "#ff69b4",
      "material": { "roughness": 0.2 },
      "background": { "type": "sky", "sunPosition": [5,5,5] },
      "lights": [
        { "type": "ambient", "intensity": 0.8 },
        { "type": "directional", "position": [5,10,5], "intensity": 0.8 }
      ]
    },
    "night": {
      "mainObjectColor": "#ff69b4",
      "material": { "roughness": 0.5 },
      "background": { "type": "stars", "radius": 200, "depth": 50, "count": 2000, "factor": 4, "saturation": 0.5, "fade": true, "speed": 0.5 },
      "lights": [
        { "type": "ambient", "intensity": 0.2 },
        { "type": "point", "position": [0,5,0], "intensity": 1.5, "color": "#ff69b4" }
      ]
    }
  }'::jsonb
);
