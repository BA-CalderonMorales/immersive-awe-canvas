
UPDATE public.worlds
SET scene_config = '{
  "day": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 1.5
      },
      {
        "type": "directional",
        "position": [
          10,
          10,
          5
        ],
        "intensity": 1
      }
    ],
    "material": {
      "metalness": 0.3,
      "roughness": 0.5,
      "materialType": "standard"
    },
    "background": {
      "type": "sky",
      "sunPosition": [
        10,
        10,
        5
      ]
    },
    "mainObjectColor": "#f97316"
  },
  "type": "TorusKnot",
  "night": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 4.025
      },
      {
        "type": "point",
        "color": "#e8e1de",
        "position": [
          1.6,
          -44.4,
          17.2
        ],
        "intensity": 1.855
      },
      {
        "type": "point",
        "color": "#e5e5f1",
        "position": [
          109.6,
          95.6,
          4
        ],
        "intensity": 4.415
      }
    ],
    "material": {
      "metalness": 0.896,
      "roughness": 0.277,
      "materialType": "normal"
    },
    "background": {
      "fade": true,
      "type": "stars",
      "count": 2700,
      "depth": 50,
      "speed": 0.6,
      "factor": 4.04,
      "radius": 67.66,
      "saturation": 0.014
    },
    "mainObjectColor": "#189a62"
  }
}'::jsonb
WHERE name = 'Genesis Torus';
