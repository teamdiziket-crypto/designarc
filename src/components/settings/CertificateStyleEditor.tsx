import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, RotateCcw, Type, Calendar, Hash } from 'lucide-react';
import type { TextElementStyle, CertificateSettings } from '@/hooks/useCertificateSettings';

interface StyleEditorProps {
  label: string;
  icon: React.ReactNode;
  style: TextElementStyle;
  onChange: (style: TextElementStyle) => void;
  defaultStyle: TextElementStyle;
}

function StyleEditor({ label, icon, style, onChange, defaultStyle }: StyleEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onChange(defaultStyle);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-2">
        <div className="space-y-6">
          {/* Position */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Top Position (%)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[style.top]}
                  onValueChange={([value]) => onChange({ ...style, top: value })}
                  min={0}
                  max={100}
                  step={0.5}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={style.top}
                  onChange={(e) => onChange({ ...style, top: parseFloat(e.target.value) || 0 })}
                  className="w-20 input-glass"
                  step={0.5}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Left Position (%)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[style.left]}
                  onValueChange={([value]) => onChange({ ...style, left: value })}
                  min={0}
                  max={100}
                  step={0.5}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={style.left}
                  onChange={(e) => onChange({ ...style, left: parseFloat(e.target.value) || 0 })}
                  className="w-20 input-glass"
                  step={0.5}
                />
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label className="text-sm">Font Size (px)</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[style.fontSize]}
                onValueChange={([value]) => onChange({ ...style, fontSize: value })}
                min={10}
                max={100}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                value={style.fontSize}
                onChange={(e) => onChange({ ...style, fontSize: parseInt(e.target.value) || 10 })}
                className="w-20 input-glass"
              />
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label className="text-sm">Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={style.color}
                onChange={(e) => onChange({ ...style, color: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={style.color}
                onChange={(e) => onChange({ ...style, color: e.target.value })}
                className="flex-1 input-glass font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Font Weight */}
          <div className="space-y-2">
            <Label className="text-sm">Font Weight</Label>
            <Select
              value={style.fontWeight.toString()}
              onValueChange={(value) => onChange({ ...style, fontWeight: parseInt(value) })}
            >
              <SelectTrigger className="input-glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Regular (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semi-Bold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Letter Spacing */}
          <div className="space-y-2">
            <Label className="text-sm">Letter Spacing (px)</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[style.letterSpacing]}
                onValueChange={([value]) => onChange({ ...style, letterSpacing: value })}
                min={0}
                max={20}
                step={0.5}
                className="flex-1"
              />
              <Input
                type="number"
                value={style.letterSpacing}
                onChange={(e) => onChange({ ...style, letterSpacing: parseFloat(e.target.value) || 0 })}
                className="w-20 input-glass"
                step={0.5}
              />
            </div>
          </div>

          {/* Text Align */}
          <div className="space-y-2">
            <Label className="text-sm">Text Alignment</Label>
            <Select
              value={style.textAlign}
              onValueChange={(value: 'left' | 'center' | 'right') => onChange({ ...style, textAlign: value })}
            >
              <SelectTrigger className="input-glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface CertificateStyleEditorProps {
  settings: CertificateSettings;
  defaultSettings: CertificateSettings;
  onChange: (settings: Partial<CertificateSettings>) => void;
}

export function CertificateStyleEditor({ settings, defaultSettings, onChange }: CertificateStyleEditorProps) {
  return (
    <div className="space-y-4">
      <StyleEditor
        label="Student Name"
        icon={<Type className="w-5 h-5 text-primary" />}
        style={settings.name_style}
        defaultStyle={defaultSettings.name_style}
        onChange={(style) => onChange({ name_style: style })}
      />
      
      <StyleEditor
        label="Date of Issue"
        icon={<Calendar className="w-5 h-5 text-primary" />}
        style={settings.date_style}
        defaultStyle={defaultSettings.date_style}
        onChange={(style) => onChange({ date_style: style })}
      />
      
      <StyleEditor
        label="Certificate ID"
        icon={<Hash className="w-5 h-5 text-primary" />}
        style={settings.certificate_id_style}
        defaultStyle={defaultSettings.certificate_id_style}
        onChange={(style) => onChange({ certificate_id_style: style })}
      />
    </div>
  );
}
