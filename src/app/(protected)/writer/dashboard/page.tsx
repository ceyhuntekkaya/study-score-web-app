'use client';

import { useState } from 'react';
import Link from 'next/link';
import CourseBannerSection from '@/components/public/course/CourseBannerSection';
import CourseTopSection from '@/components/public/course/CourseTopSection';
import CourseFilterSection from '@/components/public/course/CourseFilterSection';
import CourseGridSection from '@/components/public/course/CourseGridSection';

/**
 * Writer Dashboard Page (Courses List)
 * Template: course-filter-one-toggle.html
 */
export default function WriterDashboardPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilter, setShowFilter] = useState(false);
  
  // Dummy courses data - will be replaced with API call
  const [courses] = useState([
    {
      id: 'course-1',
      title: 'IELTS Band 8+ Accelerator',
      image: '/assets/images/course/course-online-01.jpg',
      description: 'Stop losing points on Writing and Speaking. Our AI Tutor analyzes your essays and pronunciation instantly to fix hidden errors.',
      lessons: 24,
      students: 1250,
      rating: 5,
      reviews: 342,
      author: {
        name: 'Dr. Ceyhun Tekkaya',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '/profile',
      },
      category: 'IELTS Prep',
      currentPrice: '$49.00',
      oldPrice: '$89.99',
      discount: '-45%',
    },
    {
      id: 'course-2',
      title: 'Digital SAT Elite Bootcamp',
      image: '/assets/images/course/course-online-02.jpg',
      description: 'Master the adaptive nature of the new Digital SAT. Our algorithm pinpoints your weak math concepts and verbal traps in real-time.',
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
      currentPrice: '$59.00',
      oldPrice: '$120.00',
      discount: '-50%',
    },
    {
      id: 'course-3',
      title: 'TOEFL iBT: Speaking Confidence',
      image: '/assets/images/course/course-online-03.jpg',
      description: 'Overcome exam anxiety with realistic AI simulations. Practice speaking responses 24/7 without fear of judgement.',
      lessons: 15,
      students: 650,
      rating: 5,
      reviews: 128,
      author: {
        name: 'Elif Demir',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '/profile',
      },
      category: 'TOEFL Prep',
      currentPrice: '$39.00',
      oldPrice: '$79.99',
      discount: '-50%',
    },
  ]);

  const handleSearch = (query: string) => {
    console.log('Search:', query);
    // TODO: Implement search functionality
  };

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // TODO: Implement filter functionality
  };

  return (
    <>
      {/* Course Banner Section */}
      <CourseBannerSection
        title="My Courses"
        description="Manage and create your courses here."
        courseCount={courses.length}
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Writer Dashboard', href: '/writer/dashboard' },
        ]}
      />

      {/* Course Top Section */}
      <CourseTopSection
        onSearch={handleSearch}
        onFilterToggle={handleFilterToggle}
        onViewChange={handleViewChange}
      />

      {/* Course Filter Section */}
      {showFilter && <CourseFilterSection onFilterChange={handleFilterChange} />}

      {/* Course Grid Section */}
      <CourseGridSection 
        courses={courses.map(course => ({
          ...course,
          href: `/writer/dashboard/courses/${course.id}`,
        }))} 
        viewMode={viewMode} 
      />
    </>
  );
}
