import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CertificateSettings {
  show_certificate_id: boolean;
}

export function useCertificateSettings() {
  const [settings, setSettings] = useState<CertificateSettings>({ show_certificate_id: false });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'certificate_settings')
        .maybeSingle();

      if (error) throw error;
      if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
        const value = data.value as Record<string, unknown>;
        setSettings({
          show_certificate_id: Boolean(value.show_certificate_id),
        });
      }
    } catch (error) {
      console.error('Error fetching certificate settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<CertificateSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      const { error } = await supabase
        .from('app_settings')
        .update({ value: updatedSettings })
        .eq('key', 'certificate_settings');

      if (error) throw error;
      setSettings(updatedSettings);
      toast.success('Certificate settings updated');
      return true;
    } catch (error) {
      console.error('Error updating certificate settings:', error);
      toast.error('Failed to update settings');
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
  };
}
