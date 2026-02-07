'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import type { QuestionCreateRequest, QuestionHeaderRequest } from '@/generated/api/openAPIDefinition.schemas';
import { QuestionHeaderRequestMediaType, QuestionCreateRequestQuestionType, type QuestionCreateRequestCategory } from '@/generated/api/openAPIDefinition.schemas';
import { useGetQuestionGroup } from '@/generated/api/question-group-controller/question-group-controller';
import {
  useGetQuestionsByGroup,
  useGetStandaloneQuestions,
  useUpdateQuestion,
  getQuestion,
} from '@/generated/api/question-controller/question-controller';
import QuestionGroupForm from '@/components/admin/QuestionGroupForm';
import QuestionForm from '@/components/admin/QuestionForm';
import HeaderRenderer from '@/components/learner/exam/HeaderRenderer';
import QuestionRenderer from '@/components/learner/exam/questions/QuestionRenderer';

type QuestionRow = {
  id?: string;
  name?: string;
  questionType?: string;
  maximumScore?: number;
  difficulty?: string;
  orderNumber?: number;
  [key: string]: unknown;
};

const EMPTY_HEADER: QuestionHeaderRequest = {
  orderNumber: 1,
  mediaType: QuestionHeaderRequestMediaType.TEXT,
  content: '',
};

/** Build QuestionCreateRequest from API question payload; override questionGroupId for add/remove from group */
function questionToCreateRequest(
  q: Record<string, unknown>,
  questionGroupId?: string
): QuestionCreateRequest {
  let parsedTemplateData: unknown = {};
  const rawTemplate = q.templateData;
  if (typeof rawTemplate === 'string') {
    try {
      parsedTemplateData = JSON.parse(rawTemplate);
    } catch {
      parsedTemplateData = {};
    }
  } else {
    parsedTemplateData = rawTemplate ?? {};
  }
  const rawHeaders = q.headers;
  const headers: QuestionHeaderRequest[] = Array.isArray(rawHeaders)
    ? rawHeaders.map((h: Record<string, unknown>, i: number) => ({
        orderNumber: (h.orderNumber as number) ?? i + 1,
        mediaType: (h.mediaType as QuestionHeaderRequestMediaType) ?? QuestionHeaderRequestMediaType.TEXT,
        content: (h.content as string) ?? '',
      }))
    : [{ ...EMPTY_HEADER }];
  const payload: QuestionCreateRequest = {
    name: (q.name as string) || '',
    questionType: (q.questionType as QuestionCreateRequestQuestionType) ?? QuestionCreateRequestQuestionType.MULTIPLE_CHOICE,
    maximumScore: Number(q.maximumScore) || 100,
    templateData: parsedTemplateData,
    ...(headers.length ? { headers } : {}),
    ...(questionGroupId !== undefined ? { questionGroupId: questionGroupId || undefined } : {}),
    ...(q.subject != null && q.subject !== '' ? { subject: q.subject as string } : {}),
    ...(q.difficulty ? { difficulty: q.difficulty as string } : {}),
    ...(q.category ? { category: q.category as QuestionCreateRequestCategory } : {}),
    ...(q.courseSection != null && q.courseSection !== '' ? { courseSection: q.courseSection as string } : {}),
    ...(Array.isArray(q.curriculumContentIds) && q.curriculumContentIds.length ? { curriculumContentIds: q.curriculumContentIds as string[] } : {}),
  };
  return payload;
}

function normalizeQuestions(data: unknown): QuestionRow[] {
  if (Array.isArray(data)) return data as QuestionRow[];
  if (data && typeof data === 'object' && 'content' in data) {
    const content = (data as { content?: unknown[] }).content;
    return Array.isArray(content) ? (content as QuestionRow[]) : [];
  }
  return [];
}

