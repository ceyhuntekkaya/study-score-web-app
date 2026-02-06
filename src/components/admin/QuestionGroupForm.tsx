"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import {
  QuestionGroupCreateRequest,
  QuestionGroupCreateRequestCategory,
  HeaderRequest,
  HeaderRequestMediaType,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateQuestionGroup,
  useUpdateQuestionGroup,
  useGetQuestionGroup,
} from "@/generated/api/question-group-controller/question-group-controller";
import { useGetAllActiveExams } from "@/generated/api/exam-controller/exam-controller";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import HeaderEditor from "./HeaderEditor";
import type { HeaderItem } from "./HeaderEditor";

interface QuestionGroupFormProps {
  groupId?: string;
  initialData?: Record<string, unknown>;
  onSuccess?: (groupId: string) => void;
  onCancel?: () => void;
}

export default function QuestionGroupForm({
  groupId,
  initialData,
  onSuccess,
  onCancel,
}: QuestionGroupFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!groupId;

  const createGroup = useCreateQuestionGroup();
  const updateGroup = useUpdateQuestionGroup();
  const { data: groupData } = useGetQuestionGroup(groupId || "", {
    query: {
      enabled: isEditMode && !!groupId,
    },
  });
  const { data: examsData } = useGetAllActiveExams();

  const group = initialData || groupData;
  const exams = Array.isArray(examsData) ? examsData : examsData ? [examsData] : [];

  const [formData, setFormData] = useState<QuestionGroupCreateRequest & { headers?: HeaderRequest[] }>({
    code: "",
    examId: undefined,
    maximumScore: undefined,
    category: QuestionGroupCreateRequestCategory.IELTS,
    difficultyLevel: undefined,
    courseSection: "",
    usagePart: "",
    headers: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && group) {
      const g = group as Record<string, unknown>;
      const rawHeaders = g.headers;
      const headers: HeaderRequest[] = Array.isArray(rawHeaders)
        ? rawHeaders.map((h: Record<string, unknown>) => ({
            mediaType: (h.mediaType as HeaderRequestMediaType) ?? HeaderRequestMediaType.TEXT,
            content: (h.content as string) ?? "",
          }))
        : [];
      setFormData({
        code: (g.code as string) || "",
        examId: (g.examId as string) || undefined,
        maximumScore:
          g.maximumScore != null ? Number(g.maximumScore) : undefined,
        category:
          (g.category as QuestionGroupCreateRequestCategory) ||
          QuestionGroupCreateRequestCategory.IELTS,
        difficultyLevel:
          g.difficultyLevel != null ? Number(g.difficultyLevel) : undefined,
        courseSection: (g.courseSection as string) || "",
        usagePart: (g.usagePart as string) || "",
        headers,
      });
    }
  }, [isEditMode, group]);

  useEffect(() => {
    if (!isEditMode && initialData?.examId) {
      setFormData((prev) => ({
        ...prev,
        examId: initialData.examId as string,
      }));
    }
  }, [isEditMode, initialData?.examId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue: string | number | undefined = value;

    if (name === "code") {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    }
    if (type === "number") {
      const numValue = value === "" ? undefined : Number(value);
      processedValue =
        value === "" ? undefined : isNaN(numValue as number) ? undefined : numValue;
    }
    if (name === "examId") {
      processedValue = value === "" ? undefined : value;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : processedValue,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code || !/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = t("common.validation.invalidCode") || "Geçerli bir kod girin (örn: GRUP_001)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload: QuestionGroupCreateRequest = {
        code: formData.code,
        category: formData.category,
        ...(formData.examId ? { examId: formData.examId } : {}),
        ...(formData.maximumScore != null ? { maximumScore: formData.maximumScore } : {}),
        ...(formData.difficultyLevel != null ? { difficultyLevel: formData.difficultyLevel } : {}),
        ...(formData.courseSection?.trim() ? { courseSection: formData.courseSection.trim() } : {}),
        ...(formData.usagePart?.trim() ? { usagePart: formData.usagePart.trim() } : {}),
        ...(formData.headers?.length ? { headers: formData.headers.map(({ mediaType, content }) => ({ mediaType, content })) } : {}),
      };

      if (isEditMode && groupId) {
        await updateGroup.mutateAsync({
          groupId,
          data: payload,
        });
        if (onSuccess) onSuccess(groupId);
      } else {
        const result = await createGroup.mutateAsync({ data: payload });
        const createdId = (result as Record<string, unknown>)?.id as string | undefined;
        if (createdId && onSuccess) onSuccess(createdId);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const errorData = err?.response?.data;
      if (errorData?.message) {
        setErrors({ ...errors, submit: errorData.message });
      } else if (errorData?.errors) {
        const validationErrors: Record<string, string> = {};
        Object.entries(errorData.errors).forEach(([key, val]) => {
          validationErrors[key] = Array.isArray(val) ? val.join(", ") : String(val);
        });
        setErrors({ ...errors, ...validationErrors });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row g-3">
        {/* Code */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="code">
              {t("admin.exam.groupCode")} <span className="text-danger">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder={t("admin.exam.groupCodePlaceholder")}
              className={errors.code ? "is-invalid" : ""}
              style={{ textTransform: "uppercase" }}
              disabled={isEditMode}
            />
            {errors.code && (
              <div className="invalid-feedback d-block">{errors.code}</div>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="category">{t("admin.exam.category")}</Label>
            <Select
              id="category"
              name="category"
              value={formData.category ?? ""}
              onChange={handleChange}
            >
              <option value={QuestionGroupCreateRequestCategory.IELTS}>IELTS</option>
              <option value={QuestionGroupCreateRequestCategory.TOEFL}>TOEFL</option>
              <option value={QuestionGroupCreateRequestCategory.SAT_ENGLISH}>SAT English</option>
              <option value={QuestionGroupCreateRequestCategory.SAT_MATH}>SAT Math</option>
              <option value={QuestionGroupCreateRequestCategory.GENERAL_ENGLISH}>General English</option>
            </Select>
          </div>
        </div>

        {/* Exam */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="examId">{t("admin.exam.selectExam")}</Label>
            <Select
              id="examId"
              name="examId"
              value={formData.examId ?? ""}
              onChange={handleChange}
            >
              <option value="">— {t("admin.exam.selectExam")} —</option>
              {exams.map((exam: Record<string, unknown>) => (
                <option key={String(exam.id)} value={String(exam.id)}>
                  {String(exam.name ?? exam.code ?? exam.id)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Maximum Score */}
        <div className="col-md-3">
          <div className="form-group">
            <Label htmlFor="maximumScore">{t("admin.exam.maxScore")}</Label>
            <Input
              id="maximumScore"
              name="maximumScore"
              type="number"
              min={0}
              value={formData.maximumScore ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="col-md-3">
          <div className="form-group">
            <Label htmlFor="difficultyLevel">{t("admin.exam.difficulty")}</Label>
            <Input
              id="difficultyLevel"
              name="difficultyLevel"
              type="number"
              min={1}
              max={10}
              value={formData.difficultyLevel ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Course Section */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="courseSection">{t("admin.exam.courseSection")}</Label>
            <Input
              id="courseSection"
              name="courseSection"
              value={formData.courseSection ?? ""}
              onChange={handleChange}
              maxLength={255}
            />
          </div>
        </div>

        {/* Usage Part */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="usagePart">{t("admin.exam.usagePart")}</Label>
            <Input
              id="usagePart"
              name="usagePart"
              value={formData.usagePart ?? ""}
              onChange={handleChange}
              maxLength={255}
            />
          </div>
        </div>

        {/* Headers (soru grubu gövdesi) - opsiyonel */}
        <div className="col-12">
          <HeaderEditor
            value={(formData.headers ?? []) as HeaderItem[]}
            onChange={(headers) => setFormData((prev) => ({ ...prev, headers: headers as HeaderRequest[] }))}
            includeOrderNumber={false}
            minItems={0}
          />
        </div>

        {errors.submit && (
          <div className="col-12">
            <div className="alert alert-danger">{errors.submit}</div>
          </div>
        )}

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="rbt-btn btn-md btn-gradient">
            {isEditMode
              ? t("common.save") || "Kaydet"
              : t("common.add") || "Ekle"}
          </button>
          {onCancel && (
            <button
              type="button"
              className="rbt-btn btn-md btn-border"
              onClick={onCancel}
            >
              {t("common.cancel") || "İptal"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
