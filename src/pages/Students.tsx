import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StudentFilters } from '@/components/students/StudentFilters';
import { StudentTable } from '@/components/students/StudentTable';
import { Pagination } from '@/components/students/Pagination';
import { AddStudentModal } from '@/components/students/AddStudentModal';
import { DeleteConfirmModal } from '@/components/students/DeleteConfirmModal';
import { Button } from '@/components/ui/button';
import { mockStudents } from '@/data/mockData';
import { Student } from '@/types/student';
import { toast } from 'sonner';

export default function Students() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.fullName.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.whatsappNo.includes(query) ||
          s.city.toLowerCase().includes(query)
      );
    }

    // Course filter
    if (selectedCourse !== 'all') {
      filtered = filtered.filter((s) => s.course === selectedCourse);
    }

    // Date filter
    if (dateFilter !== 'all' && dateFilter !== 'custom') {
      const days = parseInt(dateFilter);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter((s) => new Date(s.timestamp) >= cutoff);
    }

    // Sort by timestamp (newest first)
    filtered.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return filtered;
  }, [students, searchQuery, selectedCourse, dateFilter]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredStudents.slice(start, start + recordsPerPage);
  }, [filteredStudents, currentPage, recordsPerPage]);

  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCourse('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  const handleExport = () => {
    toast.success('Export started! Your file will be ready shortly.');
  };

  const handleAddStudent = (studentData: Partial<Student>) => {
    if (editStudent) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editStudent.id ? { ...s, ...studentData } as Student : s
        )
      );
    } else {
      const newStudent: Student = {
        id: `STU-${String(students.length + 1).padStart(4, '0')}`,
        rowId: students.length + 2,
        timestamp: new Date().toISOString(),
        fullName: studentData.fullName || '',
        email: studentData.email || '',
        whatsappNo: studentData.whatsappNo || '',
        city: studentData.city || '',
        course: studentData.course || '',
        paymentMode: studentData.paymentMode || 'UPI',
        paymentStatus: studentData.paymentStatus || 'Pending',
        amountPaid: studentData.amountPaid || 0,
        pendingAmount: studentData.pendingAmount || 0,
      };
      setStudents((prev) => [newStudent, ...prev]);
    }
    setEditStudent(null);
  };

  const handleDeleteStudent = () => {
    if (deleteStudent) {
      setStudents((prev) => prev.filter((s) => s.id !== deleteStudent.id));
      toast.success('Student deleted successfully');
    }
    setDeleteStudent(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">
              Manage your student directory and enrollment records.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditStudent(null);
              setAddModalOpen(true);
            }}
            className="btn-primary-gradient"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Filters */}
        <StudentFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          selectedCourse={selectedCourse}
          onCourseChange={(value) => {
            setSelectedCourse(value);
            setCurrentPage(1);
          }}
          dateFilter={dateFilter}
          onDateFilterChange={(value) => {
            setDateFilter(value);
            setCurrentPage(1);
          }}
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={(value) => {
            setRecordsPerPage(value);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
          onExport={handleExport}
        />

        {/* Results Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Found <span className="font-semibold text-foreground">{filteredStudents.length}</span>{' '}
            students
          </span>
          {(searchQuery || selectedCourse !== 'all' || dateFilter !== 'all') && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Filtered
            </span>
          )}
        </div>

        {/* Table */}
        <div>
          <StudentTable
            students={paginatedStudents}
            onEdit={(student) => {
              setEditStudent(student);
              setAddModalOpen(true);
            }}
            onDelete={setDeleteStudent}
          />

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={filteredStudents.length}
              recordsPerPage={recordsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* Modals */}
        <AddStudentModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onSubmit={handleAddStudent}
          editStudent={editStudent}
        />

        <DeleteConfirmModal
          open={!!deleteStudent}
          onOpenChange={(open) => !open && setDeleteStudent(null)}
          student={deleteStudent}
          onConfirm={handleDeleteStudent}
        />
      </div>
    </MainLayout>
  );
}
