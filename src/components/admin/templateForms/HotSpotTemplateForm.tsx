"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/i18n";
import { getFilePreviewUrl } from "@/lib/fileUtils";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import MediaUpload from "@/components/ui/MediaUpload";
import ScoringConfigForm from "./ScoringConfigForm";
import TemplateOptionalDetails from "./TemplateOptionalDetails";
import { TemplateFormProps } from "./types";

/** Display coords (relative to image element) → natural image pixel coords */
function displayToNatural(
  displayX: number,
  displayY: number,
  rect: DOMRect,
  naturalWidth: number,
  naturalHeight: number
) {
  const scaleX = naturalWidth / rect.width;
  const scaleY = naturalHeight / rect.height;
  return {
    x: (displayX / rect.width) * naturalWidth,
    y: (displayY / rect.height) * naturalHeight,
    scaleX,
    scaleY,
  };
}

export default function HotSpotTemplateForm({
  templateData,
  onChange,
}: TemplateFormProps) {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<any>(templateData || {});
  const imagePreviewRef = useRef<HTMLImageElement>(null);
  const [imageNaturalSize, setImageNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [drawingSpotIndex, setDrawingSpotIndex] = useState<number | null>(null);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null);

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
    coordinates: {} as Record<string, unknown>,
    isCorrect: true,
    label: "",
  };
  updateData({
    ...localData,
    imageUrl: localData.imageUrl || "",
    options: {
      ...options,
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
  updated[index] = { ...updated[index], [field]: value, isCorrect: true };
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

const getImageRelativeCoords = useCallback((e: React.MouseEvent) => {
  const img = imagePreviewRef.current;
  if (!img) return null;
  const rect = img.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x, y, rect };
}, []);

const handleDrawStart = (e: React.MouseEvent) => {
  if (drawingSpotIndex === null) return;
  e.preventDefault();
  const rel = getImageRelativeCoords(e);
  if (!rel || !imageNaturalSize) return;
  const { x, y } = rel;
  if (x < 0 || y < 0 || x > rel.rect.width || y > rel.rect.height) return;
  setDrawStart({ x, y });
  setDrawCurrent({ x, y });
};

const handleDrawMove = (e: React.MouseEvent) => {
  if (drawingSpotIndex === null || !drawStart) return;
  const rel = getImageRelativeCoords(e);
  if (!rel) return;
  setDrawCurrent({ x: rel.x, y: rel.y });
};

const handleDrawEnd = () => {
  if (drawingSpotIndex === null || !drawStart || !drawCurrent || !imageNaturalSize) return;
  const img = imagePreviewRef.current;
  if (!img) return;
  const rect = img.getBoundingClientRect();
  const { width: nw, height: nh } = imageNaturalSize;
  const spot = hotSpots[drawingSpotIndex];
  const shape = spot?.shape || "RECTANGLE";

  if (shape === "RECTANGLE") {
    const x1 = Math.min(drawStart.x, drawCurrent.x);
    const y1 = Math.min(drawStart.y, drawCurrent.y);
    const x2 = Math.max(drawStart.x, drawCurrent.x);
    const y2 = Math.max(drawStart.y, drawCurrent.y);
    const { x, y } = displayToNatural(x1, y1, rect, nw, nh);
    const { x: x2n, y: y2n } = displayToNatural(x2, y2, rect, nw, nh);
    updateHotSpot(drawingSpotIndex, "coordinates", {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(x2n - x),
      height: Math.round(y2n - y),
    });
  } else if (shape === "CIRCLE") {
    const cx = (drawStart.x + drawCurrent.x) / 2;
    const cy = (drawStart.y + drawCurrent.y) / 2;
    const rDisplay = Math.sqrt(
      Math.pow(drawCurrent.x - drawStart.x, 2) + Math.pow(drawCurrent.y - drawStart.y, 2)
    ) / 2;
    const { x, y } = displayToNatural(cx, cy, rect, nw, nh);
    const scaleX = nw / rect.width;
    const radiusNat = rDisplay * scaleX;
    updateHotSpot(drawingSpotIndex, "coordinates", {
      x: Math.round(x),
      y: Math.round(y),
      radius: Math.round(radiusNat),
    });
  }
  setDrawingSpotIndex(null);
  setDrawStart(null);
  setDrawCurrent(null);
};

const hasValidCoordinates = (spot: any) => {
  const c = spot?.coordinates;
  if (!c || typeof c !== "object") return false;
  if (spot.shape === "RECTANGLE")
    return [c.x, c.y, c.width, c.height].every((n) => typeof n === "number");
  if (spot.shape === "CIRCLE")
    return typeof c.x === "number" && typeof c.y === "number" && typeof c.radius === "number";
  if (spot.shape === "POLYGON") return Array.isArray(c.points) && c.points.length >= 3;
  return false;
};

return (
  <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
    <div className="form-group mb--20">
      <Label htmlFor="imageUrl">
        {t("admin.exam.imageUrl") || "Image"} <span className="text-danger">*</span>
      </Label>
      <MediaUpload
        id="imageUrl"
        acceptedTypes={["image"]}
        mode="single"
        maxFileSize={50}
        value={localData.imageUrl ?? null}
        onChange={(pathOrPaths) =>
          updateData({
            ...localData,
            imageUrl: typeof pathOrPaths === "string" ? pathOrPaths : pathOrPaths[0] ?? "",
          })
        }
        objectType="Question"
        fileProp="hotspot"
        showPreview={true}
      />
    </div>

    {/* Büyük görsel önizleme – hotspot alanı seçmek için */}
    {localData.imageUrl && (
      <div className="form-group mb--20">
        <Label className="mb-2">
          {t("admin.exam.hotSpotImagePreview") || "Image for hot spot selection"}
        </Label>
        <div
          className="position-relative d-inline-block rounded overflow-hidden border bg-light"
          style={{ maxWidth: "100%", cursor: drawingSpotIndex !== null ? "crosshair" : "default" }}
          onMouseDown={handleDrawStart}
          onMouseMove={handleDrawMove}
          onMouseLeave={() => {
            if (drawingSpotIndex !== null && drawStart) handleDrawEnd();
          }}
          onMouseUp={handleDrawEnd}
        >
          <img
            ref={imagePreviewRef}
            src={
              localData.imageUrl.startsWith("http")
                ? localData.imageUrl
                : getFilePreviewUrl(localData.imageUrl)
            }
            alt="Preview"
            style={{ display: "block", maxWidth: "100%", height: "auto", maxHeight: 420 }}
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              setImageNaturalSize({
                width: img.naturalWidth,
                height: img.naturalHeight,
              });
            }}
          />
          {/* Mevcut hotspot overlay */}
          {imageNaturalSize && hotSpots.some((s: any) => hasValidCoordinates(s)) && (
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                {hotSpots.map((spot: any) => {
                  if (!hasValidCoordinates(spot)) return null;
                  const c = spot.coordinates;
                  const rect = imagePreviewRef.current?.getBoundingClientRect();
                  if (!rect) return null;
                  const scaleX = rect.width / imageNaturalSize.width;
                  const scaleY = rect.height / imageNaturalSize.height;
                  const isDrawing =
                    drawingSpotIndex !== null && hotSpots[drawingSpotIndex]?.id === spot.id;
                  let style: React.CSSProperties = {
                    position: "absolute",
                    border: `2px solid ${isDrawing ? "#4d79ff" : spot.isCorrect ? "#28a745" : "#ffc107"}`,
                    backgroundColor: isDrawing
                      ? "rgba(77,121,255,0.35)"
                      : spot.isCorrect
                      ? "rgba(40,167,69,0.25)"
                      : "rgba(255,193,7,0.25)",
                    borderRadius: spot.shape === "CIRCLE" ? "50%" : 4,
                  };
                  if (spot.shape === "RECTANGLE" && c.x != null && c.width != null) {
                    style.left = c.x * scaleX + "px";
                    style.top = c.y * scaleY + "px";
                    style.width = c.width * scaleX + "px";
                    style.height = c.height * scaleY + "px";
                  } else if (spot.shape === "CIRCLE" && c.x != null && c.radius != null) {
                    style.left = (c.x - c.radius) * scaleX + "px";
                    style.top = (c.y - c.radius) * scaleY + "px";
                    style.width = c.radius * 2 * scaleX + "px";
                    style.height = c.radius * 2 * scaleY + "px";
                  } else return null;
                  return <div key={spot.id} style={style} />;
                })}
              </div>
            )}
          {/* Sürüklerken önizleme */}
          {drawingSpotIndex !== null && drawStart && drawCurrent && imageNaturalSize && (
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {hotSpots[drawingSpotIndex]?.shape === "RECTANGLE" && (
                <div
                  style={{
                    position: "absolute",
                    left: Math.min(drawStart.x, drawCurrent.x) + "px",
                    top: Math.min(drawStart.y, drawCurrent.y) + "px",
                    width: Math.abs(drawCurrent.x - drawStart.x) + "px",
                    height: Math.abs(drawCurrent.y - drawStart.y) + "px",
                    border: "2px dashed #4d79ff",
                    backgroundColor: "rgba(77,121,255,0.2)",
                  }}
                />
              )}
              {hotSpots[drawingSpotIndex]?.shape === "CIRCLE" && (
                (() => {
                  const cx = (drawStart.x + drawCurrent.x) / 2;
                  const cy = (drawStart.y + drawCurrent.y) / 2;
                  const r =
                    Math.sqrt(
                      Math.pow(drawCurrent.x - drawStart.x, 2) +
                        Math.pow(drawCurrent.y - drawStart.y, 2)
                    ) / 2;
                  return (
                    <div
                      style={{
                        position: "absolute",
                        left: cx - r + "px",
                        top: cy - r + "px",
                        width: r * 2 + "px",
                        height: r * 2 + "px",
                        border: "2px dashed #4d79ff",
                        borderRadius: "50%",
                        backgroundColor: "rgba(77,121,255,0.2)",
                      }}
                    />
                  );
                })()
              )}
            </div>
          )}
          {drawingSpotIndex !== null && (
            <div
              style={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              {hotSpots[drawingSpotIndex]?.shape === "RECTANGLE"
                ? (t("admin.exam.drawRectangle") || "Drag to draw a rectangle")
                : hotSpots[drawingSpotIndex]?.shape === "CIRCLE"
                ? (t("admin.exam.drawCircle") || "Drag to set center and radius")
                : (t("admin.exam.drawOnImage") || "Draw on image")}
            </div>
          )}
        </div>
      </div>
    )}

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
                {(spot.shape === "RECTANGLE" || spot.shape === "CIRCLE") && localData.imageUrl && (
                  <div className="col-12">
                    <button
                      type="button"
                      className="rbt-btn btn-sm btn-border me-2"
                      onClick={() => setDrawingSpotIndex(index)}
                    >
                      <i className="feather-mouse-pointer me-1"></i>
                      {hasValidCoordinates(spot)
                        ? (t("admin.exam.changeAreaOnImage") || "Change area on image")
                        : (t("admin.exam.selectAreaOnImage") || "Select area on image")}
                    </button>
                    {hasValidCoordinates(spot) && (
                      <span className="text-muted small">
                        {spot.shape === "RECTANGLE" &&
                          ` x:${spot.coordinates?.x} y:${spot.coordinates?.y} w:${spot.coordinates?.width} h:${spot.coordinates?.height}`}
                        {spot.shape === "CIRCLE" &&
                          ` center:${spot.coordinates?.x},${spot.coordinates?.y} r:${spot.coordinates?.radius}`}
                      </span>
                    )}
                  </div>
                )}
                {(spot.shape === "POLYGON" || (spot.shape !== "RECTANGLE" && spot.shape !== "CIRCLE")) && (
                  <div className="col-12">
                    <div className="form-group">
                      <Label htmlFor={`spot-coordinates-${index}`}>
                        {t("admin.exam.coordinates") || "Coordinates (JSON)"}
                      </Label>
                      <Input
                        id={`spot-coordinates-${index}`}
                        value={
                          typeof spot.coordinates === "string"
                            ? spot.coordinates
                            : JSON.stringify(spot.coordinates || {})
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            updateHotSpot(index, "coordinates", parsed);
                          } catch {
                            updateHotSpot(index, "coordinates", e.target.value);
                          }
                        }}
                        placeholder='{"points": [[0.1,0.2],[0.3,0.4],...]}'
                      />
                    </div>
                  </div>
                )}
                {spot.shape !== "POLYGON" && (spot.shape === "RECTANGLE" || spot.shape === "CIRCLE") && (
                  <div className="col-12">
                    <details className="small">
                      <summary className="text-muted">
                        {t("admin.exam.coordinatesAdvanced") || "Coordinates (advanced JSON)"}
                      </summary>
                      <Input
                        className="mt-1 font-monospace"
                        value={
                          typeof spot.coordinates === "string"
                            ? spot.coordinates
                            : JSON.stringify(spot.coordinates || {})
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            updateHotSpot(index, "coordinates", parsed);
                          } catch {
                            updateHotSpot(index, "coordinates", e.target.value);
                          }
                        }}
                      />
                    </details>
                  </div>
                )}
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
        defaultStrategy="BINARY"
      />
    </TemplateOptionalDetails>
  </div>
);

}
