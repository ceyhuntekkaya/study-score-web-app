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

  // Backend: rubrik and allowedFormats are strings; requiredTopics is string (optional)
  const rubrik = typeof localData.rubrik === "string" ? localData.rubrik : (localData.rubric ? (Array.isArray(localData.rubric) ? "" : String(localData.rubric)) : "");
  const allowedFormatsStr = typeof localData.allowedFormats === "string"
    ? localData.allowedFormats
    : Array.isArray(localData.allowedFormats)
      ? (localData.allowedFormats as string[]).join(",")
      : "HTML,MARKDOWN,PLAIN_TEXT";
  const requiredTopicsStr = typeof localData.requiredTopics === "string"
    ? localData.requiredTopics
    : Array.isArray(localData.requiredTopics)
      ? (localData.requiredTopics as string[]).join(", ")
      : "";

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

    <div className="form-group mb--20">
      <Label htmlFor="requiredTopics">
        {t("admin.exam.requiredTopics") || "Required Topics (optional, comma-separated)"}
      </Label>
      <Input
        id="requiredTopics"
        value={requiredTopicsStr}
        onChange={(e) =>
          updateData({ ...localData, requiredTopics: e.target.value })
        }
        placeholder="Topic 1, Topic 2"
      />
    </div>

    <div className="form-group mb--20">
      <Label htmlFor="rubrik">
        {t("admin.exam.rubric") || "Rubrik (evaluation criteria, text)"}
      </Label>
      <Textarea
        id="rubrik"
        value={rubrik}
        onChange={(e) =>
          updateData({ ...localData, rubrik: e.target.value })
        }
        rows={4}
        className="form-control"
        placeholder="İçerik 40%, Dil 30%, Organizasyon 30%"
      />
    </div>

    <div className="row g-3 mb--20">
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
            {t("admin.exam.allowedFormats") || "Allowed Formats (comma-separated)"}
          </Label>
          <Input
            id="allowedFormats"
            value={allowedFormatsStr}
            onChange={(e) =>
              updateData({ ...localData, allowedFormats: e.target.value })
            }
            placeholder="HTML,MARKDOWN,PLAIN_TEXT"
          />
        </div>
      </div>
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
