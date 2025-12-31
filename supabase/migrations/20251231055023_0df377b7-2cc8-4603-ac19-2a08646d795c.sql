-- Create app_settings table for certificate configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to app_settings" 
ON public.app_settings 
FOR SELECT 
USING (true);

-- Allow authenticated users to update settings
CREATE POLICY "Allow authenticated update to app_settings" 
ON public.app_settings 
FOR UPDATE 
USING (true);

-- Insert default certificate settings
INSERT INTO public.app_settings (key, value) 
VALUES ('certificate_settings', '{"show_certificate_id": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();