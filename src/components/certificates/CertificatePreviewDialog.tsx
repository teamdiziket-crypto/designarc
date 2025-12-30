import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Certificate } from '@/types/student';
import CertificateTemplate from './CertificateTemplate';
import { useCourses } from '@/contexts/CoursesContext';

interface CertificatePreviewDialogProps {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificatePreviewDialog({
  certificate,
  open,
  onOpenChange,
}: CertificatePreviewDialogProps) {
  const { getTemplateUrl } = useCourses();
  
  if (!certificate) return null;

  const templateUrl = getTemplateUrl(certificate.course);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[95vh] overflow-auto p-0 bg-gray-100">
        <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Certificate Preview</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-2" />
              Print / Save PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-6 flex justify-center">
          <div className="shadow-2xl">
            <CertificateTemplate
              fullName={certificate.fullName}
              course={certificate.course}
              issueDate={certificate.issueDate}
              certificateId={certificate.certificateId}
              templateUrl={templateUrl}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