/** Öğrencinin sınavda göreceği şekilde soru grubu önizlemesi */
function QuestionGroupPreview({
  groupData,
  questions,
}: {
  groupData: unknown;
  questions: QuestionRow[];
}) {
  const { t } = useTranslation();
  const g = (groupData ?? {}) as Record<string, unknown>;
  const groupName = (g.name as string) || (g.code as string) || '—';
  const groupCode = (g.code as string) || '';
  const headers = (Array.isArray(g.headers) ? g.headers : []) as Array<{ mediaType?: string; content?: string }>;

  return (
    <div className="mt-5 pt-4 border-top">
      <h5 className="rbt-title-style-3 mb--20">
        <i className="feather-eye me-2" />
        {t('admin.exam.questionGroupPreview') ?? 'Öğrenci önizlemesi'}
      </h5>
      <div
        className="p-4 rounded"
        style={{
          backgroundColor: '#f5f7fa',
          border: '1px solid #e0e0e0',
        }}
      >
        {/* Grup bilgisi */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
            <h6 className="rbt-title-style-2 mb-0" style={{ fontSize: '18px' }}>
              {groupName}
            </h6>
            {groupCode && (
              <span className="badge bg-secondary" style={{ fontSize: '12px' }}>
                {groupCode}
              </span>
            )}
          </div>
        </div>

        {/* Gruba ait materyaller (headers) */}
        {headers.length > 0 && (
          <div className="headers-section mb-4">
            <h6 className="rbt-title-style-2 mb-3" style={{ fontSize: '14px', color: '#666' }}>
              <i className="feather-file-text me-2" />
              {t('admin.exam.materials') ?? 'Materyaller'}
            </h6>
            {headers.map((header, index) => (
              <HeaderRenderer
                key={`preview-header-${index}`}
                header={{
                  mediaType: (header.mediaType as 'IMAGE' | 'VIDEO' | 'AUDIO' | 'TEXT' | 'DOCUMENT' | 'PDF' | 'LINK' | 'OTHER') || 'TEXT',
                  content: header.content,
                }}
              />
            ))}
          </div>
        )}

        {/* Sorular */}
        <div className="questions-preview">
          <h6 className="rbt-title-style-2 mb-3" style={{ fontSize: '14px', color: '#666' }}>
            <i className="feather-list me-2" />
            {t('admin.exam.questions')} ({questions.length})
          </h6>
          {questions.length === 0 ? (
            <p className="text-muted mb-0 py-3">{t('admin.exam.noQuestions')}</p>
          ) : (
            questions.map((q, questionIndex) => {
              const qId = q.id ?? `q-${questionIndex}`;
              const questionText = (q.questionText as string) ?? (q.name as string) ?? '';
              const templateData = q.templateData ?? {};
              const questionForRenderer = {
                questionType: (q.questionType as string) || 'MULTIPLE_CHOICE',
                questionText,
                templateData: typeof templateData === 'string' ? (() => { try { return JSON.parse(templateData); } catch { return {}; } })() : templateData,
                questionId: qId,
                id: qId,
              };
              return (
                <div
                  key={qId}
                  className="question-item mb-4"
                  style={{
                    padding: '20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-muted" style={{ fontSize: '13px' }}>
                      {t('admin.exam.question')} {questionIndex + 1} / {questions.length}
                    </span>
                    {q.maximumScore != null && (
                      <span className="badge bg-secondary" style={{ fontSize: '12px' }}>
                        {q.maximumScore} {t('admin.exam.points') ?? 'puan'}
                      </span>
                    )}
                  </div>
                  <QuestionRenderer
                    question={questionForRenderer}
                    questionId={qId}
                    onAnswerChange={() => {}}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
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
                groupData={groupData}
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
  groupData,
  questions,
  isLoading,
  onRefetch,
}: {
  groupId: string;
  groupData: unknown;
  questions: QuestionRow[];
  isLoading: boolean;
  onRefetch: () => void;
}) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [selectedStandaloneId, setSelectedStandaloneId] = useState<string>('');

  const updateQuestion = useUpdateQuestion();
  const { data: standaloneData, isLoading: standaloneLoading, refetch: refetchStandalone } = useGetStandaloneQuestions();
  const standaloneList = normalizeQuestions(standaloneData);

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

  const handleAddSelectedToGroup = async () => {
    if (!selectedStandaloneId) return;
    try {
      const full = await getQuestion(selectedStandaloneId);
      const q = full as Record<string, unknown>;
      const payload = questionToCreateRequest(q, groupId);
      await updateQuestion.mutateAsync({ questionId: selectedStandaloneId, data: payload });
      setSelectedStandaloneId('');
      onRefetch();
      refetchStandalone();
    } catch (err) {
      console.error('Add question to group failed:', err);
    }
  };

  const handleRemoveFromGroup = async (questionId: string) => {
    try {
      const full = await getQuestion(questionId);
      const q = full as Record<string, unknown>;
      const payload = questionToCreateRequest(q, undefined);
      await updateQuestion.mutateAsync({ questionId, data: payload });
      onRefetch();
      refetchStandalone();
    } catch (err) {
      console.error('Remove question from group failed:', err);
    }
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
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <button type="button" className="rbt-btn btn-sm btn-border-gradient" onClick={handleAdd}>
            <i className="feather-plus me-1" />
            {t('admin.exam.addQuestion')}
          </button>
          <div className="d-flex align-items-center gap-1">
            <select
              className="form-select form-select-sm"
              style={{ minWidth: 180 }}
              value={selectedStandaloneId}
              onChange={(e) => setSelectedStandaloneId(e.target.value)}
              disabled={standaloneLoading}
            >
              <option value="">{t('admin.exam.selectQuestion') ?? 'Soru seçin'}</option>
              {standaloneList.map((q) => (
                <option key={q.id ?? ''} value={q.id ?? ''}>
                  {q.name ?? q.id ?? '—'}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="rbt-btn btn-sm btn-border-gradient"
              onClick={handleAddSelectedToGroup}
              disabled={!selectedStandaloneId || updateQuestion.isPending}
            >
              {updateQuestion.isPending ? t('common.loading') : t('admin.exam.addSelectedQuestion') ?? 'Seçileni ekle'}
            </button>
          </div>
        </div>
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
                        className="rbt-btn btn-sm btn-border-gradient me-1"
                        onClick={() => handleEdit(qId)}
                      >
                        <i className="feather-edit me-1" />
                        {t('common.edit')}
                      </button>
                      <button
                        type="button"
                        className="rbt-btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveFromGroup(qId)}
                        disabled={updateQuestion.isPending}
                        title={t('admin.exam.removeFromGroup') ?? 'Gruptan çıkar'}
                      >
                        <i className="feather-minus-circle me-1" />
                        {t('admin.exam.removeFromGroup') ?? 'Gruptan çıkar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Öğrenci önizlemesi - Soru grubu ve sorular öğrencinin göreceği şekilde */}
      <QuestionGroupPreview groupData={groupData} questions={questions} />
    </>
  );
}
