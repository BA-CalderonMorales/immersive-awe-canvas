-- Create sequences first
CREATE SEQUENCE public.backgrounds_id_seq;
CREATE SEQUENCE public.default_geometries_id_seq;

-- Create backgrounds table for different background options
CREATE TABLE public.backgrounds (
  id BIGINT NOT NULL DEFAULT nextval('public.backgrounds_id_seq'::regclass) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  background_config JSONB NOT NULL,
  is_featured BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create default_geometries table based on worlds structure
CREATE TABLE public.default_geometries (
  id BIGINT NOT NULL DEFAULT nextval('public.default_geometries_id_seq'::regclass) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  geometry_type TEXT NOT NULL, -- 'TorusKnot', 'DistortionSphere', etc.
  material_config JSONB,
  color_day TEXT DEFAULT '#f97316',
  color_night TEXT DEFAULT '#189a62',
  is_featured BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Set sequence ownership
ALTER SEQUENCE public.backgrounds_id_seq OWNED BY public.backgrounds.id;
ALTER SEQUENCE public.default_geometries_id_seq OWNED BY public.default_geometries.id;

-- Enable Row Level Security
ALTER TABLE public.backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.default_geometries ENABLE ROW LEVEL SECURITY;

-- Create policies for public read-only access
CREATE POLICY "Allow public read-only access to backgrounds" 
ON public.backgrounds 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read-only access to default_geometries" 
ON public.default_geometries 
FOR SELECT 
USING (true);

-- Insert sample background options
INSERT INTO public.backgrounds (name, description, background_config, sort_order) VALUES 
('Starry Night', 'Classic star field background', '{
  "type": "stars",
  "fade": true,
  "count": 2700,
  "depth": 50,
  "speed": 0.6,
  "factor": 4.04,
  "radius": 67.66,
  "saturation": 0.014
}', 1),
('Sunset Glory', 'Beautiful sunset gradient', '{
  "type": "sunset",
  "speed": 0.3,
  "colorTop": "#87CEEB",
  "colorBottom": "#FF6347",
  "colorMiddle": "#FFA500"
}', 2),
('Forest Environment', 'Peaceful forest setting', '{
  "type": "environment",
  "preset": "forest",
  "blur": 0.5
}', 3),
('Aurora Dreams', 'Mystical aurora background', '{
  "type": "aurora",
  "intensity": 0.8,
  "speed": 0.5
}', 4),
('Void Space', 'Minimalist void background', '{
  "type": "void"
}', 5);

-- Insert sample default geometries
INSERT INTO public.default_geometries (name, description, geometry_type, material_config, color_day, color_night, sort_order) VALUES 
('Genesis Torus', 'A primordial torus knot structure', 'TorusKnot', '{
  "metalness": 0.3,
  "roughness": 0.5,
  "materialType": "standard"
}', '#f97316', '#189a62', 1),
('Distortion Sphere', 'Chaotic spherical form', 'DistortionSphere', '{
  "roughness": 0.069,
  "materialType": "physical"
}', '#4682b4', '#1e90ff', 2),
('Wobble Field', 'Reality-bending field', 'WobbleField', '{
  "emissive": "#000511",
  "metalness": 0.3,
  "roughness": 0.4,
  "materialType": "standard",
  "emissiveIntensity": 0.03
}', '#6366f1', '#0f6b23', 3),
('Crystalline Spire', 'Towering crystal monument', 'CrystallineSpire', '{
  "metalness": 0.9,
  "roughness": 0.3,
  "materialType": "standard"
}', '#E0FFFF', '#4169E1', 4);