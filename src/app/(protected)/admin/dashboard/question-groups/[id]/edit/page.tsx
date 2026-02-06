'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { useGetQuestionGroup } from '@/generated/api/question-group-controller/question-group-controller';
import { useGetQuestionsByGroup } from '@/generated/api/question-controller/question-controller';
import QuestionGroupForm from '@/components/admin/QuestionGroupForm';
import QuestionForm from '@/components/admin/QuestionForm';

type QuestionRow = {
  id?: string;
  name?: string;
  questionType?: string;
  maximumScore?: number;
  difficulty?: string;
  orderNumber?: number;
  [key: string]: unknown;
};

function normalizeQuestions(data: unknown): QuestionRow[] {
  if (Array.isArray(data)) return data as QuestionRow[];
  if (data && typeof data === 'object' && 'content' in data) {
    const content = (data as { content?: unknown[] }).content;
    return Array.isArray(content) ? (content as QuestionRow[]) : [];
  }
  return [];
}

export default function EditQuestionGroupPage() {
  const { t } = useTranslation();
  const params = useParams();
  const groupId = params?.id as string;

  const { data: groupData, isLoading: groupLoading } = useGetQuestionGroup(groupId, {
    query: { enabled: !!groupId },
  });
  const { data: questionsData, isLoading: questionsLoading, refetch: refetchQuestions } = useGetQuestionsByGroup(
    groupId,
    { query: { enabled: !!groupId } }
  );

  const questions = normalizeQuestions(questionsData);

  if (groupLoading || !groupId) {
    return (
      <div className="rbt-page-title mb--20">
        <div className="text-center py-5">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.exam.editQuestionGroup')}</h2>
          <Link href="/admin/dashboard/question-groups" className="rbt-btn-link">
            <i className="feather-arrow-left me-1" />
            {t('admin.entity.backToQuestionGroupsList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="row g-4">
          {/* Sol: Soru grubu özellikleri */}
          <div className="col-lg-5 col-xl-4">
            <div className="rbt-shadow-box h-100">
              <h4 className="rbt-title-style-3 mb--30">
                {t('admin.exam.questionGroupProperties') ?? 'Soru grubu özellikleri'}
              </h4>
              <QuestionGroupForm groupId={groupId} onSuccess={() => {}} />
            </div>
          </div>
          {/* Sağ: Gruptaki sorular */}
          <div className="col-lg-7 col-xl-8">
            <div className="rbt-shadow-box">
              <h4 className="rbt-title-style-3 mb--30">
                {t('admin.exam.questions')} ({questions.length})
              </h4>
              <QuestionGroupQuestionsPanel
                groupId={groupId}
                questions={questions}
                isLoading={questionsLoading}
                onRefetch={refetchQuestions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function QuestionGroupQuestionsPanel({
  groupId,
  questions,
  isLoading,
  onRefetch,
}: {
  groupId: string;
  questions: QuestionRow[];
  isLoading: boolean;
  onRefetch: () => void;
}) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingQuestionId(null);
    setShowForm(true);
  };

  const handleEdit = (questionId: string) => {
    setEditingQuestionId(questionId);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingQuestionId(null);
    onRefetch();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuestionId(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb--20">
        <p className="text-muted mb-0">
          {t('admin.exam.questionsInGroupDescription') ?? 'Bu gruba ait soruları aşağıda yönetebilirsiniz.'}
        </p>
        <button type="button" className="rbt-btn btn-sm btn-border-gradient" onClick={handleAdd}>
          <i className="feather-plus me-1" />
          {t('admin.exam.addQuestion')}
        </button>
      </div>

      {showForm && (
        <div className="mb--30 p-3 bg-light rounded">
          <QuestionForm
            questionGroupId={groupId}
            questionId={editingQuestionId ?? undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {questions.length === 0 && !showForm ? (
        <p className="text-muted text-center py-4 mb-0">
          {t('admin.exam.noQuestions')}
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>{t('admin.lesson.orderNumber') ?? 'Sıra'}</th>
                <th>{t('admin.exam.questionName') ?? 'Soru adı'}</th>
                <th>{t('admin.exam.questionType') ?? 'Tip'}</th>
                <th>{t('admin.exam.maxScore') ?? 'Puan'}</th>
                <th>{t('admin.exam.difficulty') ?? 'Zorluk'}</th>
                <th className="text-end">{t('common.actions') ?? 'İşlemler'}</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => {
                const qId = q.id ?? '';
                return (
                  <tr key={qId}>
                    <td>{q.orderNumber ?? '—'}</td>
                    <td>{q.name ?? '—'}</td>
                    <td>
                      <span className="badge bg-secondary">{q.questionType ?? '—'}</span>
                    </td>
                    <td>{q.maximumScore ?? '—'}</td>
                    <td>
                      {q.difficulty && <span className="badge bg-info">{q.difficulty}</span>}
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="rbt-btn btn-sm btn-border-gradient"
                        onClick={() => handleEdit(qId)}
                      >
                        <i className="feather-edit me-1" />
                        {t('common.edit')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
