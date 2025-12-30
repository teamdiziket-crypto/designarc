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
  studentId: db.student_id || undefined,
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
      
      // Also update the student's certificate status
      const cert = certificates.find(c => c.id === id);
      if (cert?.studentId) {
        await supabase
          .from('students')
          .update({ certificate_status: 'Revoked' })
          .eq('id', cert.studentId);
      }
      
      toast.success('Certificate revoked successfully');
      return true;
    } catch (error) {
      console.error('Error revoking certificate:', error);
      toast.error('Failed to revoke certificate');
      return false;
    }
  };

  const createCertificate = async (studentId: string, fullName: string, course: string) => {
    try {
      // Generate certificate ID: DAC-YYYY-COURSESHORT-XXXXX
      const year = new Date().getFullYear();
      const courseShort = course.replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const certificateId = `DAC-${year}-${courseShort}-${String(randomNum).padStart(5, '0')}`;

      const { error } = await supabase.from('certificates').insert({
        certificate_id: certificateId,
        student_id: studentId,
        full_name: fullName,
        course: course,
        status: 'Active',
        issue_date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;
      toast.success('Certificate created successfully');
      return true;
    } catch (error) {
      console.error('Error creating certificate:', error);
      toast.error('Failed to create certificate');
      return false;
    }
  };

  const deleteCertificate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Certificate deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error('Failed to delete certificate');
      return false;
    }
  };

  return {
    certificates,
    loading,
    revokeCertificate,
    createCertificate,
    deleteCertificate,
    refetch: fetchCertificates,
  };
}
