'use client';

import { useState, useMemo } from 'react';
import CourseBannerSection from '@/components/public/course/CourseBannerSection';
import CourseTopSection from '@/components/public/course/CourseTopSection';
import CourseFilterSection from '@/components/public/course/CourseFilterSection';
import CourseGridSection from '@/components/public/course/CourseGridSection';
import { useGetAllCourses } from '@/generated/api/course-rest-controller/course-rest-controller';
import type { Course as ApiCourse } from '@/generated/api/openAPIDefinition.schemas';
import { getMediaServeUrl } from '@/lib/fileUtils';

/** Map API Course to the card format expected by CourseGridSection (keeps existing card design). */
function mapApiCourseToCard(apiCourse: ApiCourse): {
  id: string;
  image: string;
  title: string;
  description: string;
  lessons: number;
  students: number;
  rating: number;
  reviews: number;
  author: { name: string; avatar: string; profileLink: string };
  category: string;
  currentPrice: string;
  oldPrice?: string;
  discount?: string;
  href: string;
} {
  const id = apiCourse.id ?? '';
  const imageUrl = apiCourse.imageUrl ? getMediaServeUrl(apiCourse.imageUrl) : '';
  return {
    id,
    image: imageUrl || '/assets/images/course/course-online-01.jpg',
    title: apiCourse.name ?? 'Untitled Course',
    description: apiCourse.description ?? '',
    lessons: 0,
    students: 0,
    rating: 5,
    reviews: 0,
    author: {
      name: apiCourse.createdBy?.name ?? 'Study Score',
      avatar: '/assets/images/client/avatar-02.png',
      profileLink: '#',
    },
    category: apiCourse.category ?? apiCourse.level ?? 'Course',
    currentPrice: 'Free',
    href: `/courses/${id}`,
  };
}

/**
 * Courses Page
 * Template content converted to React components. Courses loaded from API.
 */
export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilter, setShowFilter] = useState(false);

  const { data: apiCourses, isLoading, error } = useGetAllCourses();
  const courses = useMemo(
    () => (apiCourses ?? []).map(mapApiCourseToCard),
    [apiCourses]
  );

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
      {isLoading && (
        <div className="rbt-section-overlayping-top rbt-section-gapBottom">
          <div className="inner">
            <div className="container text-center py-5">
              <p className="text-muted">Loading courses...</p>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="rbt-section-overlayping-top rbt-section-gapBottom">
          <div className="inner">
            <div className="container text-center py-5">
              <p className="text-danger">
                Error loading courses. Please try again later.
                {error instanceof Error && ` (${error.message})`}
              </p>
            </div>
          </div>
        </div>
      )}
      {!isLoading && !error && courses.length === 0 && (
        <div className="rbt-section-overlayping-top rbt-section-gapBottom">
          <div className="inner">
            <div className="container text-center py-5">
              <p className="text-muted">No courses available.</p>
            </div>
          </div>
        </div>
      )}
      {!isLoading && !error && courses.length > 0 && (
        <CourseGridSection courses={courses} viewMode={viewMode} />
      )}
    </>
  );
}

