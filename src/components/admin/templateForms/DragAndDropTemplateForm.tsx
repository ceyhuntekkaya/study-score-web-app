"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import ScoringConfigForm from "./ScoringConfigForm";
import TemplateOptionalDetails from "./TemplateOptionalDetails";
import { TemplateFormProps } from "./types";

/** Item inside a drop zone (id + text). */
interface DragAndDropItem {
  id: string;
  text: string;
}

/** Drop zone: id, label, items. */
interface DropZone {
  id: string;
  label: string;
  items: DragAndDropItem[];
}

const defaultScoringConfig = {
  strategy: "PROPORTIONAL",
  allowPartialCredit: true,
  penaltyPerWrong: 0.0,
  roundScore: false,
  decimalPlaces: 2,
};

export default function DragAndDropTemplateForm({
  templateData,
  onChange,
}: TemplateFormProps) {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<{
    options?: { dropZones?: DropZone[] };
    layout?: string;
    shuffleItems?: boolean;
    scoringConfig?: typeof defaultScoringConfig;
  }>(templateData || {});

  useEffect(() => {
    setLocalData(templateData || {});
  }, [templateData]);

  const updateData = (newData: typeof localData) => {
    setLocalData(newData);
    onChange(newData);
  };

  const options = localData.options || {};
  const dropZones: DropZone[] = options.dropZones || [];

  /** Tüm zone'lardaki item ID'lerini toplar; her ID kaç kez geçiyorsa sayar. */
  const itemIdCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dropZones.forEach((zone) => {
      (zone.items || []).forEach((item) => {
        const id = (item.id || "").trim();
        if (id) counts[id] = (counts[id] || 0) + 1;
      });
    });
    return counts;
  }, [dropZones]);

  /** Bu item'ın ID'si başka bir item ile aynı mı? (Boş ID geçerli sayılmaz.) */
  const isItemIdDuplicate = (zoneIndex: number, itemIndex: number): boolean => {
    const id = (dropZones[zoneIndex]?.items?.[itemIndex]?.id || "").trim();
    if (!id) return false;
    return (itemIdCounts[id] || 0) > 1;
  };

  const hasAnyDuplicateItemIds = useMemo(
    () => Object.values(itemIdCounts).some((c) => c > 1),
    [itemIdCounts]
  );

  const addDropZone = () => {
    const newZone: DropZone = {
      id: `z_${Date.now()}`,
      label: "",
      items: [],
    };
    updateData({
      ...localData,
      options: {
        ...options,
        dropZones: [...dropZones, newZone],
      },
      layout: localData.layout || "VERTICAL",
      scoringConfig: localData.scoringConfig || defaultScoringConfig,
    });
  };

  const updateDropZone = (index: number, field: "id" | "label", value: string) => {
    const updated = [...dropZones];
    updated[index] = { ...updated[index], [field]: value };
    updateData({
      ...localData,
      options: { ...options, dropZones: updated },
    });
  };

  const removeDropZone = (index: number) => {
    const updated = dropZones.filter((_, i) => i !== index);
    updateData({
      ...localData,
      options: { ...options, dropZones: updated },
    });
  };

  const addItemToZone = (zoneIndex: number) => {
    const zone = dropZones[zoneIndex];
    const existingIds = new Set(
      dropZones.flatMap((z) => (z.items || []).map((i) => i.id))
    );
    let candidateId = `d_${Date.now()}`;
    while (existingIds.has(candidateId)) {
      candidateId = `d_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }
    const newItem: DragAndDropItem = {
      id: candidateId,
      text: "",
    };
    const updated = [...dropZones];
    updated[zoneIndex] = {
      ...zone,
      items: [...(zone.items || []), newItem],
    };
    updateData({
      ...localData,
      options: { ...options, dropZones: updated },
    });
  };

  const updateZoneItem = (
    zoneIndex: number,
    itemIndex: number,
    field: "id" | "text",
    value: string
  ) => {
    const updated = [...dropZones];
    const items = [...(updated[zoneIndex].items || [])];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    updated[zoneIndex] = { ...updated[zoneIndex], items };
    updateData({
      ...localData,
      options: { ...options, dropZones: updated },
    });
  };

  const removeZoneItem = (zoneIndex: number, itemIndex: number) => {
    const updated = [...dropZones];
    const items = (updated[zoneIndex].items || []).filter((_, i) => i !== itemIndex);
    updated[zoneIndex] = { ...updated[zoneIndex], items };
    updateData({
      ...localData,
      options: { ...options, dropZones: updated },
    });
  };

  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: "#f9fafb" }}>
      <div className="form-group mb--20">
        <Label htmlFor="layout">{t("admin.exam.layout") || "Layout"}</Label>
        <Select
          id="layout"
          value={localData.layout || "VERTICAL"}
          onChange={(e) => updateData({ ...localData, layout: e.target.value })}
        >
          <option value="VERTICAL">VERTICAL</option>
          <option value="HORIZONTAL">HORIZONTAL</option>
          <option value="GRID">GRID</option>
          <option value="CUSTOM">CUSTOM</option>
        </Select>
      </div>

      <div className="d-flex justify-content-between align-items-center mb--20">
        <label className="mb--0">{t("admin.exam.dropZones") || "Drop Zones"}</label>
        <button
          type="button"
          className="rbt-btn btn-sm btn-border-gradient"
          onClick={addDropZone}
        >
          <i className="feather-plus me-1"></i>
          {t("admin.exam.addZone") || "Add Zone"}
        </button>
      </div>

      {hasAnyDuplicateItemIds && (
        <div
          className="mb--20"
          style={{
            padding: "10px 14px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#b91c1c",
            fontSize: "14px",
          }}
        >
          <i className="feather-alert-circle me-2"></i>
          {t("admin.exam.uniqueItemIdsRequired") ||
            "Each item ID must be unique across all zones. Please fix duplicate IDs."}
        </div>
      )}

      {dropZones.length === 0 ? (
        <p className="text-muted text-center py--20">
          {t("admin.exam.noZones") || "No zones added. Add at least one drop zone with at least one item."}
        </p>
      ) : (
        <div className="row g-3 mb--20">
          {dropZones.map((zone, zoneIndex) => (
            <div key={zone.id || zoneIndex} className="col-12">
              <div className="rbt-card rbt-card-body" style={{ backgroundColor: "#ffffff" }}>
                <div className="d-flex justify-content-between align-items-center mb--15">
                  <label className="mb--0">
                    {t("admin.exam.zone") || "Zone"} {zoneIndex + 1}
                  </label>
                  <button
                    type="button"
                    className="rbt-btn btn-sm btn-border"
                    onClick={() => removeDropZone(zoneIndex)}
                  >
                    <i className="feather-trash-2 me-1"></i>
                    {t("common.delete")}
                  </button>
                </div>
                <div className="row g-3 mb--15">
                  <div className="col-md-6">
                    <div className="form-group">
                      <Label htmlFor={`zone-id-${zoneIndex}`}>
                        {t("admin.exam.zoneId") || "Zone ID"}
                      </Label>
                      <Input
                        id={`zone-id-${zoneIndex}`}
                        value={zone.id || ""}
                        onChange={(e) => updateDropZone(zoneIndex, "id", e.target.value)}
                        placeholder="z1"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <Label htmlFor={`zone-label-${zoneIndex}`}>
                        {t("admin.exam.label") || "Label"}
                      </Label>
                      <Input
                        id={`zone-label-${zoneIndex}`}
                        value={zone.label || ""}
                        onChange={(e) => updateDropZone(zoneIndex, "label", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb--10">
                  <Label className="mb--0">
                    {t("admin.exam.items") || "Items"} (correct answers for this zone)
                  </Label>
                  <button
                    type="button"
                    className="rbt-btn btn-sm btn-border"
                    onClick={() => addItemToZone(zoneIndex)}
                  >
                    <i className="feather-plus me-1"></i>
                    {t("admin.exam.addItem") || "Add Item"}
                  </button>
                </div>
                {(!zone.items || zone.items.length === 0) ? (
                  <p className="text-muted small mb--0">
                    {t("admin.exam.noItems") || "No items. Add at least one item."}
                  </p>
                ) : (
                  <div className="row g-2">
                    {zone.items.map((item, itemIndex) => (
                      <div key={item.id || itemIndex} className="col-12">
                        <div
                          className="d-flex gap-2 align-items-center"
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "6px",
                          }}
                        >
                          <div style={{ maxWidth: "120px" }}>
                            <Input
                              placeholder="ID (e.g. d1)"
                              value={item.id || ""}
                              onChange={(e) =>
                                updateZoneItem(zoneIndex, itemIndex, "id", e.target.value)
                              }
                              style={{
                                maxWidth: "100%",
                                borderColor: isItemIdDuplicate(zoneIndex, itemIndex)
                                  ? "#dc2626"
                                  : undefined,
                              }}
                            />
                            {isItemIdDuplicate(zoneIndex, itemIndex) && (
                              <span
                                className="small"
                                style={{ color: "#dc2626", display: "block", marginTop: "4px" }}
                              >
                                {t("admin.exam.duplicateItemId") || "Duplicate ID"}
                              </span>
                            )}
                          </div>
                          <Input
                            placeholder={t("admin.exam.text") || "Text"}
                            value={item.text || ""}
                            onChange={(e) =>
                              updateZoneItem(zoneIndex, itemIndex, "text", e.target.value)
                            }
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            className="rbt-btn btn-sm btn-border"
                            onClick={() => removeZoneItem(zoneIndex, itemIndex)}
                          >
                            <i className="feather-x"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
