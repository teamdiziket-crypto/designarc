import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Certificate } from '@/types/student';
import { toast } from 'sonner';

interface DbCertificate {
  id: string;
  certificate_id: string;
  student_id: string | null;
  full_name: string;
  course: string;
  issue_date: string;
  status: string;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

const mapDbToCertificate = (db: DbCertificate): Certificate => ({
  id: db.id,
  certificateId: db.certificate_id,
  studentRowId: 0, // Not used with new structure
  fullName: db.full_name,
  course: db.course,
  issueDate: db.issue_date,
  status: db.status as Certificate['status'],
  pdfUrl: db.pdf_url || undefined,
});

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates((data || []).map(mapDbToCertificate));
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();

    // Set up realtime subscription
    const channel = supabase
      .channel('certificates-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'certificates' },
        (payload) => {
          console.log('Realtime certificate update:', payload);
          if (payload.eventType === 'INSERT') {
            setCertificates((prev) => [
              mapDbToCertificate(payload.new as DbCertificate),
              ...prev,
            ]);
          } else if (payload.eventType === 'UPDATE') {
            setCertificates((prev) =>
              prev.map((c) =>
                c.id === (payload.new as DbCertificate).id
                  ? mapDbToCertificate(payload.new as DbCertificate)
                  : c
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setCertificates((prev) =>
              prev.filter((c) => c.id !== (payload.old as DbCertificate).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const revokeCertificate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('certificates')
        .update({ status: 'Revoked' })
        .eq('id', id);

      if (error) throw error;
      toast.success('Certificate revoked successfully');
      return true;
    } catch (error) {
      console.error('Error revoking certificate:', error);
      toast.error('Failed to revoke certificate');
      return false;
    }
  };

  return {
    certificates,
    loading,
    revokeCertificate,
    refetch: fetchCertificates,
  };
}
