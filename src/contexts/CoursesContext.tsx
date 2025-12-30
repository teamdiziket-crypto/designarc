import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;
  short_name: string | null;
}

interface CoursesContextType {
  courses: string[];
  coursesData: Course[];
  loading: boolean;
  addCourse: (course: string) => Promise<boolean>;
  updateCourse: (id: string, newName: string, shortName?: string) => Promise<boolean>;
  getShortName: (courseName: string) => string;
  deleteCourse: (id: string) => Promise<void>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name');

      if (error) throw error;
      setCoursesData(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();

    // Set up realtime subscription
    const channel = supabase
      .channel('courses-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'courses' },
        (payload) => {
          console.log('Realtime course update:', payload);
          if (payload.eventType === 'INSERT') {
            setCoursesData((prev) => [...prev, payload.new as Course].sort((a, b) => a.name.localeCompare(b.name)));
          } else if (payload.eventType === 'UPDATE') {
            setCoursesData((prev) =>
              prev.map((c) => (c.id === (payload.new as Course).id ? (payload.new as Course) : c))
                .sort((a, b) => a.name.localeCompare(b.name))
            );
          } else if (payload.eventType === 'DELETE') {
            setCoursesData((prev) => prev.filter((c) => c.id !== (payload.old as Course).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const courses = coursesData.map((c) => c.name);

  const addCourse = async (course: string): Promise<boolean> => {
    const trimmed = course.trim();
    if (!trimmed || courses.includes(trimmed)) {
      toast.error('Course already exists or invalid name');
      return false;
    }

    try {
      const { error } = await supabase.from('courses').insert({ name: trimmed });
      if (error) throw error;
      toast.success('Course added successfully');
      return true;
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
      return false;
    }
  };

  const updateCourse = async (id: string, newName: string, shortName?: string): Promise<boolean> => {
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error('Course name cannot be empty');
      return false;
    }

    try {
      const updateData: { name: string; short_name?: string } = { name: trimmed };
      if (shortName !== undefined) {
        updateData.short_name = shortName.trim().toUpperCase() || null;
      }
      
      const { error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      toast.success('Course updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
      return false;
    }
  };

  const getShortName = (courseName: string): string => {
    const course = coursesData.find((c) => c.name === courseName);
    return course?.short_name || courseName.substring(0, 3).toUpperCase();
  };

  const deleteCourse = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  return (
    <CoursesContext.Provider value={{ courses, coursesData, loading, addCourse, updateCourse, deleteCourse, getShortName }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
}
