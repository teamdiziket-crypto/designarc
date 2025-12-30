-- Add certificate_name field to courses table for certificate printing
ALTER TABLE public.courses ADD COLUMN certificate_name text;