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

export default function TrueFalseTemplateForm({
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

  const optionList = localData.optionList || {};

  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
      <div className="form-group mb--20">
        <Label htmlFor="questionText">{t("admin.exam.questionText") || "Question Text"}</Label>
        <Textarea
          id="questionText"
          value={optionList.questionText || ""}
          onChange={(e) =>
            updateData({
              ...localData,
              optionList: { ...optionList, questionText: e.target.value },
            })
          }
          rows={3}
          className="form-control"
        />
      </div>

      <div className="form-group mb--20">
        <Label htmlFor="correctAnswer">{t("admin.exam.correctAnswer")}</Label>
        <Select
          id="correctAnswer"
          value={optionList.correctAnswer === false ? "false" : "true"}
          onChange={(e) =>
            updateData({
              ...localData,
              optionList: { ...optionList, correctAnswer: e.target.value === "true" },
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
        </Select>
      </div>

      <div className="row g-3 mb--20">
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="trueLabel">{t("admin.exam.trueLabel") || "True Label"}</Label>
            <Input
              id="trueLabel"
              value={optionList.trueLabel || "True"}
              onChange={(e) =>
                updateData({
                  ...localData,
                  optionList: { ...optionList, trueLabel: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="falseLabel">{t("admin.exam.falseLabel") || "False Label"}</Label>
            <Input
              id="falseLabel"
              value={optionList.falseLabel || "False"}
              onChange={(e) =>
                updateData({
                  ...localData,
                  optionList: { ...optionList, falseLabel: e.target.value },
                })
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

      <ScoringConfigForm
        scoringConfig={localData.scoringConfig}
        onChange={(config) => updateData({ ...localData, scoringConfig: config })}
        defaultStrategy="BINARY"
      />
    </div>
  );
}
