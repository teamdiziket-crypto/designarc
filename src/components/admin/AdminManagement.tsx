import { useState } from 'react';
import { UserPlus, Trash2, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdmins } from '@/hooks/useAdmins';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

const adminSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function AdminManagement() {
  const { admins, loading, createAdmin, deleteAdmin } = useAdmins();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    try {
      adminSchema.parse({ email, password });
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

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await createAdmin(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setIsModalOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deleteAdminId) return;

    setIsSubmitting(true);
    await deleteAdmin(deleteAdminId);
    setIsSubmitting(false);
    setDeleteAdminId(null);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Admin Management</h2>
            <p className="text-sm text-muted-foreground">Manage admin accounts</p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="btn-primary-gradient">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {admins.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No admin accounts found. Create one to get started.
            </p>
          ) : (
            admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {admin.email ? admin.email.substring(0, 2).toUpperCase() : 'AD'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {admin.email || 'Admin User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(admin.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {admin.id === user?.id && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      You
                    </span>
                  )}
                  {admin.id !== user?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteAdminId(admin.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Admin Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Create Admin Account</DialogTitle>
            <DialogDescription>
              Add a new admin who can access the dashboard
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAdmin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@designarc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-gradient" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Admin'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAdminId} onOpenChange={() => setDeleteAdminId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Admin Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke admin access for this user? They will no longer be able to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Revoking...
                </>
              ) : (
                'Revoke Access'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}