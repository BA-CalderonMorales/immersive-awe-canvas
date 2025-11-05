-- Add 7 new unique geometry worlds with distinct visual identities
-- Each world uses a different THREE.js geometry for maximum variety

-- 1. Crystal Heart - Pulsating Octahedron with crystalline appearance
INSERT INTO public.worlds (
  name,
  description,
  slug,
  scene_config,
  ui_color_day,
  ui_color_night,
  is_featured,
  sort_order
) VALUES (
  'Crystal Heart',
  'A crystalline octahedron pulsating with cosmic energy',
  'crystal-heart',
  '{
    "type": "PulsatingOctahedron",
    "day": {
      "mainObjectColor": "#FF1493",
      "material": {
        "materialType": "physical",
        "metalness": 0.9,
        "roughness": 0.1,
        "clearcoat": 1.0,
        "clearcoatRoughness": 0.05,
        "emissive": "#FF69B4",
        "emissiveIntensity": 0.5
      },
      "background": {
        "type": "gradient",
        "colorTop": "#FFE4E1",
        "colorBottom": "#FFC0CB"
      },
      "lights": [
        {"type": "ambient", "intensity": 0.6},
        {"type": "point", "position": [5, 5, 5], "intensity": 1.5, "color": "#FF1493"}
      ]
    },
    "night": {
      "mainObjectColor": "#9400D3",
      "material": {
        "materialType": "physical",
        "metalness": 0.95,
        "roughness": 0.05,
        "clearcoat": 1.0,
        "clearcoatRoughness": 0.03,
        "emissive": "#8A2BE2",
        "emissiveIntensity": 0.7
      },
      "background": {
        "type": "stars",
        "radius": 200,
        "depth": 50,
        "count": 3000,
        "factor": 4,
        "saturation": 0.8,
        "fade": true,
        "speed": 1.0
      },
      "lights": [
        {"type": "ambient", "intensity": 0.3},
        {"type": "point", "position": [5, 5, 5], "intensity": 2.0, "color": "#9400D3"}
      ]
    }
  }'::jsonb,
  '#FF1493',
  '#9400D3',
  true,
  100
);

-- 2. Cosmic Dodecahedron - Spinning dodecahedron in space
INSERT INTO public.worlds (
  name,
  description,
  slug,
  scene_config,
  ui_color_day,
  ui_color_night,
  is_featured,
  sort_order
) VALUES (
  'Cosmic Dodecahedron',
  'A twelve-faced polyhedron spinning through the cosmos',
  'cosmic-dodecahedron',
  '{
    "type": "SpinningDodecahedron",
    "day": {
      "mainObjectColor": "#00CED1",
      "material": {
        "materialType": "standard",
        "metalness": 0.7,
        "roughness": 0.3,
        "emissive": "#40E0D0",
        "emissiveIntensity": 0.4
      },
      "background": {
        "type": "aurora",
        "auroraSpeed": 0.5,
        "auroraIntensity": 0.8,
        "auroraColors": ["#00CED1", "#40E0D0", "#48D1CC"]
      },
      "lights": [
        {"type": "ambient", "intensity": 0.5},
        {"type": "directional", "position": [10, 10, 5], "intensity": 1.0, "color": "#00CED1"}
      ]
    },
    "night": {
      "mainObjectColor": "#FF6347",
      "material": {
        "materialType": "standard",
        "metalness": 0.85,
        "roughness": 0.15,
        "emissive": "#FF4500",
        "emissiveIntensity": 0.6
      },
      "background": {
        "type": "nebula",
        "nebulaSpeed": 0.3,
        "nebulaIntensity": 0.9,
        "gasDensity": 0.7,
        "dustDensity": 0.5,
        "nebulaColor1": "#FF6347",
        "nebulaColor2": "#FF4500",
        "nebulaColor3": "#DC143C"
      },
      "lights": [
        {"type": "ambient", "intensity": 0.4},
        {"type": "point", "position": [0, 0, 10], "intensity": 1.8, "color": "#FF6347"}
      ]
    }
  }'::jsonb,
  '#00CED1',
  '#FF6347',
  true,
  101
);

