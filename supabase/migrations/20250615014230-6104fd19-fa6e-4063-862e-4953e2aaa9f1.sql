
-- This migration updates the "Echoing Void" world to make it more visible in the night theme.
-- It changes the main object's color to a light grey and adds an emissive intensity to make it glow.
UPDATE worlds
SET scene_config = jsonb_set(
    jsonb_set(
        scene_config,
        '{night, mainObjectColor}',
        '"#e0e0e0"',
        true
    ),
    '{night, material, emissiveIntensity}',
    '1.5',
    true
)
WHERE name = 'Echoing Void';
