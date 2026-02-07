"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import ScoringConfigForm from "./ScoringConfigForm";
import TemplateOptionalDetails from "./TemplateOptionalDetails";
import { TemplateFormProps, OrderingTemplateData, OrderingItemTemplate } from "./types";

/** Returns Set of item texts that appear more than once (trimmed, non-empty). */
function getDuplicateItemTexts(items: { text?: string }[]): Set<string> {
  const seen = new Map<string, number>();
  for (const item of items) {
    const t = (item.text ?? "").trim();
    if (t) seen.set(t, (seen.get(t) ?? 0) + 1);
  }
  const duplicates = new Set<string>();
  seen.forEach((count, text) => {
    if (count > 1) duplicates.add(text);
  });
  return duplicates;
}

export default function OrderingTemplateForm({
  templateData,
  onChange,
}: TemplateFormProps) {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<any>(templateData || {});

  useEffect(() => {
    setLocalData(normalizePayload(templateData || {}));
  }, [templateData]);

  /** Strip item ids so saved payload matches OrderingItemTemplate (single source of truth). */
  const normalizePayload = (data: any): OrderingTemplateData => ({
    ...data,
    options: {
      ...data?.options,
      items: (data?.options?.items ?? []).map((item: any) => ({
        text: item.text ?? "",
        correctPosition: item.correctPosition ?? 0,
      })),
    },
  });

  const updateData = (newData: any) => {
    const normalized = normalizePayload(newData);
    setLocalData(normalized);
    onChange(normalized);
  };

  const options = localData.options || {};
  const items = options.items || [];

  const duplicateTexts = useMemo(() => getDuplicateItemTexts(items), [items]);
  const isItemTextDuplicate = (text: string) =>
    duplicateTexts.has((text ?? "").trim()) && (text ?? "").trim() !== "";

  const addItem = () => {
  const newItem: OrderingItemTemplate = {
    text: "",
    correctPosition: items.length + 1,
  };
  updateData({
    ...localData,
    options: {
      ...options,
      items: [...items, newItem],
    },
    orderingType: localData.orderingType || "SEQUENTIAL",
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
        value={localData.orderingType || "SEQUENTIAL"}
        onChange={(e) =>
          updateData({
            ...localData,
            orderingType: e.target.value,
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

    {duplicateTexts.size > 0 && (
      <div className="alert alert-warning mb--20" role="alert">
        <i className="feather-alert-triangle me-2" />
        {t("admin.exam.orderingDuplicateItemText") || "Aynı metne sahip birden fazla madde var. Sıralama için her madde metni benzersiz olmalıdır."}
      </div>
    )}

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
                      error={isItemTextDuplicate(item.text ?? "")}
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
