import { useMemo } from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  CalendarDays,
  IndianRupee,
  Clock,
  TrendingUp,
  Award,
  Loader2,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useStudents } from '@/hooks/useStudents';
import { useCertificates } from '@/hooks/useCertificates';
import { DashboardStats } from '@/types/student';

const formatCurrency = (amount: number) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${(amount / 1000).toFixed(0)}K`;
};

export default function Dashboard() {
  const { students, loading: studentsLoading } = useStudents();
  const { certificates, loading: certificatesLoading } = useCertificates();

  const loading = studentsLoading || certificatesLoading;

  const stats: DashboardStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      totalStudents: students.length,
      todayCount: students.filter((s) => new Date(s.timestamp) >= today).length,
      last7Days: students.filter((s) => new Date(s.timestamp) >= last7Days).length,
      last30Days: students.filter((s) => new Date(s.timestamp) >= last30Days).length,
      totalPaidAmount: students.reduce((sum, s) => sum + s.amountPaid, 0),
      totalPendingAmount: students.reduce((sum, s) => sum + s.pendingAmount, 0),
    };
  }, [students]);

  const courseDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    students.forEach((student) => {
      distribution[student.course] = (distribution[student.course] || 0) + 1;
    });
    return Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [students]);

  const recentStudents = useMemo(() => {
    return [...students]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [students]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening at Design Arc Academy.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-lg font-semibold text-foreground">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 stagger-children">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Today"
            value={stats.todayCount}
            icon={UserPlus}
            subtitle="New enrollments"
          />
          <StatCard
            title="Last 7 Days"
            value={stats.last7Days}
            icon={Calendar}
            subtitle="Weekly growth"
          />
          <StatCard
            title="Last 30 Days"
            value={stats.last30Days}
            icon={CalendarDays}
            subtitle="Monthly growth"
          />
          <StatCard
            title="Total Collected"
            value={formatCurrency(stats.totalPaidAmount)}
            icon={IndianRupee}
            variant="success"
          />
          <StatCard
            title="Pending Amount"
            value={formatCurrency(stats.totalPendingAmount)}
            icon={Clock}
            variant="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Distribution */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Course Distribution
              </h2>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {courseDistribution.map(([course, count]) => {
                const percentage = stats.totalStudents > 0 
                  ? Math.round((count / stats.totalStudents) * 100) 
                  : 0;
                return (
                  <div key={course} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{course}</span>
                      <span className="text-muted-foreground">
                        {count} students ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {courseDistribution.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No course data available yet.
                </p>
              )}
            </div>
          </div>

          {/* Recent Certificates */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Certificates
              </h2>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-4">
              {certificates.slice(0, 5).map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {cert.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {cert.course}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cert.status === 'Active'
                        ? 'badge-paid'
                        : 'bg-destructive/15 text-destructive'
                    }`}
                  >
                    {cert.status}
                  </span>
                </div>
              ))}
              {certificates.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No certificates issued yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Students */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Enrollments
            </h2>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {recentStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {student.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {student.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">{student.city}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                    {student.course}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      student.paymentStatus === 'Paid'
                        ? 'badge-paid'
                        : 'badge-partial'
                    }`}
                  >
                    {student.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
            {recentStudents.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-4">
                No students enrolled yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
