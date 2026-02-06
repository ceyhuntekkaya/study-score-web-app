'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n';
import QuestionForm from '@/components/admin/QuestionForm';

/**
 * Standalone soru ekleme sayfası (gruba bağlı değil).
 * Aynı form ekleme ve güncelleme için kullanılır; burada questionGroupId verilmez.
 */
export default function AddQuestionPage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.exam.addQuestion') ?? 'Soru Ekle'}</h2>
          <Link href="/admin/dashboard/questions" className="rbt-btn-link">
            <i className="feather-arrow-left me-1" />
            {t('admin.entity.backToQuestionsList') ?? 'Sorulara dön'}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="rbt-shadow-box">
          <QuestionForm
            onSuccess={() => {
              window.location.href = '/admin/dashboard/questions';
            }}
            onCancel={() => {
              window.location.href = '/admin/dashboard/questions';
            }}
          />
        </div>
      </div>
    </>
  );
}
