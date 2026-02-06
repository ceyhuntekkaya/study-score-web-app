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
const distractors = options.distractors || [];

const addPair = () => {
  const newPair = {
    leftId: `left_${Date.now()}`,
    leftText: "",
    leftMediaUrl: "",
    rightId: `right_${Date.now()}`,
    rightText: "",
    rightMediaUrl: "",
    feedback: "",
    scorePercentage: 1.0,
  };
  updateData({
    ...localData,
    options: {
      ...options,
      pairs: [...pairs, newPair],
      matchingType: options.matchingType || "ONE_TO_ONE",
    },
    shuffleLeftItems: localData.shuffleLeftItems ?? true,
    shuffleRightItems: localData.shuffleRightItems ?? true,
    showFeedback: localData.showFeedback ?? false,
    scoringConfig: localData.scoringConfig || {
      strategy: "PROPORTIONAL",
      allowPartialCredit: true,
      penaltyPerWrong: 0.0,
      roundScore: false,
      decimalPlaces: 2,
    },
  });
};

const updatePair = (index: number, field: string, value: any) => {
  const updated = [...pairs];
  updated[index] = { ...updated[index], [field]: value };
  updateData({
    ...localData,
    options: {
      ...options,
      pairs: updated,
    },
  });
};

const removePair = (index: number) => {
  const updated = pairs.filter((_: any, i: number) => i !== index);
  updateData({
    ...localData,
    options: {
      ...options,
      pairs: updated,
    },
  });
};

const addDistractor = () => {
  const newDistractor = {
    id: `distractor_${Date.now()}`,
    text: "",
    mediaUrl: "",
    side: "LEFT",
  };
  updateData({
    ...localData,
    options: {
      ...options,
      distractors: [...distractors, newDistractor],
    },
  });
};

const updateDistractor = (index: number, field: string, value: any) => {
  const updated = [...distractors];
  updated[index] = { ...updated[index], [field]: value };
  updateData({
    ...localData,
    options: {
      ...options,
      distractors: updated,
    },
  });
};

const removeDistractor = (index: number) => {
  const updated = distractors.filter((_: any, i: number) => i !== index);
  updateData({
    ...localData,
    options: {
      ...options,
      distractors: updated,
    },
  });
};

return (
  <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
    <div className="form-group mb--20">
      <Label htmlFor="matchingType">
        {t("admin.exam.matchingType") || "Matching Type"}
      </Label>
      <Select
        id="matchingType"
        value={options.matchingType || "ONE_TO_ONE"}
        onChange={(e) =>
          updateData({
            ...localData,
            options: { ...options, matchingType: e.target.value },
          })
        }
      >
        <option value="ONE_TO_ONE">ONE_TO_ONE</option>
        <option value="MANY_TO_ONE">MANY_TO_ONE</option>
      </Select>
    </div>

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
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`left-media-${index}`}>
                      {t("admin.exam.leftMediaUrl") || "Left Media URL"}
                    </Label>
                    <Input
                      id={`left-media-${index}`}
                      value={pair.leftMediaUrl || ""}
                      onChange={(e) => updatePair(index, "leftMediaUrl", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`right-media-${index}`}>
                      {t("admin.exam.rightMediaUrl") || "Right Media URL"}
                    </Label>
                    <Input
                      id={`right-media-${index}`}
                      value={pair.rightMediaUrl || ""}
                      onChange={(e) => updatePair(index, "rightMediaUrl", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`pair-feedback-${index}`}>
                      {t("admin.exam.feedback") || "Feedback"}
                    </Label>
                    <Input
                      id={`pair-feedback-${index}`}
                      value={pair.feedback || ""}
                      onChange={(e) => updatePair(index, "feedback", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`pair-score-${index}`}>
                      {t("admin.exam.scorePercentage") || "Score %"}
                    </Label>
                    <Input
                      id={`pair-score-${index}`}
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={pair.scorePercentage || 1.0}
                      onChange={(e) =>
                        updatePair(index, "scorePercentage", parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    <div className="d-flex justify-content-between align-items-center mt--20 mb--20">
      <label className="mb--0">{t("admin.exam.distractors") || "Distractors"}</label>
      <button
        type="button"
        className="rbt-btn btn-sm btn-border-gradient"
        onClick={addDistractor}
      >
        <i className="feather-plus me-1"></i>
        {t("admin.exam.addDistractor") || "Add Distractor"}
      </button>
    </div>

    {distractors.length > 0 && (
      <div className="row g-3">
        {distractors.map((distractor: any, index: number) => (
          <div key={index} className="col-12">
            <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <Label htmlFor={`distractor-text-${index}`}>
                      {t("admin.exam.text") || "Text"}
                    </Label>
                    <Input
                      id={`distractor-text-${index}`}
                      value={distractor.text || ""}
                      onChange={(e) => updateDistractor(index, "text", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <Label htmlFor={`distractor-side-${index}`}>
                      {t("admin.exam.side") || "Side"}
                    </Label>
                    <Select
                      id={`distractor-side-${index}`}
                      value={distractor.side || "LEFT"}
                      onChange={(e) => updateDistractor(index, "side", e.target.value)}
                    >
                      <option value="LEFT">LEFT</option>
                      <option value="RIGHT">RIGHT</option>
                      <option value="BOTH">BOTH</option>
                    </Select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <Label htmlFor={`distractor-media-${index}`}>
                      {t("admin.exam.mediaUrl") || "Media URL"}
                    </Label>
                    <div className="d-flex gap-2">
                      <Input
                        id={`distractor-media-${index}`}
                        value={distractor.mediaUrl || ""}
                        onChange={(e) => updateDistractor(index, "mediaUrl", e.target.value)}
                      />
                      <button
                        type="button"
                        className="rbt-btn btn-sm btn-border"
                        onClick={() => removeDistractor(index)}
                      >
                        <i className="feather-trash-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    <div className="row g-3 mt--20">
      <div className="col-md-4">
        <div className="form-group">
          <Checkbox
            id="shuffleLeftItems"
            checked={localData.shuffleLeftItems ?? true}
            onChange={(e) =>
              updateData({ ...localData, shuffleLeftItems: e.target.checked })
            }
            label={t("admin.exam.shuffleLeftItems") || "Shuffle Left Items"}
          />
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-group">
          <Checkbox
            id="shuffleRightItems"
            checked={localData.shuffleRightItems ?? true}
            onChange={(e) =>
              updateData({ ...localData, shuffleRightItems: e.target.checked })
            }
            label={t("admin.exam.shuffleRightItems") || "Shuffle Right Items"}
          />
        </div>
      </div>
      <div className="col-md-4">
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
        defaultStrategy="PROPORTIONAL"
      />
    </TemplateOptionalDetails>
  </div>
);

}
