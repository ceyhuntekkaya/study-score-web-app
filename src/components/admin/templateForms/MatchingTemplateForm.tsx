"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import ScoringConfigForm from "./ScoringConfigForm";
import TemplateOptionalDetails from "./TemplateOptionalDetails";
import { TemplateFormProps } from "./types";

export default function MatchingTemplateForm({
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
  const pairs = options.pairs || [];

  const addPair = () => {
    const newPair = { leftText: "", rightText: "" };
    updateData({
      ...localData,
      options: { pairs: [...pairs, newPair] },
      scoringConfig: localData.scoringConfig || {
        strategy: "PROPORTIONAL",
        allowPartialCredit: true,
        penaltyPerWrong: 0.0,
        roundScore: false,
        decimalPlaces: 2,
      },
    });
  };

  const updatePair = (index: number, field: "leftText" | "rightText", value: string) => {
    const updated = [...pairs];
    updated[index] = { ...(updated[index] || { leftText: "", rightText: "" }), [field]: value };
    updateData({
      ...localData,
      options: { pairs: updated },
    });
  };

  const removePair = (index: number) => {
    const updated = pairs.filter((_: unknown, i: number) => i !== index);
    updateData({
      ...localData,
      options: { pairs: updated },
    });
  };

  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
      <div className="d-flex justify-content-between align-items-center mb--20">
      <label className="mb--0">{t("admin.exam.matchingPairs") || "Matching Pairs"}</label>
      <button
        type="button"
        className="rbt-btn btn-sm btn-border-gradient"
        onClick={addPair}
      >
        <i className="feather-plus me-1"></i>
        {t("admin.exam.addPair") || "Add Pair"}
      </button>
    </div>

    {pairs.length === 0 ? (
      <p className="text-muted text-center py--20">
        {t("admin.exam.noPairs") || "No pairs added"}
      </p>
    ) : (
      <div className="row g-3">
        {pairs.map((pair: any, index: number) => (
          <div key={index} className="col-12">
            <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
              <div className="d-flex justify-content-between align-items-center mb--15">
                <label className="mb--0">
                  {t("admin.exam.pair") || "Pair"} {index + 1}
                </label>
                <button
                  type="button"
                  className="rbt-btn btn-sm btn-border"
                  onClick={() => removePair(index)}
                >
                  <i className="feather-trash-2 me-1"></i>
                  {t("common.delete")}
                </button>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`left-text-${index}`}>
                      {t("admin.exam.leftText") || "Left Text"}
                    </Label>
                    <Input
                      id={`left-text-${index}`}
                      value={pair.leftText || ""}
                      onChange={(e) => updatePair(index, "leftText", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`right-text-${index}`}>
                      {t("admin.exam.rightText") || "Right Text"}
                    </Label>
                    <Input
                      id={`right-text-${index}`}
                      value={pair.rightText || ""}
                      onChange={(e) => updatePair(index, "rightText", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

      <TemplateOptionalDetails>
      <ScoringConfigForm
        scoringConfig={localData.scoringConfig}
        onChange={(config) => updateData({ ...localData, scoringConfig: config })}
        defaultStrategy="PROPORTIONAL"
      />
    </TemplateOptionalDetails>
  </div>
);

}
