'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import QuestionGroupForm from '@/components/admin/QuestionGroupForm';

export default function AddQuestionGroupPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSuccess = (groupId: string) => {
    router.push(`/admin/dashboard/question-groups/${groupId}/edit`);
  };

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.entity.addQuestionGroup')}</h2>
          <Link href="/admin/dashboard/question-groups" className="rbt-btn-link">
            <i className="feather-arrow-left me-1" />
            {t('admin.entity.backToQuestionGroupsList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="rbt-shadow-box">
          <h4 className="rbt-title-style-3 mb--30">
            {t('admin.exam.questionGroups')}
          </h4>
          <QuestionGroupForm onSuccess={handleSuccess} />
        </div>
      </div>
    </>
  );
}
