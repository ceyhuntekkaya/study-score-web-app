"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import ScoringConfigForm from "./ScoringConfigForm";
import TemplateOptionalDetails from "./TemplateOptionalDetails";
import { TemplateFormProps } from "./types";

export default function ShortAnswerTemplateForm({
  templateData,
  onChange,
}: TemplateFormProps) {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<any>(templateData || {});

  useEffect(() => {
    setLocalData(templateData || {});
  }, [templateData]);

  const updateData = (newData: any) => {
    setLocalData(newData);
    onChange(newData);
  };

  const options = localData.options || {};
  const answers = options.acceptableAnswers || [];

  const addAnswer = () => {
    updateData({
      ...localData,
      options: {
        ...options,
        acceptableAnswers: [...answers, ""],
      },
      maxCharacters: localData.maxCharacters ?? 500,
      minCharacters: localData.minCharacters ?? 10,
      trimWhitespace: localData.trimWhitespace ?? true,
      caseSensitive: options.caseSensitive ?? false,
      exactMatch: options.exactMatch ?? false,
      scoringConfig: localData.scoringConfig || {
        strategy: "PROPORTIONAL",
        allowPartialCredit: true,
        penaltyPerWrong: 0.0,
        roundScore: false,
        decimalPlaces: 2,
      },
    });
  };

  const updateAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    updateData({
      ...localData,
      options: {
        ...options,
        acceptableAnswers: updated,
      },
    });
  };

  const removeAnswer = (index: number) => {
    const updated = answers.filter((_: any, i: number) => i !== index);
    updateData({
      ...localData,
      options: {
        ...options,
        acceptableAnswers: updated,
      },
    });
  };

  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
      <div className="row g-3 mb--20">
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="placeholder">
              {t("admin.exam.placeholder") || "Placeholder"}
            </Label>
            <Input
              id="placeholder"
              value={options.placeholder || ""}
              onChange={(e) =>
                updateData({
                  ...localData,
                  options: { ...options, placeholder: e.target.value },
                })
              }
              placeholder={t("admin.exam.placeholder") || "Placeholder text"}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <Label htmlFor="minCharacters">
              {t("admin.exam.minCharacters") || "Min Characters"}
            </Label>
            <Input
              id="minCharacters"
              type="number"
              min="1"
              value={localData.minCharacters ?? 10}
              onChange={(e) =>
                updateData({
                  ...localData,
                  minCharacters: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <Label htmlFor="maxCharacters">
              {t("admin.exam.maxCharacters") || "Max Characters"}
            </Label>
            <Input
              id="maxCharacters"
              type="number"
              min="1"
              value={localData.maxCharacters ?? 500}
              onChange={(e) =>
                updateData({
                  ...localData,
                  maxCharacters: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="row g-3 mb--20">
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="caseSensitive"
              checked={options.caseSensitive ?? false}
              onChange={(e) =>
                updateData({
                  ...localData,
                  options: { ...options, caseSensitive: e.target.checked },
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
              checked={options.exactMatch ?? false}
              onChange={(e) =>
                updateData({
                  ...localData,
                  options: { ...options, exactMatch: e.target.checked },
                })
              }
              label={t("admin.exam.exactMatch") || "Exact Match"}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb--20">
        <label className="mb--0">{t("admin.exam.acceptableAnswers") || "Acceptable Answers"}</label>
        <button
          type="button"
          className="rbt-btn btn-sm btn-border-gradient"
          onClick={addAnswer}
        >
          <i className="feather-plus me-1"></i>
          {t("admin.exam.addAnswer") || "Add Answer"}
        </button>
      </div>

      {answers.length === 0 ? (
        <p className="text-muted text-center py--20">
          {t("admin.exam.noAnswers") || "No answers added"}
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

      <div className="form-group mt--20">
        <Checkbox
          id="trimWhitespace"
          checked={localData.trimWhitespace ?? true}
          onChange={(e) =>
            updateData({ ...localData, trimWhitespace: e.target.checked })
          }
          label={t("admin.exam.trimWhitespace") || "Trim Whitespace"}
        />
      </div>

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
