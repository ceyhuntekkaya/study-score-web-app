"use client";

import { useTranslation } from "@/i18n";
import {
  QuestionHeaderRequest,
  QuestionHeaderRequestMediaType,
  HeaderRequest,
} from "@/generated/api/openAPIDefinition.schemas";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import SimpleHtmlEditor from "@/components/ui/SimpleHtmlEditor";
import MediaUpload from "@/components/ui/MediaUpload";
import type { FileTypeCategory } from "@/lib/fileUtils";

/** Question (orderNumber + mediaType + content) veya QuestionGroup (mediaType + content) için ortak tip */
export type HeaderItem = QuestionHeaderRequest | (HeaderRequest & { orderNumber?: number });

const MEDIA_TYPES = [
  QuestionHeaderRequestMediaType.TEXT,
  QuestionHeaderRequestMediaType.IMAGE,
  QuestionHeaderRequestMediaType.VIDEO,
  QuestionHeaderRequestMediaType.AUDIO,
  QuestionHeaderRequestMediaType.DOCUMENT,
  QuestionHeaderRequestMediaType.PDF,
  QuestionHeaderRequestMediaType.LINK,
  QuestionHeaderRequestMediaType.OTHER,
] as const;

const FILE_MEDIA_TYPES: string[] = [
  QuestionHeaderRequestMediaType.IMAGE,
  QuestionHeaderRequestMediaType.VIDEO,
  QuestionHeaderRequestMediaType.AUDIO,
  QuestionHeaderRequestMediaType.DOCUMENT,
  QuestionHeaderRequestMediaType.PDF,
  QuestionHeaderRequestMediaType.OTHER,
];

function isFileMediaType(mediaType?: string): boolean {
  return !!mediaType && FILE_MEDIA_TYPES.includes(mediaType);
}

function mediaTypeToAcceptedTypes(mediaType: string): FileTypeCategory[] {
  const map: Record<string, FileTypeCategory[]> = {
    [QuestionHeaderRequestMediaType.IMAGE]: ["image"],
    [QuestionHeaderRequestMediaType.VIDEO]: ["video"],
    [QuestionHeaderRequestMediaType.AUDIO]: ["audio"],
    [QuestionHeaderRequestMediaType.PDF]: ["pdf"],
    [QuestionHeaderRequestMediaType.DOCUMENT]: ["document"],
    [QuestionHeaderRequestMediaType.OTHER]: ["image", "video", "audio", "pdf", "document", "other"],
  };
  return map[mediaType] ?? ["other"];
}

interface HeaderEditorProps {
  value: HeaderItem[];
  onChange: (headers: HeaderItem[]) => void;
  includeOrderNumber?: boolean;
  minItems?: number;
  error?: string;
}

