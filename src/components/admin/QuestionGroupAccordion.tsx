"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n";
import {
  useGetQuestionGroupsByExam,
  useCreateQuestionGroup,
  useDeleteQuestionGroup,
} from "@/generated/api/question-group-controller/question-group-controller";
import {
  QuestionGroupCreateRequest,
} from "@/generated/api/openAPIDefinition.schemas";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import QuestionList from "./QuestionList";

interface QuestionGroupAccordionProps {
  examId: string;
}

export default function QuestionGroupAccordion({
  examId,
}: QuestionGroupAccordionProps) {
  const { t } = useTranslation();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGroupCode, setNewGroupCode] = useState("");

  const { data: questionGroups, refetch } = useGetQuestionGroupsByExam(
    examId,
    {
      query: {
        enabled: !!examId,
      },
    }
  );

  const createGroup = useCreateQuestionGroup();
  const deleteGroup = useDeleteQuestionGroup();

  // Remove the problematic useEffect - onRefresh is not needed here
  // The parent component can refetch if needed using the key prop

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleAddGroup = async () => {
    if (!newGroupCode.trim()) {
      return;
    }

    const code = newGroupCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "_");

    try {
      await createGroup.mutateAsync({
        data: {
          code,
          examId,
        },
      });
      setNewGroupCode("");
      setShowAddForm(false);
      refetch();
    } catch (error) {
      console.error("Error creating question group:", error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm(t("admin.exam.confirmDeleteGroup"))) {
      return;
    }

    try {
      await deleteGroup.mutateAsync({ groupId });
      refetch();
    } catch (error) {
      console.error("Error deleting question group:", error);
    }
  };

  const groups = (questionGroups as any) || [];

  return (
    <div className="rbt-shadow-box">
      <div className="d-flex justify-content-between align-items-center mb--30">
        <h4 className="rbt-title-style-3">{t("admin.exam.questionGroups")}</h4>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="rbt-btn btn-sm btn-border-gradient"
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addQuestionGroup")}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="rbt-card rbt-card-body mb--30" style={{ backgroundColor: '#f9fafb' }}>
          <h5 className="mb--20">{t("admin.exam.addQuestionGroup")}</h5>
          <div className="row g-3">
            <div className="col-12">
              <div className="form-group">
                <label htmlFor="newGroupCode">
                  {t("admin.exam.groupCode")} <span className="text-danger">*</span>
                </label>
                <input
                  id="newGroupCode"
                  type="text"
                  className="form-control"
                  value={newGroupCode}
                  onChange={(e) => setNewGroupCode(e.target.value)}
                  placeholder={t("admin.exam.groupCodePlaceholder")}
                  style={{ textTransform: "uppercase" }}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="rbt-btn-wrapper d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="rbt-btn btn-sm btn-border"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGroupCode("");
                  }}
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  className="rbt-btn btn-sm btn-gradient"
                  onClick={handleAddGroup}
                  disabled={!newGroupCode.trim() || createGroup.isPending}
                >
                  {createGroup.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      {t("common.loading")}
                    </>
                  ) : (
                    <>
                      <i className="feather-check me-1"></i>
                      {t("common.add")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {groups.length === 0 && !showAddForm ? (
        <div className="text-center py--50">
          <p className="text-muted">{t("admin.exam.noQuestionGroups")}</p>
        </div>
      ) : (
        <div className="rbt-course-list">
          {groups.map((group: any) => {
            const groupId = group.id || group.questionGroupId;
            const isOpen = openGroups.has(groupId);

            return (
              <div
                key={groupId}
                className="rbt-course rbt-course-wrape mb--20"
              >
                <div
                  className="d-flex align-items-center justify-content-between p--20 cursor-pointer"
                  onClick={() => toggleGroup(groupId)}
                  style={{
                    backgroundColor: isOpen ? '#f9fafb' : '#ffffff',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <i
                      className={`feather-chevron-${isOpen ? 'up' : 'down'}`}
                      style={{ fontSize: '18px', color: 'var(--color-heading)' }}
                    ></i>
                    <div>
                      <h6 className="mb--5" style={{ fontWeight: 600 }}>
                        {group.code || t("admin.exam.group")} #{groups.indexOf(group) + 1}
                      </h6>
                      {group.maximumScore && (
                        <span className="text-muted" style={{ fontSize: '14px' }}>
                          {t("admin.exam.maxScore")}: {group.maximumScore}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="rbt-course-icon rbt-course-del"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(groupId);
                      }}
                      title={t("common.delete")}
                    ></button>
                  </div>
                </div>

                {isOpen && (
                  <div className="p--20 border-top">
                    <QuestionList
                      questionGroupId={groupId}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
