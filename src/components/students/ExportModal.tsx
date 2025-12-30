import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Student } from '@/types/student';
import { toast } from 'sonner';

export interface ExportColumn {
  key: keyof Student | 'courses_joined';
  label: string;
  default: boolean;
}

const EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'rowId', label: 'Row ID', default: true },
  { key: 'fullName', label: 'Full Name', default: true },
  { key: 'email', label: 'Email', default: true },
  { key: 'whatsappNo', label: 'WhatsApp No', default: true },
  { key: 'city', label: 'City', default: true },
  { key: 'courses_joined', label: 'Courses', default: true },
  { key: 'batchCode', label: 'Batch Code', default: true },
  { key: 'paymentMode', label: 'Payment Mode', default: true },
  { key: 'paymentStatus', label: 'Payment Status', default: true },
  { key: 'amountPaid', label: 'Amount Paid', default: true },
  { key: 'pendingAmount', label: 'Pending Amount', default: true },
  { key: 'timestamp', label: 'Date Added', default: true },
];

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
}

export function ExportModal({ open, onOpenChange, students }: ExportModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set(EXPORT_COLUMNS.filter(c => c.default).map(c => c.key))
  );

  const handleToggleColumn = (key: string) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedColumns(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedColumns(new Set(EXPORT_COLUMNS.map(c => c.key)));
  };

  const handleDeselectAll = () => {
    setSelectedColumns(new Set());
  };

  const handleExport = () => {
    if (selectedColumns.size === 0) {
      toast.error('Please select at least one column to export');
      return;
    }

    if (students.length === 0) {
      toast.error('No students to export');
      return;
    }

    // Get selected columns in order
    const columnsToExport = EXPORT_COLUMNS.filter(c => selectedColumns.has(c.key));
    
    // Build headers
    const headers = columnsToExport.map(c => c.label);

    // Build rows
    const rows = students.map(student => 
      columnsToExport.map(col => {
        if (col.key === 'courses_joined') {
          return student.courses.join('; ');
        }
        if (col.key === 'timestamp') {
          return new Date(student.timestamp).toLocaleDateString('en-IN');
        }
        const value = student[col.key as keyof Student];
        return value ?? '';
      })
    );

    // Generate CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      ),
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${students.length} students with ${selectedColumns.size} columns`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Students</DialogTitle>
          <DialogDescription>
            Select the columns you want to include in the export. {students.length} students will be exported.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
            {EXPORT_COLUMNS.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <Checkbox
                  id={column.key}
                  checked={selectedColumns.has(column.key)}
                  onCheckedChange={() => handleToggleColumn(column.key)}
                />
                <Label
                  htmlFor={column.key}
                  className="text-sm font-normal cursor-pointer"
                >
                  {column.label}
                </Label>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {selectedColumns.size} of {EXPORT_COLUMNS.length} columns selected
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            className="btn-primary-gradient"
            disabled={selectedColumns.size === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
