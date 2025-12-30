import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Student } from '@/types/student';

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  bulkCount?: number;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  student,
  bulkCount,
  onConfirm,
}: DeleteConfirmModalProps) {
  const isBulk = bulkCount && bulkCount > 0;

  if (!student && !isBulk) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] glass-card border-border/50">
        <DialogHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <DialogTitle className="text-xl font-bold">
            {isBulk ? `Delete ${bulkCount} Students` : 'Delete Student'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isBulk ? (
              <>
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  {bulkCount} students
                </span>
                ? This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  {student?.fullName}
                </span>
                ? This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="btn-glass min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="min-w-[100px]"
          >
            Delete{isBulk ? ` (${bulkCount})` : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
