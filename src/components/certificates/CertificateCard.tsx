import { Award, Download, Mail, Eye, MoreHorizontal, XCircle } from 'lucide-react';
import { Certificate } from '@/types/student';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CertificateCardProps {
  certificate: Certificate;
  onView: (cert: Certificate) => void;
  onDownload: (cert: Certificate) => void;
  onEmail: (cert: Certificate) => void;
  onRevoke: (cert: Certificate) => void;
}

export function CertificateCard({
  certificate,
  onView,
  onDownload,
  onEmail,
  onRevoke,
}: CertificateCardProps) {
  const isActive = certificate.status === 'Active';

  return (
    <div className="glass-card-hover rounded-2xl p-5 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${isActive ? 'bg-primary/20' : 'bg-destructive/20'}`}>
          <Award className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-destructive'}`} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onView(certificate)}>
              <Eye className="w-4 h-4 mr-2" />
              View Certificate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(certificate)}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEmail(certificate)}>
              <Mail className="w-4 h-4 mr-2" />
              Email to Student
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isActive && (
              <DropdownMenuItem
                onClick={() => onRevoke(certificate)}
                className="text-destructive focus:text-destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Revoke Certificate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Certificate ID
          </p>
          <p className="font-mono text-sm font-medium text-foreground">
            {certificate.certificateId}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Student
          </p>
          <p className="font-medium text-foreground">{certificate.fullName}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Course
            </p>
            <p className="text-sm text-foreground">{certificate.course}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isActive ? 'badge-paid' : 'bg-destructive/15 text-destructive border border-destructive/20'
            }`}
          >
            {certificate.status}
          </span>
        </div>

        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Issued on{' '}
            <span className="font-medium text-foreground">
              {new Date(certificate.issueDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
