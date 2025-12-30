-- First drop the existing check constraint
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_payment_mode_check;

-- Update existing data to new payment modes
UPDATE public.students SET payment_mode = 'UPI' WHERE payment_mode IN ('UPI', 'Card');
UPDATE public.students SET payment_mode = 'Razorpay' WHERE payment_mode = 'Bank Transfer';
UPDATE public.students SET payment_mode = 'Others' WHERE payment_mode = 'Cash';

-- Add the new check constraint
ALTER TABLE public.students ADD CONSTRAINT students_payment_mode_check CHECK (payment_mode IN ('UPI', 'Razorpay', 'Others'));