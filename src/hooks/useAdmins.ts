import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Admin {
  id: string;
  email: string;
  created_at: string;
}

export function useAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('list-admins');

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAdmins(data?.admins || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const createAdmin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { email, password },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Admin account created successfully');
      fetchAdmins();
      return { success: true };
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error(error.message || 'Failed to create admin account');
      return { success: false, error };
    }
  };

  const deleteAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('delete-admin', {
        body: { userId },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Admin access revoked');
      fetchAdmins();
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      toast.error('Failed to revoke admin access');
      return { success: false, error };
    }
  };

  return {
    admins,
    loading,
    createAdmin,
    deleteAdmin,
    refetch: fetchAdmins,
  };
}