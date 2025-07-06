-- Update backgrounds to be more vibrant and provide better contrast
UPDATE backgrounds SET 
  background_config = jsonb_set(background_config, '{saturation}', '0.8')
WHERE name = 'Starry Night';

UPDATE backgrounds SET 
  background_config = jsonb_set(
    jsonb_set(
      jsonb_set(background_config, '{colorTop}', '"#FF6B35"'),
      '{colorMiddle}', '"#F7931E"'
    ),
    '{colorBottom}', '"#FFE66D"'
  )
WHERE name = 'Sunset Glory';

-- Add more vibrant aurora colors
UPDATE backgrounds SET 
  background_config = jsonb_set(
    jsonb_set(background_config, '{intensity}', '1.2'),
    '{speed}', '0.7'
  )
WHERE name = 'Aurora Dreams';

-- Update default geometries to have better contrast and vibrancy
UPDATE default_geometries SET 
  color_day = '#FFD700',  -- Bright gold for day
  color_night = '#87CEEB', -- Sky blue for night
  material_config = jsonb_set(
    jsonb_set(
      jsonb_set(material_config, '{metalness}', '0.9'),
      '{roughness}', '0.1'
    ),
    '{emissive}', '"#FFB347"'
  ),
  material_config = jsonb_set(material_config, '{emissiveIntensity}', '0.1')
WHERE name = 'Genesis Torus';

UPDATE default_geometries SET 
  color_day = '#FF6347',  -- Vibrant orange-red for day
  color_night = '#4169E1', -- Royal blue for night  
  material_config = jsonb_set(
    jsonb_set(
      jsonb_set(material_config, '{metalness}', '0.7'),
      '{roughness}', '0.2'
    ),
    '{emissive}', '"#FF4500"'
  ),
  material_config = jsonb_set(material_config, '{emissiveIntensity}', '0.05')
WHERE name = 'Distortion Sphere';

UPDATE default_geometries SET 
  color_day = '#00CED1',  -- Dark turquoise for day
  color_night = '#32CD32', -- Lime green for night
  material_config = jsonb_set(
    jsonb_set(material_config, '{emissive}', '"#00FF7F"'),
    '{emissiveIntensity}', '0.08'
  )
WHERE name = 'Wobble Field';

UPDATE default_geometries SET 
  color_day = '#DDA0DD',  -- Plum for day
  color_night = '#9370DB', -- Medium purple for night
  material_config = jsonb_set(
    jsonb_set(
      jsonb_set(material_config, '{metalness}', '0.95'),
      '{roughness}', '0.1'
    ),
    '{emissive}', '"#8A2BE2"'
  ),
  material_config = jsonb_set(material_config, '{emissiveIntensity}', '0.06')
WHERE name = 'Crystalline Spire';