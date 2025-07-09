
-- Update the Crystalline Spire world with the new light mode configuration
UPDATE public.worlds 
SET scene_config = '{
  "type": "CrystallineSpire",
  "day": { 
    "mainObjectColor": "#E0FFFF", 
    "material": { "roughness": 0.3, "metalness": 0.9, "materialType": "standard" }, 
    "background": { 
      "type": "fog", 
      "color": "#999999", 
      "near": 5, 
      "far": 50,
      "density": 0.02
    }, 
    "lights": [
      { "type": "ambient", "intensity": 1.2 }, 
      { "type": "directional", "position": [5, 15, 5], "intensity": 1.5 }
    ],
    "extras": [
      { "type": "cloud", "position": [-10, 8, -30], "speed": 0.05, "opacity": 0.3, "segments": 20 },
      { "type": "cloud", "position": [15, 12, -25], "speed": 0.08, "opacity": 0.25, "segments": 25 },
      { "type": "cloud", "position": [0, 5, -40], "speed": 0.06, "opacity": 0.2, "segments": 30 }
    ]
  },
  "night": { 
    "mainObjectColor": "#4169E1", 
    "material": { "roughness": 0, "metalness": 1.0, "emissive": "#4169E1", "emissiveIntensity": 0.3, "materialType": "standard" }, 
    "background": { 
      "type": "fog", 
      "color": "#0B0B2F", 
      "near": 3, 
      "far": 35,
      "density": 0.03
    }, 
    "lights": [
      { "type": "ambient", "intensity": 0.3 }, 
      { "type": "point", "position": [0, 10, 0], "intensity": 2, "color": "#4169E1" }, 
      { "type": "point", "position": [-15, 5, -10], "intensity": 1.2, "color": "#6495ED" }
    ],
    "extras": [
      { "type": "cloud", "position": [-8, 6, -20], "speed": 0.03, "opacity": 0.15, "segments": 15 },
      { "type": "cloud", "position": [12, 10, -28], "speed": 0.04, "opacity": 0.12, "segments": 18 },
      { "type": "cloud", "position": [0, 3, -35], "speed": 0.05, "opacity": 0.1, "segments": 22 }
    ]
  }
}'::jsonb 
WHERE name = 'Crystalline Spire';
