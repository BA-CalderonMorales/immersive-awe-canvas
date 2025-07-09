
-- Step 1: Add a new column to store the scene configuration as JSONB.
-- JSONB is used for better performance and indexing capabilities with JSON data.
ALTER TABLE public.worlds ADD COLUMN scene_config JSONB;

-- Step 2: Update all existing worlds with their unique scene configurations.
-- This structured JSON will be used by a new dynamic renderer component,
-- replacing the static World1, World2, and World3 components.

-- Original Worlds
UPDATE public.worlds SET scene_config = '{
  "type": "TorusKnot",
  "day": { "mainObjectColor": "#f97316", "material": { "roughness": 0.5, "metalness": 0.3 }, "background": { "type": "sky", "sunPosition": [10, 10, 5] }, "lights": [{ "type": "ambient", "intensity": 1.5 }, { "type": "directional", "position": [10, 10, 5], "intensity": 1 }] },
  "night": { "mainObjectColor": "#f97316", "material": { "roughness": 0, "metalness": 0.8 }, "background": { "type": "stars", "radius": 300, "depth": 50, "count": 5000, "factor": 4, "saturation": 0, "fade": true, "speed": 1 }, "lights": [{ "type": "ambient", "intensity": 0.1 }, { "type": "point", "position": [10, 10, 10], "intensity": 2, "color": "#f97316" }, { "type": "point", "position": [-10, -10, -10], "intensity": 1, "color": "#4f46e5" }] }
}'::jsonb WHERE name = 'Genesis Torus';

UPDATE public.worlds SET scene_config = '{
  "type": "WobbleField",
  "day": { "mainObjectColor": "#4682b4", "material": { "roughness": 0.2 }, "background": { "type": "fog", "color": "#aaccff", "near": 0, "far": 20 }, "lights": [{ "type": "ambient", "intensity": 1 }, { "type": "directional", "position": [5, 5, 5], "intensity": 1.5, "color": "white" }], "extras": [{ "type": "cloud", "position": [-4, -2, -25], "speed": 0.2, "opacity": 0.5 }, { "type": "cloud", "position": [4, 2, -15], "speed": 0.2, "opacity": 0.3 }, { "type": "cloud", "position": [-4, 2, -10], "speed": 0.2, "opacity": 0.4 }] },
  "night": { "mainObjectColor": "#1e90ff", "material": { "roughness": 0.2 }, "background": { "type": "stars", "radius": 100, "depth": 50, "count": 2000, "factor": 7, "saturation": 0, "fade": true, "speed": 2 }, "lights": [{ "type": "ambient", "intensity": 0.2 }, { "type": "point", "position": [0, 0, 0], "intensity": 1, "color": "lightblue" }] }
}'::jsonb WHERE name = 'Wobble Field';

UPDATE public.worlds SET scene_config = '{
  "type": "DistortionSphere",
  "day": { "mainObjectColor": "#ffff00", "material": { "distort": 0.8, "speed": 3, "roughness": 0 }, "background": { "type": "sparkles", "count": 200, "scale": 5, "size": 3, "speed": 0.4, "color": "#ffd700" }, "lights": [{ "type": "ambient", "intensity": 0.8 }, { "type": "directional", "position": [0, 10, 5], "intensity": 2, "color": "white" }] },
  "night": { "mainObjectColor": "#ff4500", "material": { "distort": 0.8, "speed": 3, "roughness": 0 }, "background": { "type": "stars", "radius": 200, "depth": 60, "count": 3000, "factor": 5, "saturation": 1, "fade": true, "speed": 1.5 }, "lights": [{ "type": "ambient", "intensity": 0.1 }, { "type": "hemisphere", "groundColor": "black", "intensity": 0.5 }, { "type": "point", "ref": "pulsing", "position": [0, 0, 0], "intensity": 2, "color": "#ff4500" }] }
}'::jsonb WHERE name = 'Distortion Sphere';

-- New Worlds (with unique variations)
UPDATE public.worlds SET scene_config = '{
  "type": "TorusKnot",
  "day": { "mainObjectColor": "#E0FFFF", "material": { "roughness": 0.3, "metalness": 0.9 }, "background": { "type": "sky", "sunPosition": [5, 15, 5] }, "lights": [{ "type": "ambient", "intensity": 1.2 }, { "type": "directional", "position": [5, 15, 5], "intensity": 1.5 }] },
  "night": { "mainObjectColor": "#E0FFFF", "material": { "roughness": 0, "metalness": 1.0, "emissive": "#E0FFFF", "emissiveIntensity": 0.2 }, "background": { "type": "stars", "radius": 400, "depth": 70, "count": 7000, "factor": 3, "saturation": 0, "fade": true, "speed": 0.5 }, "lights": [{ "type": "ambient", "intensity": 0.2 }, { "type": "point", "position": [15, 15, 15], "intensity": 1.5, "color": "#FFFFFF" }, { "type": "point", "position": [-15, -15, -15], "intensity": 1.5, "color": "#00FFFF" }] }
}'::jsonb WHERE name = 'Crystalline Spire';

