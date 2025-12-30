import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types/student';
import { toast } from 'sonner';

interface DbStudent {
  id: string;
  row_id: number;
  full_name: string;
  email: string;
  whatsapp_no: string;
  city: string;
  course: string;
  courses: string[] | null;
  batch_code: string | null;
  payment_mode: string;
  payment_status: string;
  amount_paid: number;
  pending_amount: number;
  certificate_status: string;
  created_at: string;
  updated_at: string;
}

const mapDbToStudent = (db: DbStudent): Student => ({
  id: db.id,
  rowId: db.row_id,
  timestamp: db.created_at,
  fullName: db.full_name,
  email: db.email,
  whatsappNo: db.whatsapp_no,
  city: db.city,
  course: db.courses?.[0] || db.course, // Use first course from array or fallback to old course
  courses: db.courses || (db.course ? [db.course] : []),
  batchCode: db.batch_code || '',
  paymentMode: db.payment_mode as Student['paymentMode'],
  paymentStatus: db.payment_status as Student['paymentStatus'],
  amountPaid: Number(db.amount_paid),
  pendingAmount: Number(db.pending_amount),
  certificateStatus: (db.certificate_status || 'Pending') as Student['certificateStatus'],
});

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents((data || []).map(mapDbToStudent));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    // Set up realtime subscription
    const channel = supabase
      .channel('students-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        (payload) => {
          console.log('Realtime update:', payload);
          if (payload.eventType === 'INSERT') {
            setStudents((prev) => [mapDbToStudent(payload.new as DbStudent), ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setStudents((prev) =>
              prev.map((s) =>
                s.id === (payload.new as DbStudent).id
                  ? mapDbToStudent(payload.new as DbStudent)
                  : s
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setStudents((prev) =>
              prev.filter((s) => s.id !== (payload.old as DbStudent).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addStudent = async (studentData: Partial<Student>) => {
    try {
      const { error } = await supabase.from('students').insert({
        full_name: studentData.fullName,
        email: studentData.email,
        whatsapp_no: studentData.whatsappNo,
        city: studentData.city,
        course: studentData.courses?.[0] || studentData.course,
        courses: studentData.courses || (studentData.course ? [studentData.course] : []),
        batch_code: studentData.batchCode || null,
        payment_mode: studentData.paymentMode,
        payment_status: studentData.paymentStatus,
        amount_paid: studentData.amountPaid || 0,
        pending_amount: studentData.pendingAmount || 0,
      });

      if (error) throw error;
      toast.success('Student added successfully');
      return true;
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
      return false;
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          full_name: studentData.fullName,
          email: studentData.email,
          whatsapp_no: studentData.whatsappNo,
          city: studentData.city,
          course: studentData.courses?.[0] || studentData.course,
          courses: studentData.courses || (studentData.course ? [studentData.course] : []),
          batch_code: studentData.batchCode || null,
          payment_mode: studentData.paymentMode,
          payment_status: studentData.paymentStatus,
          amount_paid: studentData.amountPaid,
          pending_amount: studentData.pendingAmount,
          certificate_status: studentData.certificateStatus,
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Student updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
      return false;
    }
  };

  const bulkUpdateCertificateStatus = async (ids: string[], status: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ certificate_status: status })
        .in('id', ids);
      if (error) throw error;
      toast.success(`${ids.length} students updated to ${status}`);
      return true;
    } catch (error) {
      console.error('Error bulk updating certificate status:', error);
      toast.error('Failed to update certificate status');
      return false;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      toast.success('Student deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
      return false;
    }
  };

  const bulkDeleteStudents = async (ids: string[]) => {
    try {
      const { error } = await supabase.from('students').delete().in('id', ids);
      if (error) throw error;
      toast.success(`${ids.length} students deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error bulk deleting students:', error);
      toast.error('Failed to delete students');
      return false;
    }
  };

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    bulkDeleteStudents,
    bulkUpdateCertificateStatus,
    refetch: fetchStudents,
  };
}
