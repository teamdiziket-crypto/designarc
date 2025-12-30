import { useState, useRef } from 'react';
import { GraduationCap, Plus, Pencil, Trash2, X, Check, Loader2, Upload, Image, FileImage } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCourses } from '@/contexts/CoursesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Courses() {
  const { courses, coursesData, loading, addCourse, updateCourse, updateCourseTemplate, deleteCourse } = useCourses();
  const [newCourse, setNewCourse] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingShortName, setEditingShortName] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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

  const handleUploadClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourseId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadingId(selectedCourseId);

    try {
      const course = coursesData.find(c => c.id === selectedCourseId);
      const fileName = `${selectedCourseId}-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Delete old template if exists
      if (course?.template_url) {
        const oldPath = course.template_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('certificate-templates').remove([oldPath]);
        }
      }

      // Upload new template
      const { data, error } = await supabase.storage
        .from('certificate-templates')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('certificate-templates')
        .getPublicUrl(fileName);

      // Update course with template URL
      await updateCourseTemplate(selectedCourseId, urlData.publicUrl);
    } catch (error) {
      console.error('Error uploading template:', error);
      toast.error('Failed to upload template');
    } finally {
      setUploadingId(null);
      setSelectedCourseId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveTemplate = async (courseId: string, templateUrl: string) => {
    try {
      const fileName = templateUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('certificate-templates').remove([fileName]);
      }
      await updateCourseTemplate(courseId, null);
    } catch (error) {
      console.error('Error removing template:', error);
      toast.error('Failed to remove template');
    }
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
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage courses and upload certificate templates.
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
          <div className="space-y-4">
            {coursesData.map((course, index) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors"
              >
                {editingId === course.id ? (
                  <div className="flex items-center gap-3">
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
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Course Info Row */}
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
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
                    </div>

                    {/* Certificate Template Row */}
                    <div className="flex items-center gap-3 pl-11">
                      <div className="flex items-center gap-2 flex-1">
                        <FileImage className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Certificate Template:</span>
                        {course.template_url ? (
                          <div className="flex items-center gap-2">
                            <a 
                              href={course.template_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <Image className="w-3 h-3" />
                              View Template
                            </a>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTemplate(course.id, course.template_url!)}
                              className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-amber-600">Not uploaded</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUploadClick(course.id)}
                        disabled={uploadingId === course.id}
                        className="h-7 text-xs"
                      >
                        {uploadingId === course.id ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3 mr-1" />
                        )}
                        {course.template_url ? 'Replace' : 'Upload'}
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

        {/* Template Guidelines */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileImage className="w-5 h-5 text-primary" />
            Certificate Template Guidelines
          </h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Upload high-quality template images (PNG or JPG recommended)</p>
            <p>• Recommended size: <strong>3508 × 2480 px</strong> (A4 landscape at 300 DPI)</p>
            <p>• Leave space for dynamic text: Student Name, Issue Date, and Certificate ID</p>
            <p>• Maximum file size: 10MB</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
