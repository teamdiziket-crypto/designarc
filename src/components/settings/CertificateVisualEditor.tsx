import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, RotateCcw } from 'lucide-react';
import type { CertificateSettings, TextElementStyle } from '@/hooks/useCertificateSettings';
import { useCourses } from '@/contexts/CoursesContext';

interface CertificateVisualEditorProps {
  settings: CertificateSettings;
  defaultSettings: CertificateSettings;
  onChange: (settings: Partial<CertificateSettings>) => void;
}

// Template dimensions
const TEMPLATE_WIDTH = 1588;
const TEMPLATE_HEIGHT = 2246;
const ASPECT_RATIO = TEMPLATE_HEIGHT / TEMPLATE_WIDTH;

type ElementType = 'name' | 'date' | 'certificateId';

interface DraggableTextProps {
  type: ElementType;
  label: string;
  style: TextElementStyle;
  defaultStyle: TextElementStyle;
  scale: number;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (style: Partial<TextElementStyle>) => void;
  onReset: () => void;
}

function DraggableText({ 
  type, label, style, defaultStyle, scale, text, isSelected, onSelect, onChange, onReset 
}: DraggableTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ top: 0, left: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ top: style.top, left: style.left });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - dragStart.x) / scale;
      const deltaY = (e.clientY - dragStart.y) / scale;
      
      const newLeft = initialPos.left + (deltaX / TEMPLATE_WIDTH) * 100;
      const newTop = initialPos.top + (deltaY / TEMPLATE_HEIGHT) * 100;
      
      onChange({
        left: Math.max(0, Math.min(100, newLeft)),
        top: Math.max(0, Math.min(100, newTop)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, initialPos, scale, onChange]);

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${style.top}%`,
    left: style.textAlign === 'center' ? '0' : `${style.left}%`,
    width: style.textAlign === 'center' ? '100%' : 'auto',
    textAlign: style.textAlign,
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
  };

  const textStyle: React.CSSProperties = {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: style.fontWeight,
    fontSize: `${style.fontSize}px`,
    color: style.color,
    letterSpacing: `${style.letterSpacing}px`,
    textTransform: type === 'name' ? 'capitalize' : 'none',
  };

  return (
    <Popover open={isSelected}>
      <PopoverTrigger asChild>
        <div
          ref={elementRef}
          style={positionStyle}
          onMouseDown={handleMouseDown}
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2 rounded' : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 rounded'}`}
        >
          <p style={textStyle}>{text}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-3 z-50" 
        side="right" 
        align="start"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{label}</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onReset}>
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onSelect()}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Top %</Label>
              <Input
                type="number"
                value={style.top.toFixed(1)}
                onChange={(e) => onChange({ top: parseFloat(e.target.value) || 0 })}
                className="h-7 text-xs"
                step="0.5"
              />
            </div>
            <div>
              <Label className="text-xs">Left %</Label>
              <Input
                type="number"
                value={style.left.toFixed(1)}
                onChange={(e) => onChange({ left: parseFloat(e.target.value) || 0 })}
                className="h-7 text-xs"
                step="0.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Font Size</Label>
              <Input
                type="number"
                value={style.fontSize}
                onChange={(e) => onChange({ fontSize: parseInt(e.target.value) || 12 })}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Color</Label>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={style.color}
                  onChange={(e) => onChange({ color: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer border"
                />
                <Input
                  value={style.color}
                  onChange={(e) => onChange({ color: e.target.value })}
                  className="h-7 text-xs flex-1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Weight</Label>
              <select
                value={style.fontWeight}
                onChange={(e) => onChange({ fontWeight: parseInt(e.target.value) })}
                className="w-full h-7 text-xs rounded border bg-background px-2"
              >
                <option value={300}>Light</option>
                <option value={400}>Regular</option>
                <option value={500}>Medium</option>
                <option value={600}>Semi Bold</option>
                <option value={700}>Bold</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Spacing</Label>
              <Input
                type="number"
                value={style.letterSpacing}
                onChange={(e) => onChange({ letterSpacing: parseFloat(e.target.value) || 0 })}
                className="h-7 text-xs"
                step="0.5"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Align</Label>
            <div className="flex gap-1 mt-1">
              {(['left', 'center', 'right'] as const).map((align) => (
                <Button
                  key={align}
                  size="sm"
                  variant={style.textAlign === align ? 'default' : 'outline'}
                  className="flex-1 h-7 text-xs capitalize"
                  onClick={() => onChange({ textAlign: align })}
                >
                  {align}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CertificateVisualEditor({ settings, defaultSettings, onChange }: CertificateVisualEditorProps) {
  const { coursesData, getTemplateUrl } = useCourses();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  const [previewData, setPreviewData] = useState({
    fullName: 'John Doe',
    course: coursesData[0]?.name || 'Sample Course',
    issueDate: new Date().toISOString().split('T')[0],
    certificateId: 'DAA-2025-PRO-001',
  });

  const templateUrl = getTemplateUrl(previewData.course);

  // Calculate scale
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / TEMPLATE_WIDTH);
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const year = date.getFullYear();
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' 
                 : (day === 2 || day === 22) ? 'nd'
                 : (day === 3 || day === 23) ? 'rd' : 'th';
    return `${day}${suffix} ${month}, ${year}`;
  };

  const handleStyleChange = (element: ElementType, updates: Partial<TextElementStyle>) => {
    const key = element === 'name' ? 'name_style' 
              : element === 'date' ? 'date_style' 
              : 'certificate_id_style';
    const currentStyle = settings[key];
    onChange({ [key]: { ...currentStyle, ...updates } });
  };

  const handleReset = (element: ElementType) => {
    const key = element === 'name' ? 'name_style' 
              : element === 'date' ? 'date_style' 
              : 'certificate_id_style';
    onChange({ [key]: defaultSettings[key] });
  };

  const handleBackgroundClick = () => {
    setSelectedElement(null);
  };

  return (
    <div className="space-y-4">
      {/* Preview Data Inputs */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[150px]">
          <Label className="text-xs">Preview Name</Label>
          <Input
            value={previewData.fullName}
            onChange={(e) => setPreviewData({ ...previewData, fullName: e.target.value })}
            className="h-8 text-sm"
            placeholder="Enter name"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <Label className="text-xs">Preview Date</Label>
          <Input
            type="date"
            value={previewData.issueDate}
            onChange={(e) => setPreviewData({ ...previewData, issueDate: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
        {coursesData.length > 0 && (
          <div className="flex-1 min-w-[150px]">
            <Label className="text-xs">Course</Label>
            <select
              value={previewData.course}
              onChange={(e) => setPreviewData({ ...previewData, course: e.target.value })}
              className="w-full h-8 rounded border bg-background text-sm px-2"
            >
              {coursesData.map((course) => (
                <option key={course.id} value={course.name}>{course.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Click and drag text elements to reposition. Click to open style editor.
      </p>

      {/* Visual Editor Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/30"
        style={{ paddingBottom: `${ASPECT_RATIO * 100}%` }}
        onClick={handleBackgroundClick}
      >
        <div 
          className="absolute top-0 left-0 origin-top-left"
          style={{ 
            width: `${TEMPLATE_WIDTH}px`,
            height: `${TEMPLATE_HEIGHT}px`,
            transform: `scale(${scale})`,
          }}
        >
          {/* Background Template */}
          {templateUrl ? (
            <img 
              src={templateUrl} 
              alt="Certificate Template" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-amber-50 flex items-center justify-center">
              <p className="text-muted-foreground text-2xl">No template uploaded</p>
            </div>
          )}

          {/* Draggable Text Elements */}
          <DraggableText
            type="name"
            label="Student Name"
            style={settings.name_style}
            defaultStyle={defaultSettings.name_style}
            scale={scale}
            text={previewData.fullName}
            isSelected={selectedElement === 'name'}
            onSelect={() => setSelectedElement(selectedElement === 'name' ? null : 'name')}
            onChange={(updates) => handleStyleChange('name', updates)}
            onReset={() => handleReset('name')}
          />

          <DraggableText
            type="date"
            label="Issue Date"
            style={settings.date_style}
            defaultStyle={defaultSettings.date_style}
            scale={scale}
            text={formatDate(previewData.issueDate)}
            isSelected={selectedElement === 'date'}
            onSelect={() => setSelectedElement(selectedElement === 'date' ? null : 'date')}
            onChange={(updates) => handleStyleChange('date', updates)}
            onReset={() => handleReset('date')}
          />

          {settings.show_certificate_id && (
            <DraggableText
              type="certificateId"
              label="Certificate ID"
              style={settings.certificate_id_style}
              defaultStyle={defaultSettings.certificate_id_style}
              scale={scale}
              text={previewData.certificateId}
              isSelected={selectedElement === 'certificateId'}
              onSelect={() => setSelectedElement(selectedElement === 'certificateId' ? null : 'certificateId')}
              onChange={(updates) => handleStyleChange('certificateId', updates)}
              onReset={() => handleReset('certificateId')}
            />
          )}
        </div>
      </div>
    </div>
  );
}