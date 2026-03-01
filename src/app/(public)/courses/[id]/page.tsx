'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import CourseDetailsBanner from '@/components/public/course-details/CourseDetailsBanner';
import CourseDetailsNavigation from '@/components/public/course-details/CourseDetailsNavigation';
import CourseOverviewSection from '@/components/public/course-details/CourseOverviewSection';
import CourseContentSection from '@/components/public/course-details/CourseContentSection';
import CourseDetailsInfoSection from '@/components/public/course-details/CourseDetailsInfoSection';
import CourseInstructorSection from '@/components/public/course-details/CourseInstructorSection';
import CourseReviewSection from '@/components/public/course-details/CourseReviewSection';
import CourseSidebar from '@/components/public/course-details/CourseSidebar';
import CourseCard from '@/components/public/course/CourseCard';
import { useGetCourseWithAllDetails, useGetAllCourses } from '@/generated/api/course-rest-controller/course-rest-controller';
import type { CourseLessonDetailDTO } from '@/generated/api/openAPIDefinition.schemas';

/** API may return nested childLessons (not in schema); support both flat and nested. */
type LessonWithChildren = CourseLessonDetailDTO & { childLessons?: LessonWithChildren[] };
import type { Course as ApiCourse } from '@/generated/api/openAPIDefinition.schemas';
import { getMediaServeUrl } from '@/lib/fileUtils';

/** Get children of a lesson: from nested childLessons or from flat list by parentLessonId. */
function getChildLessons(
  parent: LessonWithChildren,
  allFlat: LessonWithChildren[],
): LessonWithChildren[] {
  if (parent.childLessons && parent.childLessons.length > 0) {
    return parent.childLessons.sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
  }
  const pid = parent.id ?? '';
  return allFlat
    .filter((l) => l.parentLessonId === pid)
    .sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
}

/** Build course content sections from API lessons (UNIT -> TOPIC -> LESSON -> parts). Supports both nested childLessons and flat parentLessonId. */
function buildSectionsFromLessons(lessons: CourseLessonDetailDTO[] | undefined): {
  id: string;
  title: string;
  duration: string;
  lessons: { id: string; title: string; duration?: string; type: 'video' | 'text'; isPreview?: boolean; isLocked?: boolean }[];
}[] {
  if (!lessons?.length) return [];

  const all = lessons as LessonWithChildren[];

  // Root units: no parent or parentLessonId empty
  let units = all
    .filter((l) => l.lessonLevel === 'UNIT' && !l.parentLessonId)
    .sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));

  // Fallback: if no UNIT at root, treat any root items as sections (e.g. API returns only TOPIC/LESSON at top level)
  if (units.length === 0) {
    units = all
      .filter((l) => !l.parentLessonId)
      .sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
  }

  return units.map((unit) => {
    const unitId = unit.id ?? 'unit';
    const topics = getChildLessons(unit, all).filter((l) => l.lessonLevel === 'TOPIC');

    const sectionLessons: { id: string; title: string; duration?: string; type: 'video' | 'text'; isPreview?: boolean; isLocked?: boolean }[] = [];

    for (const topic of topics) {
      const topicLessons = getChildLessons(topic, all).filter((l) => l.lessonLevel === 'LESSON');

      for (const les of topicLessons) {
        sectionLessons.push({
          id: les.id ?? `les-${sectionLessons.length}`,
          title: les.name ?? 'Lesson',
          type: 'text',
          isLocked: true,
        });
        const parts = (les.lessonParts ?? []).sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
        for (const part of parts) {
          sectionLessons.push({
            id: part.id ?? `p-${sectionLessons.length}`,
            title: part.name ?? 'Part',
            type: 'text',
            isLocked: true,
          });
        }
      }
    }

    // If no TOPIC/LESSON hierarchy, show UNIT's own lessonParts or single placeholder
    if (sectionLessons.length === 0 && unit.lessonParts?.length) {
      for (const part of unit.lessonParts.sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0))) {
        sectionLessons.push({
          id: part.id ?? `p-${sectionLessons.length}`,
          title: part.name ?? 'Part',
          type: 'text',
          isLocked: true,
        });
      }
    }
    if (sectionLessons.length === 0) {
      sectionLessons.push({
        id: unitId,
        title: unit.name ?? 'Content',
        type: 'text',
        isLocked: true,
      });
    }

    const partCount = sectionLessons.length;
    return {
      id: unitId,
      title: unit.name ?? 'Section',
      duration: partCount ? `${partCount} item${partCount !== 1 ? 's' : ''}` : '—',
      lessons: sectionLessons,
    };
  });
}

/** Map API Course to card format (for related courses). */
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
 * Course Details Page
 * Data loaded from API (getCourseWithAllDetails). Design unchanged.
 */
