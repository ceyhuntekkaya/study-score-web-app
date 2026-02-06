'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import QuestionForm from '@/components/admin/QuestionForm';

/**
 * Soru düzenleme sayfası. Hem standalone hem gruba bağlı sorular için kullanılır.
 * questionGroupId soru verisinden gelir (API'den).
 */
export default function EditQuestionPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const questionId = params?.id as string;

  const handleSuccess = () => {
    router.push('/admin/dashboard/questions');
  };

  const handleCancel = () => {
    router.push('/admin/dashboard/questions');
  };

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.exam.editQuestion') ?? 'Soru Düzenle'}</h2>
          <Link href="/admin/dashboard/questions" className="rbt-btn-link">
            <i className="feather-arrow-left me-1" />
            {t('admin.entity.backToQuestionsList') ?? 'Sorulara dön'}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="rbt-shadow-box">
          <QuestionForm
            questionId={questionId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </>
  );
}
