"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import ScoringConfigForm from "./ScoringConfigForm";
import TemplateOptionalDetails from "./TemplateOptionalDetails";
import { TemplateFormProps } from "./types";

export interface ShortAnswerTemplateData {
  acceptableAnswers: string[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

const defaultScoringConfig = {
  strategy: "PROPORTIONAL",
  allowPartialCredit: true,
  penaltyPerWrong: 0.0,
  roundScore: false,
  decimalPlaces: 2,
};

export default function ShortAnswerTemplateForm({
  templateData,
  onChange,
}: TemplateFormProps) {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<ShortAnswerTemplateData>(
    normalizeTemplateData(templateData)
  );

  useEffect(() => {
    setLocalData(normalizeTemplateData(templateData));
  }, [templateData]);

  const updateData = (newData: ShortAnswerTemplateData) => {
    setLocalData(newData);
    onChange(newData);
  };

  const answers = localData.acceptableAnswers || [];

  const addAnswer = () => {
    updateData({
      ...localData,
      acceptableAnswers: [...answers, ""],
    });
  };

  const updateAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    updateData({
      ...localData,
      acceptableAnswers: updated,
    });
  };

  const removeAnswer = (index: number) => {
    const updated = answers.filter((_, i) => i !== index);
    updateData({
      ...localData,
      acceptableAnswers: updated,
    });
  };

  const atLeastOneAnswer = answers.length >= 1;
  const allNonEmpty = answers.length > 0 && answers.every((a) => (a || "").trim().length > 0);

  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
      <div className="row g-3 mb--20">
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="caseSensitive"
              checked={localData.caseSensitive ?? false}
              onChange={(e) =>
                updateData({
                  ...localData,
                  caseSensitive: e.target.checked,
                })
              }
              label={t("admin.exam.caseSensitive") || "Case Sensitive"}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="exactMatch"
              checked={localData.exactMatch ?? false}
              onChange={(e) =>
                updateData({
                  ...localData,
                  exactMatch: e.target.checked,
                })
              }
              label={t("admin.exam.exactMatch") || "Exact Match"}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb--20">
        <Label className="mb--0">
          {t("admin.exam.acceptableAnswers") || "Acceptable Answers"}
          <span className="text-danger ms-1">*</span>
        </Label>
        <button
          type="button"
          className="rbt-btn btn-sm btn-border-gradient"
          onClick={addAnswer}
        >
          <i className="feather-plus me-1"></i>
          {t("admin.exam.addAnswer") || "Add Answer"}
        </button>
      </div>

      {!atLeastOneAnswer && (
        <p className="text-warning mb--20" style={{ fontSize: '14px' }}>
          {t("admin.exam.atLeastOneAnswer") || "At least one acceptable answer is required."}
        </p>
      )}

      {answers.length === 0 ? (
        <p className="text-muted text-center py--20">
          {t("admin.exam.noAnswers") || "No answers added. Click \"Add Answer\" to add at least one."}
        </p>
      ) : (
        <div className="row g-3">
          {answers.map((answer: string, index: number) => (
            <div key={index} className="col-12">
              <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                <div className="d-flex gap-2 align-items-center">
                  <Input
                    value={answer || ""}
                    onChange={(e) => updateAnswer(index, e.target.value)}
                    placeholder={t("admin.exam.answerText") || "Answer text"}
                    className="flex-grow-1"
                  />
                  <button
                    type="button"
                    className="rbt-btn btn-sm btn-border"
                    onClick={() => removeAnswer(index)}
                    disabled={answers.length <= 1}
                    title={answers.length <= 1 ? (t("admin.exam.atLeastOneAnswer") || "At least one answer required") : undefined}
                  >
                    <i className="feather-trash-2 me-1"></i>
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {atLeastOneAnswer && !allNonEmpty && (
        <p className="text-warning mt--20" style={{ fontSize: '14px' }}>
          {t("admin.exam.allAnswersNonEmpty") || "All acceptable answers must be non-empty."}
        </p>
      )}

      <TemplateOptionalDetails>
        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="PROPORTIONAL"
        />
      </TemplateOptionalDetails>
    </div>
  );
}

function normalizeTemplateData(data: any): ShortAnswerTemplateData {
  if (!data) {
    return {
      acceptableAnswers: [],
      caseSensitive: false,
      exactMatch: false,
      scoringConfig: defaultScoringConfig,
    };
  }
  const options = data.options || {};
  const legacyAnswers = options.acceptableAnswers;
  const list = Array.isArray(legacyAnswers)
    ? legacyAnswers.map((a: any) => (typeof a === "string" ? a : (a && a.answer) || ""))
    : Array.isArray(data.acceptableAnswers)
    ? data.acceptableAnswers
    : [];
  return {
    acceptableAnswers: list,
    caseSensitive: data.caseSensitive ?? options.caseSensitive ?? false,
    exactMatch: data.exactMatch ?? options.exactMatch ?? false,
    scoringConfig: data.scoringConfig || options.scoringConfig || defaultScoringConfig,
  };
}
