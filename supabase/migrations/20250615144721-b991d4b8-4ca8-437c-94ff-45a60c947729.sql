
-- Update scene_config for Distortion Sphere world
UPDATE worlds
SET scene_config = '{
  "day": {
    "extras": [
      { "type": "cloud", "speed": 0.2, "opacity": 0.5, "position": [-4, -2, -25] },
      { "type": "cloud", "speed": 0.2, "opacity": 0.3, "position": [4, 2, -15] },
      { "type": "cloud", "speed": 0.2, "opacity": 0.4, "position": [-4, 2, -10] }
    ],
    "lights": [
      { "type": "ambient", "intensity": 1 },
      { "type": "directional", "color": "white", "position": [5, 5, 5], "intensity": 1.5 }
    ],
    "material": { "roughness": 0.069, "materialType": "physical" },
    "background": { "far": 20, "near": 0, "type": "environment", "color": "#aaccff", "preset": "forest", "blur": 0.5 },
    "mainObjectColor": "#4682b4"
  },
  "type": "DistortionSphere",
  "night": {
    "lights": [
      { "type": "ambient", "intensity": 0.2 },
      { "type": "point", "color": "lightblue", "position": [0, 0, 0], "intensity": 0.155 }
    ],
    "material": { "roughness": 0.042, "materialType": "physical" },
    "background": { "fade": true, "type": "environment", "count": 2000, "depth": 50, "speed": 2, "factor": 7, "radius": 100, "saturation": 0, "preset": "night", "blur": 0.436 },
    "mainObjectColor": "#1e90ff"
  }
}'::jsonb
WHERE name = 'Distortion Sphere';
