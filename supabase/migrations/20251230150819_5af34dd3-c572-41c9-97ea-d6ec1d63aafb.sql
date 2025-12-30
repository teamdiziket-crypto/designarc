-- Allow anyone to check if any admin exists (for setup mode detection)
CREATE POLICY "Anyone can check if admin exists"
ON public.user_roles
FOR SELECT
USING (true);