-- Add certificate_status column to students table
ALTER TABLE public.students 
ADD COLUMN certificate_status text NOT NULL DEFAULT 'Pending';

-- Add comment to explain the column
COMMENT ON COLUMN public.students.certificate_status IS 'Status of certificate issuance: Pending, Issued, Revoked';