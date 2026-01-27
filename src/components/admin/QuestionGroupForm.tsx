"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import {
  QuestionGroupCreateRequest,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateQuestionGroup,
  useUpdateQuestionGroup,
  useGetQuestionGroup,
} from "@/generated/api/question-group-controller/question-group-controller";

interface QuestionGroupFormProps {
  examId: string;
  questionGroupId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function QuestionGroupForm({
  examId,
  questionGroupId,
  onSuccess,
  onCancel,
}: QuestionGroupFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!questionGroupId;

  const createGroup = useCreateQuestionGroup();
  const updateGroup = useUpdateQuestionGroup();
  const { data: groupData } = useGetQuestionGroup(questionGroupId || "", {
    query: {
      enabled: isEditMode && !!questionGroupId,
    },
  });

  const [formData, setFormData] = useState<QuestionGroupCreateRequest>({
    code: "",
    examId: examId,
    maximumScore: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with group data if editing
  useEffect(() => {
    if (isEditMode && groupData) {
      const group = groupData as any;
      setFormData({
        code: group.code || "",
        examId: group.examId || examId,
        maximumScore: group.maximumScore,
      });
    }
  }, [isEditMode, groupData, examId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    if (name === "code") {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9_-]/g, "_");
    } else if (name === "maximumScore") {
      processedValue = value ? Number(value) : undefined;
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code || !/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = t("common.validation.invalidCode");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode && questionGroupId) {
        await updateGroup.mutateAsync({
          groupId: questionGroupId,
          data: formData,
        });
      } else {
        await createGroup.mutateAsync({
          data: formData,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} question group:`, error);
      if (error?.response?.data?.message) {
        setErrors({ ...errors, submit: error.response.data.message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <h5 className="mb--20">
        {isEditMode
          ? t("admin.exam.editQuestionGroup") || "Soru Grubu Düzenle"
          : t("admin.exam.addQuestionGroup") || "Soru Grubu Ekle"}
      </h5>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="code">
              {t("admin.exam.groupCode")} <span className="text-danger">*</span>
            </label>
            <input
              id="code"
              name="code"
              type="text"
              className={`form-control ${errors.code ? "is-invalid" : ""}`}
              value={formData.code}
              onChange={handleChange}
              placeholder={t("admin.exam.groupCodePlaceholder")}
              style={{ textTransform: "uppercase" }}
              disabled={isEditMode}
            />
            {errors.code && (
              <div className="invalid-feedback d-block">{errors.code}</div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="maximumScore">
              {t("admin.exam.maximumScore")}
            </label>
            <input
              id="maximumScore"
              name="maximumScore"
              type="number"
              className="form-control"
              value={formData.maximumScore || ""}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="alert alert-danger mt--20" role="alert">
          {errors.submit}
        </div>
      )}

      <div className="rbt-btn-wrapper d-flex justify-content-end gap-2 mt--30">
        {onCancel && (
          <button
            type="button"
            className="rbt-btn btn-border"
            onClick={onCancel}
          >
            {t("common.cancel")}
          </button>
        )}
        <button
          type="submit"
          className="rbt-btn btn-gradient"
          disabled={createGroup.isPending || updateGroup.isPending}
        >
          {(createGroup.isPending || updateGroup.isPending) ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              {t("common.loading")}
            </>
          ) : (
            <>
              <i className="feather-save me-1"></i>
              {isEditMode ? t("common.save") : t("common.add")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
