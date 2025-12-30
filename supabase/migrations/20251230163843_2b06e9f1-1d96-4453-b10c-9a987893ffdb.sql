-- Create storage bucket for certificate templates
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificate-templates', 'certificate-templates', true);

-- Allow public read access to certificate templates
CREATE POLICY "Public read access for certificate templates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-templates');

-- Allow authenticated users to upload certificate templates
CREATE POLICY "Authenticated users can upload certificate templates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificate-templates' AND auth.role() = 'authenticated');

-- Allow authenticated users to update certificate templates
CREATE POLICY "Authenticated users can update certificate templates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificate-templates' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete certificate templates
CREATE POLICY "Authenticated users can delete certificate templates"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificate-templates' AND auth.role() = 'authenticated');

-- Add template_url to courses table
ALTER TABLE public.courses ADD COLUMN template_url text;