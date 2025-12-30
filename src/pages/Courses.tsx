import { useState } from 'react';
import { GraduationCap, Plus, Pencil, Trash2, X, Check, Loader2, Award } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCourses } from '@/contexts/CoursesContext';
import { Label } from '@/components/ui/label';

export default function Courses() {
  const { courses, coursesData, loading, addCourse, updateCourse, deleteCourse } = useCourses();
  const [newCourse, setNewCourse] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingShortName, setEditingShortName] = useState('');
  const [editingCertificateName, setEditingCertificateName] = useState('');

  const handleAddCourse = async () => {
    if (!newCourse.trim()) {
      return;
    }
    const success = await addCourse(newCourse);
    if (success) {
      setNewCourse('');
    }
  };

  const handleEditCourse = (course: { id: string; name: string; short_name: string | null; certificate_name: string | null }) => {
    setEditingId(course.id);
    setEditingValue(course.name);
    setEditingShortName(course.short_name || '');
    setEditingCertificateName(course.certificate_name || '');
  };

  const handleSaveEdit = async () => {
    if (editingId === null) return;
    if (!editingValue.trim()) {
      return;
    }
    const success = await updateCourse(editingId, editingValue, editingShortName, editingCertificateName);
    if (success) {
      setEditingId(null);
      setEditingValue('');
      setEditingShortName('');
      setEditingCertificateName('');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    await deleteCourse(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
    setEditingShortName('');
    setEditingCertificateName('');
  };

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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage the courses offered by your institute.
          </p>
        </div>

        {/* Course Management */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Course Management
          </h2>

          {/* Add Course */}
          <div className="flex gap-2 mb-6">
            <Input
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              placeholder="Enter new course name..."
              className="input-glass flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCourse()}
            />
            <Button onClick={handleAddCourse} className="btn-primary-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                <p className="text-xs text-muted-foreground">Total Courses</p>
              </div>
            </div>
          </div>

          {/* Course List */}
          <div className="space-y-3">
            {coursesData.map((course, index) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors"
              >
                {editingId === course.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="input-glass flex-1"
                        placeholder="Course name"
                        autoFocus
                      />
                      <Input
                        value={editingShortName}
                        onChange={(e) => setEditingShortName(e.target.value.toUpperCase())}
                        className="input-glass w-24"
                        placeholder="Short"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Certificate Name (printed on certificate)
                        </Label>
                        <Input
                          value={editingCertificateName}
                          onChange={(e) => setEditingCertificateName(e.target.value)}
                          className="input-glass"
                          placeholder="e.g., Advanced Fashion Designing"
                        />
                      </div>
                      <div className="flex gap-2 pt-5">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleSaveEdit}
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-foreground font-medium">{course.name}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-bold">
                          {course.short_name || '—'}
                        </span>
                      </div>
                      {course.certificate_name && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Award className="w-3 h-3" />
                          <span>Certificate: {course.certificate_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditCourse(course)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {courses.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No courses added yet. Add your first course above.
              </p>
            )}
          </div>
        </div>

        {/* Certificate Name Info */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Certificate Name Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            The <strong>Certificate Name</strong> field defines how the course name will appear on generated certificates. 
            If not set, the regular course name will be used. This allows you to have a short internal name 
            (e.g., "AFD") while displaying a professional name on certificates (e.g., "Advanced Fashion Designing").
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
