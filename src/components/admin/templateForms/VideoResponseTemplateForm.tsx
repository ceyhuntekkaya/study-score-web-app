"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import ScoringConfigForm from "./ScoringConfigForm";
import TemplateOptionalDetails from "./TemplateOptionalDetails";
import { TemplateFormProps } from "./types";

export default function VideoResponseTemplateForm({
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

  // Backend: criteria is string (evaluation criteria text), not array
  const criteriaStr = typeof localData.criteria === "string"
    ? localData.criteria
    : Array.isArray(localData.criteria)
      ? (localData.criteria as any[]).map((c) => (typeof c === "object" && c?.description != null ? c.description : String(c))).join("\n")
      : "";

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
            value={localData.minRecordingDuration ?? 10}
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
            max="1800"
            value={localData.maxRecordingDuration ?? 600}
            onChange={(e) =>
              updateData({ ...localData, maxRecordingDuration: parseInt(e.target.value) })
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
      <div className="col-md-4">
        <div className="form-group">
          <Label htmlFor="requiredQuality">
            {t("admin.exam.requiredQuality") || "Required Quality"}
          </Label>
          <Select
            id="requiredQuality"
            value={localData.requiredQuality || ""}
            onChange={(e) =>
              updateData({ ...localData, requiredQuality: e.target.value })
            }
          >
            <option value="">None</option>
            <option value="480p">480p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </Select>
        </div>
      </div>
      <div className="col-md-2">
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
      <div className="col-md-2">
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

    <div className="form-group mb--20">
      <Label htmlFor="criteria">
        {t("admin.exam.criteria") || "Grading Criteria (text)"}
      </Label>
      <Textarea
        id="criteria"
        value={criteriaStr}
        onChange={(e) =>
          updateData({ ...localData, criteria: e.target.value })
        }
        rows={4}
        className="form-control"
        placeholder="Sunum, Beden dili, İçerik (serbest metin)"
      />
    </div>

    <TemplateOptionalDetails>
      <ScoringConfigForm
        scoringConfig={localData.scoringConfig}
        onChange={(config) => updateData({ ...localData, scoringConfig: config })}
        defaultStrategy="MANUAL"
      />
    </TemplateOptionalDetails>
  </div>
);

}
