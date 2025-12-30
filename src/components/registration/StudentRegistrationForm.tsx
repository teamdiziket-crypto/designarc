import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';
import logoFull from '@/assets/logo-full.png';

const registrationSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  whatsapp_no: z.string().min(10, 'WhatsApp number must be at least 10 digits').max(15),
  email: z.string().email('Please enter a valid email'),
  course: z.string().min(1, 'Please select a course'),
  city: z.string().min(2, 'City must be at least 2 characters').max(50),
  payment_mode: z.enum(['UPI/Gpay/Phonepe/Paytm', 'Website (Razorpay)', 'Others']),
  payment_status: z.enum(['Paid', 'Partial']),
  amount_paid: z.number().min(0, 'Amount cannot be negative'),
  pending_amount: z.number().min(0, 'Amount cannot be negative'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface Course {
  id: string;
  name: string;
}

export function StudentRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      full_name: '',
      whatsapp_no: '',
      email: '',
      course: '',
      city: '',
      payment_mode: 'UPI/Gpay/Phonepe/Paytm',
      payment_status: 'Paid',
      amount_paid: 0,
      pending_amount: 0,
    },
  });

  const paymentStatus = watch('payment_status');
  const amountPaid = watch('amount_paid');

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle payment status conditional logic
  useEffect(() => {
    if (paymentStatus === 'Paid') {
      setValue('pending_amount', 0);
    }
  }, [paymentStatus, setValue]);

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);

    try {
      // Check for duplicate entry by email or WhatsApp number
      const { data: existingStudent, error: checkError } = await supabase
        .from('students')
        .select('id, email, whatsapp_no')
        .or(`email.eq.${data.email.trim().toLowerCase()},whatsapp_no.eq.${data.whatsapp_no.trim()}`)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingStudent) {
        const duplicateField = existingStudent.email === data.email.trim().toLowerCase() 
          ? 'email address' 
          : 'WhatsApp number';
        toast.error(`A student with this ${duplicateField} is already registered.`);
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.from('students').insert({
        full_name: data.full_name.trim(),
        whatsapp_no: data.whatsapp_no.trim(),
        email: data.email.trim().toLowerCase(),
        course: data.course,
        city: data.city.trim(),
        payment_mode: data.payment_mode,
        payment_status: data.payment_status,
        amount_paid: data.amount_paid,
        pending_amount: data.pending_amount,
        batch_code: null, // Admin will fill this later
        courses: [data.course], // Store selected course in array
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('Registration successful!');
      reset();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md glass-card border-border/50 text-center">
          <CardContent className="pt-10 pb-10">
            <div className="mx-auto mb-6">
              <img src={logoFull} alt="Design Arc Academy" className="h-12 object-contain mx-auto" />
            </div>
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Thank you for registering.</h2>
            <p className="text-muted-foreground text-lg">
              Your registration has been successfully received.
            </p>
            <p className="text-primary font-medium mt-4 text-lg">
              Happy Learning with Design Arc Academy.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 py-10">
      <Card className="w-full max-w-lg glass-card border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <img src={logoFull} alt="Design Arc Academy" className="h-14 object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Fill in your details to register for a course
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Enter your full name"
                {...register('full_name')}
                className="input-glass"
                disabled={isLoading}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp_no">WhatsApp Number *</Label>
              <Input
                id="whatsapp_no"
                placeholder="Enter your WhatsApp number"
                {...register('whatsapp_no')}
                className="input-glass"
                disabled={isLoading}
              />
              {errors.whatsapp_no && (
                <p className="text-sm text-destructive">{errors.whatsapp_no.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className="input-glass"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Course Select */}
            <div className="space-y-2">
              <Label>Course *</Label>
              <Select
                onValueChange={(value) => setValue('course', value)}
                disabled={isLoading || coursesLoading}
              >
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select a course"} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.name}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course && (
                <p className="text-sm text-destructive">{errors.course.message}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Enter your city"
                {...register('city')}
                className="input-glass"
                disabled={isLoading}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            {/* Payment Mode */}
            <div className="space-y-2">
              <Label>Payment Mode *</Label>
              <Select
                defaultValue="UPI/Gpay/Phonepe/Paytm"
                onValueChange={(value: 'UPI/Gpay/Phonepe/Paytm' | 'Website (Razorpay)' | 'Others') => setValue('payment_mode', value)}
                disabled={isLoading}
              >
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI/Gpay/Phonepe/Paytm">UPI/Gpay/Phonepe/Paytm</SelectItem>
                  <SelectItem value="Website (Razorpay)">Website (Razorpay)</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <Label>Payment Status *</Label>
              <Select
                defaultValue="Paid"
                onValueChange={(value: 'Paid' | 'Partial') => setValue('payment_status', value)}
                disabled={isLoading}
              >
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Full Paid</SelectItem>
                  <SelectItem value="Partial">Partial Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Paid - Show for Paid and Partial */}
            {(paymentStatus === 'Paid' || paymentStatus === 'Partial') && (
              <div className="space-y-2">
                <Label htmlFor="amount_paid">Amount Paid (₹) *</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  placeholder="Enter amount paid"
                  {...register('amount_paid', { valueAsNumber: true })}
                  className="input-glass"
                  disabled={isLoading}
                />
                {errors.amount_paid && (
                  <p className="text-sm text-destructive">{errors.amount_paid.message}</p>
                )}
              </div>
            )}

            {/* Pending Amount - Show for Partial only */}
            {paymentStatus === 'Partial' && (
              <div className="space-y-2">
                <Label htmlFor="pending_amount">Pending Amount (₹) *</Label>
                <Input
                  id="pending_amount"
                  type="number"
                  placeholder="Enter pending amount"
                  {...register('pending_amount', { valueAsNumber: true })}
                  className="input-glass"
                  disabled={isLoading}
                />
                {errors.pending_amount && (
                  <p className="text-sm text-destructive">{errors.pending_amount.message}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full btn-primary-gradient mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                'Submit Registration'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}