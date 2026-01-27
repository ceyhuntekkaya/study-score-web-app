"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n";
import {
  useGetQuestionsByGroup,
  useDeleteQuestion,
} from "@/generated/api/question-controller/question-controller";
import QuestionForm from "./QuestionForm";

interface QuestionListProps {
  questionGroupId: string;
}

export default function QuestionList({
  questionGroupId,
}: QuestionListProps) {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const { data: questions, refetch } = useGetQuestionsByGroup(
    questionGroupId,
    {
      query: {
        enabled: !!questionGroupId,
      },
    }
  );

  const deleteQuestion = useDeleteQuestion();

  const handleDelete = async (questionId: string) => {
    if (!confirm(t("admin.exam.confirmDeleteQuestion"))) {
      return;
    }

    try {
      await deleteQuestion.mutateAsync({ questionId });
      refetch();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingQuestionId(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingQuestionId(null);
  };

  const questionList = (questions as any) || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb--20">
        <h5 className="mb--0">
          {t("admin.exam.questions")} <span className="badge bg-primary">{questionList.length}</span>
        </h5>
        {!showAddForm && !editingQuestionId && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="rbt-btn btn-sm btn-border-gradient"
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addQuestion")}
          </button>
        )}
      </div>

      {(showAddForm || editingQuestionId) && (
        <div className="rbt-card rbt-card-body mb--20" style={{ backgroundColor: '#f9fafb' }}>
          <QuestionForm
            questionGroupId={questionGroupId}
            questionId={editingQuestionId || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {questionList.length === 0 && !showAddForm && !editingQuestionId ? (
        <div className="text-center py--30">
          <p className="text-muted">{t("admin.exam.noQuestions")}</p>
        </div>
      ) : (
        <div className="rbt-course-list">
          {questionList.map((question: any) => {
            const qId = question.id || question.questionId;
            const isEditing = editingQuestionId === qId;

            if (isEditing) {
              return null; // Form will be shown above
            }

            return (
              <div
                key={qId}
                className="rbt-course rbt-course-wrape mb--15"
                style={{
                  backgroundColor: '#ffffff',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <div className="d-flex align-items-center justify-content-between p--15">
                  <div className="flex-1">
                    <h6 className="mb--5" style={{ fontWeight: 600 }}>
                      {question.name || t("admin.exam.question")} #{questionList.indexOf(question) + 1}
                    </h6>
                    <div className="d-flex gap-3 flex-wrap">
                      <span className="badge bg-secondary">
                        {t("admin.exam.type")}: {question.questionType}
                      </span>
                      <span className="badge bg-info">
                        {t("admin.exam.score")}: {question.maximumScore}
                      </span>
                      {question.difficulty && (
                        <span className="badge bg-warning">
                          {t("admin.exam.difficulty")}: {question.difficulty}
                        </span>
                      )}
                    </div>
                    {question.questionText && (
                      <p className="text-muted mt--10 mb--0" style={{ fontSize: '14px' }}>
                        {question.questionText.replace(/<[^>]*>/g, "").substring(0, 100)}
                        {question.questionText.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="rbt-course-icon rbt-course-edit"
                      onClick={() => setEditingQuestionId(qId)}
                      title={t("common.edit")}
                    ></button>
                    <button
                      type="button"
                      className="rbt-course-icon rbt-course-del"
                      onClick={() => handleDelete(qId)}
                      title={t("common.delete")}
                    ></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
