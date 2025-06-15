
UPDATE public.worlds
SET scene_config = '{
  "day": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.535
      },
      {
        "type": "directional",
        "color": "white",
        "position": [
          27.2,
          -90.8,
          -200
        ],
        "intensity": 1.695
      }
    ],
    "material": {
      "speed": 3,
      "distort": 0.8,
      "roughness": 0.652,
      "materialType": "physical"
    },
    "background": {
      "size": 3,
      "type": "sparkles",
      "color": "#00ccff",
      "count": 200,
      "scale": 5,
      "speed": 2.43
    },
    "mainObjectColor": "#00aaff"
  },
  "type": "DistortionSphere",
  "night": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.1
      },
      {
        "type": "hemisphere",
        "intensity": 0.5,
        "groundColor": "black"
      },
      {
        "ref": "pulsing",
        "type": "point",
        "color": "#ff4500",
        "position": [
          0,
          0,
          0
        ],
        "intensity": 2
      }
    ],
    "material": {
      "speed": 3,
      "distort": 0.8,
      "roughness": 0,
      "materialType": "standard"
    },
    "background": {
      "fade": true,
      "type": "stars",
      "count": 3000,
      "depth": 60,
      "speed": 1.5,
      "factor": 5,
      "radius": 200,
      "saturation": 1
    },
    "mainObjectColor": "#ff4500"
  }
}'::jsonb
WHERE name = 'Distortion Sphere';
