
-- Add slug column and feature flag to worlds table
ALTER TABLE public.worlds 
ADD COLUMN slug TEXT,
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Create unique index on slug
CREATE UNIQUE INDEX worlds_slug_idx ON public.worlds(slug) WHERE slug IS NOT NULL;

-- Generate slugs for existing worlds and set feature flags for first 4
UPDATE public.worlds 
SET slug = CASE 
  WHEN name = 'Genesis Torus' THEN 'genesis-torus'
  WHEN name = 'Wobble Field' THEN 'wobble-field'
  WHEN name = 'Distortion Sphere' THEN 'distortion-sphere'
  WHEN name = 'Crystalline Spire' THEN 'crystalline-spire'
  WHEN name = 'Quantum Foam' THEN 'quantum-foam'
  WHEN name = 'Echoing Void' THEN 'echoing-void'
  WHEN name = 'Solar Flare' THEN 'solar-flare'
  WHEN name = 'Gravity Well' THEN 'gravity-well'
  WHEN name = 'Chromatic Nebula' THEN 'chromatic-nebula'
  WHEN name = 'Temporal Rift' THEN 'temporal-rift'
  WHEN name = 'Singularity Garden' THEN 'singularity-garden'
  WHEN name = 'Whispering Dunes' THEN 'whispering-dunes'
  WHEN name = 'Celestial Weave' THEN 'celestial-weave'
  ELSE lower(replace(name, ' ', '-'))
END,
is_featured = CASE 
  WHEN name IN ('Genesis Torus', 'Wobble Field', 'Distortion Sphere', 'Crystalline Spire') THEN true
  ELSE false
END;
