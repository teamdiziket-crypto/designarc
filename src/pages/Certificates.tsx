import { useState, useMemo } from 'react';
import { Search, Filter, Award, Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockCertificates } from '@/data/mockData';
import { Certificate } from '@/types/student';
import { useCourses } from '@/contexts/CoursesContext';
import { toast } from 'sonner';

export default function Certificates() {
  const { courses } = useCourses();
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCertificates = useMemo(() => {
    let filtered = [...certificates];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.fullName.toLowerCase().includes(query) ||
          c.certificateId.toLowerCase().includes(query) ||
          c.course.toLowerCase().includes(query)
      );
    }

    if (selectedCourse !== 'all') {
      filtered = filtered.filter((c) => c.course === selectedCourse);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    return filtered;
  }, [certificates, searchQuery, selectedCourse, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: certificates.length,
      active: certificates.filter((c) => c.status === 'Active').length,
      revoked: certificates.filter((c) => c.status === 'Revoked').length,
    };
  }, [certificates]);

  const handleView = (cert: Certificate) => {
    toast.info(`Viewing certificate: ${cert.certificateId}`);
  };

  const handleDownload = (cert: Certificate) => {
    toast.success(`Downloading certificate: ${cert.certificateId}`);
  };

  const handleEmail = (cert: Certificate) => {
    toast.success(`Email sent to ${cert.fullName}`);
  };

  const handleRevoke = (cert: Certificate) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === cert.id ? { ...c, status: 'Revoked' as const } : c
      )
    );
    toast.success(`Certificate ${cert.certificateId} has been revoked`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Certificates</h1>
            <p className="text-muted-foreground mt-1">
              Manage and issue certificates for your students.
            </p>
          </div>
          <Button className="btn-primary-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Generate Certificate
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Certificates</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <Award className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/20">
                <Award className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.revoked}</p>
                <p className="text-sm text-muted-foreground">Revoked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, certificate ID, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 input-glass h-11"
              />
            </div>

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[180px] input-glass h-11">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] input-glass h-11">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Found{' '}
            <span className="font-semibold text-foreground">
              {filteredCertificates.length}
            </span>{' '}
            certificates
          </span>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onView={handleView}
              onDownload={handleDownload}
              onEmail={handleEmail}
              onRevoke={handleRevoke}
            />
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No certificates found</p>
            <p className="text-muted-foreground mt-1">
              Try adjusting your filters or generate new certificates.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
