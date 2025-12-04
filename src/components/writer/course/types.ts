export interface Topic {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration?: string;
  isPreview?: boolean;
}

export interface CourseFormData {
  title: string;
  slug: string;
  aboutCourse: string;
  maxStudents: number;
  difficultyLevel: string;
  isPublic: boolean;
  enableQA: boolean;
  contentDripEnabled: boolean;
  contentDripType: string;
  priceType: 'paid' | 'free';
  regularPrice: string;
  discountedPrice: string;
  categories: string[];
  thumbnail: File | null;
  videoSource: string;
  videoUrl: string;
  startDate: string;
  language: string[];
  requirements: string;
  description: string;
  courseDurationHours: string;
  courseDurationMinutes: string;
  courseTags: string;
  targetedAudience: string;
  certificateTemplate: string;
}

