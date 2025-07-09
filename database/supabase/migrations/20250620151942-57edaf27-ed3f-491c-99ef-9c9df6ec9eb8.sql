
-- Insert a new world into the worlds table
INSERT INTO public.worlds (name, description, scene_config, ui_day_color, ui_night_color) 
VALUES (
  'Mystic Forest',
  'An enchanted woodland where ancient magic flows through towering trees.',
  '{
    "type": "TorusKnot",
    "day": {
      "mainObjectColor": "#228B22",
      "material": {
        "materialType": "standard",
        "metalness": 0.1,
        "roughness": 0.8,
        "emissive": "#002200",
        "emissiveIntensity": 0.02
      },
      "background": {
        "type": "environment",
        "preset": "forest",
        "blur": 0.3
      },
      "lights": [
        {
          "type": "ambient",
          "intensity": 0.6
        },
        {
          "type": "directional",
          "position": [5, 10, 3],
          "intensity": 0.8,
          "color": "#90EE90"
        },
        {
          "type": "point",
          "position": [-3, 2, 4],
          "intensity": 0.5,
          "color": "#32CD32"
        }
      ]
    },
    "night": {
      "mainObjectColor": "#006400",
      "material": {
        "materialType": "standard",
        "metalness": 0.2,
        "roughness": 0.6,
        "emissive": "#004400",
        "emissiveIntensity": 0.15
      },
      "background": {
        "type": "stars",
        "count": 3000,
        "radius": 80,
        "depth": 40,
        "factor": 3,
        "saturation": 0.2,
        "fade": true,
        "speed": 0.4
      },
      "lights": [
        {
          "type": "ambient",
          "intensity": 0.2
        },
        {
          "type": "point",
          "position": [0, 8, 0],
          "intensity": 1.2,
          "color": "#ADFF2F"
        },
        {
          "type": "point",
          "position": [6, -2, -8],
          "intensity": 0.8,
          "color": "#98FB98"
        }
      ]
    }
  }'::jsonb,
  '#32CD32',
  '#90EE90'
);
