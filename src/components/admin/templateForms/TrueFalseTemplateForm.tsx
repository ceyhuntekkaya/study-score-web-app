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

export default function TrueFalseTemplateForm({
  templateData,
  onChange,
}: TemplateFormProps) {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<any>(templateData || {});

  useEffect(() => {
    const raw = templateData || {};
    const data = raw as Record<string, unknown>;
    // Backend uses flat fields; support legacy optionList shape when loading
    if (data.optionList && typeof data.optionList === "object") {
      const ol = data.optionList as Record<string, unknown>;
      setLocalData({
        ...data,
        questionText: ol.questionText ?? data.questionText ?? "",
        correctAnswer: ol.correctAnswer === false ? "false" : ol.correctAnswer === true ? "true" : (data.correctAnswer ?? ol.correctAnswer ?? "true"),
        trueLabel: ol.trueLabel ?? data.trueLabel ?? "True",
        falseLabel: ol.falseLabel ?? data.falseLabel ?? "False",
        notGivenLabel: ol.notGivenLabel ?? data.notGivenLabel ?? "Not Given",
      });
    } else {
      setLocalData(raw);
    }
  }, [templateData]);

  const updateData = (newData: any) => {
    setLocalData(newData);
    onChange(newData);
  };

  const questionText = localData.questionText ?? "";
  const correctAnswer = localData.correctAnswer ?? "true";
  const trueLabel = localData.trueLabel ?? "True";
  const falseLabel = localData.falseLabel ?? "False";
  const notGivenLabel = localData.notGivenLabel ?? "Not Given";

  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
      <div className="form-group mb--20">
        <Label htmlFor="questionText">{t("admin.exam.questionText") || "Question Text"}</Label>
        <Textarea
          id="questionText"
          value={questionText}
          onChange={(e) =>
            updateData({ ...localData, questionText: e.target.value })
          }
          rows={3}
          className="form-control"
        />
      </div>

      <div className="form-group mb--20">
        <Label htmlFor="correctAnswer">{t("admin.exam.correctAnswer")}</Label>
        <Select
          id="correctAnswer"
          value={correctAnswer}
          onChange={(e) =>
            updateData({
              ...localData,
              correctAnswer: e.target.value as "true" | "false" | "notGiven",
              showFeedback: localData.showFeedback ?? false,
              scoringConfig: localData.scoringConfig || {
                strategy: "BINARY",
                allowPartialCredit: false,
                penaltyPerWrong: 0.0,
                roundScore: false,
                decimalPlaces: 2,
              },
            })
          }
        >
          <option value="true">{t("admin.exam.true") || "True"}</option>
          <option value="false">{t("admin.exam.false") || "False"}</option>
          <option value="notGiven">{t("admin.exam.notGiven") || "Not Given"}</option>
        </Select>
      </div>

      <div className="row g-3 mb--20">
        <div className="col-md-4">
          <div className="form-group">
            <Label htmlFor="trueLabel">{t("admin.exam.trueLabel") || "True Label"}</Label>
            <Input
              id="trueLabel"
              value={trueLabel}
              onChange={(e) =>
                updateData({ ...localData, trueLabel: e.target.value })
              }
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <Label htmlFor="falseLabel">{t("admin.exam.falseLabel") || "False Label"}</Label>
            <Input
              id="falseLabel"
              value={falseLabel}
              onChange={(e) =>
                updateData({ ...localData, falseLabel: e.target.value })
              }
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <Label htmlFor="notGivenLabel">{t("admin.exam.notGivenLabel") || "Not Given Label"}</Label>
            <Input
              id="notGivenLabel"
              value={notGivenLabel}
              onChange={(e) =>
                updateData({ ...localData, notGivenLabel: e.target.value })
              }
            />
          </div>
        </div>
      </div>

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

      <TemplateOptionalDetails>
        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="BINARY"
        />
      </TemplateOptionalDetails>
    </div>
  );
}
