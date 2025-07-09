
-- Update UI colors to ensure better contrast with scene backgrounds
UPDATE public.worlds 
SET 
  ui_day_color = CASE 
    WHEN slug = 'genesis-torus' THEN '#000000'  -- Black for orange torus on sky
    WHEN slug = 'distortion-sphere' THEN '#FFFFFF'  -- White for blue sphere on forest/blue bg
    WHEN slug = 'wobble-field' THEN '#FFFFFF'  -- White for purple field on light city bg
    WHEN slug = 'crystalline-spire' THEN '#000000'  -- Black for light cyan spire on fog
    WHEN slug = 'quantum-foam' THEN '#000000'  -- Black for green sphere on light blue bg
    WHEN slug = 'echoing-void' THEN '#000000'  -- Black for light gray on sparkles
    WHEN slug = 'solar-flare' THEN '#000000'  -- Black for orange/red on bright sky
    WHEN slug = 'gravity-well' THEN '#FFFFFF'  -- White for dark gray on fog
    WHEN slug = 'chromatic-nebula' THEN '#000000'  -- Black for purple on sparkles
    WHEN slug = 'temporal-rift' THEN '#000000'  -- Black for light blue on sky
    WHEN slug = 'singularity-garden' THEN '#000000'  -- Black for green on fog
    WHEN slug = 'whispering-dunes' THEN '#000000'  -- Black for sandy colors on sparkles
    WHEN slug = 'celestial-weave' THEN '#000000'  -- Black for gold on bright sky
    WHEN slug = 'mystic-forest' THEN '#FFFFFF'  -- White for green on forest environment
    ELSE ui_day_color
  END,
  ui_night_color = CASE 
    WHEN slug = 'genesis-torus' THEN '#FFFFFF'  -- White for green torus on dark stars
    WHEN slug = 'distortion-sphere' THEN '#FFFFFF'  -- White for blue sphere on dark environment
    WHEN slug = 'wobble-field' THEN '#FFFFFF'  -- White for dark green on dark environment
    WHEN slug = 'crystalline-spire' THEN '#FFFFFF'  -- White for blue spire on dark fog
    WHEN slug = 'quantum-foam' THEN '#FFFFFF'  -- White for green sphere on dark stars
    WHEN slug = 'echoing-void' THEN '#FFFFFF'  -- White for gray on dark stars
    WHEN slug = 'solar-flare' THEN '#FFFFFF'  -- White for red on dark stars
    WHEN slug = 'gravity-well' THEN '#FFFFFF'  -- White for black on dark stars
    WHEN slug = 'chromatic-nebula' THEN '#FFFFFF'  -- White for dark purple on dark stars
    WHEN slug = 'temporal-rift' THEN '#FFFFFF'  -- White for light blue on dark stars
    WHEN slug = 'singularity-garden' THEN '#FFFFFF'  -- White for dark green on dark stars
    WHEN slug = 'whispering-dunes' THEN '#FFFFFF'  -- White for brown on dark stars
    WHEN slug = 'celestial-weave' THEN '#FFFFFF'  -- White for gold on dark stars
    WHEN slug = 'mystic-forest' THEN '#FFFFFF'  -- White for dark green on dark stars
    ELSE ui_night_color
  END
WHERE slug IS NOT NULL;
