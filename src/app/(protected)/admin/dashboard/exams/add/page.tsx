'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import ExamForm from '@/components/admin/ExamForm';
import ExamPartsManager from '@/components/admin/ExamPartsManager';

export default function AddExamPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [examId, setExamId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExamCreated = (createdExamId: string) => {
    setExamId(createdExamId);
  };

  // Removed handleRefresh - using key prop for refresh instead

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.entity.addExam')}</h2>
          <Link href="/admin/dashboard/exams" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.entity.backToExamsList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        {!examId ? (
          <div className="rbt-shadow-box">
            <h4 className="rbt-title-style-3 mb--30">
              {t('admin.exam.examInformation')}
            </h4>
            <ExamForm onSuccess={handleExamCreated} />
          </div>
        ) : (
          <div>
            <div className="rbt-shadow-box mb--30">
              <div className="alert alert-success" role="alert">
                <h5 className="alert-heading mb--10">
                  <i className="feather-check-circle me-2"></i>
                  {t('admin.exam.examCreated')}
                </h5>
                <p className="mb--0">
                  {t('admin.exam.examCreatedMessage')}
                </p>
              </div>
              <div className="rbt-btn-wrapper d-flex gap-2 mt--20">
                <Link
                  href="/admin/dashboard/exams"
                  className="rbt-btn btn-border"
                >
                  <i className="feather-arrow-left me-1"></i>
                  {t('admin.entity.backToExamsList')}
                </Link>
                <button
                  onClick={() => setExamId(null)}
                  className="rbt-btn btn-border"
                >
                  <i className="feather-edit me-1"></i>
                  {t('admin.exam.editExamInfo')}
                </button>
              </div>
            </div>

            <ExamPartsManager key={refreshKey} examId={examId} />
          </div>
        )}
      </div>
    </>
  );
}
