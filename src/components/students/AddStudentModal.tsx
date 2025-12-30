import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Student, PaymentMode, PaymentStatus } from '@/types/student';
import { useCourses } from '@/contexts/CoursesContext';
import { toast } from 'sonner';

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (student: Partial<Student>) => void;
  editStudent?: Student | null;
}

const paymentModes: PaymentMode[] = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'];
const paymentStatuses: PaymentStatus[] = ['Paid', 'Pending', 'Partial'];

export function AddStudentModal({
  open,
  onOpenChange,
  onSubmit,
  editStudent,
}: AddStudentModalProps) {
  const { courses } = useCourses();
  const [formData, setFormData] = useState({
    fullName: editStudent?.fullName || '',
    email: editStudent?.email || '',
    whatsappNo: editStudent?.whatsappNo || '',
    city: editStudent?.city || '',
    course: editStudent?.course || '',
    paymentMode: editStudent?.paymentMode || 'UPI',
    paymentStatus: editStudent?.paymentStatus || 'Pending',
    amountPaid: editStudent?.amountPaid || 0,
    pendingAmount: editStudent?.pendingAmount || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.course) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit({
      ...formData,
      id: editStudent?.id,
      rowId: editStudent?.rowId,
    });

    toast.success(editStudent ? 'Student updated successfully' : 'Student added successfully');
    onOpenChange(false);
  };

  const isEditing = !!editStudent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="input-glass"
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-glass"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={formData.whatsappNo}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappNo: e.target.value })
                }
                className="input-glass"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="input-glass"
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Course *</Label>
            <Select
              value={formData.course}
              onValueChange={(value) =>
                setFormData({ ...formData, course: value })
              }
            >
              <SelectTrigger className="input-glass">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <Select
                value={formData.paymentMode}
                onValueChange={(value: PaymentMode) =>
                  setFormData({ ...formData, paymentMode: value })
                }
              >
                <SelectTrigger className="input-glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value: PaymentStatus) =>
                  setFormData({ ...formData, paymentStatus: value })
                }
              >
                <SelectTrigger className="input-glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Paid (₹)</Label>
              <Input
                id="amountPaid"
                type="number"
                value={formData.amountPaid}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amountPaid: Number(e.target.value),
                  })
                }
                className="input-glass"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pendingAmount">Pending Amount (₹)</Label>
              <Input
                id="pendingAmount"
                type="number"
                value={formData.pendingAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pendingAmount: Number(e.target.value),
                  })
                }
                className="input-glass"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="btn-glass"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary-gradient">
              {isEditing ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
