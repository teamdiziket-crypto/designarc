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

const normalizePaymentMode = (mode: string): Student['paymentMode'] => {
  if (mode === 'UPI') return 'UPI/Gpay/Phonepe/Paytm';
  if (mode === 'Razorpay') return 'Website (Razorpay)';
  return mode as Student['paymentMode'];
};

const normalizePaymentStatus = (status: string): Student['paymentStatus'] => {
  // Legacy: Pending is now treated as Partial (with amounts deciding what is due)
  if (status === 'Pending') return 'Partial';
  return status as Student['paymentStatus'];
};

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
  paymentMode: normalizePaymentMode(db.payment_mode),
  paymentStatus: normalizePaymentStatus(db.payment_status),
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
      // Get the current student to check if certificate status is changing to Issued
      const currentStudent = students.find(s => s.id === id);
      
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
      
      // If certificate status changed to "Issued", create certificates
      if (studentData.certificateStatus === 'Issued' && currentStudent?.certificateStatus !== 'Issued') {
        const coursesToIssue = studentData.courses || (studentData.course ? [studentData.course] : []);
        const studentName = studentData.fullName || currentStudent?.fullName || '';
        
        for (const course of coursesToIssue) {
          // Check if certificate already exists for this student-course combination
          const { data: existing } = await supabase
            .from('certificates')
            .select('id')
            .eq('student_id', id)
            .eq('course', course)
            .maybeSingle();
          
          if (!existing) {
            // Get course short_name from courses table
            const { data: courseData } = await supabase
              .from('courses')
              .select('short_name')
              .eq('name', course)
              .maybeSingle();
            
            // Generate certificate ID: DAA-YEAR-SHORTNAME-XXXXX
            const year = new Date().getFullYear();
            const courseShort = courseData?.short_name || course.replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase();
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            const certificateId = `DAA-${year}-${courseShort}-${String(randomNum).padStart(5, '0')}`;
            
            // Create certificate
            await supabase.from('certificates').insert({
              certificate_id: certificateId,
              student_id: id,
              full_name: studentName,
              course: course,
              status: 'Active',
              issue_date: new Date().toISOString().split('T')[0],
            });
          }
        }
      }
      
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
      // First get the students to create certificates for
      if (status === 'Issued') {
        const studentsToIssue = students.filter(s => ids.includes(s.id));
        
        // Generate certificates for each student and their courses
        for (const student of studentsToIssue) {
          for (const course of student.courses) {
            // Get course short_name from courses table
            const { data: courseData } = await supabase
              .from('courses')
              .select('short_name')
              .eq('name', course)
              .maybeSingle();
            
            // Generate certificate ID: DAA-YEAR-SHORTNAME-XXXXX
            const year = new Date().getFullYear();
            const courseShort = courseData?.short_name || course.replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase();
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            const certificateId = `DAA-${year}-${courseShort}-${String(randomNum).padStart(5, '0')}`;
            
            // Check if certificate already exists for this student-course combination
            const { data: existing } = await supabase
              .from('certificates')
              .select('id')
              .eq('student_id', student.id)
              .eq('course', course)
              .maybeSingle();
            
            if (!existing) {
              // Create certificate
              await supabase.from('certificates').insert({
                certificate_id: certificateId,
                student_id: student.id,
                full_name: student.fullName,
                course: course,
                status: 'Active',
                issue_date: new Date().toISOString().split('T')[0],
              });
            }
          }
        }
      }
      
      // Update student certificate status
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
