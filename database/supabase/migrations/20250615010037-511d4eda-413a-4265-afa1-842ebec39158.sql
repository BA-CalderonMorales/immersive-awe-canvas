
-- Remove the unique constraint on the component_key column to allow reusing 3D scenes
ALTER TABLE public.worlds DROP CONSTRAINT worlds_component_key_key;

-- Insert 10 new worlds into the table, reusing existing component keys
INSERT INTO public.worlds (name, description, component_key) VALUES
('Crystalline Spire', 'A towering monument of pure energy.', 'World1'),
('Quantum Foam', 'Navigate the building blocks of reality.', 'World2'),
('Echoing Void', 'A silent expanse where thoughts take form.', 'World3'),
('Solar Flare', 'A star frozen at the peak of its eruption.', 'World1'),
('Gravity Well', 'A region where spacetime is deeply curved.', 'World2'),
('Chromatic Nebula', 'A swirling cloud of vibrant, sentient gas.', 'World3'),
('Temporal Rift', 'A tear in the fabric of time itself.', 'World1'),
('Singularity Garden', 'Flora that thrives on the edge of a black hole.', 'World2'),
('Whispering Dunes', 'Sands that hold the memories of the cosmos.', 'World3'),
('Celestial Weave', 'The interconnected threads of fate, made visible.', 'World1');
