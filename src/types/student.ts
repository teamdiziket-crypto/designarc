export interface Student {
  id: string;
  rowId: number;
  timestamp: string;
  fullName: string;
  email: string;
  whatsappNo: string;
  city: string;
  course: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Other';
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  amountPaid: number;
  pendingAmount: number;
}

export interface Certificate {
  id: string;
  certificateId: string;
  studentRowId: number;
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
export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Other';

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
