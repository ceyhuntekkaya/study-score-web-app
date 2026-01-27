"use client";

import { QuestionCreateRequestQuestionType } from "@/generated/api/openAPIDefinition.schemas";
import { Textarea } from "@/components/ui/Textarea";
import MultipleChoiceTemplateForm from "./templateForms/MultipleChoiceTemplateForm";
import MultipleResponseTemplateForm from "./templateForms/MultipleResponseTemplateForm";
import TrueFalseTemplateForm from "./templateForms/TrueFalseTemplateForm";
import ShortAnswerTemplateForm from "./templateForms/ShortAnswerTemplateForm";
import FillInTheBlanksTemplateForm from "./templateForms/FillInTheBlanksTemplateForm";
import OrderingTemplateForm from "./templateForms/OrderingTemplateForm";
import MatchingTemplateForm from "./templateForms/MatchingTemplateForm";
import DragAndDropTemplateForm from "./templateForms/DragAndDropTemplateForm";
import HotSpotTemplateForm from "./templateForms/HotSpotTemplateForm";
import EssayTemplateForm from "./templateForms/EssayTemplateForm";
import AudioResponseTemplateForm from "./templateForms/AudioResponseTemplateForm";
import VideoResponseTemplateForm from "./templateForms/VideoResponseTemplateForm";
import ImageResponseTemplateForm from "./templateForms/ImageResponseTemplateForm";
import { useTranslation } from "@/i18n";

interface QuestionTemplateFormProps {
  questionType: QuestionCreateRequestQuestionType;
  templateData: any;
  onChange: (templateData: any) => void;
}

export default function QuestionTemplateForm({
  questionType,
  templateData,
  onChange,
}: QuestionTemplateFormProps) {
  const { t } = useTranslation();

  // Router: Render appropriate template form based on question type
  switch (questionType) {
    case QuestionCreateRequestQuestionType.MULTIPLE_CHOICE:
      return (
        <MultipleChoiceTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.MULTIPLE_RESPONSE:
      return (
        <MultipleResponseTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.TRUE_FALSE:
      return (
        <TrueFalseTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.SHORT_ANSWER:
      return (
        <ShortAnswerTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.FILL_IN_THE_BLANKS:
      return (
        <FillInTheBlanksTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.ORDERING:
      return (
        <OrderingTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.MATCHING:
      return (
        <MatchingTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.DRAG_AND_DROP:
      return (
        <DragAndDropTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.HOT_SPOT:
      return (
        <HotSpotTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.ESSAY:
      return (
        <EssayTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.AUDIO_RESPONSE:
      return (
        <AudioResponseTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.VIDEO_RESPONSE:
      return (
        <VideoResponseTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    case QuestionCreateRequestQuestionType.IMAGE_RESPONSE:
      return (
        <ImageResponseTemplateForm
          templateData={templateData}
          onChange={onChange}
        />
      );

    default:
      // Fallback: JSON editor for unknown types
      return (
        <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
          <div className="form-group">
            <label>{t("admin.exam.templateData")}</label>
            <Textarea
              value={JSON.stringify(templateData || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  onChange(parsed);
                } catch {
                  // Invalid JSON, keep as is
                }
              }}
              placeholder={t("admin.exam.templateDataJson")}
              rows={10}
              className="form-control"
              style={{ fontFamily: 'monospace', fontSize: '14px' }}
            />
            <small className="text-muted d-block mt--10">
              {t("admin.exam.templateDataJsonHint")}
            </small>
          </div>
        </div>
      );
  }
}