export default function HeaderEditor({
  value,
  onChange,
  includeOrderNumber = true,
  minItems = 1,
  error,
}: HeaderEditorProps) {
  const { t } = useTranslation();

  const updateItem = (index: number, patch: Partial<HeaderItem>) => {
    const next = value.map((item, i) =>
      i === index ? { ...item, ...patch } : item
    );
    if (includeOrderNumber) {
      next.forEach((item, i) => {
        (item as QuestionHeaderRequest).orderNumber = i + 1;
      });
    }
    onChange(next);
  };

  const handleOrderChange = (index: number, newOrderStr: string) => {
    if (!includeOrderNumber) return;
    const newOrder = Math.max(1, Math.min(value.length, parseInt(newOrderStr, 10) || 1));
    const reordered = value.filter((_, i) => i !== index);
    reordered.splice(newOrder - 1, 0, value[index]);
    reordered.forEach((it, i) => {
      (it as QuestionHeaderRequest).orderNumber = i + 1;
    });
    onChange(reordered);
  };

  const removeItem = (index: number) => {
    if (value.length <= minItems) return;
    const next = value.filter((_, i) => i !== index);
    if (includeOrderNumber) {
      next.forEach((item, i) => {
        (item as QuestionHeaderRequest).orderNumber = i + 1;
      });
    }
    onChange(next);
  };

  const addItem = () => {
    const newItem: HeaderItem = {
      ...(includeOrderNumber ? { orderNumber: value.length + 1 } : {}),
      mediaType: QuestionHeaderRequestMediaType.TEXT,
      content: "",
    } as HeaderItem;
    onChange([...value, newItem]);
  };

  const mediaTypeLabel = (mt: string) => {
    const key = `admin.exam.mediaType.${mt}`;
    const label = t(key);
    return label !== key ? label : mt;
  };

  const displayItems = [...value].sort((a, b) => {
    if (!includeOrderNumber) return 0;
    const na = (a as QuestionHeaderRequest).orderNumber ?? 0;
    const nb = (b as QuestionHeaderRequest).orderNumber ?? 0;
    return na - nb;
  });

  return (
    <div className="form-group">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Label>
          {t("admin.exam.questionBody")} <span className="text-danger">*</span>
        </Label>
        <button
          type="button"
          className="rbt-btn btn-sm btn-border"
          onClick={addItem}
        >
          <i className="feather-plus me-1"></i>
          {t("admin.exam.addHeader")}
        </button>
      </div>
      {error && <div className="invalid-feedback d-block mb-2">{error}</div>}
      <div className="d-flex flex-column gap-3">
        {displayItems.map((item, displayIndex) => {
          const index = value.indexOf(item);
          const orderNum = includeOrderNumber ? (item as QuestionHeaderRequest).orderNumber ?? displayIndex + 1 : displayIndex + 1;
          return (
            <div
              key={index}
              className="border rounded p-3 bg-light"
              style={{ borderColor: "var(--color-border, #e0e0e0)" }}
            >
              {/* Satır 1: Sıra + Medya tipi + Sil */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                {includeOrderNumber && (
                  <div className="d-flex align-items-center gap-1">
                    <Label className="mb-0 small text-muted">{t("admin.exam.order")}</Label>
                    <Input
                      type="number"
                      min={1}
                      max={value.length}
                      value={orderNum}
                      onChange={(e) => handleOrderChange(index, e.target.value)}
                      className="form-control form-control-sm"
                      style={{ width: 56 }}
                    />
                  </div>
                )}
                <div className="d-flex align-items-center gap-1 flex-grow-1">
                  <Label className="mb-0 small text-muted">{t("admin.exam.mediaType")}</Label>
                  <Select
                    value={item.mediaType ?? QuestionHeaderRequestMediaType.TEXT}
                    onChange={(e) =>
                      updateItem(index, {
                        mediaType: e.target.value as QuestionHeaderRequestMediaType,
                        content: isFileMediaType(e.target.value) ? undefined : item.content,
                      })
                    }
                    className="form-select form-select-sm"
                    style={{ minWidth: 140 }}
                  >
                    {MEDIA_TYPES.map((mt) => (
                      <option key={mt} value={mt}>
                        {mediaTypeLabel(mt)}
                      </option>
                    ))}
                  </Select>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-auto"
                  onClick={() => removeItem(index)}
                  disabled={displayItems.length <= minItems}
                  title={t("common.delete")}
                >
                  <i className="feather-trash-2"></i>
                </button>
              </div>
              {/* Satır 2: İçerik */}
              <div className="mt-2">
                {item.mediaType === QuestionHeaderRequestMediaType.TEXT && (
                  <div className="small-editor">
                    <SimpleHtmlEditor
                      value={item.content ?? ""}
                      onChange={(content) => updateItem(index, { content })}
                      placeholder={t("admin.exam.contentPlaceholder")}
                    />
                  </div>
                )}
                {item.mediaType === QuestionHeaderRequestMediaType.LINK && (
                  <input
                    type="url"
                    className="form-control form-control-sm"
                    value={item.content ?? ""}
                    onChange={(e) => updateItem(index, { content: e.target.value })}
                    placeholder="https://..."
                  />
                )}
                {item.mediaType && isFileMediaType(item.mediaType) && (
                  <MediaUpload
                    acceptedTypes={mediaTypeToAcceptedTypes(item.mediaType)}
                    mode="single"
                    maxFileSize={50}
                    value={item.content ?? null}
                    onChange={(pathOrPaths) => updateItem(index, { content: typeof pathOrPaths === 'string' ? pathOrPaths : pathOrPaths[0] })}
                    objectType="Question"
                    fileProp="header"
                    showPreview={true}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {displayItems.length < minItems && (
        <p className="text-muted small mb-0 mt-2">
          {t("admin.exam.headersMinRequired", { count: minItems })}
        </p>
      )}
    </div>
  );
}
