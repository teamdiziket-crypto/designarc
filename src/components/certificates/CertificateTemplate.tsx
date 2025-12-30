import React from 'react';
import logoImg from '@/assets/certificate/logo.png';
import yearBadgeImg from '@/assets/certificate/year-badge.png';
import headerBgImg from '@/assets/certificate/header-bg.png';
import arcWatermarkImg from '@/assets/certificate/arc-watermark.png';
import footerBarImg from '@/assets/certificate/footer-bar.png';
import signatureImg from '@/assets/certificate/signature.png';

interface CertificateTemplateProps {
  fullName: string;
  course: string;
  issueDate: string;
  certificateId: string;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  fullName,
  course,
  issueDate,
  certificateId,
}) => {
  // Extract year from issue date
  const year = new Date(issueDate).getFullYear() || 2025;
  
  // Format issue date as DD Month YYYY
  const formattedDate = new Date(issueDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div 
      className="relative w-[794px] h-[1123px] mx-auto overflow-hidden"
      style={{ 
        fontFamily: 'Montserrat, sans-serif',
        backgroundColor: '#FFF7ED',
      }}
    >
      {/* Header Background */}
      <div className="absolute top-0 left-0 right-0 h-[140px]">
        <img 
          src={headerBgImg} 
          alt="" 
          className="w-full h-full object-cover object-left"
        />
      </div>

      {/* Logo - Top left */}
      <div className="absolute top-[25px] left-[40px] z-10">
        <img 
          src={logoImg} 
          alt="Design Arc Academy" 
          className="h-[90px] w-auto max-w-[220px]"
        />
      </div>

      {/* Year Badge */}
      <div className="absolute top-[10px] right-[60px] z-10">
        <img 
          src={yearBadgeImg} 
          alt={`Year of ${year}`} 
          className="h-[160px] w-auto"
        />
      </div>

      {/* Arc Watermark - Opacity 12-18% */}
      <div className="absolute top-[180px] left-[60px] z-0" style={{ opacity: 0.15 }}>
        <img 
          src={arcWatermarkImg} 
          alt="" 
          className="h-[700px] w-auto"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-[180px] px-[60px] text-center">
        {/* Certificate Title - Montserrat Medium */}
        <h1 
          className="text-[34px] tracking-[2px] uppercase mb-[8px]"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            color: '#92400E',
          }}
        >
          CERTIFICATE OF COMPLETION
        </h1>

        {/* Supporting Text - Montserrat Regular */}
        <p 
          className="text-[22px] mb-[30px]"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            color: '#374151',
          }}
        >
          This certificate is awarded to
        </p>

        {/* Student Name - Playfair Display Semi-Bold (Primary Element) */}
        <div className="mb-[25px]">
          <p 
            className="text-[64px] inline-block border-b-2 px-[40px] pb-[8px] min-w-[450px]"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: '#1F2937',
              letterSpacing: '1.5px',
              borderColor: '#DAA520',
            }}
          >
            {fullName || 'Student Name'}
          </p>
        </div>

        {/* Completion Text - Montserrat Regular */}
        <p 
          className="text-[22px] mb-[20px]"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            color: '#374151',
          }}
        >
          has successfully completed the
        </p>

        {/* Course Name - Montserrat Semi-Bold */}
        <h2 
          className="text-[40px] mb-[25px] tracking-[2px]"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            color: '#111827',
          }}
        >
          {course?.toUpperCase() || 'COURSE NAME'}
        </h2>

        {/* Achievement Text - Montserrat Regular */}
        <p 
          className="text-[18px] leading-[1.8] max-w-[550px] mx-auto mb-[50px]"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            color: '#374151',
          }}
        >
          demonstrating dedication, proficiency, and a deep understanding of the subject matter, and is hereby awarded this certificate of achievement.
        </p>

        {/* Bottom Section */}
        <div className="flex justify-between items-start px-[20px] mt-[30px]">
          {/* Date of Issue */}
          <div className="text-left">
            <p 
              className="text-[14px] tracking-[2px] mb-[12px] uppercase"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              DATE OF ISSUE
            </p>
            <p 
              className="text-[18px] mb-[8px]"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                color: '#4B5563',
              }}
            >
              {formattedDate}
            </p>
            {/* Certificate ID - Monospace */}
            <p 
              className="text-[14px]"
              style={{ 
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 400,
                color: '#6B7280',
              }}
            >
              Certificate ID: {certificateId}
            </p>
          </div>

          {/* Validated By */}
          <div className="text-right">
            <p 
              className="text-[14px] tracking-[2px] mb-[10px] uppercase"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              VALIDATED BY
            </p>
            <img 
              src={signatureImg} 
              alt="Signature" 
              className="h-[50px] w-auto ml-auto mb-[5px]"
            />
            <p 
              className="text-[16px]"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              AMOL S.N.
            </p>
            <p 
              className="text-[13px]"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                color: '#4B5563',
              }}
            >
              Founder & CEO
            </p>
            <p 
              className="text-[13px]"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                color: '#4B5563',
              }}
            >
              Design Arc Academy
            </p>
          </div>
        </div>

        {/* Verification Text */}
        <p 
          className="text-[12px] mt-[40px]"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 400,
            color: '#6B7280',
          }}
        >
          Verify this certificate at: designarcacademy.com/verify
        </p>
      </div>

      {/* Footer Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[40px]">
        <img 
          src={footerBarImg} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(90deg, #B8860B 0%, #DAA520 30%, #F4D03F 50%, #DAA520 70%, #B8860B 100%)',
          }}
        >
          <p 
            className="text-white text-[14px] tracking-[4px]"
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
            }}
          >
            DESIGN ARC ACADEMY {year}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
