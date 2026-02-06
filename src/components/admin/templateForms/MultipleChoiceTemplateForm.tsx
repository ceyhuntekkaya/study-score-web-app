"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import ScoringConfigForm, { DEFAULT_SCORING_CONFIG } from "./ScoringConfigForm";
import TemplateOptionalDetails from "./TemplateOptionalDetails";
import { TemplateFormProps } from "./types";

/** Backend ChoiceOption: only id, text, isCorrect. No mediaUrl/mediaType. */
function toChoiceOption(c: any): { id: string; text: string; isCorrect: boolean } {
  return {
    id: c?.id ?? "",
    text: c?.text ?? "",
    isCorrect: !!c?.isCorrect,
  };
}

export default function MultipleChoiceTemplateForm({
  templateData,
  onChange,
}: TemplateFormProps) {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<any>(templateData || {});

  useEffect(() => {
    const data = templateData || {};
    const rawChoices = data.options?.choices || [];
    const choices = rawChoices.map((c: any) => toChoiceOption(c));
    setLocalData({
      ...data,
      options: data.options ? { ...data.options, choices } : data.options,
      scoringConfig: data.scoringConfig ?? { ...DEFAULT_SCORING_CONFIG },
    });
  }, [templateData]);

  const updateData = (newData: any) => {
    const choices = (newData.options?.choices || []).map(toChoiceOption);
    const withDefaults = {
      ...newData,
      options: newData.options ? { ...newData.options, choices } : newData.options,
      scoringConfig: newData.scoringConfig ?? { ...DEFAULT_SCORING_CONFIG },
    };
    setLocalData(withDefaults);
    onChange(withDefaults);
  };

  const choices = localData.options?.choices || [];

  const addChoice = () => {
    const isFirstChoice = choices.length === 0;
    const newChoice = toChoiceOption({
      id: `choice_${Date.now()}`,
      text: "",
      isCorrect: isFirstChoice,
    });
    updateData({
      ...localData,
      options: {
        ...localData.options,
        choices: [...choices, newChoice],
      },
      shuffleChoices: localData.shuffleChoices ?? true,
      showFeedback: localData.showFeedback ?? false,
      scoringConfig: localData.scoringConfig || { ...DEFAULT_SCORING_CONFIG },
    });
  };

  const updateChoice = (index: number, field: string, value: any) => {
    const updatedChoices = [...choices].map(toChoiceOption);
    updatedChoices[index] = { ...updatedChoices[index], [field]: value };

    if (field === "isCorrect" && value === true) {
      updatedChoices.forEach((c, i) => {
        if (i !== index) c.isCorrect = false;
      });
    }

    const hasCorrect = updatedChoices.some((c) => c.isCorrect);
    if (updatedChoices.length > 0 && !hasCorrect) {
      updatedChoices[0].isCorrect = true;
    }

    updateData({
      ...localData,
      options: {
        ...localData.options,
        choices: updatedChoices,
      },
    });
  };

  const removeChoice = (index: number) => {
    const updatedChoices = choices
      .filter((_: any, i: number) => i !== index)
      .map(toChoiceOption);
    const hasCorrect = updatedChoices.some((c: any) => c.isCorrect);
    if (updatedChoices.length > 0 && !hasCorrect) {
      updatedChoices[0].isCorrect = true;
    }
    updateData({
      ...localData,
      options: {
        ...localData.options,
        choices: updatedChoices,
      },
    });
  };

  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
      <div className="d-flex justify-content-between align-items-center mb--20">
        <label className="mb--0">{t("admin.exam.choices")}</label>
        <button
          type="button"
          className="rbt-btn btn-sm btn-border-gradient"
          onClick={addChoice}
        >
          <i className="feather-plus me-1"></i>
          {t("admin.exam.addChoice")}
        </button>
      </div>

      {choices.length === 0 ? (
        <p className="text-muted text-center py--20">
          {t("admin.exam.noChoices")}
        </p>
      ) : (
        <div className="row g-3">
          {choices.map((choice: any, index: number) => (
            <div key={choice.id || index} className="col-12">
              <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                <div className="row g-3">
                  <div className="col-12">
                    <div className="form-group">
                      <Label htmlFor={`choice-text-${index}`}>
                        {t("admin.exam.choiceText")} {index + 1}
                      </Label>
                      <Input
                        id={`choice-text-${index}`}
                        value={choice.text || ""}
                        onChange={(e) => updateChoice(index, "text", e.target.value)}
                        placeholder={t("admin.exam.choiceText")}
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group d-flex gap-3 align-items-center">
                      <Checkbox
                        id={`correct-${index}`}
                        checked={choice.isCorrect || false}
                        onChange={(e) =>
                          updateChoice(index, "isCorrect", e.target.checked)
                        }
                        label={t("admin.exam.isCorrect")}
                      />
                      <button
                        type="button"
                        className="rbt-btn btn-sm btn-border ms-auto"
                        onClick={() => removeChoice(index)}
                      >
                        <i className="feather-trash-2 me-1"></i>
                        {t("common.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="row g-3 mt--20">
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="shuffleChoices"
              checked={localData.shuffleChoices ?? true}
              onChange={(e) =>
                updateData({ ...localData, shuffleChoices: e.target.checked })
              }
              label={t("admin.exam.shuffleChoices")}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="showFeedback"
              checked={localData.showFeedback ?? false}
              onChange={(e) =>
                updateData({ ...localData, showFeedback: e.target.checked })
              }
              label={t("admin.exam.showFeedback") || "Show Feedback"}
            />
          </div>
        </div>
      </div>

      <TemplateOptionalDetails>
        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultConfig={DEFAULT_SCORING_CONFIG}
        />
      </TemplateOptionalDetails>
    </div>
  );
}
