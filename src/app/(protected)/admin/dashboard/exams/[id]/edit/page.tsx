'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

export default function EditExamPage() {
  const { t } = useTranslation();
  const params = useParams();
  const examId = params?.id as string;

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>Sınav Düzenle</h2>
          <Link href="/admin/dashboard/exams" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            Sınavlar Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <p>Form içeriği yakında eklenecek... (ID: {examId})</p>
      </div>
    </>
  );
}
