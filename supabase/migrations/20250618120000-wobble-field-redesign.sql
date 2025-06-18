
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
        "intensity": 1.2
      },
      {
        "type": "point",
        "color": "#00aaff",
        "position": [5, 5, 5],
        "intensity": 1.5,
        "ref": "swirl"
      }
    ],
    "material": {
      "materialType": "standard",
      "roughness": 0.4,
      "metalness": 0.6,
      "emissive": "#001122",
      "emissiveIntensity": 0.1
    },
    "background": {
      "type": "sparkles",
      "color": "#88ccff",
      "count": 400,
      "scale": 8,
      "size": 2,
      "speed": 1.5
    },
    "mainObjectColor": "#0088ff"
  },
  "type": "WobbleField",
  "night": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.1
      },
      {
        "type": "hemisphere",
        "intensity": 0.4,
        "groundColor": "#001122"
      },
      {
        "type": "point",
        "color": "#ff3366",
        "position": [0, 8, 0],
        "intensity": 2.5,
        "ref": "pulsing"
      },
      {
        "type": "point",
        "color": "#3366ff",
        "position": [-8, -4, 8],
        "intensity": 1.8,
        "ref": "flicker"
      }
    ],
    "material": {
      "materialType": "physical",
      "roughness": 0.2,
      "metalness": 0.8,
      "emissive": "#330022",
      "emissiveIntensity": 0.3,
      "clearcoat": 0.5,
      "clearcoatRoughness": 0.1
    },
    "background": {
      "type": "stars",
      "count": 2000,
      "radius": 150,
      "depth": 50,
      "factor": 4,
      "speed": 1,
      "saturation": 0.8,
      "fade": true
    },
    "mainObjectColor": "#ff2266"
  }
}'::jsonb
WHERE name = 'Wobble Field';
