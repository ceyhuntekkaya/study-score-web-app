'use client';

import { useState } from 'react';
import CourseBannerSection from '@/components/public/course/CourseBannerSection';
import CourseTopSection from '@/components/public/course/CourseTopSection';
import CourseFilterSection from '@/components/public/course/CourseFilterSection';
import CourseGridSection from '@/components/public/course/CourseGridSection';

/**
 * Courses Page
 * Template content converted to React components
 */
export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilter, setShowFilter] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

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
      <CourseBannerSection />

      {/* Course Top Section */}
      <CourseTopSection
        onSearch={handleSearch}
        onFilterToggle={handleFilterToggle}
        onViewChange={handleViewChange}
      />

      {/* Course Filter Section */}
      {showFilter && <CourseFilterSection onFilterChange={handleFilterChange} />}

      {/* Course Grid Section */}
      <CourseGridSection courses={courses} viewMode={viewMode} />
    </>
  );
}

