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
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto p-0 bg-gray-100 print:max-w-none print:max-h-none print:overflow-visible print:bg-white print:p-0">
        {/* Header - Hidden during print */}
        <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between print:hidden">
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
        
        {/* Certificate Container - Scaled for screen, full size for print */}
        <div className="p-6 flex justify-center print:p-0 print:block">
          <div 
            className="shadow-2xl print:shadow-none origin-top-left"
            style={{ 
              transform: 'scale(0.5)',
              transformOrigin: 'top center',
            }}
          >
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