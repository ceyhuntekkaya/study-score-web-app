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

export default function ImageResponseTemplateForm({
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
          <Label htmlFor="maxFileSize">
            {t("admin.exam.maxFileSize") || "Max File Size (bytes)"}
          </Label>
          <Input
            id="maxFileSize"
            type="number"
            min="1"
            max="10485760"
            value={localData.maxFileSize ?? 5242880}
            onChange={(e) =>
              updateData({ ...localData, maxFileSize: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <Label htmlFor="allowedFormats">
            {t("admin.exam.allowedFormats") || "Allowed Formats (comma-separated)"}
          </Label>
          <Input
            id="allowedFormats"
            value={localData.allowedFormats || ""}
            onChange={(e) =>
              updateData({ ...localData, allowedFormats: e.target.value })
            }
            placeholder="JPG, PNG, PDF"
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
          <Checkbox
            id="allowMultipleImages"
            checked={localData.allowMultipleImages ?? false}
            onChange={(e) =>
              updateData({ ...localData, allowMultipleImages: e.target.checked })
            }
            label={t("admin.exam.allowMultipleImages") || "Allow Multiple Images"}
          />
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-group">
          <Label htmlFor="maxImages">
            {t("admin.exam.maxImages") || "Max Images"}
          </Label>
          <Input
            id="maxImages"
            type="number"
            min="1"
            max="10"
            value={localData.maxImages ?? 1}
            onChange={(e) =>
              updateData({ ...localData, maxImages: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <Label htmlFor="requiredResolution">
            {t("admin.exam.requiredResolution") || "Required Resolution (e.g., 1024x768)"}
          </Label>
          <Input
            id="requiredResolution"
            value={localData.requiredResolution || ""}
            onChange={(e) =>
              updateData({ ...localData, requiredResolution: e.target.value })
            }
            placeholder="1024x768"
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
        placeholder="Yaratıcılık, Netlik, Konuyla uyum (serbest metin)"
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
