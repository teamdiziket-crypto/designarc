import { Student } from '@/types/student';

export function exportStudentsToCSV(students: Student[], filename: string = 'students_export') {
  const headers = [
    'Row ID',
    'Full Name',
    'Email',
    'WhatsApp No',
    'City',
    'Courses',
    'Batch Code',
    'Payment Mode',
    'Payment Status',
    'Amount Paid',
    'Pending Amount',
    'Date Added',
  ];

  const rows = students.map((student) => [
    student.rowId,
    student.fullName,
    student.email,
    student.whatsappNo,
    student.city,
    student.courses.join('; '),
    student.batchCode || '',
    student.paymentMode,
    student.paymentStatus,
    student.amountPaid,
    student.pendingAmount,
    new Date(student.timestamp).toLocaleDateString('en-IN'),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        // Escape quotes and wrap in quotes if contains comma or newline
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}