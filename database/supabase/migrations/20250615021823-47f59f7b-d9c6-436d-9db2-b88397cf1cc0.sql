
-- Add columns to store UI colors for day and night themes
ALTER TABLE public.worlds
ADD COLUMN ui_day_color TEXT,
ADD COLUMN ui_night_color TEXT;
