-- Add batch_code column to students (free text, can have multiple comma-separated)
ALTER TABLE public.students ADD COLUMN batch_code text;

-- Change course column to support multiple courses (as text array)
ALTER TABLE public.students ADD COLUMN courses text[];

-- Copy existing course data to courses array
UPDATE public.students SET courses = ARRAY[course] WHERE course IS NOT NULL;

-- We'll keep the old course column for backward compatibility but it will be deprecated