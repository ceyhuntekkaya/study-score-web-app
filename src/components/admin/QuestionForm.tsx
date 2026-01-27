"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import {
  QuestionCreateRequest,
  QuestionCreateRequestQuestionType,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useGetQuestion,
} from "@/generated/api/question-controller/question-controller";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import SimpleHtmlEditor from "../ui/SimpleHtmlEditor";
import QuestionTemplateForm from "./QuestionTemplateForm";

interface QuestionFormProps {
  questionGroupId: string;
  questionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function QuestionForm({
  questionGroupId,
  questionId,
  onSuccess,
  onCancel,
}: QuestionFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!questionId;

  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const { data: questionData } = useGetQuestion(
    questionId || "",
    {
      query: {
        enabled: isEditMode && !!questionId,
      },
    }
  );

  // Form state
  const [formData, setFormData] = useState<QuestionCreateRequest>({
    name: "",
    questionGroupId: questionGroupId,
    questionType: QuestionCreateRequestQuestionType.MULTIPLE_CHOICE,
    maximumScore: 1,
    subject: "",
    difficulty: "MEDIUM",
    questionText: "",
    templateData: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load question data if editing
  useEffect(() => {
    if (isEditMode && questionData) {
      const q = questionData as any;
      setFormData({
        name: q.name || "",
        questionGroupId: q.questionGroupId || questionGroupId,
        questionType: q.questionType || QuestionCreateRequestQuestionType.MULTIPLE_CHOICE,
        maximumScore: q.maximumScore || 1,
        subject: q.subject || "",
        difficulty: q.difficulty || "MEDIUM",
        questionText: q.questionText || "",
        templateData: typeof q.templateData === "string" 
          ? JSON.parse(q.templateData) 
          : q.templateData || {},
      });
    }
  }, [isEditMode, questionData, questionGroupId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };


  const handleQuestionTextChange = (content: string) => {
    setFormData({ ...formData, questionText: content });
  };

  const handleTemplateDataChange = (templateData: any) => {
    setFormData({ ...formData, templateData });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = t("common.validation.minLength", { min: 3 });
    }

    if (!formData.questionText || formData.questionText.length < 10) {
      newErrors.questionText = t("common.validation.minLength", { min: 10 });
    }

    if (formData.maximumScore < 0.1 || formData.maximumScore > 1000) {
      newErrors.maximumScore = t("common.validation.range", { min: 0.1, max: 1000 });
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
      if (isEditMode && questionId) {
        await updateQuestion.mutateAsync({
          questionId,
          data: formData,
        });
      } else {
        await createQuestion.mutateAsync({
          data: formData,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving question:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <h5 className="mb--20">
        {isEditMode
          ? t("admin.exam.editQuestion") || "Soru Düzenle"
          : t("admin.exam.addQuestion") || "Soru Ekle"}
      </h5>

      <div className="row g-5">
        {/* Name */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              {t("admin.exam.questionName")} <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("admin.exam.questionNamePlaceholder")}
              className={errors.name ? "is-invalid" : ""}
            />
            {errors.name && (
              <div className="invalid-feedback d-block">{errors.name}</div>
            )}
          </div>
        </div>

        {/* Question Type */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="questionType">
              {t("admin.exam.questionType")} <span className="text-danger">*</span>
            </Label>
            <select
              id="questionType"
              name="questionType"
              className="form-control"
              value={formData.questionType}
              onChange={handleChange}
            >
              <option value={QuestionCreateRequestQuestionType.MULTIPLE_CHOICE}>
                {t("admin.exam.multipleChoice")}
              </option>
              <option value={QuestionCreateRequestQuestionType.TRUE_FALSE}>
                {t("admin.exam.trueFalse")}
              </option>
              <option value={QuestionCreateRequestQuestionType.MULTIPLE_RESPONSE}>
                {t("admin.exam.multipleResponse")}
              </option>
              <option value={QuestionCreateRequestQuestionType.SHORT_ANSWER}>
                {t("admin.exam.shortAnswer")}
              </option>
              <option value={QuestionCreateRequestQuestionType.FILL_IN_THE_BLANKS}>
                {t("admin.exam.fillInTheBlanks")}
              </option>
              <option value={QuestionCreateRequestQuestionType.MATCHING}>
                {t("admin.exam.matching")}
              </option>
              <option value={QuestionCreateRequestQuestionType.ESSAY}>
                {t("admin.exam.essay")}
              </option>
              <option value={QuestionCreateRequestQuestionType.ORDERING}>
                {t("admin.exam.ordering")}
              </option>
              <option value={QuestionCreateRequestQuestionType.HOT_SPOT}>
                {t("admin.exam.hotSpot")}
              </option>
              <option value={QuestionCreateRequestQuestionType.DRAG_AND_DROP}>
                {t("admin.exam.dragAndDrop")}
              </option>
              <option value={QuestionCreateRequestQuestionType.AUDIO_RESPONSE}>
                {t("admin.exam.audioResponse")}
              </option>
              <option value={QuestionCreateRequestQuestionType.VIDEO_RESPONSE}>
                {t("admin.exam.videoResponse")}
              </option>
              <option value={QuestionCreateRequestQuestionType.IMAGE_RESPONSE}>
                {t("admin.exam.imageResponse")}
              </option>
            </select>
          </div>
        </div>

        {/* Maximum Score */}
        <div className="col-md-3">
          <div className="form-group">
            <Label htmlFor="maximumScore">
              {t("admin.exam.maximumScore")} <span className="text-danger">*</span>
            </Label>
            <Input
              id="maximumScore"
              name="maximumScore"
              type="number"
              min="0.1"
              max="1000"
              step="0.1"
              value={formData.maximumScore}
              onChange={handleChange}
              className={errors.maximumScore ? "is-invalid" : ""}
            />
            {errors.maximumScore && (
              <div className="invalid-feedback d-block">{errors.maximumScore}</div>
            )}
          </div>
        </div>

        {/* Difficulty */}
        <div className="col-md-3">
          <div className="form-group">
            <Label htmlFor="difficulty">{t("admin.exam.difficulty")}</Label>
            <select
              id="difficulty"
              name="difficulty"
              className="form-control"
              value={formData.difficulty || "MEDIUM"}
              onChange={handleChange}
            >
              <option value="EASY">{t("admin.exam.easy")}</option>
              <option value="MEDIUM">{t("admin.exam.medium")}</option>
              <option value="HARD">{t("admin.exam.hard")}</option>
            </select>
          </div>
        </div>

        {/* Subject */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="subject">{t("admin.exam.subject")}</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject || ""}
              onChange={handleChange}
              placeholder={t("admin.exam.subjectPlaceholder")}
            />
          </div>
        </div>
      </div>

      {/* Question Text */}
      <div className="row g-5">
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="questionText">
              {t("admin.exam.questionText")} <span className="text-danger">*</span>
            </Label>
            <SimpleHtmlEditor
              value={formData.questionText}
              onChange={handleQuestionTextChange}
              placeholder={t("admin.exam.questionTextPlaceholder")}
            />
            {errors.questionText && (
              <div className="invalid-feedback d-block">{errors.questionText}</div>
            )}
          </div>
        </div>
      </div>

      {/* Template Data Form */}
      <div className="row g-5">
        <div className="col-12">
          <div className="form-group">
            <Label>{t("admin.exam.templateData")}</Label>
            <QuestionTemplateForm
              questionType={formData.questionType}
              templateData={formData.templateData}
              onChange={handleTemplateDataChange}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
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
          disabled={createQuestion.isPending || updateQuestion.isPending}
        >
          {(createQuestion.isPending || updateQuestion.isPending) ? (
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
