'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

export default function EditCoursePage() {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params?.id as string;

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
        <p>Form içeriği yakında eklenecek... (ID: {courseId})</p>
      </div>
    </>
  );
}
