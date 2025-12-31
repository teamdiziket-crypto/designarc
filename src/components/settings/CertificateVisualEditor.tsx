import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw, X, Move } from 'lucide-react';
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

interface FloatingEditorProps {
  label: string;
  style: TextElementStyle;
  position: { x: number; y: number };
  onClose: () => void;
  onChange: (style: Partial<TextElementStyle>) => void;
  onReset: () => void;
}

function FloatingEditor({ label, style, position, onClose, onChange, onReset }: FloatingEditorProps) {
  return (
    <div 
      className="fixed z-50 bg-background border rounded-lg shadow-xl p-3 w-64 animate-in fade-in zoom-in-95 duration-150"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="font-medium text-sm">{label}</span>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onReset} title="Reset">
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onClose} title="Close">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Top %</Label>
            <Input
              type="number"
              value={style.top.toFixed(1)}
              onChange={(e) => onChange({ top: parseFloat(e.target.value) || 0 })}
              className="h-7 text-xs"
              step="0.5"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Left %</Label>
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
            <Label className="text-xs text-muted-foreground">Font Size</Label>
            <Input
              type="number"
              value={style.fontSize}
              onChange={(e) => onChange({ fontSize: parseInt(e.target.value) || 12 })}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Color</Label>
            <div className="flex gap-1">
              <input
                type="color"
                value={style.color}
                onChange={(e) => onChange({ color: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border-0 p-0"
              />
              <Input
                value={style.color}
                onChange={(e) => onChange({ color: e.target.value })}
                className="h-7 text-xs flex-1 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Weight</Label>
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
            <Label className="text-xs text-muted-foreground">Spacing</Label>
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
          <Label className="text-xs text-muted-foreground">Alignment</Label>
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
    </div>
  );
}

export function CertificateVisualEditor({ settings, defaultSettings, onChange }: CertificateVisualEditorProps) {
  const { coursesData, getTemplateUrl } = useCourses();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<{
    element: ElementType;
    startX: number;
    startY: number;
    initialTop: number;
    initialLeft: number;
  } | null>(null);

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

  const getStyleKey = (element: ElementType) => {
    return element === 'name' ? 'name_style' 
         : element === 'date' ? 'date_style' 
         : 'certificate_id_style';
  };

  const handleStyleChange = useCallback((element: ElementType, updates: Partial<TextElementStyle>) => {
    const key = getStyleKey(element);
    const currentStyle = settings[key];
    onChange({ [key]: { ...currentStyle, ...updates } });
  }, [settings, onChange]);

  const handleReset = (element: ElementType) => {
    const key = getStyleKey(element);
    onChange({ [key]: defaultSettings[key] });
  };

  // Handle right-click to open editor
  const handleContextMenu = (e: React.MouseEvent, element: ElementType) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Position the editor near the click, but ensure it stays in viewport
    const x = Math.min(e.clientX, window.innerWidth - 280);
    const y = Math.min(e.clientY, window.innerHeight - 400);
    
    setEditorPosition({ x, y });
    setSelectedElement(element);
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent, element: ElementType) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    
    const style = settings[getStyleKey(element)];
    setDragState({
      element,
      startX: e.clientX,
      startY: e.clientY,
      initialTop: style.top,
      initialLeft: style.left,
    });
  };

  // Handle mouse move for dragging
  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - dragState.startX) / scale;
      const deltaY = (e.clientY - dragState.startY) / scale;
      
      const newLeft = dragState.initialLeft + (deltaX / TEMPLATE_WIDTH) * 100;
      const newTop = dragState.initialTop + (deltaY / TEMPLATE_HEIGHT) * 100;
      
      handleStyleChange(dragState.element, {
        left: Math.max(0, Math.min(100, newLeft)),
        top: Math.max(0, Math.min(100, newTop)),
      });
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, scale, handleStyleChange]);

  // Close editor when clicking outside
  const handleBackgroundClick = () => {
    setSelectedElement(null);
  };

  // Render a text element
  const renderTextElement = (
    element: ElementType,
    style: TextElementStyle,
    text: string
  ) => {
    const isDragging = dragState?.element === element;
    
    const positionStyle: React.CSSProperties = {
      position: 'absolute',
      top: `${style.top}%`,
      left: style.textAlign === 'center' ? '0' : `${style.left}%`,
      width: style.textAlign === 'center' ? '100%' : 'auto',
      textAlign: style.textAlign,
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
      transition: isDragging ? 'none' : 'box-shadow 0.15s ease',
    };

    const textStyle: React.CSSProperties = {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: style.fontWeight,
      fontSize: `${style.fontSize}px`,
      color: style.color,
      letterSpacing: `${style.letterSpacing}px`,
      textTransform: element === 'name' ? 'uppercase' : 'none',
    };

    return (
      <div
        key={element}
        style={positionStyle}
        onMouseDown={(e) => handleMouseDown(e, element)}
        onContextMenu={(e) => handleContextMenu(e, element)}
        className={`group rounded px-2 py-1 ${
          selectedElement === element 
            ? 'ring-2 ring-primary bg-primary/10' 
            : 'hover:ring-2 hover:ring-primary/50 hover:bg-primary/5'
        }`}
        title="Drag to move • Right-click to edit"
      >
        <p style={textStyle}>{text}</p>
      </div>
    );
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

      {/* Visual Editor Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-lg"
        style={{ 
          paddingBottom: `${ASPECT_RATIO * 100}%`,
          overflow: 'hidden',
        }}
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
          {renderTextElement('name', settings.name_style, previewData.fullName)}
          {renderTextElement('date', settings.date_style, formatDate(previewData.issueDate))}
          {settings.show_certificate_id && 
            renderTextElement('certificateId', settings.certificate_id_style, previewData.certificateId)
          }
        </div>
      </div>

      {/* Floating Editor */}
      {selectedElement && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={handleBackgroundClick}
          />
          <FloatingEditor
            label={selectedElement === 'name' ? 'Student Name' : selectedElement === 'date' ? 'Issue Date' : 'Certificate ID'}
            style={settings[getStyleKey(selectedElement)]}
            position={editorPosition}
            onClose={() => setSelectedElement(null)}
            onChange={(updates) => handleStyleChange(selectedElement, updates)}
            onReset={() => handleReset(selectedElement)}
          />
        </>
      )}
    </div>
  );
}