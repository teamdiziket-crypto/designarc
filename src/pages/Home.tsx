import { useState } from 'react';
import { Search, ShieldCheck, ShieldX, Award, Calendar, GraduationCap, Download, FileText, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Certificate } from '@/types/student';
import logoFull from '@/assets/logo-full.png';

interface StudentCertificates {
  fullName: string;
  email: string;
  certificates: Certificate[];
}

export default function Home() {
  const [searchType, setSearchType] = useState<'certificate' | 'student'>('certificate');
  const [searchQuery, setSearchQuery] = useState('');
  const [certificateResult, setCertificateResult] = useState<Certificate | null>(null);
  const [studentCertificates, setStudentCertificates] = useState<StudentCertificates | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearched(false);
    setCertificateResult(null);
    setStudentCertificates(null);

    try {
      if (searchType === 'certificate') {
        // Search by certificate ID
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .ilike('certificate_id', searchQuery.trim())
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setCertificateResult({
            id: data.id,
            certificateId: data.certificate_id,
            studentId: data.student_id || undefined,
            fullName: data.full_name,
            course: data.course,
            issueDate: data.issue_date,
            status: data.status as Certificate['status'],
            pdfUrl: data.pdf_url || undefined,
          });
        }
      } else {
        // Search by student email or phone to get all their certificates
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('id, full_name, email')
          .or(`email.ilike.%${searchQuery.trim()}%,whatsapp_no.ilike.%${searchQuery.trim()}%`)
          .limit(1);

        if (studentsError) throw studentsError;

        if (students && students.length > 0) {
          const student = students[0];
          
          // Get all certificates for this student
          const { data: certs, error: certsError } = await supabase
            .from('certificates')
            .select('*')
            .eq('student_id', student.id)
            .eq('status', 'Active')
            .order('issue_date', { ascending: false });

          if (certsError) throw certsError;

          setStudentCertificates({
            fullName: student.full_name,
            email: student.email,
            certificates: (certs || []).map(c => ({
              id: c.id,
              certificateId: c.certificate_id,
              studentId: c.student_id || undefined,
              fullName: c.full_name,
              course: c.course,
              issueDate: c.issue_date,
              status: c.status as Certificate['status'],
              pdfUrl: c.pdf_url || undefined,
            })),
          });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearched(true);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDownloadPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center">
          <img src={logoFull} alt="Design Arc Academy" className="h-10" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Certificate Verification
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Verify the authenticity of Design Arc Academy certificates or view your issued certificates.
          </p>
        </div>

        {/* Search Type Toggle */}
        <div className="flex justify-center gap-2">
          <Button
            variant={searchType === 'certificate' ? 'default' : 'outline'}
            onClick={() => {
              setSearchType('certificate');
              setSearchQuery('');
              setSearched(false);
              setCertificateResult(null);
              setStudentCertificates(null);
            }}
            className={searchType === 'certificate' ? 'btn-primary-gradient' : 'btn-glass'}
          >
            <Hash className="w-4 h-4 mr-2" />
            Verify by Certificate ID
          </Button>
          <Button
            variant={searchType === 'student' ? 'default' : 'outline'}
            onClick={() => {
              setSearchType('student');
              setSearchQuery('');
              setSearched(false);
              setCertificateResult(null);
              setStudentCertificates(null);
            }}
            className={searchType === 'student' ? 'btn-primary-gradient' : 'btn-glass'}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            My Certificates
          </Button>
        </div>

        {/* Search Box */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={
                  searchType === 'certificate'
                    ? 'Enter Certificate ID (e.g., DAC-2024-UXD-00001)'
                    : 'Enter your email or phone number'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 h-14 text-lg input-glass"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="btn-primary-gradient h-14 px-8"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                searchType === 'certificate' ? 'Verify' : 'Search'
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="animate-fade-in">
            {/* Certificate Verification Result */}
            {searchType === 'certificate' && (
              certificateResult ? (
                <div className="glass-card rounded-2xl p-8">
                  {/* Status Banner */}
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
                      certificateResult.status === 'Active'
                        ? 'bg-success/10 border border-success/20'
                        : 'bg-destructive/10 border border-destructive/20'
                    }`}
                  >
                    {certificateResult.status === 'Active' ? (
                      <ShieldCheck className="w-6 h-6 text-success" />
                    ) : (
                      <ShieldX className="w-6 h-6 text-destructive" />
                    )}
                    <div>
                      <p
                        className={`font-semibold ${
                          certificateResult.status === 'Active'
                            ? 'text-success'
                            : 'text-destructive'
                        }`}
                      >
                        {certificateResult.status === 'Active'
                          ? 'Valid Certificate'
                          : 'Certificate Revoked'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {certificateResult.status === 'Active'
                          ? 'This certificate is authentic and valid.'
                          : 'This certificate has been revoked and is no longer valid.'}
                      </p>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                      <div className="p-3 rounded-xl bg-primary/20">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Certificate ID</p>
                        <p className="font-mono font-semibold text-foreground">
                          {certificateResult.certificateId}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3 mb-2">
                          <GraduationCap className="w-5 h-5 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Student Name</p>
                        </div>
                        <p className="font-semibold text-foreground text-lg">
                          {certificateResult.fullName}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-5 h-5 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Course</p>
                        </div>
                        <p className="font-semibold text-foreground text-lg">
                          {certificateResult.course}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Issue Date</p>
                      </div>
                      <p className="font-semibold text-foreground text-lg">
                        {new Date(certificateResult.issueDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Download Buttons */}
                    {certificateResult.status === 'Active' && certificateResult.pdfUrl && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleDownloadPDF(certificateResult.pdfUrl!)}
                          className="flex-1 btn-primary-gradient"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Issuer Info */}
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground text-center">
                      Issued by{' '}
                      <span className="font-semibold text-foreground">
                        Design Arc Academy
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <ShieldX className="w-8 h-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Certificate Not Found
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    No certificate was found with the ID "{searchQuery}". Please
                    check the ID and try again.
                  </p>
                </div>
              )
            )}

            {/* Student Certificates Result */}
            {searchType === 'student' && (
              studentCertificates ? (
                <div className="space-y-4">
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-primary/20">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-lg">
                          {studentCertificates.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {studentCertificates.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {studentCertificates.certificates.length} certificate(s) found
                    </p>
                  </div>

                  {studentCertificates.certificates.length > 0 ? (
                    studentCertificates.certificates.map((cert) => (
                      <div key={cert.id} className="glass-card rounded-2xl p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-primary" />
                              <span className="font-semibold text-foreground">
                                {cert.course}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                                Active
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Certificate ID</p>
                                <p className="font-mono font-medium text-foreground">
                                  {cert.certificateId}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Issue Date</p>
                                <p className="font-medium text-foreground">
                                  {new Date(cert.issueDate).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                          {cert.pdfUrl && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleDownloadPDF(cert.pdfUrl!)}
                                className="btn-primary-gradient"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="glass-card rounded-2xl p-8 text-center">
                      <p className="text-muted-foreground">
                        No certificates have been issued yet. Please contact the academy if you believe this is an error.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Student Not Found
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    No student was found with the email or phone number "{searchQuery}". Please check and try again.
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* Help Text */}
        {!searched && (
          <div className="text-center text-sm text-muted-foreground">
            {searchType === 'certificate' ? (
              <>
                <p>
                  The certificate ID can be found on the bottom of the certificate
                  document.
                </p>
                <p className="mt-1">
                  Format: <span className="font-mono">DAC-YYYY-COURSE-XXXXX</span>
                </p>
              </>
            ) : (
              <p>
                Enter your registered email or phone number to view your certificates.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Design Arc Academy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
