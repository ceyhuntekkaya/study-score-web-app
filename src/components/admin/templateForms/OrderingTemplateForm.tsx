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

export default function OrderingTemplateForm({
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
const items = options.items || [];

const addItem = () => {
  const newItem = {
    id: `item_${Date.now()}`,
    text: "",
    correctPosition: items.length + 1,
    mediaUrl: "",
    mediaType: "",
  };
  updateData({
    ...localData,
    options: {
      ...options,
      items: [...items, newItem],
      orderingType: options.orderingType || "SEQUENTIAL",
    },
    shuffleItems: localData.shuffleItems ?? true,
    showFeedback: localData.showFeedback ?? false,
    scoringConfig: localData.scoringConfig || {
      strategy: "POSITION_BASED",
      allowPartialCredit: true,
      penaltyPerWrong: 0.0,
      roundScore: false,
      decimalPlaces: 2,
    },
  });
};

const updateItem = (index: number, field: string, value: any) => {
  const updated = [...items];
  updated[index] = { ...updated[index], [field]: value };
  updateData({
    ...localData,
    options: {
      ...options,
      items: updated,
    },
  });
};

const removeItem = (index: number) => {
  const updated = items.filter((_: any, i: number) => i !== index);
  updateData({
    ...localData,
    options: {
      ...options,
      items: updated,
    },
  });
};

return (
  <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
    <div className="form-group mb--20">
      <Label htmlFor="orderingType">
        {t("admin.exam.orderingType") || "Ordering Type"}
      </Label>
      <Select
        id="orderingType"
        value={options.orderingType || "SEQUENTIAL"}
        onChange={(e) =>
          updateData({
            ...localData,
            options: { ...options, orderingType: e.target.value },
          })
        }
      >
        <option value="SEQUENTIAL">SEQUENTIAL</option>
        <option value="CHRONOLOGICAL">CHRONOLOGICAL</option>
        <option value="PRIORITY">PRIORITY</option>
      </Select>
    </div>

    <div className="d-flex justify-content-between align-items-center mb--20">
      <label className="mb--0">{t("admin.exam.items") || "Items"}</label>
      <button
        type="button"
        className="rbt-btn btn-sm btn-border-gradient"
        onClick={addItem}
      >
        <i className="feather-plus me-1"></i>
        {t("admin.exam.addItem") || "Add Item"}
      </button>
    </div>

    {items.length === 0 ? (
      <p className="text-muted text-center py--20">
        {t("admin.exam.noItems") || "No items added"}
      </p>
    ) : (
      <div className="row g-3">
        {items.map((item: any, index: number) => (
          <div key={item.id || index} className="col-12">
            <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`item-text-${index}`}>
                      {t("admin.exam.itemText") || "Item Text"} {index + 1}
                    </Label>
                    <Input
                      id={`item-text-${index}`}
                      value={item.text || ""}
                      onChange={(e) => updateItem(index, "text", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <Label htmlFor={`item-position-${index}`}>
                      {t("admin.exam.correctPosition") || "Correct Position"}
                    </Label>
                    <Input
                      id={`item-position-${index}`}
                      type="number"
                      min="1"
                      value={item.correctPosition || index + 1}
                      onChange={(e) =>
                        updateItem(index, "correctPosition", parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <Label htmlFor={`item-media-${index}`}>
                      {t("admin.exam.mediaUrl") || "Media URL"}
                    </Label>
                    <Input
                      id={`item-media-${index}`}
                      value={item.mediaUrl || ""}
                      onChange={(e) => updateItem(index, "mediaUrl", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <button
                      type="button"
                      className="rbt-btn btn-sm btn-border"
                      onClick={() => removeItem(index)}
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
            id="shuffleItems"
            checked={localData.shuffleItems ?? true}
            onChange={(e) =>
              updateData({ ...localData, shuffleItems: e.target.checked })
            }
            label={t("admin.exam.shuffleItems") || "Shuffle Items"}
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

    <TemplateOptionalDetails>
      <ScoringConfigForm
        scoringConfig={localData.scoringConfig}
        onChange={(config) => updateData({ ...localData, scoringConfig: config })}
        defaultStrategy="POSITION_BASED"
      />
    </TemplateOptionalDetails>
  </div>
);

}
