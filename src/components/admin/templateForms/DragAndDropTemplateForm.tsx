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

export default function DragAndDropTemplateForm({
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
const draggableItems = options.draggableItems || [];
const dropZones = options.dropZones || [];

  // Backend: correctZones is DropZone[] (array of objects), not string[]
  const normalizeCorrectZones = (zones: any[], dropZonesList: any[]) => {
    if (!Array.isArray(zones)) return [];
    return zones.map((z) => {
      if (typeof z === "object" && z !== null && "id" in z)
        return { id: z.id, label: z.label ?? "", maxItems: z.maxItems ?? 1, feedback: z.feedback ?? null, position: z.position ?? null };
      const id = String(z);
      const found = dropZonesList.find((d) => d.id === id);
      return found
        ? { id: found.id, label: found.label ?? "", maxItems: found.maxItems ?? 1, feedback: found.feedback ?? null, position: found.position ?? null }
        : { id, label: "", maxItems: 1, feedback: null, position: null };
    });
  };

const addDraggableItem = () => {
  const newItem = {
    id: `item_${Date.now()}`,
    text: "",
    mediaUrl: null,
    mediaType: null,
    correctZones: [] as Array<{ id: string; label: string; maxItems: number; feedback: string | null; position: string | null }>,
  };
  updateData({
    ...localData,
    options: {
      ...options,
      draggableItems: [...draggableItems, newItem],
    },
    layout: localData.layout || "VERTICAL",
    shuffleItems: localData.shuffleItems ?? true,
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

const updateDraggableItem = (index: number, field: string, value: any) => {
  const updated = [...draggableItems];
  updated[index] = { ...updated[index], [field]: value };
  updateData({
    ...localData,
    options: {
      ...options,
      draggableItems: updated,
    },
  });
};

const removeDraggableItem = (index: number) => {
  const updated = draggableItems.filter((_: any, i: number) => i !== index);
  updateData({
    ...localData,
    options: {
      ...options,
      draggableItems: updated,
    },
  });
};

const addDropZone = () => {
  const newZone = {
    id: `zone_${Date.now()}`,
    label: "",
    maxItems: 1,
    feedback: null as string | null,
    position: null as string | null,
  };
  updateData({
    ...localData,
    options: {
      ...options,
      dropZones: [...dropZones, newZone],
    },
  });
};

const updateDropZone = (index: number, field: string, value: any) => {
  const updated = [...dropZones];
  updated[index] = { ...updated[index], [field]: value };
  updateData({
    ...localData,
    options: {
      ...options,
      dropZones: updated,
    },
  });
};

const removeDropZone = (index: number) => {
  const updated = dropZones.filter((_: any, i: number) => i !== index);
  updateData({
    ...localData,
    options: {
      ...options,
      dropZones: updated,
    },
  });
};

return (
  <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
    <div className="form-group mb--20">
      <Label htmlFor="layout">
        {t("admin.exam.layout") || "Layout"}
      </Label>
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
      <label className="mb--0">{t("admin.exam.draggableItems") || "Draggable Items"}</label>
      <button
        type="button"
        className="rbt-btn btn-sm btn-border-gradient"
        onClick={addDraggableItem}
      >
        <i className="feather-plus me-1"></i>
        {t("admin.exam.addItem") || "Add Item"}
      </button>
    </div>

    {draggableItems.length === 0 ? (
      <p className="text-muted text-center py--20">
        {t("admin.exam.noItems") || "No items added"}
      </p>
    ) : (
      <div className="row g-3 mb--20">
        {draggableItems.map((item: any, index: number) => (
          <div key={item.id || index} className="col-12">
            <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
              <div className="d-flex justify-content-between align-items-center mb--15">
                <label className="mb--0">
                  {t("admin.exam.item") || "Item"} {index + 1}
                </label>
                <button
                  type="button"
                  className="rbt-btn btn-sm btn-border"
                  onClick={() => removeDraggableItem(index)}
                >
                  <i className="feather-trash-2 me-1"></i>
                  {t("common.delete")}
                </button>
              </div>
              <div className="row g-3">
                <div className="col-12">
                  <div className="form-group">
                    <Label htmlFor={`drag-text-${index}`}>
                      {t("admin.exam.text") || "Text"}
                    </Label>
                    <Input
                      id={`drag-text-${index}`}
                      value={item.text || ""}
                      onChange={(e) => updateDraggableItem(index, "text", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`drag-mediaUrl-${index}`}>
                      {t("admin.exam.mediaUrl") || "Media URL"}
                    </Label>
                    <Input
                      id={`drag-mediaUrl-${index}`}
                      value={item.mediaUrl || ""}
                      onChange={(e) => updateDraggableItem(index, "mediaUrl", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`drag-mediaType-${index}`}>
                      {t("admin.exam.mediaType") || "Media Type"}
                    </Label>
                    <Select
                      id={`drag-mediaType-${index}`}
                      value={item.mediaType || ""}
                      onChange={(e) => updateDraggableItem(index, "mediaType", e.target.value)}
                    >
                      <option value="">None</option>
                      <option value="IMAGE">IMAGE</option>
                      <option value="VIDEO">VIDEO</option>
                      <option value="AUDIO">AUDIO</option>
                      <option value="DOCUMENT">DOCUMENT</option>
                      <option value="PDF">PDF</option>
                      <option value="TEXT">TEXT</option>
                      <option value="LINK">LINK</option>
                      <option value="OTHER">OTHER</option>
                    </Select>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <Label>{t("admin.exam.correctZones") || "Correct drop zones for this item"}</Label>
                    <div className="d-flex flex-wrap gap-2 mt--10">
                      {dropZones.map((zone: any, zIndex: number) => {
                        const correctZonesList = Array.isArray(item.correctZones)
                          ? item.correctZones.some((cz: any) => (typeof cz === "object" ? cz.id : cz) === zone.id)
                          : false;
                        const isChecked = !!correctZonesList;
                        const toggleZone = () => {
                          const current = Array.isArray(item.correctZones)
                            ? normalizeCorrectZones(item.correctZones, dropZones)
                            : [];
                          const zoneObj = { id: zone.id, label: zone.label ?? "", maxItems: zone.maxItems ?? 1, feedback: zone.feedback ?? null, position: zone.position ?? null };
                          if (current.some((c) => c.id === zone.id)) {
                            updateDraggableItem(index, "correctZones", current.filter((c) => c.id !== zone.id));
                          } else {
                            updateDraggableItem(index, "correctZones", [...current, zoneObj]);
                          }
                        };
                        return (
                          <label key={zone.id || zIndex} className="d-flex align-items-center gap-1 me-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={toggleZone}
                            />
                            <span>{zone.label || zone.id || `Zone ${zIndex + 1}`}</span>
                          </label>
                        );
                      })}
                      {dropZones.length === 0 && (
                        <span className="text-muted">{t("admin.exam.addZoneFirst") || "Add drop zones below first."}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

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

    {dropZones.length === 0 ? (
      <p className="text-muted text-center py--20">
        {t("admin.exam.noZones") || "No zones added"}
      </p>
    ) : (
      <div className="row g-3 mb--20">
        {dropZones.map((zone: any, index: number) => (
          <div key={zone.id || index} className="col-12">
            <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
              <div className="d-flex justify-content-between align-items-center mb--15">
                <label className="mb--0">
                  {t("admin.exam.zone") || "Zone"} {index + 1}
                </label>
                <button
                  type="button"
                  className="rbt-btn btn-sm btn-border"
                  onClick={() => removeDropZone(index)}
                >
                  <i className="feather-trash-2 me-1"></i>
                  {t("common.delete")}
                </button>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`zone-id-${index}`}>
                      {t("admin.exam.zoneId") || "Zone ID"}
                    </Label>
                    <Input
                      id={`zone-id-${index}`}
                      value={zone.id || ""}
                      onChange={(e) => updateDropZone(index, "id", e.target.value)}
                      placeholder="zone_1"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`zone-label-${index}`}>
                      {t("admin.exam.label") || "Label"}
                    </Label>
                    <Input
                      id={`zone-label-${index}`}
                      value={zone.label || ""}
                      onChange={(e) => updateDropZone(index, "label", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`zone-maxItems-${index}`}>
                      {t("admin.exam.maxItems") || "Max Items"}
                    </Label>
                    <Input
                      id={`zone-maxItems-${index}`}
                      type="number"
                      min="1"
                      value={zone.maxItems || 1}
                      onChange={(e) => updateDropZone(index, "maxItems", parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`zone-feedback-${index}`}>
                      {t("admin.exam.feedback") || "Feedback"}
                    </Label>
                    <Input
                      id={`zone-feedback-${index}`}
                      value={zone.feedback || ""}
                      onChange={(e) => updateDropZone(index, "feedback", e.target.value)}
                    />
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
        defaultStrategy="PROPORTIONAL"
      />
    </TemplateOptionalDetails>
  </div>
);

}
