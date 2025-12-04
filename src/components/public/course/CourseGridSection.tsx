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
      title: 'React Front To Back',
      description: 'It is a long established fact that a reader will be distracted.',
      lessons: 12,
      students: 50,
      rating: 5,
      reviews: 15,
      author: {
        name: 'Angela',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '/profile',
      },
      category: 'Development',
      currentPrice: '$60',
      oldPrice: '$120',
      discount: '-40%',
    },
    {
      id: '2',
      image: '/assets/images/course/course-online-02.jpg',
      title: 'PHP Beginner Advanced',
      description: 'It is a long established fact that a reader will be distracted.',
      lessons: 12,
      students: 50,
      rating: 5,
      reviews: 15,
      author: {
        name: 'Angela',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '/profile',
      },
      category: 'Development',
      currentPrice: '$60',
      oldPrice: '$120',
    },
    {
      id: '3',
      image: '/assets/images/course/course-online-03.jpg',
      title: 'Angular Zero to Mastery',
      description: 'Angular Js long fact that a reader will be distracted by the readable.',
      lessons: 8,
      students: 30,
      rating: 5,
      reviews: 5,
      author: {
        name: 'Slaughter',
        avatar: '/assets/images/client/avatar-03.png',
        profileLink: '/profile',
      },
      category: 'Languages',
      currentPrice: '$80',
      oldPrice: '$100',
      discount: '-10%',
    },
    {
      id: '4',
      image: '/assets/images/course/course-online-04.jpg',
      title: 'Web Front To Back',
      description: 'Web Js long fact that a reader will be distracted by the readable.',
      lessons: 20,
      students: 40,
      rating: 5,
      reviews: 15,
      author: {
        name: 'Patrick',
        avatar: '/assets/images/client/avater-01.png',
        profileLink: '/profile',
      },
      category: 'Languages',
      currentPrice: '$60',
      oldPrice: '$120',
      discount: '-40%',
    },
    {
      id: '5',
      image: '/assets/images/course/course-online-05.jpg',
      title: 'SQL Beginner Advanced',
      description: 'It is a long established fact that a reader will be distracted by the readable.',
      lessons: 12,
      students: 50,
      rating: 5,
      reviews: 15,
      author: {
        name: 'Angela',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '/profile',
      },
      category: 'Development',
      currentPrice: '$60',
      oldPrice: '$120',
      discount: '-20%',
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

