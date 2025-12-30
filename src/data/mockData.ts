import { Student, Certificate, DashboardStats, COURSES } from '@/types/student';

const generateRandomDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
const paymentModes = ['Cash', 'UPI', 'Bank Transfer', 'Card'] as const;
const paymentStatuses = ['Paid', 'Pending', 'Partial'] as const;

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Aanya', 'Aadhya', 'Saanvi', 'Myra', 'Isha', 'Kiara', 'Riya', 'Pari'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Reddy', 'Gupta', 'Nair', 'Joshi', 'Verma', 'Rao', 'Mehta', 'Agarwal', 'Iyer', 'Desai', 'Pillai'];

const generateStudents = (count: number): Student[] => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const course = COURSES[Math.floor(Math.random() * COURSES.length)];
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const totalAmount = [15000, 20000, 25000, 30000, 35000][Math.floor(Math.random() * 5)];
    
    let amountPaid = totalAmount;
    let pendingAmount = 0;
    
    if (paymentStatus === 'Pending') {
      amountPaid = 0;
      pendingAmount = totalAmount;
    } else if (paymentStatus === 'Partial') {
      amountPaid = Math.floor(totalAmount * (0.3 + Math.random() * 0.4));
      pendingAmount = totalAmount - amountPaid;
    }

    return {
      id: `STU-${String(i + 1).padStart(4, '0')}`,
      rowId: i + 2,
      timestamp: generateRandomDate(60),
      fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      whatsappNo: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      course,
      courses: [course],
      batchCode: `${course.substring(0, 2).toUpperCase()}${String(i + 1).padStart(2, '0')}`,
      paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
      paymentStatus,
      amountPaid,
      pendingAmount,
    };
  });
};

export const mockStudents: Student[] = generateStudents(87);

export const mockCertificates: Certificate[] = mockStudents
  .filter(s => s.paymentStatus === 'Paid')
  .slice(0, 25)
  .map((student, i) => ({
    id: `CERT-${String(i + 1).padStart(4, '0')}`,
    certificateId: `DAC-2024-${student.course.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)}-${String(i + 1).padStart(5, '0')}`,
    studentRowId: student.rowId,
    fullName: student.fullName,
    course: student.course,
    issueDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: Math.random() > 0.1 ? 'Active' : 'Revoked',
  }));

export const calculateStats = (students: Student[]): DashboardStats => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    totalStudents: students.length,
    todayCount: students.filter(s => new Date(s.timestamp) >= today).length,
    last7Days: students.filter(s => new Date(s.timestamp) >= last7Days).length,
    last30Days: students.filter(s => new Date(s.timestamp) >= last30Days).length,
    totalPaidAmount: students.reduce((sum, s) => sum + s.amountPaid, 0),
    totalPendingAmount: students.reduce((sum, s) => sum + s.pendingAmount, 0),
  };
};
