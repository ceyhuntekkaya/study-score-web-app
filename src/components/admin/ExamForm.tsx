"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import {
  ExamCreateRequest,
  ExamCreateRequestCategory,
  ExamCreateRequestExamType,
  ExamUpdateRequest,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateExam,
  useUpdateExam,
  useGetExam,
} from "@/generated/api/exam-controller/exam-controller";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";

interface ExamFormProps {
  examId?: string;
  initialData?: any;
  onSuccess?: (examId: string) => void;
  onCancel?: () => void;
}

export default function ExamForm({
  examId,
  initialData,
  onSuccess,
  onCancel,
}: ExamFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!examId;
  
  const createExam = useCreateExam();
  const updateExam = useUpdateExam();
  const { data: examData } = useGetExam(examId || "", {
    query: {
      enabled: isEditMode && !!examId,
    },
  });

  // Use initialData or examData
  const exam = initialData || examData;

  // Helper to convert ISO datetime to datetime-local format
  const convertISOToLocal = (isoString: string | null | undefined): string => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  // Form state
  const [formData, setFormData] = useState<ExamCreateRequest>({
    name: "",
    code: "",
    category: ExamCreateRequestCategory.IELTS,
    examLevel: "",
    examType: ExamCreateRequestExamType.PRACTICE,
    timeLimitMinutes: 60,
    passingScorePercentage: 50,
    maxAttempts: 3,
    shuffleQuestions: false,
    shuffleAnswers: true, // Backend default is true
    allowBackward: true,
    showQuestionsOneAtTime: false,
    requireCompleteAttempt: false,
    resultsReleaseType: "IMMEDIATE",
    availableFrom: "",
    availableUntil: "",
    accessCode: "",
    requireProctoring: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with exam data if editing
  useEffect(() => {
    if (isEditMode && exam) {
      const examData = exam as any;
      setFormData({
        name: examData.name || "",
        code: examData.code || "",
        category: examData.category || ExamCreateRequestCategory.IELTS,
        examLevel: examData.examLevel || "",
        examType: examData.examType || ExamCreateRequestExamType.PRACTICE,
        timeLimitMinutes: examData.timeLimitMinutes || 60,
        passingScorePercentage: examData.passingScorePercentage || 50,
        maxAttempts: examData.maxAttempts || 3,
        shuffleQuestions: examData.shuffleQuestions ?? false,
        shuffleAnswers: examData.shuffleAnswers ?? true,
        allowBackward: examData.allowBackward ?? true,
        showQuestionsOneAtTime: examData.showQuestionsOneAtTime ?? false,
        requireCompleteAttempt: examData.requireCompleteAttempt ?? false,
        resultsReleaseType: examData.resultsReleaseType || "IMMEDIATE",
        availableFrom: convertISOToLocal(examData.availableFrom),
        availableUntil: convertISOToLocal(examData.availableUntil),
        accessCode: examData.accessCode || "",
        requireProctoring: examData.requireProctoring ?? false,
      });
    }
  }, [isEditMode, exam]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue = value;
    
    // For code field, convert to uppercase and filter invalid characters
    if (name === "code") {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : processedValue,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = t("common.validation.minLength", { min: 3 });
    }

    // Code validation only for create mode
    if (!isEditMode && (!formData.code || !/^[A-Z0-9_-]+$/.test(formData.code))) {
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
      // Helper function to convert datetime-local to ISO string
      const convertToISO = (datetimeLocal: string): string => {
        if (!datetimeLocal || !datetimeLocal.trim()) return "";
        // datetime-local format: YYYY-MM-DDTHH:mm
        // Convert to ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
        const date = new Date(datetimeLocal);
        return date.toISOString();
      };

      // Clean up the data before sending - remove empty strings for optional fields
      // Note: dateRangeValid is a validation method in backend (@AssertTrue), not a field to send
      const cleanedData: any = {
        name: formData.name,
        code: formData.code,
        category: formData.category,
        examType: formData.examType,
        timeLimitMinutes: formData.timeLimitMinutes,
        passingScorePercentage: formData.passingScorePercentage ? Number(formData.passingScorePercentage) : undefined,
        maxAttempts: formData.maxAttempts,
        shuffleQuestions: formData.shuffleQuestions ?? false,
        shuffleAnswers: formData.shuffleAnswers ?? true,
        allowBackward: formData.allowBackward ?? true,
        showQuestionsOneAtTime: formData.showQuestionsOneAtTime ?? false,
        requireCompleteAttempt: formData.requireCompleteAttempt ?? false,
        requireProctoring: formData.requireProctoring ?? false,
        resultsReleaseType: formData.resultsReleaseType || "IMMEDIATE",
        // Only include optional fields if they have values
        ...(formData.examLevel && formData.examLevel.trim() ? { examLevel: formData.examLevel } : {}),
        ...(formData.availableFrom && formData.availableFrom.trim() 
          ? { availableFrom: convertToISO(formData.availableFrom) } 
          : {}),
        ...(formData.availableUntil && formData.availableUntil.trim() 
          ? { availableUntil: convertToISO(formData.availableUntil) } 
          : {}),
        ...(formData.accessCode && formData.accessCode.trim() ? { accessCode: formData.accessCode } : {}),
      };

      console.log("Sending exam data:", cleanedData);

      if (isEditMode && examId) {
        // Update mode - use ExamUpdateRequest (no code, no category)
        const updateData: ExamUpdateRequest = {
          name: cleanedData.name,
          examLevel: cleanedData.examLevel,
          examType: cleanedData.examType,
          timeLimitMinutes: cleanedData.timeLimitMinutes,
          passingScorePercentage: cleanedData.passingScorePercentage,
          maxAttempts: cleanedData.maxAttempts,
          shuffleQuestions: cleanedData.shuffleQuestions,
          shuffleAnswers: cleanedData.shuffleAnswers,
          allowBackward: cleanedData.allowBackward,
          showQuestionsOneAtTime: cleanedData.showQuestionsOneAtTime,
          requireCompleteAttempt: cleanedData.requireCompleteAttempt,
          requireProctoring: cleanedData.requireProctoring,
          resultsReleaseType: cleanedData.resultsReleaseType,
          ...(cleanedData.availableFrom ? { availableFrom: cleanedData.availableFrom } : {}),
          ...(cleanedData.availableUntil ? { availableUntil: cleanedData.availableUntil } : {}),
          ...(cleanedData.accessCode ? { accessCode: cleanedData.accessCode } : {}),
        };

        await updateExam.mutateAsync({
          examId,
          data: updateData,
        });

        if (onSuccess) {
          onSuccess(examId);
        }
      } else {
        // Create mode
        const result = await createExam.mutateAsync({
          data: cleanedData,
        });

        if (result && (result as any).id) {
          const createdExamId = (result as any).id;
          if (onSuccess) {
            onSuccess(createdExamId);
          }
        }
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} exam:`, error);
      console.error("Error response:", error?.response?.data);
      console.error("Error response status:", error?.response?.status);
      console.error("Error response headers:", error?.response?.headers);
      
      // Show error message to user
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          setErrors({ ...errors, submit: errorData.message });
        } else if (errorData.errors) {
          // Handle validation errors
          const validationErrors: Record<string, string> = {};
          Object.keys(errorData.errors).forEach((key) => {
            validationErrors[key] = Array.isArray(errorData.errors[key])
              ? errorData.errors[key].join(", ")
              : errorData.errors[key];
          });
          setErrors({ ...errors, ...validationErrors });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row g-3">
        {/* Name */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              {t("admin.exam.name")} <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("admin.exam.namePlaceholder")}
              className={errors.name ? "is-invalid" : ""}
            />
            {errors.name && (
              <div className="invalid-feedback d-block">{errors.name}</div>
            )}
          </div>
        </div>

        {/* Code - Only in create mode */}
        {!isEditMode && (
          <div className="col-md-6">
            <div className="form-group">
              <Label htmlFor="code">
                {t("admin.exam.code")} <span className="text-danger">*</span>
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder={t("admin.exam.codePlaceholder")}
                className={errors.code ? "is-invalid" : ""}
                style={{ textTransform: "uppercase" }}
              />
              {errors.code && (
                <div className="invalid-feedback d-block">{errors.code}</div>
              )}
            </div>
          </div>
        )}

        {/* Category - Only in create mode */}
        {!isEditMode && (
          <div className="col-md-6">
            <div className="form-group">
              <Label htmlFor="category">
                {t("admin.exam.category")} <span className="text-danger">*</span>
              </Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value={ExamCreateRequestCategory.IELTS}>IELTS</option>
                <option value={ExamCreateRequestCategory.TOEFL}>TOEFL</option>
                <option value={ExamCreateRequestCategory.SAT_ENGLISH}>SAT English</option>
                <option value={ExamCreateRequestCategory.SAT_MATH}>SAT Math</option>
                <option value={ExamCreateRequestCategory.GENERAL_ENGLISH}>General English</option>
              </Select>
            </div>
          </div>
        )}

        {/* Show code and category as read-only in edit mode */}
        {isEditMode && (
          <>
            <div className="col-md-6">
              <div className="form-group">
                <Label>{t("admin.exam.code")}</Label>
                <Input
                  value={formData.code || ""}
                  disabled
                  className="bg-light"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Label>{t("admin.exam.category")}</Label>
                <Input
                  value={formData.category || ""}
                  disabled
                  className="bg-light"
                />
              </div>
            </div>
          </>
        )}

        {/* Exam Type */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="examType">{t("admin.exam.examType")}</Label>
            <Select
              id="examType"
              name="examType"
              value={formData.examType}
              onChange={handleChange}
            >
              <option value={ExamCreateRequestExamType.PRACTICE}>
                {t("admin.exam.practice")}
              </option>
              <option value={ExamCreateRequestExamType.CERTIFICATE}>
                {t("admin.exam.certificate")}
              </option>
              <option value={ExamCreateRequestExamType.COURSE_EXAM}>
                {t("admin.exam.courseExam")}
              </option>
              <option value={ExamCreateRequestExamType.LEVEL_DETERMINATION}>
                {t("admin.exam.levelDetermination")}
              </option>
              <option value={ExamCreateRequestExamType.DEGREE}>
                {t("admin.exam.degree")}
              </option>
            </Select>
          </div>
        </div>

        {/* Time Limit (Minutes) */}
        <div className="col-md-4">
          <div className="form-group">
            <Label htmlFor="timeLimitMinutes">
              {t("admin.exam.timeLimitMinutes")}
            </Label>
            <Input
              id="timeLimitMinutes"
              name="timeLimitMinutes"
              type="number"
              min="1"
              max="1440"
              value={formData.timeLimitMinutes || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Passing Score Percentage */}
        <div className="col-md-4">
          <div className="form-group">
            <Label htmlFor="passingScorePercentage">
              {t("admin.exam.passingScorePercentage")}
            </Label>
            <Input
              id="passingScorePercentage"
              name="passingScorePercentage"
              type="number"
              min="0"
              max="100"
              value={formData.passingScorePercentage || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Max Attempts */}
        <div className="col-md-4">
          <div className="form-group">
            <Label htmlFor="maxAttempts">{t("admin.exam.maxAttempts")}</Label>
            <Input
              id="maxAttempts"
              name="maxAttempts"
              type="number"
              min="1"
              max="10"
              value={formData.maxAttempts || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Exam Level */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="examLevel">{t("admin.exam.examLevel")}</Label>
            <Input
              id="examLevel"
              name="examLevel"
              value={formData.examLevel || ""}
              onChange={handleChange}
              placeholder={t("admin.exam.examLevelPlaceholder")}
            />
          </div>
        </div>

        {/* Available From */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="availableFrom">
              {t("admin.exam.availableFrom")}
            </Label>
            <Input
              id="availableFrom"
              name="availableFrom"
              type="datetime-local"
              value={formData.availableFrom || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Available Until */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="availableUntil">
              {t("admin.exam.availableUntil")}
            </Label>
            <Input
              id="availableUntil"
              name="availableUntil"
              type="datetime-local"
              value={formData.availableUntil || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Access Code */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="accessCode">{t("admin.exam.accessCode")}</Label>
            <Input
              id="accessCode"
              name="accessCode"
              value={formData.accessCode || ""}
              onChange={handleChange}
              placeholder={t("admin.exam.accessCodePlaceholder")}
            />
          </div>
        </div>

        {/* Results Release Type */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="resultsReleaseType">{t("admin.exam.resultsReleaseType") || "Results Release Type"}</Label>
            <Select
              id="resultsReleaseType"
              name="resultsReleaseType"
              value={formData.resultsReleaseType || "IMMEDIATE"}
              onChange={handleChange}
            >
              <option value="IMMEDIATE">{t("admin.exam.immediate") || "Immediate"}</option>
              <option value="AFTER_COMPLETION">{t("admin.exam.afterCompletion") || "After Completion"}</option>
              <option value="MANUAL">{t("admin.exam.manual") || "Manual"}</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="shuffleQuestions"
              name="shuffleQuestions"
              checked={formData.shuffleQuestions || false}
              onChange={handleChange}
              label={t("admin.exam.shuffleQuestions")}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="shuffleAnswers"
              name="shuffleAnswers"
              checked={formData.shuffleAnswers || false}
              onChange={handleChange}
              label={t("admin.exam.shuffleAnswers")}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="allowBackward"
              name="allowBackward"
              checked={formData.allowBackward || false}
              onChange={handleChange}
              label={t("admin.exam.allowBackward")}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="showQuestionsOneAtTime"
              name="showQuestionsOneAtTime"
              checked={formData.showQuestionsOneAtTime || false}
              onChange={handleChange}
              label={t("admin.exam.showQuestionsOneAtTime")}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="requireCompleteAttempt"
              name="requireCompleteAttempt"
              checked={formData.requireCompleteAttempt || false}
              onChange={handleChange}
              label={t("admin.exam.requireCompleteAttempt")}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="requireProctoring"
              name="requireProctoring"
              checked={formData.requireProctoring || false}
              onChange={handleChange}
              label={t("admin.exam.requireProctoring")}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="alert alert-danger" role="alert">
          {errors.submit}
        </div>
      )}

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
          disabled={createExam.isPending || updateExam.isPending}
        >
          {(createExam.isPending || updateExam.isPending) ? (
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
