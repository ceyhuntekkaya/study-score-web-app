"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { TemplateFormProps } from "./types";

export default function FillInTheBlanksTemplateForm({
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
  const blanks = options.blanks || [];

  const addBlank = () => {
    const blankId = `BLANK_${blanks.length + 1}`;
    const newBlank = {
      blankId,
      acceptableAnswers: "",
    };
    updateData({
      ...localData,
      textWithBlanks: localData.textWithBlanks || "",
      options: {
        ...options,
        blanks: [...blanks, newBlank],
      },
      caseSensitive: localData.caseSensitive ?? false,
      exactMatch: localData.exactMatch ?? false,
    });
  };

  const updateBlank = (index: number, field: string, value: any) => {
    const updated = [...blanks];
    updated[index] = { ...updated[index], [field]: value };
    updateData({
      ...localData,
      options: {
        ...options,
        blanks: updated,
      },
    });
  };

  const removeBlank = (index: number) => {
    const updated = blanks.filter((_: any, i: number) => i !== index);
    updateData({
      ...localData,
      options: {
        ...options,
        blanks: updated,
      },
    });
  };

  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
      <div className="form-group mb--20">
        <Label htmlFor="textWithBlanks">
          {t("admin.exam.textWithBlanks") || "Text with Blanks"}
          <small className="text-muted d-block">
            Use {"{{BLANK_1}}"}, {"{{BLANK_2}}"}, etc. for blanks
          </small>
        </Label>
        <Textarea
          id="textWithBlanks"
          value={localData.textWithBlanks || ""}
          onChange={(e) =>
            updateData({ ...localData, textWithBlanks: e.target.value })
          }
          placeholder="The capital of Turkey is {{BLANK_1}}"
          rows={4}
          className="form-control"
        />
      </div>

      <div className="row g-3 mb--20">
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="caseSensitive"
              checked={localData.caseSensitive ?? false}
              onChange={(e) =>
                updateData({ ...localData, caseSensitive: e.target.checked })
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
                updateData({ ...localData, exactMatch: e.target.checked })
              }
              label={t("admin.exam.exactMatch") || "Exact Match"}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb--20">
        <label className="mb--0">{t("admin.exam.blanks") || "Blanks"}</label>
        <button
          type="button"
          className="rbt-btn btn-sm btn-border-gradient"
          onClick={addBlank}
        >
          <i className="feather-plus me-1"></i>
          {t("admin.exam.addBlank") || "Add Blank"}
        </button>
      </div>

      {blanks.length === 0 ? (
        <p className="text-muted text-center py--20">
          {t("admin.exam.noBlanks") || "No blanks added"}
        </p>
      ) : (
        <div className="row g-3">
          {blanks.map((blank: any, blankIndex: number) => (
            <div key={blank.blankId || blankIndex} className="col-12">
              <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                <div className="d-flex justify-content-between align-items-center mb--15">
                  <label className="mb--0">
                    {t("admin.exam.blank") || "Blank"} {blank.blankId || blankIndex + 1}
                  </label>
                  <button
                    type="button"
                    className="rbt-btn btn-sm btn-border"
                    onClick={() => removeBlank(blankIndex)}
                  >
                    <i className="feather-trash-2 me-1"></i>
                    {t("common.delete")}
                  </button>
                </div>

                <div className="form-group mb--15">
                  <Label htmlFor={`blank-id-${blankIndex}`}>
                    {t("admin.exam.blankId") || "Blank ID"}
                  </Label>
                  <Input
                    id={`blank-id-${blankIndex}`}
                    value={blank.blankId || ""}
                    onChange={(e) => updateBlank(blankIndex, "blankId", e.target.value)}
                    placeholder="BLANK_1"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor={`blank-answers-${blankIndex}`}>
                    {t("admin.exam.acceptableAnswers") || "Acceptable Answers"}
                    <small className="text-muted d-block">
                      Comma-separated answers (e.g., "answer1, answer2, answer3")
                    </small>
                  </Label>
                  <Input
                    id={`blank-answers-${blankIndex}`}
                    value={blank.acceptableAnswers || ""}
                    onChange={(e) => updateBlank(blankIndex, "acceptableAnswers", e.target.value)}
                    placeholder="answer1, answer2, answer3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