-- 3. Mystic Pyramid - Tetrahedron with ancient energy
INSERT INTO public.worlds (
  name,
  description,
  slug,
  scene_config,
  ui_color_day,
  ui_color_night,
  is_featured,
  sort_order
) VALUES (
  'Mystic Pyramid',
  'An ancient pyramid radiating mystical power',
  'mystic-pyramid',
  '{
    "type": "PyramidTetrahedron",
    "day": {
      "mainObjectColor": "#FFD700",
      "material": {
        "materialType": "standard",
        "metalness": 0.9,
        "roughness": 0.2,
        "emissive": "#FFA500",
        "emissiveIntensity": 0.5
      },
      "background": {
        "type": "sunset",
        "intensity": 1.2
      },
      "lights": [
        {"type": "ambient", "intensity": 0.7},
        {"type": "hemisphere", "groundColor": "#8B4513", "intensity": 0.8}
      ]
    },
    "night": {
      "mainObjectColor": "#4169E1",
      "material": {
        "materialType": "physical",
        "metalness": 0.6,
        "roughness": 0.1,
        "clearcoat": 0.8,
        "emissive": "#6495ED",
        "emissiveIntensity": 0.8
      },
      "background": {
        "type": "cinematic",
        "complexity": 0.8,
        "colorPrimary": "#191970",
        "colorSecondary": "#4169E1",
        "colorAccent": "#6495ED"
      },
      "lights": [
        {"type": "ambient", "intensity": 0.4},
        {"type": "point", "position": [0, 5, 0], "intensity": 2.5, "color": "#4169E1"}
      ]
    }
  }'::jsonb,
  '#FFD700',
  '#4169E1',
  true,
  102
);

-- 4. Vortex Cone - Glowing cone creating energy vortex
INSERT INTO public.worlds (
  name,
  description,
  slug,
  scene_config,
  ui_color_day,
  ui_color_night,
  is_featured,
  sort_order
) VALUES (
  'Vortex Cone',
  'A spinning cone generating a powerful energy vortex',
  'vortex-cone',
  '{
    "type": "GlowingCone",
    "day": {
      "mainObjectColor": "#32CD32",
      "material": {
        "materialType": "standard",
        "metalness": 0.5,
        "roughness": 0.3,
        "emissive": "#00FF00",
        "emissiveIntensity": 0.6
      },
      "background": {
        "type": "plasma",
        "plasmaSpeed": 1.0,
        "plasmaIntensity": 0.7,
        "plasmaColor1": "#32CD32",
        "plasmaColor2": "#00FF00",
        "plasmaColor3": "#ADFF2F",
        "turbulence": 0.8
      },
      "lights": [
        {"type": "ambient", "intensity": 0.6},
        {"type": "point", "position": [0, 5, 0], "intensity": 1.5, "color": "#32CD32"}
      ]
    },
    "night": {
      "mainObjectColor": "#FF00FF",
      "material": {
        "materialType": "physical",
        "metalness": 0.8,
        "roughness": 0.1,
        "emissive": "#DA70D6",
        "emissiveIntensity": 0.9
      },
      "background": {
        "type": "void"
      },
      "lights": [
        {"type": "ambient", "intensity": 0.3},
        {"type": "point", "position": [0, 5, 0], "intensity": 3.0, "color": "#FF00FF"}
      ]
    }
  }'::jsonb,
  '#32CD32',
  '#FF00FF',
  true,
  103
);

-- 5. Orbital Pillar - Cylinder in perpetual orbit
INSERT INTO public.worlds (
  name,
  description,
  slug,
  scene_config,
  ui_color_day,
  ui_color_night,
  is_featured,
  sort_order
) VALUES (
  'Orbital Pillar',
  'A cylindrical pillar in eternal cosmic orbit',
  'orbital-pillar',
  '{
    "type": "OrbitingCylinder",
    "day": {
      "mainObjectColor": "#FF8C00",
      "material": {
        "materialType": "standard",
        "metalness": 0.7,
        "roughness": 0.2,
        "emissive": "#FFA500",
        "emissiveIntensity": 0.4
      },
      "background": {
        "type": "gradient",
        "colorTop": "#87CEEB",
        "colorBottom": "#FFE4B5"
      },
      "lights": [
        {"type": "ambient", "intensity": 0.7},
        {"type": "directional", "position": [5, 10, 5], "intensity": 1.2, "color": "#FF8C00"}
      ]
    },
    "night": {
      "mainObjectColor": "#1E90FF",
      "material": {
        "materialType": "physical",
        "metalness": 0.9,
        "roughness": 0.05,
        "clearcoat": 0.9,
        "emissive": "#4169E1",
        "emissiveIntensity": 0.7
      },
      "background": {
        "type": "stars",
        "radius": 250,
        "depth": 60,
        "count": 4000,
        "factor": 5,
        "saturation": 0.7,
        "fade": true,
        "speed": 0.8
      },
      "lights": [
        {"type": "ambient", "intensity": 0.4},
        {"type": "point", "position": [0, 0, 5], "intensity": 2.0, "color": "#1E90FF"}
      ]
    }
  }'::jsonb,
  '#FF8C00',
  '#1E90FF',
  true,
  104
);

