-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  row_id SERIAL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_no TEXT NOT NULL,
  city TEXT NOT NULL,
  course TEXT NOT NULL,
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('Cash', 'UPI', 'Bank Transfer', 'Card', 'Other')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('Paid', 'Pending', 'Partial')),
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  pending_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_id TEXT NOT NULL UNIQUE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  course TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Revoked', 'Expired')),
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for now (no auth required - for testing)
-- Courses policies
CREATE POLICY "Allow public read access to courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to courses" ON public.courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to courses" ON public.courses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to courses" ON public.courses FOR DELETE USING (true);

-- Students policies
CREATE POLICY "Allow public read access to students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to students" ON public.students FOR DELETE USING (true);

-- Certificates policies
CREATE POLICY "Allow public read access to certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to certificates" ON public.certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to certificates" ON public.certificates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to certificates" ON public.certificates FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;

-- Set REPLICA IDENTITY FULL for realtime updates
ALTER TABLE public.courses REPLICA IDENTITY FULL;
ALTER TABLE public.students REPLICA IDENTITY FULL;
ALTER TABLE public.certificates REPLICA IDENTITY FULL;