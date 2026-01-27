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

export default function EssayTemplateForm({
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

  const rubric = localData.rubric || [];
  const requiredTopics = localData.requiredTopics || [];

const addRubricItem = () => {
  const newItem = {
    name: "",
    description: "",
    maxScore: 0,
    rubricLevel: "",
  };
  updateData({
    ...localData,
    prompt: localData.prompt || "",
    minWords: localData.minWords ?? 100,
    maxWords: localData.maxWords ?? 1000,
    requiredTopics,
    gradingType: localData.gradingType || "MANUAL",
    rubric: [...rubric, newItem],
    requireOutline: localData.requireOutline ?? false,
    allowedFormats: localData.allowedFormats || ["HTML", "MARKDOWN", "PLAIN_TEXT"],
    scoringConfig: localData.scoringConfig || {
      strategy: "MANUAL",
      allowPartialCredit: false,
      penaltyPerWrong: 0.0,
      roundScore: false,
      decimalPlaces: 2,
    },
  });
};

const updateRubricItem = (index: number, field: string, value: any) => {
  const updated = [...rubric];
  updated[index] = { ...updated[index], [field]: value };
  updateData({ ...localData, rubric: updated });
};

const removeRubricItem = (index: number) => {
  const updated = rubric.filter((_: any, i: number) => i !== index);
  updateData({ ...localData, rubric: updated });
};

const addRequiredTopic = () => {
  updateData({
    ...localData,
    requiredTopics: [...requiredTopics, ""],
  });
};

const updateRequiredTopic = (index: number, value: string) => {
  const updated = [...requiredTopics];
  updated[index] = value;
  updateData({ ...localData, requiredTopics: updated });
};

const removeRequiredTopic = (index: number) => {
  const updated = requiredTopics.filter((_: any, i: number) => i !== index);
  updateData({ ...localData, requiredTopics: updated });
};

return (
  <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
    <div className="form-group mb--20">
      <Label htmlFor="prompt">{t("admin.exam.prompt") || "Prompt"}</Label>
      <Textarea
        id="prompt"
        value={localData.prompt || ""}
        onChange={(e) => updateData({ ...localData, prompt: e.target.value })}
        rows={4}
        className="form-control"
      />
    </div>

    <div className="row g-3 mb--20">
      <div className="col-md-4">
        <div className="form-group">
          <Label htmlFor="minWords">
            {t("admin.exam.minWords") || "Min Words"}
          </Label>
          <Input
            id="minWords"
            type="number"
            min="1"
            value={localData.minWords ?? 100}
            onChange={(e) =>
              updateData({ ...localData, minWords: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-group">
          <Label htmlFor="maxWords">
            {t("admin.exam.maxWords") || "Max Words"}
          </Label>
          <Input
            id="maxWords"
            type="number"
            min="1"
            value={localData.maxWords ?? 1000}
            onChange={(e) =>
              updateData({ ...localData, maxWords: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="col-md-4">
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
    </div>

    <div className="d-flex justify-content-between align-items-center mb--20">
      <label className="mb--0">{t("admin.exam.requiredTopics") || "Required Topics"}</label>
      <button
        type="button"
        className="rbt-btn btn-sm btn-border-gradient"
        onClick={addRequiredTopic}
      >
        <i className="feather-plus me-1"></i>
        {t("admin.exam.addTopic") || "Add Topic"}
      </button>
    </div>

    {requiredTopics.map((topic: string, index: number) => (
      <div key={index} className="d-flex gap-2 mb--10">
        <Input
          value={topic}
          onChange={(e) => updateRequiredTopic(index, e.target.value)}
          placeholder={t("admin.exam.topic") || "Topic"}
        />
        <button
          type="button"
          className="rbt-btn btn-sm btn-border"
          onClick={() => removeRequiredTopic(index)}
        >
          <i className="feather-x"></i>
        </button>
      </div>
    ))}

    <div className="d-flex justify-content-between align-items-center mt--20 mb--20">
      <label className="mb--0">{t("admin.exam.rubric") || "Rubric"}</label>
      <button
        type="button"
        className="rbt-btn btn-sm btn-border-gradient"
        onClick={addRubricItem}
      >
        <i className="feather-plus me-1"></i>
        {t("admin.exam.addRubricItem") || "Add Rubric Item"}
      </button>
    </div>

    {rubric.map((item: any, index: number) => (
      <div key={index} className="rbt-card rbt-card-body mb--10" style={{ backgroundColor: '#ffffff' }}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="form-group">
              <Label htmlFor={`rubric-name-${index}`}>
                {t("admin.exam.name") || "Name"}
              </Label>
              <Input
                id={`rubric-name-${index}`}
                value={item.name || ""}
                onChange={(e) => updateRubricItem(index, "name", e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Label htmlFor={`rubric-maxScore-${index}`}>
                {t("admin.exam.maxScore") || "Max Score"}
              </Label>
              <Input
                id={`rubric-maxScore-${index}`}
                type="number"
                min="0"
                value={item.maxScore || 0}
                onChange={(e) =>
                  updateRubricItem(index, "maxScore", parseFloat(e.target.value))
                }
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Label htmlFor={`rubric-level-${index}`}>
                {t("admin.exam.rubricLevel") || "Level"}
              </Label>
              <Select
                id={`rubric-level-${index}`}
                value={item.rubricLevel || ""}
                onChange={(e) => updateRubricItem(index, "rubricLevel", e.target.value)}
              >
                <option value="">None</option>
                <option value="BASIC">BASIC</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </Select>
            </div>
          </div>
          <div className="col-12">
            <div className="form-group">
              <Label htmlFor={`rubric-desc-${index}`}>
                {t("admin.exam.description") || "Description"}
              </Label>
              <Textarea
                id={`rubric-desc-${index}`}
                value={item.description || ""}
                onChange={(e) => updateRubricItem(index, "description", e.target.value)}
                rows={2}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-12">
            <button
              type="button"
              className="rbt-btn btn-sm btn-border"
              onClick={() => removeRubricItem(index)}
            >
              <i className="feather-trash-2 me-1"></i>
              {t("common.delete")}
            </button>
          </div>
        </div>
      </div>
    ))}

    <div className="row g-3 mt--20">
      <div className="col-md-6">
        <div className="form-group">
          <Checkbox
            id="requireOutline"
            checked={localData.requireOutline ?? false}
            onChange={(e) =>
              updateData({ ...localData, requireOutline: e.target.checked })
            }
            label={t("admin.exam.requireOutline") || "Require Outline"}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <Label htmlFor="allowedFormats">
            {t("admin.exam.allowedFormats") || "Allowed Formats"}
          </Label>
          <Select
            id="allowedFormats"
            multiple
            value={localData.allowedFormats || ["HTML", "MARKDOWN", "PLAIN_TEXT"]}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) => option.value);
              updateData({ ...localData, allowedFormats: selected });
            }}
          >
            <option value="HTML">HTML</option>
            <option value="MARKDOWN">MARKDOWN</option>
            <option value="PLAIN_TEXT">PLAIN_TEXT</option>
          </Select>
        </div>
      </div>
    </div>

    <ScoringConfigForm
      scoringConfig={localData.scoringConfig}
      onChange={(config) => updateData({ ...localData, scoringConfig: config })}
      defaultStrategy="MANUAL"
    />
  </div>
);

}