-- 6. Tesseract Cube - Morphing box transcending dimensions
INSERT INTO public.worlds (
  name,
  description,
  slug,
  scene_config,
  ui_color_day,
  ui_color_night,
  is_featured,
  sort_order
) VALUES (
  'Tesseract Cube',
  'A hypercube morphing through dimensional space',
  'tesseract-cube',
  '{
    "type": "MorphingBox",
    "day": {
      "mainObjectColor": "#8B008B",
      "material": {
        "materialType": "standard",
        "metalness": 0.6,
        "roughness": 0.3,
        "emissive": "#9932CC",
        "emissiveIntensity": 0.5
      },
      "background": {
        "type": "noise",
        "noiseScale": 2.0,
        "noiseIntensity": 0.6,
        "noiseSpeed": 0.5
      },
      "lights": [
        {"type": "ambient", "intensity": 0.6},
        {"type": "point", "position": [3, 3, 3], "intensity": 1.5, "color": "#8B008B"},
        {"type": "point", "position": [-3, -3, -3], "intensity": 1.5, "color": "#9932CC"}
      ]
    },
    "night": {
      "mainObjectColor": "#00FFFF",
      "material": {
        "materialType": "physical",
        "metalness": 0.95,
        "roughness": 0.05,
        "transmission": 0.3,
        "thickness": 0.5,
        "emissive": "#00CED1",
        "emissiveIntensity": 0.8
      },
      "background": {
        "type": "cinematic",
        "complexity": 0.9,
        "colorPrimary": "#003366",
        "colorSecondary": "#00FFFF",
        "colorAccent": "#00CED1"
      },
      "lights": [
        {"type": "ambient", "intensity": 0.5},
        {"type": "point", "position": [3, 3, 3], "intensity": 2.0, "color": "#00FFFF"},
        {"type": "point", "position": [-3, -3, -3], "intensity": 2.0, "color": "#00CED1"}
      ]
    }
  }'::jsonb,
  '#8B008B',
  '#00FFFF',
  true,
  105
);

-- 7. Cosmic Pod - Floating capsule drifting through space
INSERT INTO public.worlds (
  name,
  description,
  slug,
  scene_config,
  ui_color_day,
  ui_color_night,
  is_featured,
  sort_order
) VALUES (
  'Cosmic Pod',
  'A mysterious capsule floating through the cosmos',
  'cosmic-pod',
  '{
    "type": "FloatingCapsule",
    "day": {
      "mainObjectColor": "#FF69B4",
      "material": {
        "materialType": "physical",
        "metalness": 0.8,
        "roughness": 0.2,
        "clearcoat": 0.7,
        "clearcoatRoughness": 0.2,
        "emissive": "#FFB6C1",
        "emissiveIntensity": 0.5
      },
      "background": {
        "type": "aurora",
        "auroraSpeed": 0.7,
        "auroraIntensity": 0.9,
        "auroraColors": ["#FF69B4", "#FFB6C1", "#FFC0CB"]
      },
      "lights": [
        {"type": "ambient", "intensity": 0.7},
        {"type": "hemisphere", "groundColor": "#DDA0DD", "intensity": 0.9}
      ]
    },
    "night": {
      "mainObjectColor": "#20B2AA",
      "material": {
        "materialType": "physical",
        "metalness": 0.9,
        "roughness": 0.1,
        "transmission": 0.5,
        "thickness": 0.8,
        "clearcoat": 1.0,
        "emissive": "#48D1CC",
        "emissiveIntensity": 0.7
      },
      "background": {
        "type": "nebula",
        "nebulaSpeed": 0.4,
        "nebulaIntensity": 0.8,
        "gasDensity": 0.6,
        "dustDensity": 0.4,
        "nebulaColor1": "#20B2AA",
        "nebulaColor2": "#48D1CC",
        "nebulaColor3": "#40E0D0"
      },
      "lights": [
        {"type": "ambient", "intensity": 0.5},
        {"type": "point", "position": [0, 3, 5], "intensity": 2.2, "color": "#20B2AA"}
      ]
    }
  }'::jsonb,
  '#FF69B4',
  '#20B2AA',
  true,
  106
);