UPDATE public.worlds SET scene_config = '{
  "type": "WobbleField",
  "day": { "mainObjectColor": "#7FFFD4", "material": { "roughness": 0.1 }, "background": { "type": "fog", "color": "#F0FFFF", "near": 0, "far": 30 }, "lights": [{ "type": "ambient", "intensity": 1.5 }, { "type": "directional", "position": [0, 10, 10], "intensity": 1, "color": "white" }], "extras": [] },
  "night": { "mainObjectColor": "#66CDAA", "material": { "roughness": 0.5, "emissive": "#66CDAA", "emissiveIntensity": 0.3 }, "background": { "type": "stars", "radius": 150, "depth": 30, "count": 5000, "factor": 8, "saturation": 0.5, "fade": true, "speed": 3 }, "lights": [{ "type": "ambient", "intensity": 0.3 }, { "type": "point", "position": [0, 0, 0], "intensity": 2, "color": "#20B2AA" }] }
}'::jsonb WHERE name = 'Quantum Foam';

UPDATE public.worlds SET scene_config = '{
  "type": "DistortionSphere",
  "day": { "mainObjectColor": "#F5F5F5", "material": { "distort": 0.2, "speed": 1, "roughness": 0.1 }, "background": { "type": "sparkles", "count": 100, "scale": 10, "size": 6, "speed": 0.1, "color": "#DCDCDC" }, "lights": [{ "type": "ambient", "intensity": 1.5 }, { "type": "directional", "position": [0, 0, 10], "intensity": 1, "color": "white" }] },
  "night": { "mainObjectColor": "#1C1C1C", "material": { "distort": 0.6, "speed": 2, "roughness": 0.8 }, "background": { "type": "stars", "radius": 100, "depth": 20, "count": 1000, "factor": 2, "saturation": 0, "fade": false, "speed": 0.5 }, "lights": [{ "type": "ambient", "intensity": 0.05 }, { "type": "hemisphere", "groundColor": "black", "intensity": 0.2 }, { "type": "point", "ref": "flicker", "position": [0, 0, 0], "intensity": 3, "color": "#808080" }] }
}'::jsonb WHERE name = 'Echoing Void';

UPDATE public.worlds SET scene_config = '{
  "type": "TorusKnot",
  "day": { "mainObjectColor": "#FF4500", "material": { "roughness": 0.1, "metalness": 0.5, "emissive": "#FFD700", "emissiveIntensity": 0.5 }, "background": { "type": "sky", "sunPosition": [0, 100, 0] }, "lights": [{ "type": "ambient", "intensity": 2.0 }, { "type": "directional", "position": [0, 100, 0], "intensity": 3 }] },
  "night": { "mainObjectColor": "#DC143C", "material": { "roughness": 0, "metalness": 0.9, "emissive": "#FF4500", "emissiveIntensity": 0.8 }, "background": { "type": "stars", "radius": 500, "depth": 100, "count": 10000, "factor": 2, "saturation": 1, "fade": true, "speed": 0.2 }, "lights": [{ "type": "ambient", "intensity": 0.3 }, { "type": "point", "position": [0, 0, 0], "intensity": 5, "color": "#FF6347" }] }
}'::jsonb WHERE name = 'Solar Flare';

UPDATE public.worlds SET scene_config = '{
  "type": "WobbleField",
  "day": { "mainObjectColor": "#2F4F4F", "material": { "roughness": 0.9 }, "background": { "type": "fog", "color": "#708090", "near": 0, "far": 15 }, "lights": [{ "type": "ambient", "intensity": 0.5 }, { "type": "directional", "position": [5, 5, 5], "intensity": 0.5, "color": "#B0C4DE" }], "extras": [] },
  "night": { "mainObjectColor": "#000000", "material": { "roughness": 1.0 }, "background": { "type": "stars", "radius": 50, "depth": 10, "count": 100, "factor": 1, "saturation": 0, "fade": false, "speed": 0 }, "lights": [{ "type": "ambient", "intensity": 0.01 }] }
}'::jsonb WHERE name = 'Gravity Well';

UPDATE public.worlds SET scene_config = '{
  "type": "DistortionSphere",
  "day": { "mainObjectColor": "#DA70D6", "material": { "distort": 1.2, "speed": 5, "roughness": 0.2 }, "background": { "type": "sparkles", "count": 1000, "scale": 3, "size": 4, "speed": 0.8, "color": "#DB7093" }, "lights": [{ "type": "ambient", "intensity": 1.0 }, { "type": "directional", "position": [-10, 10, -5], "intensity": 1.5, "color": "#FFC0CB" }] },
  "night": { "mainObjectColor": "#4B0082", "material": { "distort": 1.0, "speed": 4, "roughness": 0.1, "emissive": "#9400D3", "emissiveIntensity": 0.4 }, "background": { "type": "stars", "radius": 300, "depth": 80, "count": 6000, "factor": 6, "saturation": 0.8, "fade": true, "speed": 2.0 }, "lights": [{ "type": "ambient", "intensity": 0.2 }, { "type": "hemisphere", "groundColor": "#483D8B", "intensity": 0.8 }, { "type": "point", "ref": "swirl", "position": [0, 0, 0], "intensity": 2.5, "color": "#8A2BE2" }] }
}'::jsonb WHERE name = 'Chromatic Nebula';

