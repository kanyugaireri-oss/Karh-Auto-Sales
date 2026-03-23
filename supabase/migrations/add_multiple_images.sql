-- 1. Add the new array column
ALTER TABLE public.cars ADD COLUMN image_urls text[] NOT NULL DEFAULT '{}';

-- 2. Migrate existing data (for cars that already have a single image)
UPDATE public.cars 
SET image_urls = array[image_url] 
WHERE image_url IS NOT NULL;

-- 3. Drop the old single image column
ALTER TABLE public.cars DROP COLUMN image_url;
