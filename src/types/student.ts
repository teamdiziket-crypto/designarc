export interface Student {
  id: string;
  rowId: number;
  timestamp: string;
  fullName: string;
  email: string;
  whatsappNo: string;
  city: string;
  course: string; // Keep for backward compatibility, will use first course
  courses: string[]; // Multiple courses
  batchCode: string; // Batch code (e.g., "FS01, GD02")
  paymentMode: 'UPI' | 'Razorpay' | 'Others';
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  amountPaid: number;
  pendingAmount: number;
  certificateStatus: 'Pending' | 'Issued' | 'Revoked';
}

export interface Certificate {
  id: string;
  certificateId: string;
  studentId?: string;
  fullName: string;
  course: string;
  issueDate: string;
  status: 'Active' | 'Revoked' | 'Expired';
  pdfUrl?: string;
}

export interface CertificateSettings {
  instituteName: string;
  logoUrl: string;
  signatureUrl: string;
  stampUrl: string;
  templateDocumentUrl: string;
  emailBodyTemplate: string;
}

export interface DashboardStats {
  totalStudents: number;
  todayCount: number;
  last7Days: number;
  last30Days: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Partial';
export type PaymentMode = 'UPI' | 'Razorpay' | 'Others';
export type CertificateStatus = 'Pending' | 'Issued' | 'Revoked';

export const COURSES = [
  'UI/UX Design',
  'Graphic Design',
  'Web Development',
  'Digital Marketing',
  'Interior Design',
  'Fashion Design',
  'Animation & VFX',
  'Photography',
] as const;

export type Course = typeof COURSES[number];