UPDATE public.worlds SET scene_config = '{
  "type": "TorusKnot",
  "day": { "mainObjectColor": "#ADD8E6", "material": { "roughness": 0.6, "metalness": 0.1, "transparent": true, "opacity": 0.7 }, "background": { "type": "sky", "sunPosition": [10, 0, 0] }, "lights": [{ "type": "ambient", "intensity": 0.8 }, { "type": "directional", "position": [10, 0, 0], "intensity": 0.5 }] },
  "night": { "mainObjectColor": "#B0E0E6", "material": { "roughness": 0.2, "metalness": 0.3, "emissive": "#AFEEEE", "emissiveIntensity": 0.1, "transparent": true, "opacity": 0.8 }, "background": { "type": "stars", "radius": 250, "depth": 40, "count": 4000, "factor": 5, "saturation": 0.2, "fade": true, "speed": 1.2 }, "lights": [{ "type": "ambient", "intensity": 0.4 }, { "type": "point", "position": [5, 5, 5], "intensity": 1.0, "color": "#F0F8FF" }, { "type": "point", "position": [-5, -5, -5], "intensity": 1.0, "color": "#E6E6FA" }] }
}'::jsonb WHERE name = 'Temporal Rift';

UPDATE public.worlds SET scene_config = '{
  "type": "WobbleField",
  "day": { "mainObjectColor": "#32CD32", "material": { "roughness": 0.4 }, "background": { "type": "fog", "color": "#98FB98", "near": 0, "far": 25 }, "lights": [{ "type": "ambient", "intensity": 0.8 }, { "type": "directional", "position": [10, 10, 0], "intensity": 1.2, "color": "white" }], "extras": [{ "type": "cloud", "position": [0, 0, -20], "speed": 0.1, "opacity": 0.6 }] },
  "night": { "mainObjectColor": "#006400", "material": { "roughness": 0.7 }, "background": { "type": "stars", "radius": 200, "depth": 50, "count": 3000, "factor": 6, "saturation": 0.7, "fade": true, "speed": 1.5 }, "lights": [{ "type": "ambient", "intensity": 0.1 }, { "type": "point", "position": [0, 0, 0], "intensity": 1.5, "color": "#556B2F" }] }
}'::jsonb WHERE name = 'Singularity Garden';

UPDATE public.worlds SET scene_config = '{
  "type": "DistortionSphere",
  "day": { "mainObjectColor": "#F4A460", "material": { "distort": 0.5, "speed": 0.5, "roughness": 0.9 }, "background": { "type": "sparkles", "count": 50, "scale": 15, "size": 2, "speed": 0.05, "color": "#D2B48C" }, "lights": [{ "type": "ambient", "intensity": 1.2 }, { "type": "directional", "position": [20, 5, 0], "intensity": 0.8, "color": "#FAFAD2" }] },
  "night": { "mainObjectColor": "#8B4513", "material": { "distort": 0.3, "speed": 0.2, "roughness": 1.0 }, "background": { "type": "stars", "radius": 150, "depth": 90, "count": 2000, "factor": 3, "saturation": 0.3, "fade": true, "speed": 0.8 }, "lights": [{ "type": "ambient", "intensity": 0.15 }, { "type": "hemisphere", "groundColor": "#A0522D", "intensity": 0.4 }, { "type": "point", "ref": "slowPulse", "position": [0, 0, 0], "intensity": 1.0, "color": "#CD853F" }] }
}'::jsonb WHERE name = 'Whispering Dunes';

UPDATE public.worlds SET scene_config = '{
  "type": "TorusKnot",
  "day": { "mainObjectColor": "#FFD700", "material": { "roughness": 0.1, "metalness": 1.0 }, "background": { "type": "sky", "sunPosition": [0, 0, 10] }, "lights": [{ "type": "ambient", "intensity": 1.0 }, { "type": "directional", "position": [0, 0, 10], "intensity": 2.0, "color": "#FFFFFF" }] },
  "night": { "mainObjectColor": "#FFD700", "material": { "roughness": 0, "metalness": 1.0, "emissive": "#FFD700", "emissiveIntensity": 0.6 }, "background": { "type": "stars", "radius": 1000, "depth": 100, "count": 20000, "factor": 10, "saturation": 0, "fade": true, "speed": 0.1 }, "lights": [{ "type": "ambient", "intensity": 0.5 }, { "type": "point", "position": [0, 0, 0], "intensity": 2, "color": "#FFFFE0" }] }
}'::jsonb WHERE name = 'Celestial Weave';
