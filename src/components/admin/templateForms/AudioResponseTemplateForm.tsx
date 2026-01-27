"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import ScoringConfigForm from "./ScoringConfigForm";
import { TemplateFormProps } from "./types";

export default function AudioResponseTemplateForm({
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

  const criteria = localData.criteria || [];

const addCriterion = () => {
  const newCriterion = {
    name: "",
    description: "",
    maxScore: 0,
  };
  updateData({
    ...localData,
    prompt: localData.prompt || "",
    maxRecordingDuration: localData.maxRecordingDuration ?? 300,
    minRecordingDuration: localData.minRecordingDuration ?? 5,
    gradingType: localData.gradingType || "MANUAL",
    criteria: [...criteria, newCriterion],
    allowRetake: localData.allowRetake ?? true,
    maxRetakes: localData.maxRetakes ?? 3,
    scoringConfig: localData.scoringConfig || {
      strategy: "MANUAL",
      allowPartialCredit: false,
      penaltyPerWrong: 0.0,
      roundScore: false,
      decimalPlaces: 2,
    },
  });
};

const updateCriterion = (index: number, field: string, value: any) => {
  const updated = [...criteria];
  updated[index] = { ...updated[index], [field]: value };
  updateData({ ...localData, criteria: updated });
};

const removeCriterion = (index: number) => {
  const updated = criteria.filter((_: any, i: number) => i !== index);
  updateData({ ...localData, criteria: updated });
};

return (
  <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
    <div className="form-group mb--20">
      <Label htmlFor="prompt">
        {t("admin.exam.prompt") || "Prompt"} <span className="text-danger">*</span>
      </Label>
      <Textarea
        id="prompt"
        value={localData.prompt || ""}
        onChange={(e) => updateData({ ...localData, prompt: e.target.value })}
        rows={4}
        className="form-control"
      />
    </div>

    <div className="row g-3 mb--20">
      <div className="col-md-6">
        <div className="form-group">
          <Label htmlFor="minRecordingDuration">
            {t("admin.exam.minRecordingDuration") || "Min Duration (seconds)"}
          </Label>
          <Input
            id="minRecordingDuration"
            type="number"
            min="1"
            value={localData.minRecordingDuration ?? 5}
            onChange={(e) =>
              updateData({ ...localData, minRecordingDuration: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <Label htmlFor="maxRecordingDuration">
            {t("admin.exam.maxRecordingDuration") || "Max Duration (seconds)"}
          </Label>
          <Input
            id="maxRecordingDuration"
            type="number"
            min="1"
            max="600"
            value={localData.maxRecordingDuration ?? 300}
            onChange={(e) =>
              updateData({ ...localData, maxRecordingDuration: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <Label htmlFor="gradingType">
            {t("admin.exam.gradingType") || "Grading Type"}
          </Label>
          <Select
            id="gradingType"
            value={localData.gradingType || "MANUAL"}
            onChange={(e) =>
              updateData({ ...localData, gradingType: e.target.value })
            }
          >
            <option value="MANUAL">MANUAL</option>
            <option value="AI">AI</option>
            <option value="HYBRID">HYBRID</option>
          </Select>
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <Checkbox
            id="allowRetake"
            checked={localData.allowRetake ?? true}
            onChange={(e) =>
              updateData({ ...localData, allowRetake: e.target.checked })
            }
            label={t("admin.exam.allowRetake") || "Allow Retake"}
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <Label htmlFor="maxRetakes">
            {t("admin.exam.maxRetakes") || "Max Retakes"}
          </Label>
          <Input
            id="maxRetakes"
            type="number"
            min="0"
            value={localData.maxRetakes ?? 3}
            onChange={(e) =>
              updateData({ ...localData, maxRetakes: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
    </div>

    <div className="d-flex justify-content-between align-items-center mb--20">
      <label className="mb--0">{t("admin.exam.criteria") || "Grading Criteria"}</label>
      <button
        type="button"
        className="rbt-btn btn-sm btn-border-gradient"
        onClick={addCriterion}
      >
        <i className="feather-plus me-1"></i>
        {t("admin.exam.addCriterion") || "Add Criterion"}
      </button>
    </div>

    {criteria.map((item: any, index: number) => (
      <div key={index} className="rbt-card rbt-card-body mb--10" style={{ backgroundColor: '#ffffff' }}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="form-group">
              <Label htmlFor={`criterion-name-${index}`}>
                {t("admin.exam.name") || "Name"}
              </Label>
              <Input
                id={`criterion-name-${index}`}
                value={item.name || ""}
                onChange={(e) => updateCriterion(index, "name", e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Label htmlFor={`criterion-maxScore-${index}`}>
                {t("admin.exam.maxScore") || "Max Score"}
              </Label>
              <Input
                id={`criterion-maxScore-${index}`}
                type="number"
                min="0"
                value={item.maxScore || 0}
                onChange={(e) =>
                  updateCriterion(index, "maxScore", parseFloat(e.target.value))
                }
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Label htmlFor={`criterion-desc-${index}`}>
                {t("admin.exam.description") || "Description"}
              </Label>
              <Input
                id={`criterion-desc-${index}`}
                value={item.description || ""}
                onChange={(e) => updateCriterion(index, "description", e.target.value)}
              />
            </div>
          </div>
          <div className="col-12">
            <button
              type="button"
              className="rbt-btn btn-sm btn-border"
              onClick={() => removeCriterion(index)}
            >
              <i className="feather-trash-2 me-1"></i>
              {t("common.delete")}
            </button>
          </div>
        </div>
      </div>
    ))}

    <ScoringConfigForm
      scoringConfig={localData.scoringConfig}
      onChange={(config) => updateData({ ...localData, scoringConfig: config })}
      defaultStrategy="MANUAL"
    />
  </div>
);

}
