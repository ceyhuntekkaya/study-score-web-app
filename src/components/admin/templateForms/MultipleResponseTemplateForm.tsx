"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import ScoringConfigForm from "./ScoringConfigForm";
import { TemplateFormProps } from "./types";

export default function MultipleResponseTemplateForm({
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

  const choices = localData.options?.choices || [];

  const addChoice = () => {
    const newChoice = {
      id: `choice_${Date.now()}`,
      text: "",
      isCorrect: false,
      mediaUrl: "",
      mediaType: "",
    };
    updateData({
      ...localData,
      options: {
        ...localData.options,
        choices: [...choices, newChoice],
      },
      minSelections: localData.minSelections ?? 1,
      maxSelections: localData.maxSelections ?? 999,
      shuffleChoices: localData.shuffleChoices ?? true,
      showFeedback: localData.showFeedback ?? false,
      scoringConfig: localData.scoringConfig || {
        strategy: "PROPORTIONAL",
        allowPartialCredit: true,
        penaltyPerWrong: 0.25,
        roundScore: false,
        decimalPlaces: 2,
      },
    });
  };

  const updateChoice = (index: number, field: string, value: any) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = { ...updatedChoices[index], [field]: value };
    updateData({
      ...localData,
      options: {
        ...localData.options,
        choices: updatedChoices,
      },
    });
  };

  const removeChoice = (index: number) => {
    const updatedChoices = choices.filter((_: any, i: number) => i !== index);
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
      <div className="row g-3 mb--20">
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="minSelections">
              {t("admin.exam.minSelections") || "Min Selections"}
            </Label>
            <Input
              id="minSelections"
              type="number"
              min="1"
              value={localData.minSelections ?? 1}
              onChange={(e) =>
                updateData({ ...localData, minSelections: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="maxSelections">
              {t("admin.exam.maxSelections") || "Max Selections"}
            </Label>
            <Input
              id="maxSelections"
              type="number"
              min="1"
              value={localData.maxSelections ?? 999}
              onChange={(e) =>
                updateData({ ...localData, maxSelections: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

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
                  <div className="col-md-6">
                    <div className="form-group">
                      <Label htmlFor={`choice-mediaUrl-${index}`}>
                        {t("admin.exam.mediaUrl") || "Media URL"}
                      </Label>
                      <Input
                        id={`choice-mediaUrl-${index}`}
                        value={choice.mediaUrl || ""}
                        onChange={(e) => updateChoice(index, "mediaUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <Label htmlFor={`choice-mediaType-${index}`}>
                        {t("admin.exam.mediaType") || "Media Type"}
                      </Label>
                      <Select
                        id={`choice-mediaType-${index}`}
                        value={choice.mediaType || ""}
                        onChange={(e) => updateChoice(index, "mediaType", e.target.value)}
                      >
                        <option value="">None</option>
                        <option value="IMAGE">IMAGE</option>
                        <option value="VIDEO">VIDEO</option>
                        <option value="AUDIO">AUDIO</option>
                        <option value="DOCUMENT">DOCUMENT</option>
                        <option value="PDF">PDF</option>
                        <option value="TEXT">TEXT</option>
                        <option value="LINK">LINK</option>
                        <option value="OTHER">OTHER</option>
                      </Select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group d-flex align-items-center">
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

      <ScoringConfigForm
        scoringConfig={localData.scoringConfig}
        onChange={(config) => updateData({ ...localData, scoringConfig: config })}
        defaultStrategy="PROPORTIONAL"
      />
    </div>
  );
}
