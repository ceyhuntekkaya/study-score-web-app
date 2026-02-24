'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/i18n';
import { useGetExamItems, getGetExamItemsQueryKey } from '@/generated/api/exam-controller/exam-controller';
import { useGetQuestionsByGroup } from '@/generated/api/question-controller/question-controller';
import type { QuestionGroup, Question } from '@/generated/api/openAPIDefinition.schemas';
import DataTable, { Column } from '@/components/admin/DataTable';
import QuestionGroupForm from '@/components/admin/QuestionGroupForm';
import QuestionForm from '@/components/admin/QuestionForm';

// ExamItem with itemType QUESTION_GROUP has questionGroup: { id, code }; we show these as "groups in this exam"
function useQuestionGroupsInExam(examId: string) {
  const { data: items, isLoading, refetch } = useGetExamItems(examId, {
    query: { enabled: !!examId },
  });
  const itemList = Array.isArray(items) ? items : items ? [items] : [];
  const groups = itemList
    .filter((item: { itemType?: string }) => item.itemType === 'QUESTION_GROUP')
    .map((item: { id?: string; questionGroup?: { id?: string; code?: string }; score?: number }) => ({
      id: item.questionGroup?.id ?? item.id,
      code: item.questionGroup?.code ?? '-',
      maximumScore: item.score,
      examItemId: item.id,
    }));
  return { groups, isLoading, refetch };
}

export default function QuestionGroupsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const params = useParams();
  const examId = params?.id as string;
  
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const { groups, isLoading, refetch } = useQuestionGroupsInExam(examId);

  const refetchGroups = () => {
    queryClient.invalidateQueries({ queryKey: getGetExamItemsQueryKey(examId) });
    refetch();
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleAddGroup = () => {
    setEditingGroupId(null);
    setShowGroupForm(true);
  };

  const handleEditGroup = (groupId: string) => {
    setEditingGroupId(groupId);
    setShowGroupForm(true);
  };

  const handleAddQuestion = (groupId: string) => {
    setSelectedGroupId(groupId);
    setEditingQuestionId(null);
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (questionId: string, groupId: string) => {
    setSelectedGroupId(groupId);
    setEditingQuestionId(questionId);
    setShowQuestionForm(true);
  };

  const handleFormSuccess = () => {
    setShowGroupForm(false);
    setShowQuestionForm(false);
    setEditingGroupId(null);
    setEditingQuestionId(null);
    setSelectedGroupId(null);
    refetchGroups();
  };

  const handleFormCancel = () => {
    setShowGroupForm(false);
    setShowQuestionForm(false);
    setEditingGroupId(null);
    setEditingQuestionId(null);
    setSelectedGroupId(null);
  };

  const columns: Column<QuestionGroup>[] = [
    {
      key: 'code',
      label: t('admin.exam.groupCode') || 'Grup Kodu',
      sortable: true,
    },
    {
      key: 'maximumScore',
      label: t('admin.exam.maxScore') || 'Maksimum Puan',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      key: 'actions',
      label: t('common.actions') || 'İşlemler',
      sortable: false,
      clickable: true,
      render: (value, row) => {
        const groupId = row.id || (row as any).questionGroupId;
        return (
          <div className="d-flex gap-2">
            <button
              className="rbt-btn btn-sm btn-border-gradient"
              onClick={(e) => {
                e.stopPropagation();
                handleEditGroup(groupId);
              }}
            >
              <i className="feather-edit me-1"></i>
              {t('common.edit')}
            </button>
            <button
              className="rbt-btn btn-sm btn-border"
              onClick={(e) => {
                e.stopPropagation();
                toggleGroup(groupId);
              }}
            >
              <i className={`feather-chevron-${expandedGroups.has(groupId) ? 'up' : 'down'} me-1`}></i>
              {t('admin.exam.questions')}
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.exam.questionGroups') || 'Soru Grupları'}</h2>
          <Link href="/admin/dashboard/exams" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.entity.backToExamsList')}
          </Link>
        </div>
        {!showGroupForm && (
          <button
            className="rbt-btn btn-md hover-icon-reverse"
            onClick={handleAddGroup}
          >
            <span className="icon-reverse-wrapper">
              <span className="btn-text">{t('admin.exam.addQuestionGroup')}</span>
              <span className="btn-icon"><i className="feather-plus"></i></span>
              <span className="btn-icon"><i className="feather-plus"></i></span>
            </span>
          </button>
        )}
      </div>

      <div className="rbt-dashboard-content-wrapper">
        {showGroupForm && (
          <div className="rbt-shadow-box mb--30">
            <QuestionGroupForm
              groupId={editingGroupId || undefined}
              initialData={examId ? { examId } : undefined}
              onSuccess={() => handleFormSuccess()}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {showQuestionForm && selectedGroupId && (
          <div className="rbt-shadow-box mb--30">
            <QuestionForm
              questionGroupId={selectedGroupId}
              questionId={editingQuestionId || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        <div className="rbt-shadow-box">
          <DataTable
            data={groups}
            columns={columns}
            pageSize={20}
            searchable={true}
          />

          {/* Expanded Questions for each group */}
          {groups.map((group: any) => {
            const groupId = group.id || (group as any).questionGroupId;
            if (!expandedGroups.has(groupId)) return null;

            return (
              <QuestionGroupQuestions
                key={groupId}
                groupId={groupId}
                groupCode={group.code}
                onAddQuestion={() => handleAddQuestion(groupId)}
                onEditQuestion={(questionId) => handleEditQuestion(questionId, groupId)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

// Separate component for questions list to handle data fetching
function QuestionGroupQuestions({
  groupId,
  groupCode,
  onAddQuestion,
  onEditQuestion,
}: {
  groupId: string;
  groupCode?: string;
  onAddQuestion: () => void;
  onEditQuestion: (questionId: string) => void;
}) {
  const { t } = useTranslation();
  const { data: questions, isLoading } = useGetQuestionsByGroup(groupId, {
    query: {
      enabled: !!groupId,
    },
  });

  const questionList = (questions as any) || [];

  if (isLoading) {
    return (
      <div className="mt--30 border-top pt--30">
        <p className="text-center">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="mt--30 border-top pt--30">
      <div className="d-flex justify-content-between align-items-center mb--20">
        <h5>
          {t('admin.exam.questions')} - {groupCode} ({questionList.length})
        </h5>
        <button
          className="rbt-btn btn-sm btn-border-gradient"
          onClick={onAddQuestion}
        >
          <i className="feather-plus me-1"></i>
          {t('admin.exam.addQuestion')}
        </button>
      </div>

      {questionList.length === 0 ? (
        <p className="text-muted text-center py--20">
          {t('admin.exam.noQuestions')}
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{t('admin.exam.questionName')}</th>
                <th>{t('admin.exam.type')}</th>
                <th>{t('admin.exam.score')}</th>
                <th>{t('admin.exam.difficulty')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {questionList.map((question: Question) => {
                const qId = question.id || (question as any).questionId;
                return (
                  <tr key={qId}>
                    <td>{question.name || '-'}</td>
                    <td>
                      <span className="badge bg-secondary">
                        {question.questionType || '-'}
                      </span>
                    </td>
                    <td>{question.maximumScore || '-'}</td>
                    <td>
                      {question.difficulty && (
                        <span className="badge bg-info">
                          {question.difficulty}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="rbt-btn btn-sm btn-border-gradient"
                        onClick={() => onEditQuestion(qId)}
                      >
                        <i className="feather-edit me-1"></i>
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
    </div>
  );
}
