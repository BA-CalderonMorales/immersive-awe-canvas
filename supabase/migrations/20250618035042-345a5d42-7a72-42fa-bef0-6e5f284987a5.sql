
-- First, let's reset Quantum Foam back to its original simple sphere design
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
        "intensity": 1.0
      }
    ],
    "material": {
      "materialType": "standard",
      "roughness": 0.4,
      "metalness": 0.6
    },
    "background": {
      "type": "color",
      "color": "#f0f8ff"
    },
    "mainObjectColor": "#00ff88"
  },
  "type": "DistortionSphere",
  "night": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.1
      },
      {
        "type": "point",
        "color": "#00ff88",
        "position": [0, 0, 5],
        "intensity": 2.0
      }
    ],
    "material": {
      "materialType": "physical",
      "roughness": 0.1,
      "metalness": 0.9
    },
    "background": {
      "type": "stars",
      "count": 1000,
      "radius": 100
    },
    "mainObjectColor": "#00ff88"
  }
}'::jsonb
WHERE name = 'Quantum Foam';

-- Now apply the contemplative design to Wobble Field with even more thought-provoking elements
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
        "type": "point",
        "color": "#6366f1",
        "position": [3, 3, 3],
        "intensity": 0.8,
        "ref": "slowPulse"
      }
    ],
    "material": {
      "materialType": "standard",
      "roughness": 0.4,
      "metalness": 0.3,
      "emissive": "#000511",
      "emissiveIntensity": 0.03
    },
    "background": {
      "type": "sparkles",
      "color": "#f8fafc",
      "count": 100,
      "scale": 15,
      "size": 1.2,
      "speed": 0.6
    },
    "mainObjectColor": "#6366f1"
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
        "intensity": 0.2,
        "groundColor": "#001122"
      },
      {
        "type": "point",
        "color": "#a855f7",
        "position": [0, 5, 0],
        "intensity": 1.2,
        "ref": "slowPulse"
      },
      {
        "type": "point",
        "color": "#0ea5e9",
        "position": [-5, -2, 5],
        "intensity": 0.8,
        "ref": "slowPulse"
      }
    ],
    "material": {
      "materialType": "physical",
      "roughness": 0.15,
      "metalness": 0.6,
      "emissive": "#110022",
      "emissiveIntensity": 0.08,
      "clearcoat": 0.2,
      "clearcoatRoughness": 0.1
    },
    "background": {
      "type": "stars",
      "count": 600,
      "radius": 100,
      "depth": 25,
      "factor": 1.5,
      "speed": 0.3,
      "saturation": 0.5,
      "fade": true
    },
    "mainObjectColor": "#a855f7"
  }
}'::jsonb
WHERE name = 'Wobble Field';
