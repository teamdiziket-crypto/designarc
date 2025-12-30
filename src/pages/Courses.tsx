import { useState } from 'react';
import { GraduationCap, Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCourses } from '@/contexts/CoursesContext';

export default function Courses() {
  const { courses, coursesData, loading, addCourse, updateCourse, deleteCourse } = useCourses();
  const [newCourse, setNewCourse] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingShortName, setEditingShortName] = useState('');

  const handleAddCourse = async () => {
    if (!newCourse.trim()) {
      return;
    }
    const success = await addCourse(newCourse);
    if (success) {
      setNewCourse('');
    }
  };

  const handleEditCourse = (course: { id: string; name: string; short_name: string | null }) => {
    setEditingId(course.id);
    setEditingValue(course.name);
    setEditingShortName(course.short_name || '');
  };

  const handleSaveEdit = async () => {
    if (editingId === null) return;
    if (!editingValue.trim()) {
      return;
    }
    const success = await updateCourse(editingId, editingValue, editingShortName);
    if (success) {
      setEditingId(null);
      setEditingValue('');
      setEditingShortName('');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    await deleteCourse(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
    setEditingShortName('');
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
      <div className="max-w-3xl mx-auto space-y-8">
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
          <div className="space-y-2">
            {coursesData.map((course, index) => (
              <div
                key={course.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors"
              >
                {editingId === course.id ? (
                  <>
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="input-glass flex-1"
                      placeholder="Course name"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <Input
                      value={editingShortName}
                      onChange={(e) => setEditingShortName(e.target.value.toUpperCase())}
                      className="input-glass w-24"
                      placeholder="Short"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
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
                  </>
                ) : (
                  <>
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-foreground font-medium">{course.name}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-bold min-w-[50px] text-center">
                      {course.short_name || '—'}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditCourse(course)}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
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
      </div>
    </MainLayout>
  );
}
