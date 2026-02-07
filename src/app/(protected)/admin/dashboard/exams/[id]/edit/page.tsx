'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import ExamForm from '@/components/admin/ExamForm';
import ExamPartsManager from '@/components/admin/ExamPartsManager';

export default function EditExamPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const examId = params?.id as string;
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExamUpdated = () => {
    // Refresh the page or show success message
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.exam.editExam') || 'Sınav Düzenle'}</h2>
          <Link href="/admin/dashboard/exams" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.entity.backToExamsList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="rbt-shadow-box mb--30">
          <h4 className="rbt-title-style-3 mb--30">
            {t('admin.exam.examInformation')}
          </h4>
          <ExamForm
            examId={examId}
            onSuccess={handleExamUpdated}
          />
        </div>

        <ExamPartsManager key={refreshKey} examId={examId} />
      </div>
    </>
  );
}
