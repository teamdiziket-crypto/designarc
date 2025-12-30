import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import logoFull from '@/assets/logo-full.png';
import logoIcon from '@/assets/logo-icon.png';
import { supabase } from '@/integrations/supabase/client';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check if any admin exists
    const checkAdminExists = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);

        if (error) {
          console.error('Error checking admin:', error);
          setIsSetupMode(false);
        } else {
          setIsSetupMode(!data || data.length === 0);
        }
      } catch (error) {
        console.error('Error:', error);
        setIsSetupMode(false);
      } finally {
        setCheckingSetup(false);
      }
    };

    checkAdminExists();
  }, []);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('seed-admin', {
        body: { email, password },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Admin account created! Signing you in...');
      
      // Sign in with the new credentials
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        toast.error('Account created but could not sign in. Please try signing in manually.');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Failed to create admin account');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md glass-card border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex flex-col items-center gap-3">
            <img src={logoIcon} alt="Design Arc" className="w-16 h-16 rounded-2xl shadow-lg" />
            <img src={logoFull} alt="Design Arc Academy" className="h-10 object-contain" />
          </div>
          <div>
            <CardDescription className="text-muted-foreground mt-2">
              {isSetupMode 
                ? 'Create your first admin account to get started'
                : 'Admin Portal - Sign in to manage students'
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSetupMode ? handleSetup : handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@designarc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full btn-primary-gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSetupMode ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                isSetupMode ? 'Create Admin Account' : 'Sign In'
              )}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6">
            {isSetupMode 
              ? 'This will be the superadmin account'
              : 'Contact your administrator if you need access'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}