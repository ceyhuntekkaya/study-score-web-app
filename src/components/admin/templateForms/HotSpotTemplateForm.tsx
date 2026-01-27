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

export default function HotSpotTemplateForm({
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
const hotSpots = options.hotSpots || [];

const addHotSpot = () => {
  const newSpot = {
    id: `spot_${Date.now()}`,
    shape: "RECTANGLE",
    coordinates: "",
    isCorrect: false,
    label: "",
  };
  updateData({
    ...localData,
    imageUrl: localData.imageUrl || "",
    options: {
      ...options,
      backgroundImageUrl: options.backgroundImageUrl || "",
      hotSpots: [...hotSpots, newSpot],
      selectionType: options.selectionType || "CLICK",
    },
    maxSelections: localData.maxSelections ?? 1,
    allowMultipleSpots: localData.allowMultipleSpots ?? false,
    scoringConfig: localData.scoringConfig || {
      strategy: "BINARY",
      allowPartialCredit: false,
      penaltyPerWrong: 0.0,
      roundScore: false,
      decimalPlaces: 2,
    },
  });
};

const updateHotSpot = (index: number, field: string, value: any) => {
  const updated = [...hotSpots];
  updated[index] = { ...updated[index], [field]: value };
  updateData({
    ...localData,
    options: {
      ...options,
      hotSpots: updated,
    },
  });
};

const removeHotSpot = (index: number) => {
  const updated = hotSpots.filter((_: any, i: number) => i !== index);
  updateData({
    ...localData,
    options: {
      ...options,
      hotSpots: updated,
    },
  });
};

return (
  <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
    <div className="form-group mb--20">
      <Label htmlFor="imageUrl">
        {t("admin.exam.imageUrl") || "Image URL"} <span className="text-danger">*</span>
      </Label>
      <Input
        id="imageUrl"
        value={localData.imageUrl || ""}
        onChange={(e) => updateData({ ...localData, imageUrl: e.target.value })}
        placeholder="https://example.com/image.jpg"
      />
    </div>

    <div className="form-group mb--20">
      <Label htmlFor="backgroundImageUrl">
        {t("admin.exam.backgroundImageUrl") || "Background Image URL"}
      </Label>
      <Input
        id="backgroundImageUrl"
        value={options.backgroundImageUrl || ""}
        onChange={(e) =>
          updateData({
            ...localData,
            options: { ...options, backgroundImageUrl: e.target.value },
          })
        }
        placeholder="https://example.com/image.jpg"
      />
    </div>

    <div className="row g-3 mb--20">
      <div className="col-md-6">
        <div className="form-group">
          <Label htmlFor="selectionType">
            {t("admin.exam.selectionType") || "Selection Type"}
          </Label>
          <Select
            id="selectionType"
            value={options.selectionType || "CLICK"}
            onChange={(e) =>
              updateData({
                ...localData,
                options: { ...options, selectionType: e.target.value },
              })
            }
          >
            <option value="CLICK">CLICK</option>
            <option value="DRAG_RECTANGLE">DRAG_RECTANGLE</option>
          </Select>
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <Label htmlFor="maxSelections">
            {t("admin.exam.maxSelections") || "Max Selections"}
          </Label>
          <Input
            id="maxSelections"
            type="number"
            min="1"
            value={localData.maxSelections ?? 1}
            onChange={(e) =>
              updateData({ ...localData, maxSelections: parseInt(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <Checkbox
            id="allowMultipleSpots"
            checked={localData.allowMultipleSpots ?? false}
            onChange={(e) =>
              updateData({ ...localData, allowMultipleSpots: e.target.checked })
            }
            label={t("admin.exam.allowMultipleSpots") || "Allow Multiple Spots"}
          />
        </div>
      </div>
    </div>

    <div className="d-flex justify-content-between align-items-center mb--20">
      <label className="mb--0">{t("admin.exam.hotSpots") || "Hot Spots"}</label>
      <button
        type="button"
        className="rbt-btn btn-sm btn-border-gradient"
        onClick={addHotSpot}
      >
        <i className="feather-plus me-1"></i>
        {t("admin.exam.addHotSpot") || "Add Hot Spot"}
      </button>
    </div>

    {hotSpots.length === 0 ? (
      <p className="text-muted text-center py--20">
        {t("admin.exam.noHotSpots") || "No hot spots added"}
      </p>
    ) : (
      <div className="row g-3">
        {hotSpots.map((spot: any, index: number) => (
          <div key={spot.id || index} className="col-12">
            <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
              <div className="d-flex justify-content-between align-items-center mb--15">
                <label className="mb--0">
                  {t("admin.exam.hotSpot") || "Hot Spot"} {index + 1}
                </label>
                <button
                  type="button"
                  className="rbt-btn btn-sm btn-border"
                  onClick={() => removeHotSpot(index)}
                >
                  <i className="feather-trash-2 me-1"></i>
                  {t("common.delete")}
                </button>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`spot-shape-${index}`}>
                      {t("admin.exam.shape") || "Shape"}
                    </Label>
                    <Select
                      id={`spot-shape-${index}`}
                      value={spot.shape || "RECTANGLE"}
                      onChange={(e) => updateHotSpot(index, "shape", e.target.value)}
                    >
                      <option value="RECTANGLE">RECTANGLE</option>
                      <option value="CIRCLE">CIRCLE</option>
                      <option value="POLYGON">POLYGON</option>
                    </Select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <Label htmlFor={`spot-label-${index}`}>
                      {t("admin.exam.label") || "Label"}
                    </Label>
                    <Input
                      id={`spot-label-${index}`}
                      value={spot.label || ""}
                      onChange={(e) => updateHotSpot(index, "label", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <Label htmlFor={`spot-coordinates-${index}`}>
                      {t("admin.exam.coordinates") || "Coordinates (JSON)"}
                    </Label>
                    <Input
                      id={`spot-coordinates-${index}`}
                      value={typeof spot.coordinates === "string" ? spot.coordinates : JSON.stringify(spot.coordinates || {})}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateHotSpot(index, "coordinates", parsed);
                        } catch {
                          updateHotSpot(index, "coordinates", e.target.value);
                        }
                      }}
                      placeholder='{"x": 100, "y": 100, "width": 50, "height": 50}'
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <Checkbox
                      id={`spot-correct-${index}`}
                      checked={spot.isCorrect || false}
                      onChange={(e) => updateHotSpot(index, "isCorrect", e.target.checked)}
                      label={t("admin.exam.isCorrect") || "Is Correct"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    <ScoringConfigForm
      scoringConfig={localData.scoringConfig}
      onChange={(config) => updateData({ ...localData, scoringConfig: config })}
      defaultStrategy="BINARY"
    />
  </div>
);

}
