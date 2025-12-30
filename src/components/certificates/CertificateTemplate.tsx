import React from 'react';

interface CertificateTemplateProps {
  fullName: string;
  course: string;
  issueDate: string;
  certificateId: string;
  templateUrl?: string | null;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  fullName,
  course,
  issueDate,
  certificateId,
  templateUrl,
}) => {
  // Format issue date as DD Month YYYY
  const formattedDate = new Date(issueDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  if (!templateUrl) {
    return (
      <div 
        className="relative w-[794px] h-[562px] mx-auto flex items-center justify-center"
        style={{ backgroundColor: '#FFF7ED' }}
      >
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No template uploaded</p>
          <p className="text-sm">Please upload a certificate template for this course</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-[794px] h-[562px] mx-auto overflow-hidden"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Background Template Image */}
      <img 
        src={templateUrl} 
        alt="Certificate Template" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dynamic Text Overlays */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Student Name - Centered, positioned in middle area */}
        <div 
          className="absolute"
          style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <p 
            className="text-[48px] text-center"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: '#1F2937',
              letterSpacing: '1.5px',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {fullName || 'Student Name'}
          </p>
        </div>

        {/* Issue Date - Bottom left area */}
        <div 
          className="absolute text-left"
          style={{ bottom: '15%', left: '12%' }}
        >
          <p 
            className="text-[16px]"
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              color: '#4B5563',
            }}
          >
            {formattedDate}
          </p>
        </div>

        {/* Certificate ID - Bottom left, below date */}
        <div 
          className="absolute text-left"
          style={{ bottom: '10%', left: '12%' }}
        >
          <p 
            className="text-[12px]"
            style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 400,
              color: '#6B7280',
            }}
          >
            ID: {certificateId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
