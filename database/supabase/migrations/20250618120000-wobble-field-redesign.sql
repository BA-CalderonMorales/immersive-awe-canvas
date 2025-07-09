
UPDATE public.worlds
SET scene_config = '{
  "day": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.4
      },
      {
        "type": "directional",
        "color": "#ffffff",
        "position": [10, 20, 5],
        "intensity": 0.8
      },
      {
        "type": "point",
        "color": "#4a90e2",
        "position": [3, 3, 3],
        "intensity": 1.0,
        "ref": "slowPulse"
      }
    ],
    "material": {
      "materialType": "standard",
      "roughness": 0.3,
      "metalness": 0.4,
      "emissive": "#001133",
      "emissiveIntensity": 0.05
    },
    "background": {
      "type": "sparkles",
      "color": "#e8f4fd",
      "count": 150,
      "scale": 12,
      "size": 1.5,
      "speed": 0.8
    },
    "mainObjectColor": "#4a90e2"
  },
  "type": "WobbleField",
  "night": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.15
      },
      {
        "type": "hemisphere",
        "intensity": 0.3,
        "groundColor": "#001122"
      },
      {
        "type": "point",
        "color": "#8b5cf6",
        "position": [0, 5, 0],
        "intensity": 1.5,
        "ref": "slowPulse"
      },
      {
        "type": "point",
        "color": "#06b6d4",
        "position": [-5, -2, 5],
        "intensity": 1.0,
        "ref": "slowPulse"
      }
    ],
    "material": {
      "materialType": "physical",
      "roughness": 0.1,
      "metalness": 0.7,
      "emissive": "#220033",
      "emissiveIntensity": 0.1,
      "clearcoat": 0.3,
      "clearcoatRoughness": 0.05
    },
    "background": {
      "type": "stars",
      "count": 800,
      "radius": 100,
      "depth": 30,
      "factor": 2,
      "speed": 0.5,
      "saturation": 0.6,
      "fade": true
    },
    "mainObjectColor": "#8b5cf6"
  }
}'::jsonb
WHERE name = 'Wobble Field';
