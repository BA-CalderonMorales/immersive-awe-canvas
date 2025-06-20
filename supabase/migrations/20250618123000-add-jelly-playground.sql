INSERT INTO public.worlds (name, description, scene_config) VALUES (
  'Jelly Playground',
  'A physics sandbox of jiggly shapes.',
  '{
    "type": "PhysicsPlayground",
    "day": {
      "mainObjectColor": "#ff69b4",
      "material": { "roughness": 0.2, "metalness": 0.3 },
      "background": { "type": "color", "color": "#e0f7ff" },
      "lights": [
        { "type": "ambient", "intensity": 0.8 },
        { "type": "directional", "position": [5, 10, 5], "intensity": 0.9 }
      ]
    },
    "night": {
      "mainObjectColor": "#ff69b4",
      "material": { "roughness": 0.2, "metalness": 0.3 },
      "background": { "type": "stars", "radius": 100, "depth": 30, "count": 500, "factor": 2, "saturation": 0.5, "fade": true, "speed": 1 },
      "lights": [
        { "type": "ambient", "intensity": 0.2 },
        { "type": "point", "position": [0, 5, 0], "intensity": 1 }
      ]
    }
  }'
);
