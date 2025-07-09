
-- Update UI colors for worlds that don't have them set
UPDATE public.worlds 
SET 
  ui_day_color = CASE 
    WHEN name = 'Genesis Torus' THEN '#8B4513'
    WHEN name = 'Distortion Sphere' THEN '#4169E1'
    WHEN name = 'Wobble Field' THEN '#32CD32'
    WHEN name = 'Crystalline Spire' THEN '#9932CC'
    WHEN name = 'Quantum Foam' THEN '#FF1493'
    WHEN name = 'Echoing Void' THEN '#2F4F4F'
    WHEN name = 'Solar Flare' THEN '#FF4500'
    WHEN name = 'Gravity Well' THEN '#800080'
    WHEN name = 'Chromatic Nebula' THEN '#FF69B4'
    WHEN name = 'Temporal Rift' THEN '#4682B4'
    WHEN name = 'Singularity Garden' THEN '#228B22'
    WHEN name = 'Whispering Dunes' THEN '#DAA520'
    WHEN name = 'Celestial Weave' THEN '#20B2AA'
    WHEN name = 'Mystic Forest' THEN '#32CD32'
    ELSE '#1a1a1a'
  END,
  ui_night_color = CASE 
    WHEN name = 'Genesis Torus' THEN '#CD853F'
    WHEN name = 'Distortion Sphere' THEN '#87CEEB'
    WHEN name = 'Wobble Field' THEN '#98FB98'
    WHEN name = 'Crystalline Spire' THEN '#DDA0DD'
    WHEN name = 'Quantum Foam' THEN '#FFB6C1'
    WHEN name = 'Echoing Void' THEN '#708090'
    WHEN name = 'Solar Flare' THEN '#FFA500'
    WHEN name = 'Gravity Well' THEN '#DA70D6'
    WHEN name = 'Chromatic Nebula' THEN '#FFB6C1'
    WHEN name = 'Temporal Rift' THEN '#87CEFA'
    WHEN name = 'Singularity Garden' THEN '#90EE90'
    WHEN name = 'Whispering Dunes' THEN '#F0E68C'
    WHEN name = 'Celestial Weave' THEN '#AFEEEE'
    WHEN name = 'Mystic Forest' THEN '#90EE90'
    ELSE '#ffffff'
  END
WHERE ui_day_color IS NULL OR ui_night_color IS NULL;
