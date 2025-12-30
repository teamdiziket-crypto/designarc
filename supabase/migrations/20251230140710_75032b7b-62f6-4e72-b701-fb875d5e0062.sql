-- Add short_name column to courses table
ALTER TABLE public.courses ADD COLUMN short_name text;

-- Update existing courses with abbreviations
UPDATE public.courses SET short_name = 
  CASE 
    WHEN name ILIKE '%full stack%' THEN 'FS'
    WHEN name ILIKE '%data science%' THEN 'DS'
    WHEN name ILIKE '%web development%' THEN 'WD'
    WHEN name ILIKE '%machine learning%' THEN 'ML'
    WHEN name ILIKE '%python%' THEN 'PY'
    WHEN name ILIKE '%java%' THEN 'JAVA'
    WHEN name ILIKE '%react%' THEN 'REACT'
    ELSE UPPER(LEFT(name, 3))
  END;