import { useState } from 'react';
import { Search, ShieldCheck, ShieldX, Award, Calendar, GraduationCap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockCertificates } from '@/data/mockData';
import { Certificate } from '@/types/student';

export default function Verify() {
  const [certificateId, setCertificateId] = useState('');
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!certificateId.trim()) return;

    setIsLoading(true);
    setSearched(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const found = mockCertificates.find(
      (c) => c.certificateId.toLowerCase() === certificateId.toLowerCase()
    );

    setResult(found || null);
    setSearched(true);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Certificate Verification
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Enter a certificate ID to verify its authenticity and view details.
          </p>
        </div>

        {/* Search */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Enter Certificate ID (e.g., DAC-2024-UXD-00001)"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 h-14 text-lg input-glass"
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={isLoading || !certificateId.trim()}
              className="btn-primary-gradient h-14 px-8"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="animate-fade-in">
            {result ? (
              <div className="glass-card rounded-2xl p-8">
                {/* Status Banner */}
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
                    result.status === 'Active'
                      ? 'bg-success/10 border border-success/20'
                      : 'bg-destructive/10 border border-destructive/20'
                  }`}
                >
                  {result.status === 'Active' ? (
                    <ShieldCheck className="w-6 h-6 text-success" />
                  ) : (
                    <ShieldX className="w-6 h-6 text-destructive" />
                  )}
                  <div>
                    <p
                      className={`font-semibold ${
                        result.status === 'Active'
                          ? 'text-success'
                          : 'text-destructive'
                      }`}
                    >
                      {result.status === 'Active'
                        ? 'Valid Certificate'
                        : 'Certificate Revoked'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {result.status === 'Active'
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
                        {result.certificateId}
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
                        {result.fullName}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Course</p>
                      </div>
                      <p className="font-semibold text-foreground text-lg">
                        {result.course}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Issue Date</p>
                    </div>
                    <p className="font-semibold text-foreground text-lg">
                      {new Date(result.issueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
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
                  No certificate was found with the ID "{certificateId}". Please
                  check the ID and try again.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        {!searched && (
          <div className="text-center text-sm text-muted-foreground">
            <p>
              The certificate ID can be found on the bottom of the certificate
              document.
            </p>
            <p className="mt-1">
              Format: <span className="font-mono">DAC-YYYY-COURSE-XXXXX</span>
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
