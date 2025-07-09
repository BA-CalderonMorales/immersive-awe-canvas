
-- Enhance Wobble Field with more captivating lighting and unique atmospheric backgrounds
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
        "intensity": 0.7
      },
      {
        "type": "point",
        "color": "#4f46e5",
        "position": [4, 6, 2],
        "intensity": 1.2,
        "ref": "slowPulse"
      },
      {
        "type": "point",
        "color": "#06b6d4",
        "position": [-3, 2, 4],
        "intensity": 0.9,
        "ref": "swirl"
      },
      {
        "type": "point",
        "color": "#f59e0b",
        "position": [0, -2, -3],
        "intensity": 0.6,
        "ref": "flicker"
      }
    ],
    "material": {
      "materialType": "physical",
      "roughness": 0.2,
      "metalness": 0.5,
      "emissive": "#001a33",
      "emissiveIntensity": 0.08,
      "clearcoat": 0.4,
      "clearcoatRoughness": 0.1
    },
    "background": {
      "type": "fog",
      "color": "#e0f2fe",
      "near": 1,
      "far": 50
    },
    "extras": [
      {
        "type": "cloud",
        "position": [-20, 8, -25],
        "speed": 0.08,
        "opacity": 0.4,
        "segments": 45
      },
      {
        "type": "cloud",
        "position": [15, -5, -30],
        "speed": 0.06,
        "opacity": 0.35,
        "segments": 40
      },
      {
        "type": "cloud",
        "position": [0, 12, -40],
        "speed": 0.04,
        "opacity": 0.3,
        "segments": 50
      },
      {
        "type": "cloud",
        "position": [-10, -8, -20],
        "speed": 0.07,
        "opacity": 0.45,
        "segments": 35
      }
    ],
    "mainObjectColor": "#4f46e5"
  },
  "type": "WobbleField",
  "night": {
    "lights": [
      {
        "type": "ambient",
        "intensity": 0.05
      },
      {
        "type": "hemisphere",
        "intensity": 0.3,
        "groundColor": "#000d1a"
      },
      {
        "type": "point",
        "color": "#8b5cf6",
        "position": [0, 8, 0],
        "intensity": 2.0,
        "ref": "slowPulse"
      },
      {
        "type": "point",
        "color": "#ec4899",
        "position": [-6, -1, 7],
        "intensity": 1.4,
        "ref": "swirl"
      },
      {
        "type": "point",
        "color": "#06b6d4",
        "position": [5, 3, -4],
        "intensity": 1.1,
        "ref": "flicker"
      },
      {
        "type": "point",
        "color": "#f59e0b",
        "position": [0, -6, 3],
        "intensity": 0.8,
        "ref": "pulsing"
      }
    ],
    "material": {
      "materialType": "physical",
      "roughness": 0.05,
      "metalness": 0.8,
      "emissive": "#1a0d33",
      "emissiveIntensity": 0.15,
      "clearcoat": 0.6,
      "clearcoatRoughness": 0.02,
      "ior": 1.8
    },
    "background": {
      "type": "environment",
      "preset": "night",
      "background": true,
      "blur": 0.8
    },
    "extras": [
      {
        "type": "cloud",
        "position": [-25, 5, -35],
        "speed": 0.03,
        "opacity": 0.15,
        "segments": 60
      },
      {
        "type": "cloud",
        "position": [20, -3, -45],
        "speed": 0.02,
        "opacity": 0.12,
        "segments": 55
      },
      {
        "type": "cloud",
        "position": [0, 15, -50],
        "speed": 0.025,
        "opacity": 0.1,
        "segments": 65
      }
    ],
    "mainObjectColor": "#8b5cf6"
  }
}'::jsonb
WHERE name = 'Wobble Field';
