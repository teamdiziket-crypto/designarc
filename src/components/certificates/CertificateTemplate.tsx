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
        className="relative w-[794px] h-[1123px] mx-auto flex items-center justify-center"
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
      className="relative w-[794px] h-[1123px] mx-auto overflow-hidden"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Background Template Image */}
      <img 
        src={templateUrl} 
        alt="Certificate Template" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dynamic Text Overlays - Positioned based on template design */}
      
      {/* Student Name - Centered below "This is to certify that" */}
      <div 
        className="absolute w-full text-center"
        style={{ top: '42%', left: '0' }}
      >
        <p 
          className="text-[36px] px-12"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: '#1F2937',
            letterSpacing: '2px',
          }}
        >
          {fullName || 'Student Name'}
        </p>
      </div>

      {/* Issue Date - Below "DATE OF ISSUE" label on left side */}
      <div 
        className="absolute"
        style={{ bottom: '15.5%', left: '10%' }}
      >
        <p 
          className="text-[14px]"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            color: '#4B5563',
          }}
        >
          {formattedDate}
        </p>
      </div>

      {/* Certificate ID - Small text at bottom */}
      <div 
        className="absolute w-full text-center"
        style={{ bottom: '4%', left: '0' }}
      >
        <p 
          className="text-[10px]"
          style={{ 
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 400,
            color: '#6B7280',
            letterSpacing: '0.5px',
          }}
        >
          Certificate ID: {certificateId}
        </p>
      </div>
    </div>
  );
};

export default CertificateTemplate;
