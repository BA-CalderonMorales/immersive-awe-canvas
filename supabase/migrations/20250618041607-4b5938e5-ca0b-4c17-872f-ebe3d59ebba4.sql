
UPDATE public.worlds
SET scene_config = '{
  "day": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.3
      },
      {
        "type": "directional",
        "color": "#ffffff",
        "position": [10, 20, 5],
        "intensity": 0.6
      },
      {
        "ref": "slowPulse",
        "type": "point",
        "color": "#6366f1",
        "position": [3, 3, 3],
        "intensity": 0.8
      }
    ],
    "material": {
      "emissive": "#000511",
      "metalness": 0.3,
      "roughness": 0.4,
      "materialType": "standard",
      "emissiveIntensity": 0.03
    },
    "background": {
      "size": 1.2,
      "type": "environment",
      "color": "#f8fafc",
      "count": 100,
      "scale": 15,
      "speed": 0.6,
      "preset": "city",
      "blur": 0
    },
    "mainObjectColor": "#6366f1"
  },
  "type": "WobbleField",
  "night": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 2.835
      },
      {
        "type": "hemisphere",
        "intensity": 2.56,
        "groundColor": "#001122"
      },
      {
        "ref": "slowPulse",
        "type": "point",
        "color": "#a855f7",
        "position": [0, 5, 0],
        "intensity": 3.665
      },
      {
        "ref": "slowPulse",
        "type": "point",
        "color": "#0ea5e9",
        "position": [-5, -2, 5],
        "intensity": 1.59
      }
    ],
    "material": {
      "emissive": "#703ba5",
      "clearcoat": 0.2,
      "metalness": 0.6,
      "roughness": 0.15,
      "materialType": "standard",
      "emissiveIntensity": 2.105,
      "clearcoatRoughness": 0.1,
      "matcapTexture": "gold"
    },
    "background": {
      "fade": true,
      "type": "environment",
      "count": 600,
      "depth": 25,
      "speed": 0.3,
      "factor": 1.5,
      "radius": 581.08,
      "saturation": 0.5,
      "preset": "night",
      "blur": 0
    },
    "mainObjectColor": "#0f6b23"
  }
}'::jsonb
WHERE name = 'Wobble Field';
