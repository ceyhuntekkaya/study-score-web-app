"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import {
  QuestionCreateRequest,
  QuestionCreateRequestQuestionType,
  QuestionCreateRequestCategory,
  QuestionHeaderRequest,
  QuestionHeaderRequestMediaType,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useGetQuestion,
} from "@/generated/api/question-controller/question-controller";
import { useGetAllCurriculumContents } from "@/generated/api/curriculum-content-rest-controller/curriculum-content-rest-controller";
import type { CurriculumContent } from "@/generated/api/openAPIDefinition.schemas";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import QuestionTemplateForm from "./QuestionTemplateForm";
import HeaderEditor, { type HeaderItem } from "./HeaderEditor";
import QuestionPreview from "./QuestionPreview";

const DEFAULT_ORDER_NUMBER = 1;
const DEFAULT_MAXIMUM_SCORE = 100;
const DEFAULT_DIFFICULTY = "MEDIUM";
const DEFAULT_VERSION = 1;

const EMPTY_HEADER: QuestionHeaderRequest = {
  orderNumber: 1,
  mediaType: QuestionHeaderRequestMediaType.TEXT,
  content: "",
};

interface QuestionFormProps {
  questionGroupId?: string;
  questionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type FormState = Omit<QuestionCreateRequest, "headers"> & {
  headers: QuestionHeaderRequest[];
  orderNumber: number;
  version: number;
};

export default function QuestionForm({
  questionGroupId,
  questionId,
  onSuccess,
  onCancel,
}: QuestionFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!questionId;
  const [showDetails, setShowDetails] = useState(false);

  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const { data: questionData } = useGetQuestion(questionId || "", {
    query: { enabled: isEditMode && !!questionId },
  });
  const { data: curriculumData } = useGetAllCurriculumContents();

  const [formData, setFormData] = useState<FormState>({
    name: "",
    questionGroupId: questionGroupId ?? undefined,
    questionType: QuestionCreateRequestQuestionType.MULTIPLE_CHOICE,
    maximumScore: DEFAULT_MAXIMUM_SCORE,
    subject: undefined,
    difficulty: DEFAULT_DIFFICULTY,
    category: undefined,
    courseSection: undefined,
    curriculumContentIds: undefined,
    headers: [{ ...EMPTY_HEADER }],
    templateData: {},
    orderNumber: DEFAULT_ORDER_NUMBER,
    version: DEFAULT_VERSION,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && questionData) {
      const q = questionData as Record<string, unknown>;
      let parsedTemplateData: unknown = {};
      const rawTemplate = q.templateData;
      if (typeof rawTemplate === "string") {
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
            content: (h.content as string) ?? "",
          }))
        : [{ ...EMPTY_HEADER }];
      if (headers.length === 0) headers.push({ ...EMPTY_HEADER });

      setFormData({
        name: (q.name as string) || "",
        questionGroupId: (q.questionGroupId as string) ?? questionGroupId,
        questionType: (q.questionType as QuestionCreateRequestQuestionType) ?? QuestionCreateRequestQuestionType.MULTIPLE_CHOICE,
        maximumScore: Number(q.maximumScore) || DEFAULT_MAXIMUM_SCORE,
        subject: (q.subject as string) ?? undefined,
        difficulty: (q.difficulty as string) ?? DEFAULT_DIFFICULTY,
        category: (q.category as QuestionCreateRequestCategory) ?? undefined,
        courseSection: (q.courseSection as string) ?? undefined,
        curriculumContentIds: (q.curriculumContentIds as string[]) ?? undefined,
        headers,
        templateData: parsedTemplateData,
        orderNumber: Number((q as { orderNumber?: number }).orderNumber) || DEFAULT_ORDER_NUMBER,
        version: Number((q as { version?: number }).version) || DEFAULT_VERSION,
      });
    }
  }, [isEditMode, questionData, questionGroupId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let parsed: string | number | undefined = value;
    if (name === "maximumScore" || name === "orderNumber" || name === "version") {
      const n = value === "" ? undefined : Number(value);
      parsed = value === "" ? undefined : (isNaN(n as number) ? value : n);
    }
    if (name === "subject" || name === "courseSection") {
      parsed = value === "" ? undefined : value;
    }
    setFormData((prev) => ({ ...prev, [name]: parsed }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleHeadersChange = (headers: QuestionHeaderRequest[]) => {
    setFormData((prev) => ({ ...prev, headers }));
    if (errors.headers) setErrors((prev) => ({ ...prev, headers: "" }));
  };

  const handleTemplateDataChange = (templateData: unknown) => {
    setFormData((prev) => ({ ...prev, templateData }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = t("common.validation.minLength", { min: 3 });
    }
    if (!formData.category) {
      newErrors.category = t("common.validation.required");
    }
    if (!formData.headers || formData.headers.length < 1) {
      newErrors.headers = t("admin.exam.headersMinRequired", { count: 1 });
    }
    const score = formData.maximumScore;
    if (score != null && (score < 0.1 || score > 1000)) {
      newErrors.maximumScore = t("common.validation.range", { min: 0.1, max: 1000 });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload: QuestionCreateRequest = {
        name: formData.name.trim(),
        questionType: formData.questionType,
        category: formData.category,
        maximumScore: formData.maximumScore ?? DEFAULT_MAXIMUM_SCORE,
        headers: formData.headers.length ? formData.headers : undefined,
        templateData: formData.templateData,
        ...(formData.questionGroupId ? { questionGroupId: formData.questionGroupId } : {}),
        ...(formData.subject != null && formData.subject !== "" ? { subject: formData.subject } : {}),
        ...(formData.difficulty ? { difficulty: formData.difficulty } : {}),
        ...(formData.courseSection != null && formData.courseSection !== "" ? { courseSection: formData.courseSection } : {}),
        ...(formData.curriculumContentIds?.length ? { curriculumContentIds: formData.curriculumContentIds } : {}),
      };
      if (isEditMode && questionId) {
        await updateQuestion.mutateAsync({ questionId, data: payload });
      } else {
        await createQuestion.mutateAsync({ data: payload });
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const curriculumList: CurriculumContent[] = Array.isArray(curriculumData) ? curriculumData : curriculumData ? [curriculumData] : [];

  return (
    <div className="row g-0">
      {/* Sol: Form */}
      <div className="col-12 col-lg-7 col-xl-8 pe-lg-4">
        <form onSubmit={handleSubmit} className="rbt-form-wrapper">
          <h5 className="mb--20">
            {isEditMode ? t("admin.exam.editQuestion") : t("admin.exam.addQuestion")}
          </h5>

          {/* Doğrudan görünen alanlar */}
          <div className="row g-3">
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
            {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="questionType">
              {t("admin.exam.questionType")} <span className="text-danger">*</span>
            </Label>
            <Select
              id="questionType"
              name="questionType"
              value={formData.questionType}
              onChange={handleChange}
            >
              <option value={QuestionCreateRequestQuestionType.MULTIPLE_CHOICE}>{t("admin.exam.multipleChoice")}</option>
              <option value={QuestionCreateRequestQuestionType.TRUE_FALSE}>{t("admin.exam.trueFalse")}</option>
              <option value={QuestionCreateRequestQuestionType.MULTIPLE_RESPONSE}>{t("admin.exam.multipleResponse")}</option>
              <option value={QuestionCreateRequestQuestionType.SHORT_ANSWER}>{t("admin.exam.shortAnswer")}</option>
              <option value={QuestionCreateRequestQuestionType.FILL_IN_THE_BLANKS}>{t("admin.exam.fillInTheBlanks")}</option>
              <option value={QuestionCreateRequestQuestionType.MATCHING}>{t("admin.exam.matching")}</option>
              <option value={QuestionCreateRequestQuestionType.ESSAY}>{t("admin.exam.essay")}</option>
              <option value={QuestionCreateRequestQuestionType.ORDERING}>{t("admin.exam.ordering")}</option>
              <option value={QuestionCreateRequestQuestionType.HOT_SPOT}>{t("admin.exam.hotSpot")}</option>
              <option value={QuestionCreateRequestQuestionType.DRAG_AND_DROP}>{t("admin.exam.dragAndDrop")}</option>
              <option value={QuestionCreateRequestQuestionType.AUDIO_RESPONSE}>{t("admin.exam.audioResponse")}</option>
              <option value={QuestionCreateRequestQuestionType.VIDEO_RESPONSE}>{t("admin.exam.videoResponse")}</option>
              <option value={QuestionCreateRequestQuestionType.IMAGE_RESPONSE}>{t("admin.exam.imageResponse")}</option>
            </Select>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="category">
              {t("admin.exam.category")} <span className="text-danger">*</span>
            </Label>
            <Select
              id="category"
              name="category"
              value={formData.category ?? ""}
              onChange={handleChange}
              className={errors.category ? "is-invalid" : ""}
            >
              <option value="">— {t("admin.exam.selectCategory")} —</option>
              <option value={QuestionCreateRequestCategory.IELTS}>IELTS</option>
              <option value={QuestionCreateRequestCategory.TOEFL}>TOEFL</option>
              <option value={QuestionCreateRequestCategory.SAT_ENGLISH}>SAT English</option>
              <option value={QuestionCreateRequestCategory.SAT_MATH}>SAT Math</option>
              <option value={QuestionCreateRequestCategory.GENERAL_ENGLISH}>General English</option>
            </Select>
            {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
          </div>
        </div>
      </div>

      {/* Soru gövdesi: headers */}
      <div className="row g-3 mt-2">
        <div className="col-12">
          <HeaderEditor
            value={formData.headers as HeaderItem[]}
            onChange={(h) => handleHeadersChange(h as QuestionHeaderRequest[])}
            includeOrderNumber={true}
            minItems={1}
            error={errors.headers}
          />
        </div>
      </div>

      {/* Template form (questionType'a göre) */}
      <div className="row g-3 mt-2">
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

      {/* Detaylar (opsiyonel, açılır/kapanır) */}
      <div className="row g-3 mt-3">
        <div className="col-12">
          <button
            type="button"
            className="btn btn-link btn-sm p-0 text-decoration-none d-flex align-items-center gap-1"
            onClick={() => setShowDetails((d) => !d)}
            aria-expanded={showDetails}
          >
            <i className={`feather-chevron-${showDetails ? "up" : "down"}`}></i>
            {t("admin.exam.showDetails")}
          </button>
          {showDetails && (
            <div className="border rounded p-3 mt-2 bg-light">
              <div className="row g-3">
                <div className="col-md-4">
                  <Label htmlFor="orderNumber">{t("admin.exam.orderNumber")}</Label>
                  <Input
                    id="orderNumber"
                    name="orderNumber"
                    type="number"
                    min={1}
                    value={formData.orderNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <Label htmlFor="maximumScore">{t("admin.exam.maximumScore")}</Label>
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
                  {errors.maximumScore && <div className="invalid-feedback d-block">{errors.maximumScore}</div>}
                </div>
                <div className="col-md-4">
                  <Label htmlFor="version">{t("admin.exam.version")}</Label>
                  <Input
                    id="version"
                    name="version"
                    type="number"
                    min={1}
                    value={formData.version}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <Label htmlFor="subject">{t("admin.exam.subject")}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject ?? ""}
                    onChange={handleChange}
                    placeholder={t("admin.exam.subjectPlaceholder")}
                  />
                </div>
                <div className="col-md-6">
                  <Label htmlFor="difficulty">{t("admin.exam.difficulty")}</Label>
                  <Select id="difficulty" name="difficulty" value={formData.difficulty ?? DEFAULT_DIFFICULTY} onChange={handleChange}>
                    <option value="EASY">{t("admin.exam.easy")}</option>
                    <option value="MEDIUM">{t("admin.exam.medium")}</option>
                    <option value="HARD">{t("admin.exam.hard")}</option>
                  </Select>
                </div>
                <div className="col-12">
                  <Label htmlFor="courseSection">{t("admin.exam.courseSection")}</Label>
                  <Input
                    id="courseSection"
                    name="courseSection"
                    value={formData.courseSection ?? ""}
                    onChange={handleChange}
                    placeholder={t("admin.exam.courseSection")}
                  />
                </div>
                <div className="col-12">
                  <Label>{t("admin.exam.curriculumContents")}</Label>
                  <CurriculumContentMultiSelect
                    curriculumList={curriculumList}
                    selectedIds={formData.curriculumContentIds ?? []}
                    onChange={(ids) => setFormData((prev) => ({ ...prev, curriculumContentIds: ids }))}
                    placeholder={t("admin.exam.selectCurriculum")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

          <div className="rbt-btn-wrapper d-flex justify-content-end gap-2 mt--30">
            {onCancel && (
              <button type="button" className="rbt-btn btn-border" onClick={onCancel}>
                {t("common.cancel")}
              </button>
            )}
            <button
              type="submit"
              className="rbt-btn btn-gradient"
              disabled={createQuestion.isPending || updateQuestion.isPending}
            >
              {createQuestion.isPending || updateQuestion.isPending ? (
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
      </div>

      {/* Sağ: Öğrenci önizlemesi */}
      <div className="col-12 col-lg-5 col-xl-4 mt-4 mt-lg-0">
        <div
          className="border rounded p-3 bg-white shadow-sm sticky-top"
          style={{ minHeight: 400, maxHeight: "calc(100vh - 2rem)" }}
        >
          <QuestionPreview
            headers={formData.headers}
            questionType={formData.questionType}
            templateData={formData.templateData}
          />
        </div>
      </div>
    </div>
  );
}

/** Çoklu müfredat seçimi: seçili ID'ler + yeni ekle / listeden kaldır */
function CurriculumContentMultiSelect({
  curriculumList,
  selectedIds,
  onChange,
  placeholder,
}: {
  curriculumList: CurriculumContent[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
}) {
  const addId = (id: string) => {
    if (!id || selectedIds.includes(id)) return;
    onChange([...selectedIds, id]);
  };
  const removeId = (id: string) => {
    onChange(selectedIds.filter((s) => s !== id));
  };
  const selected = curriculumList.filter((c) => c.id && selectedIds.includes(c.id));
  const available = curriculumList.filter((c) => c.id && !selectedIds.includes(c.id));

  return (
    <div>
      <Select
        value=""
        onChange={(e) => {
          addId(e.target.value);
          e.target.value = "";
        }}
      >
        <option value="">{placeholder}</option>
        {available.map((c) => (
          <option key={c.id} value={c.id}>
            {c.code ?? c.content ?? c.id}
          </option>
        ))}
      </Select>
      {selected.length > 0 && (
        <ul className="list-group list-group-flush mt-2">
          {selected.map((c) => (
            <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center py-1 px-2">
              <span>{c.code ?? c.content ?? c.id}</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeId(c.id!)}>
                <i className="feather-trash-2"></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
