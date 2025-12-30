import { Edit2, Trash2, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StudentTableProps {
  students: Student[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

const PaymentStatusBadge = ({ status }: { status: Student['paymentStatus'] }) => {
  const styles = {
    Paid: 'badge-paid',
    Pending: 'badge-pending',
    Partial: 'badge-partial',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export function StudentTable({ students, selectedIds, onSelectionChange, onEdit, onDelete }: StudentTableProps) {
  const allSelected = students.length > 0 && students.every((s) => selectedIds.has(s.id));
  const someSelected = students.some((s) => selectedIds.has(s.id)) && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSet = new Set(selectedIds);
      students.forEach((s) => newSet.add(s.id));
      onSelectionChange(newSet);
    } else {
      const newSet = new Set(selectedIds);
      students.forEach((s) => newSet.delete(s.id));
      onSelectionChange(newSet);
    }
  };

  const handleSelectOne = (studentId: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(studentId);
    } else {
      newSet.delete(studentId);
    }
    onSelectionChange(newSet);
  };

  return (
    <div className="table-glass">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) {
                    (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected;
                  }
                }}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-right">Pending</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.id} className={`group ${selectedIds.has(student.id) ? 'bg-primary/5' : ''}`}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(student.id)}
                  onCheckedChange={(checked) => handleSelectOne(student.id, !!checked)}
                  aria-label={`Select ${student.fullName}`}
                />
              </TableCell>
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {student.fullName}
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {student.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium">
                  {student.course}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {student.city}
              </TableCell>
              <TableCell>
                <PaymentStatusBadge status={student.paymentStatus} />
              </TableCell>
              <TableCell className="text-right font-medium text-success">
                {formatCurrency(student.amountPaid)}
              </TableCell>
              <TableCell className="text-right font-medium text-warning">
                {student.pendingAmount > 0
                  ? formatCurrency(student.pendingAmount)
                  : '—'}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(student.timestamp)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onEdit(student)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Student
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(student)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {students.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">No students found</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
