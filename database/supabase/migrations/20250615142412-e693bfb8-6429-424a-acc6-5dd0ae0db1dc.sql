
BEGIN;

-- Use a temporary name to avoid conflicts during the swap.
UPDATE public.worlds
SET name = 'TEMP_SWAP_NAME'
WHERE name = 'Wobble Field';

-- Assign 'Wobble Field' to what was 'Distortion Sphere'.
UPDATE public.worlds
SET name = 'Wobble Field'
WHERE name = 'Distortion Sphere';

-- Complete the swap by renaming the temporary entry.
UPDATE public.worlds
SET name = 'Distortion Sphere'
WHERE name = 'TEMP_SWAP_NAME';

COMMIT;
