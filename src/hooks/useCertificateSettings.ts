import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TextElementStyle {
  top: number;
  left: number;
  fontSize: number;
  color: string;
  fontWeight: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface CertificateSettings {
  show_certificate_id: boolean;
  name_style: TextElementStyle;
  date_style: TextElementStyle;
  certificate_id_style: TextElementStyle;
}

const defaultSettings: CertificateSettings = {
  show_certificate_id: false,
  name_style: {
    top: 41.5,
    left: 50,
    fontSize: 50,
    color: '#F89A28',
    fontWeight: 400,
    letterSpacing: 3,
    textAlign: 'center',
  },
  date_style: {
    top: 82.5,
    left: 7.5,
    fontSize: 23,
    color: '#000000',
    fontWeight: 500,
    letterSpacing: 0,
    textAlign: 'left',
  },
  certificate_id_style: {
    top: 85.5,
    left: 7.5,
    fontSize: 18,
    color: '#000000',
    fontWeight: 500,
    letterSpacing: 0,
    textAlign: 'left',
  },
};

export function useCertificateSettings() {
  const [settings, setSettings] = useState<CertificateSettings>(defaultSettings);
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
          show_certificate_id: Boolean(value.show_certificate_id ?? defaultSettings.show_certificate_id),
          name_style: (value.name_style as TextElementStyle) ?? defaultSettings.name_style,
          date_style: (value.date_style as TextElementStyle) ?? defaultSettings.date_style,
          certificate_id_style: (value.certificate_id_style as TextElementStyle) ?? defaultSettings.certificate_id_style,
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
      
      // Convert to JSON-compatible format
      const jsonValue = JSON.parse(JSON.stringify(updatedSettings));
      
      // Check if record exists
      const { data: existingData } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', 'certificate_settings')
        .maybeSingle();

      let error;
      if (existingData) {
        // Update existing record
        const result = await supabase
          .from('app_settings')
          .update({ value: jsonValue })
          .eq('key', 'certificate_settings');
        error = result.error;
      } else {
        // Insert new record
        const result = await supabase
          .from('app_settings')
          .insert([{ key: 'certificate_settings', value: jsonValue }]);
        error = result.error;
      }

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
    defaultSettings,
  };
}
