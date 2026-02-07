"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { TemplateFormProps } from "./types";

/** Match both [BLANK_1] and legacy {{BLANK_1}} so we normalize everything to [BLANK_1] */
const BLANK_PLACEHOLDER_REGEX = /\{\{[^}]+\}\}|\[[^\]]+\]/g;

/**
 * Parse text for [...] placeholders, normalize to [BLANK_1], [BLANK_2], ...
 * and return normalized text + count. IDs are assigned by the system in order of appearance.
 */
function normalizeTextWithBlanks(text: string): { normalizedText: string; count: number } {
  if (!text || typeof text !== "string") return { normalizedText: "", count: 0 };
  let count = 0;
  const normalizedText = text.replace(BLANK_PLACEHOLDER_REGEX, () => {
    count += 1;
    return `[BLANK_${count}]`;
  });
  return { normalizedText, count };
}

export default function FillInTheBlanksTemplateForm({
  templateData,
  onChange,
}: TemplateFormProps) {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<any>(templateData || {});

  useEffect(() => {
    const data = templateData || {};
    const text = data.textWithBlanks ?? "";
    const { normalizedText, count } = normalizeTextWithBlanks(text);
    if (count > 0 && normalizedText !== text) {
      const existingBlanks = data.options?.blanks || [];
      const newBlanks = Array.from({ length: count }, (_, i) => {
        const blankId = `BLANK_${i + 1}`;
        const existing = existingBlanks[i];
        return {
          blankId,
          acceptableAnswers: existing?.blankId === blankId ? (existing.acceptableAnswers ?? "") : "",
        };
      });
      const synced = {
        ...data,
        textWithBlanks: normalizedText,
        options: { ...(data.options || {}), blanks: newBlanks },
      };
      setLocalData(synced);
      onChange(synced);
    } else if (count > 0) {
      const existingBlanks = data.options?.blanks || [];
      const expectedIds = Array.from({ length: count }, (_, i) => `BLANK_${i + 1}`);
      const needsSync =
        existingBlanks.length !== count ||
        existingBlanks.some((b: any, i: number) => b?.blankId !== expectedIds[i]);
      if (needsSync) {
        const newBlanks = Array.from({ length: count }, (_, i) => {
          const blankId = expectedIds[i];
          const existing = existingBlanks[i];
          return {
            blankId,
            acceptableAnswers: existing?.blankId === blankId ? (existing.acceptableAnswers ?? "") : "",
          };
        });
        const synced = {
          ...data,
          options: { ...(data.options || {}), blanks: newBlanks },
        };
        setLocalData(synced);
        onChange(synced);
      } else {
        setLocalData(data);
      }
    } else {
      setLocalData(data);
    }
  }, [templateData, onChange]);

  const updateData = useCallback(
    (newData: any) => {
      setLocalData(newData);
      onChange(newData);
    },
    [onChange]
  );

  const options = localData.options || {};
  const blanks = options.blanks || [];

  const handleTextWithBlanksChange = (newText: string) => {
    const { normalizedText, count } = normalizeTextWithBlanks(newText);
    const existingBlanks = options.blanks || [];
    const newBlanks = Array.from({ length: count }, (_, i) => {
      const blankId = `BLANK_${i + 1}`;
      const existing = existingBlanks[i];
      return {
        blankId,
        acceptableAnswers: existing?.blankId === blankId ? (existing.acceptableAnswers ?? "") : "",
      };
    });
    updateData({
      ...localData,
      textWithBlanks: normalizedText,
      options: {
        ...options,
        blanks: newBlanks,
      },
    });
  };

  const updateBlankAnswers = (index: number, value: string) => {
    const updated = [...blanks];
    if (updated[index]) {
      updated[index] = { ...updated[index], acceptableAnswers: value };
    }
    updateData({
      ...localData,
      options: {
        ...options,
        blanks: updated,
      },
    });
  };

  const hasNoBlanks = blanks.length === 0;
  const textWithBlanks = localData.textWithBlanks || "";

  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
      <div className="form-group mb--20">
        <Label htmlFor="textWithBlanks">
          {t("admin.exam.textWithBlanks") || "Text with Blanks"}
          <small className="text-muted d-block">
            {t("admin.exam.fillBlanksPlaceholderHint") || "Use [BLANK_1], [BLANK_2] etc. for blanks. Blanks are auto-created and IDs are assigned by the system."}
          </small>
        </Label>
        <Textarea
          id="textWithBlanks"
          value={textWithBlanks}
          onChange={(e) => handleTextWithBlanksChange(e.target.value)}
          placeholder="The capital of Turkey is [BLANK_1] and the largest city is [BLANK_2]"
          rows={4}
          className="form-control"
        />
        {hasNoBlanks && textWithBlanks.trim() !== "" && (
          <p className="text-danger small mt-1 mb-0">
            {t("admin.exam.atLeastOneBlankRequired") || "At least one blank is required. Use [BLANK_1] in the text."}
          </p>
        )}
        {hasNoBlanks && textWithBlanks.trim() === "" && (
          <p className="text-muted small mt-1 mb-0">
            {t("admin.exam.enterTextWithBlanks") || "Enter text and add at least one blank (e.g. [BLANK_1])."}
          </p>
        )}
      </div>

      <div className="row g-3 mb--20">
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="caseSensitive"
              checked={localData.caseSensitive ?? false}
              onChange={(e) =>
                updateData({ ...localData, caseSensitive: e.target.checked })
              }
              label={t("admin.exam.caseSensitive") || "Case Sensitive"}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="exactMatch"
              checked={localData.exactMatch ?? false}
              onChange={(e) =>
                updateData({ ...localData, exactMatch: e.target.checked })
              }
              label={t("admin.exam.exactMatch") || "Exact Match"}
            />
          </div>
        </div>
      </div>

      <div className="mb--20">
        <label className="mb--0">{t("admin.exam.blanks") || "Blanks"}</label>
        <small className="text-muted d-block">
          {t("admin.exam.blanksAutoFromText") || "Blanks are created automatically from the text above. IDs cannot be edited."}
        </small>
      </div>

      {blanks.length === 0 ? (
        <p className="text-muted text-center py--20">
          {t("admin.exam.noBlanks") || "No blanks yet. Add placeholders like [BLANK_1] in the text."}
        </p>
      ) : (
        <div className="row g-3">
          {blanks.map((blank: any, blankIndex: number) => (
            <div key={blank.blankId || blankIndex} className="col-12">
              <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                <div className="d-flex justify-content-between align-items-center mb--15">
                  <label className="mb--0 fw-semibold">
                    {t("admin.exam.blank") || "Blank"} {blank.blankId}
                  </label>
                  <span className="badge bg-secondary" title={t("admin.exam.systemAssignedId") || "System-assigned ID"}>
                    {blank.blankId}
                  </span>
                </div>

                <div className="form-group">
                  <Label htmlFor={`blank-answers-${blankIndex}`}>
                    {t("admin.exam.acceptableAnswers") || "Acceptable Answers"}
                    <small className="text-muted d-block">
                      {t("admin.exam.oneAnswerPerLine") || "One answer per line (press Enter for each answer)"}
                    </small>
                  </Label>
                  <Textarea
                    id={`blank-answers-${blankIndex}`}
                    value={blank.acceptableAnswers || ""}
                    onChange={(e) => updateBlankAnswers(blankIndex, e.target.value)}
                    placeholder={'Ankara\nankara\nAnkara '}
                    rows={4}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
