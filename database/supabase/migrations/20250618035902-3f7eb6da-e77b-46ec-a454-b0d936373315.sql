
-- Significantly reduce chaos and create a unique atmospheric background for Wobble Field
UPDATE public.worlds
SET scene_config = '{
  "day": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.6
      },
      {
        "type": "directional",
        "color": "#ffffff",
        "position": [5, 10, 3],
        "intensity": 0.5
      },
      {
        "type": "point",
        "color": "#4f46e5",
        "position": [0, 4, 2],
        "intensity": 0.8,
        "ref": "slowPulse"
      }
    ],
    "material": {
      "materialType": "standard",
      "roughness": 0.4,
      "metalness": 0.3,
      "emissive": "#000511",
      "emissiveIntensity": 0.02
    },
    "background": {
      "type": "sparkles",
      "count": 80,
      "scale": 20,
      "size": 2,
      "speed": 0.3,
      "color": "#f0f9ff",
      "opacity": 0.6
    },
    "mainObjectColor": "#4f46e5"
  },
  "type": "WobbleField",
  "night": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.2
      },
      {
        "type": "hemisphere",
        "intensity": 0.4,
        "groundColor": "#0a0a0f"
      },
      {
        "type": "point",
        "color": "#8b5cf6",
        "position": [0, 6, 0],
        "intensity": 1.2,
        "ref": "slowPulse"
      }
    ],
    "material": {
      "materialType": "standard",
      "roughness": 0.3,
      "metalness": 0.4,
      "emissive": "#110822",
      "emissiveIntensity": 0.04
    },
    "background": {
      "type": "color",
      "color": "#0f0f23"
    },
    "mainObjectColor": "#8b5cf6"
  }
}'::jsonb
WHERE name = 'Wobble Field';
