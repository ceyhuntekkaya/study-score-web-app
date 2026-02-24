"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n";
import {
  CourseLessonPartMaterialDetailDTO,
  CourseLessonPartMaterialDetailDTOMediaType,
  CourseLessonPartMaterialDetailDTOMaterialType,
  CourseLessonPartQuizItemDetailDTO,
  CourseLessonPartQuizItemDetailDTOType,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateCoursePartMaterial,
  useUpdateCoursePartMaterial,
  useAddQuizItem,
  useRemoveQuizItem,
} from "@/generated/api/course-lesson-part-material-rest-controller/course-lesson-part-material-rest-controller";
import { useListQuestionGroups } from "@/generated/api/question-group-controller/question-group-controller";
import { useGetStandaloneQuestions } from "@/generated/api/question-controller/question-controller";
import { useMutation } from "@tanstack/react-query";
import { customInstance } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import LoadingButton from "@/components/ui/LoadingButton";
import SimpleHtmlEditor from "@/components/ui/SimpleHtmlEditor";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";

interface MaterialFormProps {
  courseLessonPartId: string;
  initialData?: CourseLessonPartMaterialDetailDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
  onFormDataChange?: (data: CourseLessonPartMaterialDetailDTO) => void;
}

function QuizItemsSection({
  materialId,
  quizItemsList,
  addQuizType,
  setAddQuizType,
  addQuizQuestionId,
  setAddQuizQuestionId,
  addQuizQuestionGroupId,
  setAddQuizQuestionGroupId,
  addQuizOrderNumber,
  setAddQuizOrderNumber,
  onAddQuizItem,
  onRemoveQuizItem,
  isAddSubmitting,
  isRemoveSubmitting,
  t,
}: {
  materialId?: string;
  quizItemsList: Array<{ id: string; type: CourseLessonPartQuizItemDetailDTOType; label: string; orderNumber?: number }>;
  addQuizType: CourseLessonPartQuizItemDetailDTOType;
  setAddQuizType: (v: CourseLessonPartQuizItemDetailDTOType) => void;
  addQuizQuestionId: string;
  setAddQuizQuestionId: (v: string) => void;
  addQuizQuestionGroupId: string;
  setAddQuizQuestionGroupId: (v: string) => void;
  addQuizOrderNumber: number | "";
  setAddQuizOrderNumber: (v: number | "") => void;
  onAddQuizItem: (e: React.FormEvent) => void;
  onRemoveQuizItem: (id: string) => void;
  isAddSubmitting: boolean;
  isRemoveSubmitting: boolean;
  t: (key: string) => string;
}) {
  const { data: groupsData } = useListQuestionGroups(
    { page: 0, size: 500 },
    { query: { enabled: addQuizType === CourseLessonPartQuizItemDetailDTOType.QUESTION_GROUP } }
  );
  const { data: questionsData } = useGetStandaloneQuestions({
    query: { enabled: addQuizType === CourseLessonPartQuizItemDetailDTOType.QUESTION },
  });
  const groups = normalizeListResponse(groupsData) as { id?: string; code?: string }[];
  const questions = normalizeListResponse(questionsData) as { id?: string; name?: string; questionType?: string }[];

  return (
    <div className="col-12">
      <div className="form-group">
        <Label className="d-block mb-2">{t("admin.material.quizItems")}</Label>
        {!materialId && (
          <p className="text-muted small mb-2">
            {t("admin.material.quizItemsIncludedOnCreate")}
          </p>
        )}
        {quizItemsList.length > 0 && (
              <ul className="list-group list-group-flush mb-3">
                {quizItemsList.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {item.type === CourseLessonPartQuizItemDetailDTOType.QUESTION
                        ? t("admin.material.question")
                        : t("admin.material.questionGroup")}
                      : {item.label}
                      {item.orderNumber != null && (
                        <span className="text-muted small ms-1">(sıra: {item.orderNumber})</span>
                      )}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveQuizItem(item.id)}
                      disabled={isRemoveSubmitting}
                    >
                      {t("common.delete")}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
        <div className="rbt-card rbt-card-body p-3">
              <div className="row g-2">
                <div className="col-12">
                  <Label>{t("admin.material.quizItemType")}</Label>
                  <Select
                    value={addQuizType}
                    onChange={(e) => {
                      setAddQuizType(e.target.value as CourseLessonPartQuizItemDetailDTOType);
                      setAddQuizQuestionId("");
                      setAddQuizQuestionGroupId("");
                    }}
                  >
                    <option value={CourseLessonPartQuizItemDetailDTOType.QUESTION_GROUP}>
                      {t("admin.material.questionGroup")}
                    </option>
                    <option value={CourseLessonPartQuizItemDetailDTOType.QUESTION}>
                      {t("admin.material.question")}
                    </option>
                  </Select>
                </div>
                {addQuizType === CourseLessonPartQuizItemDetailDTOType.QUESTION_GROUP && (
                  <div className="col-12">
                    <Label>{t("admin.material.selectQuestionGroup")}</Label>
                    <Select
                      value={addQuizQuestionGroupId}
                      onChange={(e) => setAddQuizQuestionGroupId(e.target.value)}
                    >
                      <option value="">{t("form.label.select")}</option>
                      {groups.filter((g) => g?.id).map((g) => (
                        <option key={g.id!} value={g.id}>
                          {g.code ?? g.id}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
                {addQuizType === CourseLessonPartQuizItemDetailDTOType.QUESTION && (
                  <div className="col-12">
                    <Label>{t("admin.material.selectQuestion")}</Label>
                    <Select
                      value={addQuizQuestionId}
                      onChange={(e) => setAddQuizQuestionId(e.target.value)}
                    >
                      <option value="">{t("form.label.select")}</option>
                      {questions.filter((q) => q?.id).map((q) => (
                        <option key={q.id!} value={q.id}>
                          {q.name || q.questionType || q.id}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
                <div className="col-6">
                  <Label>{t("form.label.orderNumber")}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={addQuizOrderNumber}
                    onChange={(e) => setAddQuizOrderNumber(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="—"
                  />
                </div>
                <div className="col-12">
                  <LoadingButton
                    type="button"
                    variant="primary"
                    size="sm"
                    isLoading={isAddSubmitting}
                    loadingText={t("common.loading")}
                    disabled={
                      isAddSubmitting ||
                      (addQuizType === CourseLessonPartQuizItemDetailDTOType.QUESTION_GROUP && !addQuizQuestionGroupId) ||
                      (addQuizType === CourseLessonPartQuizItemDetailDTOType.QUESTION && !addQuizQuestionId)
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      onAddQuizItem(e as unknown as React.FormEvent);
                    }}
                  >
                    {t("admin.material.addQuizItem")}
                  </LoadingButton>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
}

function normalizeListResponse(data: unknown): unknown[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && "content" in data && Array.isArray((data as { content: unknown[] }).content)) {
    return (data as { content: unknown[] }).content;
  }
  if (typeof data === "object" && "data" in data && Array.isArray((data as { data: unknown[] }).data)) {
    return (data as { data: unknown[] }).data;
  }
  return [data];
}

/** Normalize quiz items from API (DetailDTO or entity) to a display list. */
function normalizeQuizItems(
  items: CourseLessonPartQuizItemDetailDTO[] | Array<{ id?: string; type?: string; question?: { id?: string; name?: string }; questionGroup?: { id?: string; code?: string }; orderNumber?: number }> | undefined
): Array<{ id: string; type: CourseLessonPartQuizItemDetailDTOType; label: string; orderNumber?: number }> {
  if (!items?.length) return [];
  return items
    .filter((x) => x?.id)
    .map((x) => {
      const type: CourseLessonPartQuizItemDetailDTOType =
        (x as CourseLessonPartQuizItemDetailDTO).type ??
        ((x as { question?: unknown }).question ? CourseLessonPartQuizItemDetailDTOType.QUESTION : CourseLessonPartQuizItemDetailDTOType.QUESTION_GROUP);
      const label =
        (x as { question?: { name?: string }; questionGroup?: { code?: string } }).question?.name ||
        (x as { questionGroup?: { code?: string } }).questionGroup?.code ||
        (x as { question?: { id?: string }; questionGroup?: { id?: string } }).question?.id ||
        (x as { questionGroup?: { id?: string } }).questionGroup?.id ||
        x.id ||
        "";
      return { id: x.id!, type, label, orderNumber: x.orderNumber };
    });
}

export default function MaterialForm({
  courseLessonPartId,
  initialData,
  onSuccess,
  onCancel,
  onFormDataChange,
}: MaterialFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!initialData?.id;


  // Quiz items: checkbox = "bu materyalde quiz öğeleri olsun"; edit modda quizItems varsa seçili
  const [hasQuizItems, setHasQuizItems] = useState<boolean>(() =>
    Boolean(initialData?.quizItems?.length)
  );
  const [quizItemsList, setQuizItemsList] = useState<
    Array<{ id: string; type: CourseLessonPartQuizItemDetailDTOType; label: string; orderNumber?: number }>
  >(() => normalizeQuizItems(initialData?.quizItems));
  // Create modda materyal kaydedilmeden eklenen quiz öğeleri (create ile birlikte gönderilecek)
  type PendingQuizItem = {
    tempId: string;
    type: CourseLessonPartQuizItemDetailDTOType;
    questionId?: string;
    questionGroupId?: string;
    orderNumber?: number;
    label: string;
  };
  const [pendingQuizItems, setPendingQuizItems] = useState<PendingQuizItem[]>([]);

  // Form state
  const [formData, setFormData] = useState<CourseLessonPartMaterialDetailDTO>({
    name: "",
    description: "",
    content: "",
    mediaType: CourseLessonPartMaterialDetailDTOMediaType.VIDEO,
    materialType: CourseLessonPartMaterialDetailDTOMaterialType.CONTENT,
    orderNumber: 0,
    duration: 0,
    courseLessonPartId: courseLessonPartId,
  });

  // Quiz item add form state (one of questionId or questionGroupId required)
  const [addQuizType, setAddQuizType] = useState<CourseLessonPartQuizItemDetailDTOType>(
    CourseLessonPartQuizItemDetailDTOType.QUESTION_GROUP
  );
  const [addQuizQuestionId, setAddQuizQuestionId] = useState("");
  const [addQuizQuestionGroupId, setAddQuizQuestionGroupId] = useState("");
  const [addQuizOrderNumber, setAddQuizOrderNumber] = useState<number | "">("");

  // Mutations
  const createMaterial = useCreateCoursePartMaterial();
  const updateMaterial = useUpdateCoursePartMaterial();
  const addQuizItemMutation = useAddQuizItem();
  const removeQuizItemMutation = useRemoveQuizItem();
  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      objectType,
      fileProp,
    }: {
      file: File;
      objectType: string;
      fileProp: string;
    }) => {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("objectType", objectType);
      formData.append("fileProp", fileProp);
      return customInstance<string[]>({
        url: "/files/upload",
        method: "POST",
        data: formData,
      });
    },
  });

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Initialize form with initial data - only when initialData.id changes (not the whole object)
  useEffect(() => {
    if (initialData?.id) {
      setFormData({
        id: initialData.id,
        name: initialData.name || "",
        description: initialData.description || "",
        content: initialData.content || "",
        mediaType: initialData.mediaType || CourseLessonPartMaterialDetailDTOMediaType.VIDEO,
        materialType: initialData.materialType || CourseLessonPartMaterialDetailDTOMaterialType.CONTENT,
        orderNumber: initialData.orderNumber || 0,
        duration: initialData.duration || 0,
        courseLessonPartId: initialData.courseLessonPartId || courseLessonPartId,
        uploadedFileId: initialData.uploadedFileId,
        uploadedFileName: initialData.uploadedFileName,
      });
      setHasQuizItems(Boolean(initialData.quizItems?.length));
      setQuizItemsList(normalizeQuizItems(initialData.quizItems));
      setPendingQuizItems([]);
    } else if (!initialData) {
      // Only reset if we're switching from edit to add mode
      setFormData({
        name: "",
        description: "",
        content: "",
        mediaType: CourseLessonPartMaterialDetailDTOMediaType.VIDEO,
        materialType: CourseLessonPartMaterialDetailDTOMaterialType.CONTENT,
        orderNumber: 0,
        duration: 0,
        courseLessonPartId: courseLessonPartId,
      });
      setHasQuizItems(false);
      setQuizItemsList([]);
      setPendingQuizItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id]); // Only depend on initialData.id, not the whole object

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const newFormData = { ...formData, [name]: value };
    // If media type changes to TEXT, clear uploadedFileId
    if (name === 'mediaType' && value === CourseLessonPartMaterialDetailDTOMediaType.TEXT) {
      newFormData.uploadedFileId = undefined;
    }
    // If media type changes to LINK, clear uploadedFileId
    if (name === 'mediaType' && value === CourseLessonPartMaterialDetailDTOMediaType.LINK) {
      newFormData.uploadedFileId = undefined;
    }
    // If media type changes from TEXT or LINK, clear content
    if (name === 'mediaType' && 
        value !== CourseLessonPartMaterialDetailDTOMediaType.TEXT && 
        value !== CourseLessonPartMaterialDetailDTOMediaType.LINK) {
      newFormData.content = '';
    }
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  const handleContentChange = (content: string) => {
    const newFormData = { ...formData, content };
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const paths = await uploadMutation.mutateAsync({
        file,
        objectType: "CourseLessonPartMaterial",
        fileProp: "file",
      });

      if (paths?.length) {
        const newFormData = {
          ...formData,
          content: paths[0],
          uploadedFileName: file.name,
        };
        setFormData(newFormData);
        if (onFormDataChange) {
          onFormDataChange(newFormData);
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      alert("Dosya yüklenirken bir hata oluştu.");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddQuizItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const isQuestion = addQuizType === CourseLessonPartQuizItemDetailDTOType.QUESTION;
    const questionId = isQuestion ? addQuizQuestionId : undefined;
    const questionGroupId = !isQuestion ? addQuizQuestionGroupId : undefined;
    if (!questionId && !questionGroupId) return;

    const materialId = formData.id ?? initialData?.id;
    if (materialId) {
      // Edit / mevcut materyal: API ile ekle
      try {
        const created = await addQuizItemMutation.mutateAsync({
          materialId,
          data: {
            ...(questionId ? { questionId } : {}),
            ...(questionGroupId ? { questionGroupId } : {}),
            ...(addQuizOrderNumber !== "" ? { orderNumber: Number(addQuizOrderNumber) } : {}),
          },
        });
        setQuizItemsList((prev) => [
          ...prev,
          {
            id: created.id!,
            type: addQuizType,
            label:
              (created as { question?: { name?: string }; questionGroup?: { code?: string } }).question?.name ||
              (created as { questionGroup?: { code?: string } }).questionGroup?.code ||
              created.id!,
            orderNumber: addQuizOrderNumber !== "" ? Number(addQuizOrderNumber) : undefined,
          },
        ]);
        setAddQuizQuestionId("");
        setAddQuizQuestionGroupId("");
        setAddQuizOrderNumber("");
      } catch (err) {
        console.error(err);
      }
    } else {
      // Yeni materyal: create ile birlikte gönderilecek listeye ekle (API yok)
      const label =
        addQuizType === CourseLessonPartQuizItemDetailDTOType.QUESTION_GROUP
          ? `${t("admin.material.questionGroup")}: ${addQuizQuestionGroupId}`
          : `${t("admin.material.question")}: ${addQuizQuestionId}`;
      setPendingQuizItems((prev) => [
        ...prev,
        {
          tempId: `pending-${Date.now()}`,
          type: addQuizType,
          questionId,
          questionGroupId,
          orderNumber: addQuizOrderNumber !== "" ? Number(addQuizOrderNumber) : undefined,
          label,
        },
      ]);
      setAddQuizQuestionId("");
      setAddQuizQuestionGroupId("");
      setAddQuizOrderNumber("");
    }
  };

  const handleRemoveQuizItem = async (quizItemId: string) => {
    if (quizItemId.startsWith("pending-")) {
      setPendingQuizItems((prev) => prev.filter((p) => p.tempId !== quizItemId));
      return;
    }
    if (!window.confirm(t("admin.material.confirmRemoveQuizItem"))) return;
    try {
      await removeQuizItemMutation.mutateAsync({ quizItemId });
      setQuizItemsList((prev) => prev.filter((x) => x.id !== quizItemId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const quizMaterialName = t("admin.material.question");

    try {
      if (isEditMode) {
        const id = initialData!.id!;
        const data: CourseLessonPartMaterialDetailDTO = hasQuizItems
          ? {
              ...formData,
              name: quizMaterialName,
              mediaType: CourseLessonPartMaterialDetailDTOMediaType.OTHER,
              materialType: CourseLessonPartMaterialDetailDTOMaterialType.QUIZ,
              duration: 0,
              description: "",
            }
          : { ...formData, materialType: formData.materialType ?? CourseLessonPartMaterialDetailDTOMaterialType.CONTENT };
        await updateMaterial.mutateAsync({
          coursePartMaterialId: id,
          data,
        });
        if (onSuccess) onSuccess();
      } else {
        const payload: CourseLessonPartMaterialDetailDTO = {
          ...formData,
          materialType: formData.materialType ?? CourseLessonPartMaterialDetailDTOMaterialType.CONTENT,
          ...(hasQuizItems
            ? {
                name: quizMaterialName,
                mediaType: CourseLessonPartMaterialDetailDTOMediaType.OTHER,
                materialType: CourseLessonPartMaterialDetailDTOMaterialType.QUIZ,
                duration: 0,
                description: "",
              }
            : {}),
          quizItems:
            pendingQuizItems.length > 0
              ? pendingQuizItems.map((p) => ({
                  type: p.type,
                  ...(p.questionId ? { question: { id: p.questionId } } : {}),
                  ...(p.questionGroupId ? { questionGroup: { id: p.questionGroupId } } : {}),
                  ...(p.orderNumber != null ? { orderNumber: p.orderNumber } : {}),
                }))
              : undefined,
        };
        await createMaterial.mutateAsync({ data: payload });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createMaterial.isPending || updateMaterial.isPending || uploadingFile;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row g-3">
        {/* Quiz items checkbox */}
        <div className="col-12">
          <div className="form-group d-flex align-items-center gap-2">
            <Checkbox
              id="hasQuizItems"
              checked={hasQuizItems}
              onChange={(e) => {
                const checked = e.target.checked;
                setHasQuizItems(checked);
                if (checked) {
                  setFormData((prev) => ({
                    ...prev,
                    mediaType: CourseLessonPartMaterialDetailDTOMediaType.OTHER,
                    duration: 0,
                    description: "",
                    content: "",
                  }));
                }
              }}
            />
            <Label htmlFor="hasQuizItems" className="mb-0">
              {t("admin.material.hasQuizItems")}
            </Label>
          </div>
        </div>

        {/* Name, Description, Media Type, Duration, Content - gizli when Quiz seçili */}
        {!hasQuizItems && (
          <>
        {/* Name - Required */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              {t("admin.material.name")} <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="description">{t("form.label.description")}</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Media Type */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="mediaType">
              {t("admin.material.mediaType")} <span className="text-danger">*</span>
            </Label>
            <Select
              id="mediaType"
              name="mediaType"
              value={formData.mediaType || CourseLessonPartMaterialDetailDTOMediaType.VIDEO}
              onChange={(e) => handleSelectChange("mediaType", e.target.value)}
            >
              <option value={CourseLessonPartMaterialDetailDTOMediaType.VIDEO}>
                VIDEO
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMediaType.AUDIO}>
                AUDIO
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMediaType.IMAGE}>
                IMAGE
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMediaType.PDF}>
                PDF
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMediaType.DOCUMENT}>
                DOCUMENT
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMediaType.TEXT}>
                TEXT
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMediaType.LINK}>
                LINK
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMediaType.OTHER}>
                OTHER
              </option>
            </Select>
          </div>
        </div>

        {/* Material Type */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="materialType">
              {t("admin.material.materialType")} <span className="text-danger">*</span>
            </Label>
            <Select
              id="materialType"
              name="materialType"
              value={formData.materialType || CourseLessonPartMaterialDetailDTOMaterialType.CONTENT}
              onChange={(e) => handleSelectChange("materialType", e.target.value)}
            >
              <option value={CourseLessonPartMaterialDetailDTOMaterialType.CONTENT}>
                CONTENT
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMaterialType.QUIZ}>
                QUIZ
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMaterialType.PRACTICE}>
                PRACTICE
              </option>
              <option value={CourseLessonPartMaterialDetailDTOMaterialType.EXAMPLE}>
                EXAMPLE
              </option>
            </Select>
          </div>
        </div>

        {/* Duration */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="duration">{t("form.label.duration")}</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration || 0}
              onChange={handleChange}
              min={0}
            />
          </div>
        </div>

        {/* Content / File Upload / Link URL - Conditional based on Media Type */}
        {formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.TEXT ? (
          <div className="col-12">
            <div className="form-group">
              <Label htmlFor="content">{t("admin.material.content")}</Label>
              <SimpleHtmlEditor
                value={formData.content || ''}
                onChange={handleContentChange}
                placeholder={t("admin.material.contentPlaceholder")}
              />
            </div>
          </div>
        ) : formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.LINK ? (
          <div className="col-12">
            <div className="form-group">
              <Label htmlFor="content">
                {t("admin.material.linkUrl")} <span className="text-danger">*</span>
              </Label>
              <Input
                id="content"
                name="content"
                type="url"
                value={formData.content || ''}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
        ) : (
          <div className="col-12">
            <div className="form-group">
              <Label htmlFor="fileUpload">
                {t("admin.material.fileUpload")} <span className="text-danger">*</span>
              </Label>
              <div className="d-flex gap-2 align-items-center">
                <input
                  ref={fileInputRef}
                  id="fileUpload"
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  disabled={uploadingFile}
                  accept={
                    formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.IMAGE
                      ? 'image/*'
                      : formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.VIDEO
                      ? 'video/*'
                      : formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.AUDIO
                      ? 'audio/*'
                      : formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.PDF
                      ? 'application/pdf'
                      : '*/*'
                  }
                />
                {uploadingFile && (
                  <span className="text-muted">
                    <i className="feather-loader me-1"></i>
                    {t("common.uploading")}
                  </span>
                )}
              </div>
              {formData.uploadedFileId && (
                <div className="mt-2">
                  <small className="text-success">
                    <i className="feather-check-circle me-1"></i>
                    {t("admin.material.fileUploaded")}: {formData.uploadedFileName || formData.uploadedFileId}
                  </small>
                </div>
              )}
            </div>
          </div>
        )}
          </>
        )}

        {/* Order Number - her zaman göster */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="orderNumber">{t("form.label.orderNumber")}</Label>
            <Input
              id="orderNumber"
              name="orderNumber"
              type="number"
              value={formData.orderNumber || 0}
              onChange={handleChange}
              min={0}
            />
          </div>
        </div>

        {/* Quiz items section - only when checkbox selected */}
        {hasQuizItems && (
          <QuizItemsSection
            materialId={formData.id ?? initialData?.id}
            quizItemsList={[
              ...quizItemsList,
              ...pendingQuizItems.map((p) => ({
                id: p.tempId,
                type: p.type,
                label: p.label,
                orderNumber: p.orderNumber,
              })),
            ]}
            addQuizType={addQuizType}
            setAddQuizType={setAddQuizType}
            addQuizQuestionId={addQuizQuestionId}
            setAddQuizQuestionId={setAddQuizQuestionId}
            addQuizQuestionGroupId={addQuizQuestionGroupId}
            setAddQuizQuestionGroupId={setAddQuizQuestionGroupId}
            addQuizOrderNumber={addQuizOrderNumber}
            setAddQuizOrderNumber={setAddQuizOrderNumber}
            onAddQuizItem={handleAddQuizItem}
            onRemoveQuizItem={handleRemoveQuizItem}
            isAddSubmitting={addQuizItemMutation.isPending}
            isRemoveSubmitting={removeQuizItemMutation.isPending}
            t={t}
          />
        )}

        {/* Submit buttons */}
        <div className="col-12">
          <div className="form-group d-flex flex-wrap gap-3">
            <LoadingButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              loadingText={t("common.loading")}
              disabled={isLoading}
            >
              {formData.id ? t("common.save") : t("common.add")}
            </LoadingButton>
            {formData.id && onSuccess && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => onSuccess()}
                disabled={isLoading}
              >
                {t("admin.material.doneClose")}
              </Button>
            )}
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
