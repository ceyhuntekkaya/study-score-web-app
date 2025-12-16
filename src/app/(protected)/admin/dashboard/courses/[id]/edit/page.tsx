'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { useGetCourseWithAllDetails } from '@/generated/api/course-rest-controller/course-rest-controller';
import CourseForm from '@/components/admin/CourseForm';
import CourseLessonsAccordion from '@/components/admin/CourseLessonsAccordion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EditCoursePage() {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params?.id as string;

  const { data: courseDetails, isLoading } = useGetCourseWithAllDetails(courseId, {
    query: { enabled: !!courseId },
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <LoadingSpinner />
        <p className="mt-3">{t('common.loading') || 'Yükleniyor...'}</p>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="text-center py-5">
        <p>Kurs bulunamadı.</p>
        <Link href="/admin/dashboard/courses" className="rbt-btn-link">
          <i className="feather-arrow-left me-1"></i>
          Kurslar Listesine Dön
        </Link>
      </div>
    );
  }

  // Convert CourseDetailDTO to Course for the form
  const courseData = {
    id: courseDetails.id,
    name: courseDetails.name,
    description: courseDetails.description,
    code: courseDetails.code,
    language: courseDetails.language,
    level: courseDetails.level,
    imageUrl: courseDetails.imageUrl,
    category: courseDetails.category,
    status: courseDetails.status,
  };

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>Kurs Düzenle</h2>
          <Link href="/admin/dashboard/courses" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            Kurslar Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        {/* Course Form - Top Section */}
        <div className="rbt-card rbt-card-body mb--30">
          <h3 className="mb--20">Kurs Bilgileri</h3>
          <CourseForm initialData={courseData} />
        </div>

        {/* Course Lessons Accordion - Bottom Section (2 columns) */}
        <div className="row g-5">
          <div className="col-md-6">
            <div className="rbt-card rbt-card-body">
              <CourseLessonsAccordion lessons={courseDetails.lessons} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="rbt-card rbt-card-body">
              <div className="text-center py-5">
                <p className="text-muted">Bu alan gelecekte kullanılacak.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
