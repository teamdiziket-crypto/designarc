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
  
  // Format issue date
  const formattedDate = new Date(issueDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div 
      className="relative bg-white w-[794px] h-[1123px] mx-auto overflow-hidden"
      style={{ fontFamily: 'Times New Roman, serif' }}
    >
      {/* Header Background */}
      <div className="absolute top-0 left-0 right-0 h-[140px]">
        <img 
          src={headerBgImg} 
          alt="" 
          className="w-full h-full object-cover object-left"
        />
      </div>

      {/* Logo */}
      <div className="absolute top-[25px] left-[40px] z-10">
        <img 
          src={logoImg} 
          alt="Design Arc Academy" 
          className="h-[90px] w-auto"
        />
      </div>

      {/* Year Badge */}
      <div className="absolute top-[10px] right-[60px] z-10">
        <div className="relative">
          <img 
            src={yearBadgeImg} 
            alt={`Year of ${year}`} 
            className="h-[160px] w-auto"
          />
        </div>
      </div>

      {/* Arc Watermark */}
      <div className="absolute top-[180px] left-[60px] opacity-20 z-0">
        <img 
          src={arcWatermarkImg} 
          alt="" 
          className="h-[700px] w-auto"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-[180px] px-[60px] text-center">
        {/* Certificate Title */}
        <h1 
          className="text-[72px] italic font-normal mb-0"
          style={{ 
            fontFamily: 'Georgia, serif',
            background: 'linear-gradient(90deg, #B8860B 0%, #DAA520 50%, #B8860B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          CERTIFICATE
        </h1>

        {/* Of Completion */}
        <p 
          className="text-[24px] tracking-[8px] text-[#333] mt-[-10px] mb-[30px]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          OF COMPLETION
        </p>

        {/* Certification Text */}
        <p 
          className="text-[18px] text-[#666] italic mb-[40px]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          This is to certify that
        </p>

        {/* Student Name */}
        <div className="mb-[20px]">
          <p 
            className="text-[36px] font-semibold text-[#333] border-b-2 border-[#DAA520] inline-block px-[40px] pb-[5px] min-w-[400px]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {fullName || 'Student Name'}
          </p>
        </div>

        {/* Completion Text */}
        <p 
          className="text-[18px] text-[#666] italic mb-[20px]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          has successfully completed the
        </p>

        {/* Course Name */}
        <h2 
          className="text-[28px] font-bold text-[#333] mb-[20px] tracking-[2px]"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {course?.toUpperCase() || 'COURSE NAME'}
        </h2>

        {/* Achievement Text */}
        <p 
          className="text-[16px] text-[#666] leading-[1.8] max-w-[550px] mx-auto mb-[60px]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          demonstrating dedication, proficiency, and a deep understanding of the subject matter, and is hereby awarded this certificate of achievement.
        </p>

        {/* Bottom Section */}
        <div className="flex justify-between items-start px-[20px] mt-[40px]">
          {/* Date of Issue */}
          <div className="text-left">
            <p 
              className="text-[14px] font-bold text-[#333] tracking-[2px] mb-[15px]"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              DATE OF ISSUE
            </p>
            <p 
              className="text-[16px] text-[#666]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {formattedDate}
            </p>
            <p 
              className="text-[12px] text-[#999] mt-[10px]"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              ID: {certificateId}
            </p>
          </div>

          {/* Validated By */}
          <div className="text-right">
            <p 
              className="text-[14px] font-bold text-[#333] tracking-[2px] mb-[10px]"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              VALIDATED BY
            </p>
            <img 
              src={signatureImg} 
              alt="Signature" 
              className="h-[50px] w-auto ml-auto mb-[5px]"
            />
            <p 
              className="text-[16px] font-bold text-[#333]"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              AMOL S.N.
            </p>
            <p 
              className="text-[13px] text-[#666]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Founder & CEO
            </p>
            <p 
              className="text-[13px] text-[#666]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Design Arc Academy
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="absolute bottom-0 left-0 right-0">
        <img 
          src={footerBarImg} 
          alt="" 
          className="w-full h-[40px] object-cover"
        />
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(90deg, #B8860B 0%, #DAA520 30%, #F4D03F 50%, #DAA520 70%, #B8860B 100%)',
          }}
        >
          <p 
            className="text-white text-[14px] tracking-[4px] font-semibold"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            DESIGN ARC ACADEMY {year}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
