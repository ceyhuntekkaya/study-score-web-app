'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import CourseForm from '@/components/admin/CourseForm';

export default function AddCoursePage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/dashboard/courses');
  };

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.course.add')}</h2>
          <Link href="/admin/dashboard/courses" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.course.backToList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="rbt-card rbt-card-body">
          <CourseForm 
            onSuccess={handleSuccess}
            onCancel={() => router.push('/admin/dashboard/courses')}
          />
        </div>
      </div>
    </>
  );
}
