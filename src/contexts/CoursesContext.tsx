import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CoursesContextType {
  courses: string[];
  addCourse: (course: string) => boolean;
  updateCourse: (index: number, newName: string) => boolean;
  deleteCourse: (index: number) => void;
}

const DEFAULT_COURSES = [
  'UI/UX Design',
  'Graphic Design',
  'Web Development',
  'Digital Marketing',
  'Interior Design',
  'Fashion Design',
  'Animation & VFX',
  'Photography',
];

const STORAGE_KEY = 'designarc_courses';

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_COURSES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const addCourse = (course: string): boolean => {
    const trimmed = course.trim();
    if (!trimmed || courses.includes(trimmed)) {
      return false;
    }
    setCourses((prev) => [...prev, trimmed]);
    return true;
  };

  const updateCourse = (index: number, newName: string): boolean => {
    const trimmed = newName.trim();
    if (!trimmed || courses.some((c, i) => i !== index && c === trimmed)) {
      return false;
    }
    setCourses((prev) => {
      const updated = [...prev];
      updated[index] = trimmed;
      return updated;
    });
    return true;
  };

  const deleteCourse = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CoursesContext.Provider value={{ courses, addCourse, updateCourse, deleteCourse }}>
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
