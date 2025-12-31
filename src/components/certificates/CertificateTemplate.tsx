import React from 'react';
import type { TextElementStyle } from '@/hooks/useCertificateSettings';

interface CertificateTemplateProps {
  fullName: string;
  course: string;
  issueDate: string;
  certificateId: string;
  templateUrl?: string | null;
  showCertificateId?: boolean;
  nameStyle?: TextElementStyle;
  dateStyle?: TextElementStyle;
  certificateIdStyle?: TextElementStyle;
}

const defaultNameStyle: TextElementStyle = {
  top: 41.5,
  left: 50,
  fontSize: 50,
  color: '#F89A28',
  fontWeight: 400,
  letterSpacing: 3,
  textAlign: 'center',
};

const defaultDateStyle: TextElementStyle = {
  top: 82.5,
  left: 7.5,
  fontSize: 23,
  color: '#000000',
  fontWeight: 500,
  letterSpacing: 0,
  textAlign: 'left',
};

const defaultCertIdStyle: TextElementStyle = {
  top: 85.5,
  left: 7.5,
  fontSize: 18,
  color: '#000000',
  fontWeight: 500,
  letterSpacing: 0,
  textAlign: 'left',
};

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  fullName,
  issueDate,
  certificateId,
  templateUrl,
  showCertificateId = false,
  nameStyle = defaultNameStyle,
  dateStyle = defaultDateStyle,
  certificateIdStyle = defaultCertIdStyle,
}) => {
  // Format issue date as "25th JUNE, 2025"
  const formatDateWithSuffix = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const year = date.getFullYear();
    
    // Add ordinal suffix
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' 
                 : (day === 2 || day === 22) ? 'nd'
                 : (day === 3 || day === 23) ? 'rd' 
                 : 'th';
    
    return `${day}${suffix} ${month}, ${year}`;
  };

  // Uppercase name
  const formatName = (name: string) => {
    return name.toUpperCase();
  };

  const formattedDate = formatDateWithSuffix(issueDate);

  if (!templateUrl) {
    return (
      <div 
        className="certificate-content relative mx-auto flex items-center justify-center"
        style={{ 
          width: '1588px', 
          height: '2246px',
          backgroundColor: '#FFF7ED' 
        }}
      >
        <div className="text-center text-muted-foreground">
          <p className="text-2xl font-medium">No template uploaded</p>
          <p className="text-lg">Please upload a certificate template for this course</p>
        </div>
      </div>
    );
  }

  const getPositionStyle = (style: TextElementStyle) => {
    const baseStyle: React.CSSProperties = {
      top: `${style.top}%`,
      left: style.textAlign === 'center' ? '0' : `${style.left}%`,
      width: style.textAlign === 'center' ? '100%' : 'auto',
      textAlign: style.textAlign,
    };
    return baseStyle;
  };

  const getTextStyle = (style: TextElementStyle): React.CSSProperties => ({
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: style.fontWeight,
    fontSize: `${style.fontSize}px`,
    color: style.color,
    letterSpacing: `${style.letterSpacing}px`,
  });

  return (
    <div 
      className="certificate-content relative mx-auto overflow-hidden"
      style={{ 
        width: '1588px', 
        height: '2246px',
        fontFamily: 'Montserrat, sans-serif' 
      }}
    >
      {/* Background Template Image - High resolution */}
      <img 
        src={templateUrl} 
        alt="Certificate Template" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dynamic Text Overlays - Positioned based on settings */}
      
      {/* Student Name */}
      <div 
        className="absolute"
        style={getPositionStyle(nameStyle)}
      >
        <p style={getTextStyle(nameStyle)}>
          {formatName(fullName) || 'Student Name'}
        </p>
      </div>

      {/* Issue Date */}
      <div 
        className="absolute"
        style={getPositionStyle(dateStyle)}
      >
        <p style={getTextStyle(dateStyle)}>
          {formattedDate}
        </p>
      </div>

      {/* Certificate ID - conditionally shown */}
      {showCertificateId && (
        <div 
          className="absolute"
          style={getPositionStyle(certificateIdStyle)}
        >
          <p style={getTextStyle(certificateIdStyle)}>
            {certificateId}
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificateTemplate;