export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: courseDetails, isLoading, error } = useGetCourseWithAllDetails(id, {
    query: { enabled: !!id },
  });
  const { data: allCourses } = useGetAllCourses();

  const course = useMemo(() => {
    if (!courseDetails) return null;

    const name = courseDetails.name ?? 'Untitled Course';
    const description = courseDetails.description ?? '';
    const category = courseDetails.category ?? courseDetails.level ?? 'Course';
    const imageUrl = courseDetails.imageUrl ? getMediaServeUrl(courseDetails.imageUrl) : '';

    const sections = buildSectionsFromLessons(courseDetails.lessons);

    const courseFeatures = [
      { label: 'Category', value: category },
      { label: 'Level', value: courseDetails.level ?? '—' },
      { label: 'Language', value: courseDetails.language ?? 'English' },
      { label: 'Curriculum', value: courseDetails.curriculumName ?? '—' },
      { label: 'Code', value: courseDetails.code ?? '—' },
    ].filter((f) => f.value && f.value !== '—');

    const relatedList = (allCourses ?? []).filter((c) => c.id && c.id !== id);
    const relatedCourses = relatedList.slice(0, 2).map(mapApiCourseToCard);

    return {
      id: courseDetails.id ?? id,
      title: name,
      description,
      rating: 4.9,
      totalRatings: 0,
      totalStudents: 0,
      author: {
        name: 'Study Score',
        avatar: '/assets/images/client/avatar-02.png',
        profileLink: '#',
      },
      category,
      lastUpdated: courseDetails.createdAt ? new Date(courseDetails.createdAt).toLocaleDateString() : undefined,
      language: courseDetails.language ?? 'English',
      isCertified: true,
      isBestseller: false,
      thumbnail: imageUrl || '/assets/images/course/course-01.jpg',
      currentPrice: 'Free',
      oldPrice: undefined,
      discountDays: undefined,
      videoPreview: undefined,
      learningPoints: description
        ? [description.slice(0, 120) + (description.length > 120 ? '...' : '')]
        : ['Course content from curriculum.'],
      extendedDescription: description,
      sections: sections.length > 0 ? sections : [{ id: 'overview', title: 'Course content', duration: '—', lessons: [] }],
      requirements: ['Internet access.', 'Basic proficiency recommended.'],
      detailsDescription: description ? [description] : ['No additional description.'],
      instructor: {
        name: 'Study Score Team',
        avatar: '/assets/images/testimonial/testimonial-7.jpg',
        profileLink: '#',
        title: 'Instructor',
        rating: 4.9,
        totalReviews: 0,
        totalStudents: 0,
        totalCourses: 1,
        bio: 'Study Score offers adaptive exam preparation with AI-powered feedback.',
        socialLinks: {},
      },
      ratingBreakdown: [
        { stars: 5, percentage: 100 },
        { stars: 4, percentage: 0 },
        { stars: 3, percentage: 0 },
        { stars: 2, percentage: 0 },
        { stars: 1, percentage: 0 },
      ],
      featuredReviews: [] as { id: string; author: { name: string; avatar: string; profileLink: string }; rating: number; comment: string }[],
      courseFeatures: courseFeatures.length > 0 ? courseFeatures : [{ label: 'Access', value: 'Free' }],
      relatedCourses,
    };
  }, [courseDetails, id, allCourses]);

  const handleAddToCart = () => {
    if (course) console.log('Add to cart:', course.id);
  };

  const handleBuyNow = () => {
    if (course) console.log('Buy now:', course.id);
  };

  if (isLoading) {
    return (
      <div className="rbt-course-details-area ptb--60">
        <div className="container text-center py-5">
          <p className="text-muted">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rbt-course-details-area ptb--60">
        <div className="container text-center py-5">
          <p className="text-danger">
            Error loading course. Please try again.
            {error instanceof Error && ` (${error.message})`}
          </p>
          <Link href="/courses" className="rbt-btn btn-md mt-3">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="rbt-course-details-area ptb--60">
        <div className="container text-center py-5">
          <p className="text-muted">Course not found.</p>
          <Link href="/courses" className="rbt-btn btn-md mt-3">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <CourseDetailsBanner
        title={course.title}
        description={course.description}
        rating={course.rating}
        totalRatings={course.totalRatings}
        totalStudents={course.totalStudents}
        author={course.author}
        category={course.category}
        lastUpdated={course.lastUpdated}
        language={course.language}
        isCertified={course.isCertified}
        isBestseller={course.isBestseller}
      />

      <div className="rbt-course-details-area ptb--60">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="course-details-content">
                <div className="rbt-course-feature-box rbt-shadow-box thuumbnail">
                  <img
                    className="w-100"
                    src={course.thumbnail}
                    alt={course.title}
                    width={800}
                    height={450}
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <CourseDetailsNavigation />

                <CourseOverviewSection
                  description={course.description}
                  learningPoints={course.learningPoints}
                  extendedDescription={course.extendedDescription}
                />

                <CourseContentSection sections={course.sections} />

                <CourseDetailsInfoSection
                  requirements={course.requirements}
                  description={course.detailsDescription}
                />

                <CourseInstructorSection instructor={course.instructor} />

                <CourseReviewSection
                  averageRating={course.rating}
                  totalRatings={course.totalRatings}
                  ratingBreakdown={course.ratingBreakdown}
                  featuredReviews={course.featuredReviews}
                />

                {course.relatedCourses.length > 0 && (
                  <div className="related-course mt--60">
                    <div className="row g-5 align-items-end mb--40">
                      <div className="col-lg-8 col-md-8 col-12">
                        <div className="section-title">
                          <span className="subtitle bg-pink-opacity">Top Course</span>
                          <h4 className="title">
                            More courses
                          </h4>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-12">
                        <div className="read-more-btn text-start text-md-end">
                          <Link className="rbt-btn rbt-switch-btn btn-border btn-sm" href="/courses">
                            View All Courses
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="row g-5">
                      {course.relatedCourses.map((relatedCourse) => (
                        <div key={relatedCourse.id} className="col-lg-6 col-md-6 col-sm-6 col-12">
                          <CourseCard {...relatedCourse} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <CourseSidebar
              currentPrice={course.currentPrice}
              oldPrice={course.oldPrice}
              discountDays={course.discountDays}
              videoPreview={course.videoPreview}
              courseFeatures={course.courseFeatures}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      </div>
    </>
  );
}
