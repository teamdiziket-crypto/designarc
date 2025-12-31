import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CertificateTemplate from '@/components/certificates/CertificateTemplate';
import type { CertificateSettings } from '@/hooks/useCertificateSettings';
import { useCourses } from '@/contexts/CoursesContext';

interface CertificateLivePreviewProps {
  settings: CertificateSettings;
}

export function CertificateLivePreview({ settings }: CertificateLivePreviewProps) {
  const { coursesData, getTemplateUrl } = useCourses();
  const [previewData, setPreviewData] = useState({
    fullName: 'John Doe',
    course: coursesData[0]?.name || 'Sample Course',
    issueDate: new Date().toISOString().split('T')[0],
    certificateId: 'DAA-2025-PRO-001',
  });

  const templateUrl = getTemplateUrl(previewData.course);

  return (
    <div className="space-y-4">
      {/* Preview Data Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Preview Name</Label>
          <Input
            value={previewData.fullName}
            onChange={(e) => setPreviewData({ ...previewData, fullName: e.target.value })}
            className="input-glass"
            placeholder="Enter name to preview"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Preview Date</Label>
          <Input
            type="date"
            value={previewData.issueDate}
            onChange={(e) => setPreviewData({ ...previewData, issueDate: e.target.value })}
            className="input-glass"
          />
        </div>
      </div>

      {/* Course Selection */}
      {coursesData.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Select Course Template</Label>
          <select
            value={previewData.course}
            onChange={(e) => setPreviewData({ ...previewData, course: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
          >
            {coursesData.map((course) => (
              <option key={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Live Preview */}
      <div className="border rounded-xl overflow-hidden bg-gray-100">
        <div 
          className="overflow-auto"
          style={{ 
            maxHeight: '500px',
          }}
        >
          <div 
            style={{ 
              transform: 'scale(0.35)',
              transformOrigin: 'top left',
              width: '1588px',
              height: '2246px',
            }}
          >
            <CertificateTemplate
              fullName={previewData.fullName}
              course={previewData.course}
              issueDate={previewData.issueDate}
              certificateId={previewData.certificateId}
              templateUrl={templateUrl}
              showCertificateId={settings.show_certificate_id}
              nameStyle={settings.name_style}
              dateStyle={settings.date_style}
              certificateIdStyle={settings.certificate_id_style}
            />
          </div>
        </div>
      </div>

      {!templateUrl && (
        <p className="text-sm text-muted-foreground text-center">
          No template uploaded for this course. Upload a template in Courses to see the preview.
        </p>
      )}
    </div>
  );
}
