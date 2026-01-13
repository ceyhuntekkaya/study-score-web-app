'use client';

import CourseCard from './CourseCard';

interface Course {
  id: string;
  image: string;
  title: string;
  description: string;
  lessons: number;
  students: number;
  rating: number;
  reviews: number;
  author: {
    name: string;
    avatar: string;
    profileLink: string;
  };
  category: string;
  currentPrice: string;
  oldPrice?: string;
  discount?: string;
  showAddToCart?: boolean;
  href?: string;
}

interface CourseGridSectionProps {
  courses: Course[];
  viewMode?: 'grid' | 'list';
}

/**
 * Course Grid Section Component
 * Converted from template
 */
export default function CourseGridSection({ courses, viewMode = 'grid' }: CourseGridSectionProps) {
  // Dummy courses data - will be replaced with API data
  const dummyCourses: Course[] = [
    {
      id: '1',
      image: '/assets/images/course/course-online-01.jpg',
      title: 'IELTS Writing Mastery: AI-Powered Feedback',
      description: 'Stuck at Band 6.5? Our AI analyzes your essays instantly, pinpointing grammar and coherence errors to help you reach Band 8.0.',
      lessons: 24,
      students: 1250,
      rating: 5,
      reviews: 340,
      author: {
        name: 'Dr. Murat Koçar',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '/profile',
      },
      category: 'IELTS Prep',
      currentPrice: '$49',
      oldPrice: '$99',
      discount: '-50%',
    },
    {
      id: '2',
      image: '/assets/images/course/course-online-02.jpg',
      title: 'Digital SAT Elite: Adaptive Math & Verbal',
      description: 'Master the new Digital SAT with an adaptive curriculum that gets harder as you get better, ensuring you are ready for the top percentile.',
      lessons: 40,
      students: 890,
      rating: 4.9,
      reviews: 215,
      author: {
        name: 'Study Score Team',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '/profile',
      },
      category: 'SAT Prep',
      currentPrice: '$59',
      oldPrice: '$120',
    },
    {
      id: '3',
      image: '/assets/images/course/course-online-03.jpg',
      title: 'TOEFL Speaking: Eliminate Your Accent',
      description: 'Practice speaking without fear. Our AI listens to your pronunciation and fluency, giving you a safe space to improve 24/7.',
      lessons: 15,
      students: 650,
      rating: 4.8,
      reviews: 120,
      author: {
        name: 'Elif Demir',
        avatar: '/assets/images/client/avatar-03.png',
        profileLink: '/profile',
      },
      category: 'TOEFL Prep',
      currentPrice: '$39',
      oldPrice: '$79',
      discount: '-50%',
    },
    {
      id: '4',
      image: '/assets/images/course/course-online-04.jpg',
      title: 'GRE & GMAT Logic: Beat the Algorithm',
      description: 'Don\'t just memorize words; master the logic. Our Smart Tutor reveals the patterns behind the hardest questions on GRE and GMAT.',
      lessons: 35,
      students: 420,
      rating: 5,
      reviews: 95,
      author: {
        name: 'Study Score AI',
        avatar: '/assets/images/client/avater-01.png',
        profileLink: '/profile',
      },
      category: 'Grad School',
      currentPrice: '$69',
      oldPrice: '$140',
      discount: '-50%',
    },
    {
      id: '5',
      image: '/assets/images/course/course-online-05.jpg',
      title: 'AP Calculus & Physics: Smart Solver',
      description: 'Prepare for your Advanced Placement exams with AI-guided problem solving that explains "why" you got an answer wrong.',
      lessons: 20,
      students: 300,
      rating: 4.9,
      reviews: 80,
      author: {
        name: 'Prof. Ahmet Y.',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '/profile',
      },
      category: 'AP Exams',
      currentPrice: '$45',
      oldPrice: '$90',
      discount: '-50%',
      showAddToCart: true,
    },
  ];

  const displayCourses = courses.length > 0 ? courses : dummyCourses;

  return (
    <div className="rbt-section-overlayping-top rbt-section-gapBottom">
      <div className="inner">
        <div className="container">
          <div className="rbt-course-grid-column">
            {displayCourses.map((course) => (
              <CourseCard key={course.id} {...course} viewMode={viewMode} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

