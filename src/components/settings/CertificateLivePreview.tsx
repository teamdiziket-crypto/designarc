import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CertificateTemplate from '@/components/certificates/CertificateTemplate';
import type { CertificateSettings } from '@/hooks/useCertificateSettings';
import { useCourses } from '@/contexts/CoursesContext';

interface CertificateLivePreviewProps {
  settings: CertificateSettings;
}

// Template dimensions (A4-like portrait)
const TEMPLATE_WIDTH = 1588;
const TEMPLATE_HEIGHT = 2246;
const ASPECT_RATIO = TEMPLATE_HEIGHT / TEMPLATE_WIDTH;

export function CertificateLivePreview({ settings }: CertificateLivePreviewProps) {
  const { coursesData, getTemplateUrl } = useCourses();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  
  const [previewData, setPreviewData] = useState({
    fullName: 'John Doe',
    course: coursesData[0]?.name || 'Sample Course',
    issueDate: new Date().toISOString().split('T')[0],
    certificateId: 'DAA-2025-PRO-001',
  });

  const templateUrl = getTemplateUrl(previewData.course);

  // Calculate scale based on container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = containerWidth / TEMPLATE_WIDTH;
        setScale(newScale);
      }
    };

    updateScale();
    
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="space-y-4">
      {/* Preview Data Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Preview Name</Label>
          <Input
            value={previewData.fullName}
            onChange={(e) => setPreviewData({ ...previewData, fullName: e.target.value })}
            className="input-glass h-9 text-sm"
            placeholder="Enter name"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Preview Date</Label>
          <Input
            type="date"
            value={previewData.issueDate}
            onChange={(e) => setPreviewData({ ...previewData, issueDate: e.target.value })}
            className="input-glass h-9 text-sm"
          />
        </div>
      </div>

      {/* Course Selection */}
      {coursesData.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-xs">Course Template</Label>
          <select
            value={previewData.course}
            onChange={(e) => setPreviewData({ ...previewData, course: e.target.value })}
            className="w-full px-3 py-2 h-9 rounded-lg border bg-background text-foreground text-sm"
          >
            {coursesData.map((course) => (
              <option key={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Live Preview - Full width with proper A4 aspect ratio */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg"
        style={{ 
          paddingBottom: `${ASPECT_RATIO * 100}%`,
        }}
      >
        <div 
          className="absolute top-0 left-0"
          style={{ 
            width: `${TEMPLATE_WIDTH}px`,
            height: `${TEMPLATE_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
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

      {!templateUrl && (
        <p className="text-xs text-muted-foreground text-center">
          No template uploaded. Upload one in Courses.
        </p>
      )}
    </div>
  );
}