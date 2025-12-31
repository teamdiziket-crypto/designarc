import React from 'react';

interface CertificateTemplateProps {
  fullName: string;
  course: string;
  issueDate: string;
  certificateId: string;
  templateUrl?: string | null;
  showCertificateId?: boolean;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  fullName,
  issueDate,
  certificateId,
  templateUrl,
  showCertificateId = false,
}) => {
  // Format issue date as "25th DECEMBER, 2025"
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

      {/* Dynamic Text Overlays - Positioned based on template design */}
      
      {/* Student Name - Centered, Uppercase, 50px, Montserrat Regular, #F89A28 */}
      <div 
        className="absolute w-full text-center"
        style={{ top: '44%', left: '0' }}
      >
        <p 
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            fontSize: '50px',
            color: '#F89A28',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          {fullName || 'STUDENT NAME'}
        </p>
      </div>

      {/* Issue Date - positioned at bottom left, 23px, Montserrat Medium, Black */}
      <div 
        className="absolute"
        style={{ bottom: '17%', left: '10%' }}
      >
        <p 
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            fontSize: '23px',
            color: '#000000',
          }}
        >
          {formattedDate}
        </p>
      </div>

      {/* Certificate ID - just below date, 18px, Montserrat Medium - conditionally shown */}
      {showCertificateId && (
        <div 
          className="absolute"
          style={{ bottom: '14.5%', left: '10%' }}
        >
          <p 
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: '18px',
              color: '#000000',
            }}
          >
            {certificateId}
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificateTemplate;