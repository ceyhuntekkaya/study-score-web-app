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
      title: 'React Front To Back',
      image: '/assets/images/course/course-online-01.jpg',
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
      category: 'Web Development',
      currentPrice: '$49.00',
      oldPrice: '$84.99',
      discount: '-40%',
    },
    {
      id: 'course-2',
      title: 'PHP Beginner + Advanced',
      image: '/assets/images/course/course-online-02.jpg',
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
      category: 'Programming',
      currentPrice: '$39.00',
      oldPrice: '$59.99',
      discount: '-30%',
    },
    {
      id: 'course-3',
      title: 'Angular Zero to Mastery',
      image: '/assets/images/course/course-online-03.jpg',
      description: 'Angular Js long fact that a reader will be distracted by the readable.',
      lessons: 8,
      students: 30,
      rating: 5,
      reviews: 5,
      author: {
        name: 'Angela',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '/profile',
      },
      category: 'Web Development',
      currentPrice: '$59.00',
      oldPrice: '$99.99',
      discount: '-40%',
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
