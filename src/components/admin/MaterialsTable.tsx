"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "@/i18n";
import {
  useGetCourseLessonPartMaterialByCourseLessonId,
  useDeleteActivity3,
  useCreateCoursePartMaterial,
} from "@/generated/api/course-lesson-part-material-rest-controller/course-lesson-part-material-rest-controller";
import {
  CourseLessonPartMaterial,
  CourseLessonPartMaterialDetailDTO,
  CourseLessonPartMaterialDetailDTOMediaType,
  CourseLessonPartMaterialDetailDTOMaterialType,
  CourseLessonPartQuizItemDetailDTOType,
} from "@/generated/api/openAPIDefinition.schemas";
import DynamicTable from "@/components/ui/DynamicTable";
import { Column } from "@/types/ui/table";
import MaterialForm from "./MaterialForm";
import MaterialRenderer from "@/components/learner/content/MaterialRenderer";
import { Button } from "@/components/ui/Button";
import ModalPanel from "@/components/ui/ModalPanel";
import QuestionForm from "./QuestionForm";
import QuestionGroupForm from "./QuestionGroupForm";
import QuestionList from "./QuestionList";

interface MaterialsTableProps {
  partId: string;
  onClose?: () => void;
}

export default function MaterialsTable({ partId, onClose }: MaterialsTableProps) {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showAddQuestionGroupModal, setShowAddQuestionGroupModal] = useState(false);
  const [addQuestionGroupStep, setAddQuestionGroupStep] = useState<"group" | "questions">("group");
  const [createdGroupIdForQuestions, setCreatedGroupIdForQuestions] = useState<string | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<CourseLessonPartMaterial | null>(null);
  const [previewData, setPreviewData] = useState<CourseLessonPartMaterialDetailDTO | null>(null);

  const { data: materials, isLoading, error, refetch } = useGetCourseLessonPartMaterialByCourseLessonId(
    partId,
    {
      query: { enabled: !!partId },
    }
  );
  const deleteMaterialMutation = useDeleteActivity3({
    mutation: { onSuccess: () => refetch() },
  });
  const createMaterialMutation = useCreateCoursePartMaterial({
    mutation: { onSuccess: () => refetch() },
  });

  /** Part'a tek quiz item içeren material oluşturur (soru veya soru grubu). */
  const createMaterialWithQuizItem = useCallback(
    async (questionId?: string, questionGroupId?: string) => {
      if (!questionId && !questionGroupId) return;
      const quizMaterialName = t("admin.material.question");
      const payload: CourseLessonPartMaterialDetailDTO = {
        courseLessonPartId: partId,
        name: quizMaterialName,
        mediaType: CourseLessonPartMaterialDetailDTOMediaType.OTHER,
        materialType: CourseLessonPartMaterialDetailDTOMaterialType.QUIZ,
        duration: 0,
        description: "",
        orderNumber: 0,
        content: "",
        quizItems: [
          questionId
            ? { type: CourseLessonPartQuizItemDetailDTOType.QUESTION, question: { id: questionId } }
            : { type: CourseLessonPartQuizItemDetailDTOType.QUESTION_GROUP, questionGroup: { id: questionGroupId! } },
        ],
      };
      await createMaterialMutation.mutateAsync({ data: payload });
    },
    [partId, t, createMaterialMutation]
  );

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingMaterial(null);
    setPreviewData(null);
  };

  const handleEditClick = (material: CourseLessonPartMaterial) => {
    setEditingMaterial(material);
    setShowAddForm(false);
    // Set initial preview data - try to get name and description from various sources
    const materialWithDetails = material as any;
    const name = 
      materialWithDetails.name || 
      materialWithDetails.uploadedFileName ||
      "";
    const description = materialWithDetails.description || "";
    
    setPreviewData({
      id: material.id,
      name: name,
      description: description,
      content: material.content || "",
      mediaType: material.mediaType as any,
      materialType: materialWithDetails.materialType,
      orderNumber: material.orderNumber || 0,
      duration: material.duration || 0,
      courseLessonPartId: partId,
      uploadedFileId: materialWithDetails.uploadedFileId || material.uploadedFile?.id,
      uploadedFileName: materialWithDetails.uploadedFileName || material.uploadedFile?.fileOriginalName || material.uploadedFile?.fileName,
    });
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingMaterial(null);
    setPreviewData(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingMaterial(null);
    setPreviewData(null);
  };

  const handleDeleteClick = (material: CourseLessonPartMaterial) => {
    if (!window.confirm(t('admin.material.confirmDeleteMaterial'))) return;
    const id = material.id;
    if (!id) return;
    deleteMaterialMutation.mutate(
      { coursePartMaterialId: id },
      {
        onSuccess: () => {
          if (editingMaterial?.id === id) {
            setEditingMaterial(null);
            setPreviewData(null);
          }
        },
      }
    );
  };

  const columns: Column<CourseLessonPartMaterial>[] = [
    {
      key: "orderNumber",
      header: t('admin.material.orderNumber'),
      sortable: true,
    },
    {
      key: "id" as any, // Using id as key since name doesn't exist in type
      header: t('admin.material.name') || "Name",
      sortable: true,
      render: (value, item) => {
        // Try to get name from various sources
        const material = item as CourseLessonPartMaterial;
        const materialWithDetails = material as any;
        const name = 
          materialWithDetails.name || 
          materialWithDetails.uploadedFileName ||
          material.uploadedFile?.id || 
          material.content?.substring(0, 50) || 
          material.id || 
          "-";
        return <span>{name}</span>;
      },
    },
    {
      key: "mediaType",
      header: t('admin.material.mediaType'),
      sortable: true,
      render: (value) => {
        const mediaType = value as string;
        return <span>{mediaType || "-"}</span>;
      },
    },
    {
      key: "materialType",
      header: t('admin.material.materialType'),
      sortable: true,
      render: (value, item) => {
        const materialWithDetails = item as any;
        const materialType = (value ?? materialWithDetails.materialType) as string;
        return <span>{materialType || "-"}</span>;
      },
    },
   
    {
      key: "actions",
      header: t('common.actions'),
      sortable: false,
      actions: [
        {
          label: <i className="feather-edit" aria-hidden />,
          onClick: (item) => handleEditClick(item),
          iconOnly: true,
          title: t("common.edit") || "Düzenle",
          className: "text-primary",
        },
        {
          label: <i className="feather-trash-2" aria-hidden />,
          onClick: (item) => handleDeleteClick(item as CourseLessonPartMaterial),
          iconOnly: true,
          title: t("common.delete") || "Sil",
          className: "text-danger",
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <p>{t("common.loading") || "Yükleniyor..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {t("error.network") || "Veri yüklenirken bir hata oluştu."}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
       
        <div className="d-flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleAddClick}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.material.addMaterial") || "Add Material"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setShowAddQuestionModal(true)}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.material.addQuestion") || "Add Question"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
            setAddQuestionGroupStep("group");
            setCreatedGroupIdForQuestions(null);
            setShowAddQuestionGroupModal(true);
          }}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.material.addQuestionGroup") || "Add Question Group"}
          </Button>
          {onClose && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
            >
              {t("common.close") || "Kapat"}
            </Button>
          )}
        </div>
      </div>

      <DynamicTable
        data={materials || []}
        columns={columns}
        pageSize={20}
        searchable={true}
      />

      {(showAddForm || editingMaterial) && (
        <div className="rbt-card rbt-card-body mt-3" style={{ overflow: 'visible' }}>
          <MaterialForm
            courseLessonPartId={partId}
            initialData={editingMaterial ? (() => {
              // Try to get name and description from various sources
              const materialWithDetails = editingMaterial as any;
              const name = 
                materialWithDetails.name || 
                materialWithDetails.uploadedFileName ||
                "";
              const description = materialWithDetails.description || "";
              
              return {
                id: editingMaterial.id,
                name: name,
                description: description,
                content: editingMaterial.content || "",
                mediaType: editingMaterial.mediaType as any,
                materialType: materialWithDetails.materialType,
                orderNumber: editingMaterial.orderNumber || 0,
                duration: editingMaterial.duration || 0,
                courseLessonPartId: partId,
                uploadedFileId: materialWithDetails.uploadedFileId || editingMaterial.uploadedFile?.id,
                uploadedFileName: materialWithDetails.uploadedFileName || editingMaterial.uploadedFile?.fileOriginalName || editingMaterial.uploadedFile?.fileName,
                quizItems: materialWithDetails.quizItems,
              };
            })() : undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            onFormDataChange={(data) => {
              setPreviewData(data);
            }}
          />
          
          {previewData && (
            (previewData.mediaType === 'TEXT' && previewData.content) ||
            (previewData.mediaType !== 'TEXT' && previewData.mediaType !== 'LINK' && (previewData.content || previewData.uploadedFileId)) ||
            (previewData.mediaType === 'LINK' && previewData.content)
          ) && (
            <div className="mt-4">
              <h4 className="mb-3">{t('admin.material.preview')}</h4>
              <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
                <MaterialRenderer
                  material={previewData}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <ModalPanel
        isOpen={showAddQuestionModal}
        onClose={() => setShowAddQuestionModal(false)}
        title={t("admin.material.addQuestion") || "Add Question"}
        size="large"
      >
        <QuestionForm
          onSuccess={async (questionId) => {
            if (questionId) {
              await createMaterialWithQuizItem(questionId, undefined);
              setShowAddQuestionModal(false);
            }
          }}
          onCancel={() => setShowAddQuestionModal(false)}
        />
      </ModalPanel>

      <ModalPanel
        isOpen={showAddQuestionGroupModal}
        onClose={() => {
          setShowAddQuestionGroupModal(false);
          setAddQuestionGroupStep("group");
          setCreatedGroupIdForQuestions(null);
        }}
        title={
          addQuestionGroupStep === "group"
            ? (t("admin.material.addQuestionGroup") || "Add Question Group")
            : (t("admin.material.addQuestionsToGroup") || "Add questions to group")
        }
        size="large"
      >
        {addQuestionGroupStep === "group" ? (
          <QuestionGroupForm
            onSuccess={(groupId) => {
              setCreatedGroupIdForQuestions(groupId);
              setAddQuestionGroupStep("questions");
            }}
            onCancel={() => {
              setShowAddQuestionGroupModal(false);
              setAddQuestionGroupStep("group");
              setCreatedGroupIdForQuestions(null);
            }}
          />
        ) : createdGroupIdForQuestions ? (
          <div>
            <div className="mb-3">
              <p className="text-muted small mb-0">
                {t("admin.material.addQuestionsToGroupHint") ||
                  "Add one or more questions to this group, then add the group to the part."}
              </p>
            </div>
            <QuestionList questionGroupId={createdGroupIdForQuestions} />
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setShowAddQuestionGroupModal(false);
                  setAddQuestionGroupStep("group");
                  setCreatedGroupIdForQuestions(null);
                }}
              >
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={async () => {
                  await createMaterialWithQuizItem(undefined, createdGroupIdForQuestions);
                  setShowAddQuestionGroupModal(false);
                  setAddQuestionGroupStep("group");
                  setCreatedGroupIdForQuestions(null);
                }}
              >
                {t("admin.material.addGroupToPart") || "Add group to part"}
              </Button>
            </div>
          </div>
        ) : null}
      </ModalPanel>
    </div>
  );
}
