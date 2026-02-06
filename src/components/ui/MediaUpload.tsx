"use client";

import React, { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { customInstance } from "@/lib/api-client";
import {
  getAcceptForTypes,
  getFilePreviewUrl,
  isFileAccepted,
  type FileTypeCategory,
} from "@/lib/fileUtils";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Progress } from "@/components/ui/Progress";

export type MediaUploadMode = "single" | "multiple";

export interface MediaUploadProps {
  /** İzin verilen dosya tipleri (image, video, audio, pdf, document, other) */
  acceptedTypes?: FileTypeCategory[];
  /** single = tek dosya, multiple = çoklu (API: POST /api/files/upload tek istekte çoklu dosya) */
  mode?: MediaUploadMode;
  /** Maksimum dosya boyutu (MB) */
  maxFileSize?: number;
  /** Çoklu modda maksimum dosya sayısı */
  maxFiles?: number;
  /** Controlled: mevcut path(ler). Question content = path. */
  value?: string | string[] | null;
  /** path veya path[] döner. Question header content'e path atanacak. */
  onChange?: (pathOrPaths: string | string[]) => void;
  /** Nesne tipi; dosyalar bu ad altında klasörlenir (örn. Question, Student). Zorunlu. */
  objectType: string;
  /** Dosyanın hangi alan için olduğu (örn. header, body, option). Alt klasör adı. Zorunlu. */
  fileProp: string;
  labelText?: string;
  error?: boolean;
  errorText?: string;
  className?: string;
  id?: string;
  /** Önizleme alanında dosya tipine göre gösterim (image/video/audio/pdf/document/other) */
  showPreview?: boolean;
}

/** Yüklenen bir öğe: API'den dönen path + meta */
interface UploadedItem {
  path: string;
  fileName?: string;
  fileSize?: number;
  /** Önizleme için tip (path'ten veya dosyadan) */
  category?: FileTypeCategory;
}

function getCategoryFromPath(path: string): FileTypeCategory {
  const lower = path.toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(lower)) return "image";
  if (/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(lower)) return "video";
  if (/\.(mp3|wav|ogg|m4a|aac)$/i.test(lower)) return "audio";
  if (/\.pdf$/i.test(lower)) return "pdf";
  if (/\.(doc|docx|odt|txt)$/i.test(lower)) return "document";
  return "other";
}

/** API: POST /api/files/upload — FormData ile files, objectType, fileProp. Cevap: string[] (serve path'ler). */
async function uploadFiles(
  files: File[],
  objectType: string,
  fileProp: string
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("objectType", objectType);
  formData.append("fileProp", fileProp);
  return customInstance<string[]>({
    url: "/files/upload",
    method: "POST",
    data: formData,
  });
}

export function MediaUpload({
  acceptedTypes = ["image", "video", "audio", "pdf", "document", "other"],
  mode = "single",
  maxFileSize = 50,
  maxFiles = 10,
  value,
  onChange,
  objectType,
  fileProp,
  labelText,
  error = false,
  errorText,
  className = "",
  id = "media-upload",
  showPreview = true,
}: MediaUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useMutation({
    mutationFn: ({ files }: { files: File[] }) =>
      uploadFiles(files, objectType, fileProp),
  });

  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const valueList: string[] = Array.isArray(value) ? value : value ? [value] : [];
  const uploadedItems: UploadedItem[] = valueList.map((path) => ({
    path,
    category: getCategoryFromPath(path),
  }));

  const acceptString = getAcceptForTypes(acceptedTypes);
  const maxSizeBytes = maxFileSize * 1024 * 1024;

  const validateAndUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLocalError("");

    const fileArray = Array.from(files);
    if (mode === "single" && fileArray.length > 1) {
      setLocalError(t("fileUpload.singleOnly") || "Sadece bir dosya seçebilirsiniz.");
      return;
    }

    const maxAllowed = mode === "single" ? 1 : Math.min(maxFiles, maxFiles - valueList.length);
    if (fileArray.length > maxAllowed) {
      setLocalError(
        t("fileUpload.maxFiles", { max: maxAllowed }) || `En fazla ${maxAllowed} dosya yükleyebilirsiniz.`
      );
      return;
    }

    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (file.size > maxSizeBytes) {
        setLocalError(
          t("fileUpload.maxSize", { name: file.name, max: maxFileSize }) ||
            `${file.name}: en fazla ${maxFileSize} MB`
        );
        return;
      }
      if (!isFileAccepted(file, acceptedTypes)) {
        setLocalError(
          t("fileUpload.typeNotAllowed", { name: file.name }) || `${file.name}: desteklenmeyen dosya tipi`
        );
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploadProgress(10);
    try {
      const paths = await uploadMutation.mutateAsync({ files: validFiles });
      setUploadProgress(100);
      if (paths.length > 0 && onChange) {
        if (mode === "single") {
          onChange(paths[0]);
        } else {
          onChange([...valueList, ...paths]);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setLocalError(t("fileUpload.uploadError") || "Yükleme sırasında hata oluştu.");
    } finally {
      setUploadProgress(100);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndUpload(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    validateAndUpload(e.dataTransfer.files);
  };

  const removeItem = (path: string) => {
    if (mode === "single") {
      onChange?.("");
    } else {
      onChange?.(valueList.filter((p) => p !== path));
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className={`media-upload ${className}`}>
      {labelText && <Label htmlFor={id}>{labelText}</Label>}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          border border-dashed rounded p-4 text-center cursor-pointer transition
          ${isDragging ? "border-primary bg-primary bg-opacity-10" : "border-secondary"}
          ${isUploading ? "opacity-60 cursor-wait" : ""}
          ${error ? "border-danger" : ""}
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          className="d-none"
          accept={acceptString}
          multiple={mode === "multiple"}
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <i className="feather-upload" style={{ fontSize: "2rem", color: "var(--color-primary, #6c757d)" }} />
        <p className="mt-2 mb-0 small">
          {t("fileUpload.dragOrClick") || "Dosya seçin veya sürükleyip bırakın"}
        </p>
        <p className="text-muted small mt-1 mb-0">
          {acceptedTypes.join(", ")} • {t("fileUpload.maxSizeShort", { max: maxFileSize }) || `Max ${maxFileSize} MB`}
          {mode === "multiple" && ` • ${t("fileUpload.maxFilesShort", { max: maxFiles }) || `Max ${maxFiles} dosya`}`}
        </p>
      </div>

      {isUploading && (
        <div className="mt-2">
          <Progress value={uploadProgress} />
          <p className="small text-muted mt-1">{t("common.uploading") || "Yükleniyor..."}</p>
        </div>
      )}

      {showPreview && uploadedItems.length > 0 && (
        <div className="mt-3">
          <p className="small fw-semibold mb-2">{t("fileUpload.uploadedPreview") || "Yüklenen dosyalar"}</p>
          <div className="row g-2">
            {uploadedItems.map((item) => (
              <div key={item.path} className="col-12 col-sm-6 col-md-4">
                <UploadedItemPreview
                  item={item}
                  onRemove={() => removeItem(item.path)}
                  disabled={isUploading}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {(localError || errorText) && (
        <div className="mt-2">
          <Alert variant="destructive">
            <AlertDescription>{localError || errorText}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}

function UploadedItemPreview({
  item,
  onRemove,
  disabled,
}: {
  item: UploadedItem;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const previewUrl = getFilePreviewUrl(item.path);
  const category = item.category ?? "other";

  return (
    <div className="card position-relative border">
      <div
        className="card-img-top bg-light d-flex align-items-center justify-content-center overflow-hidden"
        style={{ aspectRatio: "16/10", minHeight: 80 }}
      >
        {category === "image" && (
          <img
            src={previewUrl}
            alt={item.fileName || "Preview"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        {category === "video" && (
          <video
            src={previewUrl}
            controls
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLVideoElement).style.display = "none";
            }}
          />
        )}
        {category === "audio" && (
          <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-2">
            <i className="feather-music mb-1" style={{ fontSize: "2rem", color: "#0d6efd" }} />
            <audio src={previewUrl} controls className="w-100" style={{ maxHeight: 36 }} />
          </div>
        )}
        {(category === "pdf" || category === "document" || category === "other") && (
          <div className="d-flex flex-column align-items-center justify-content-center p-2">
            <i className="feather-file" style={{ fontSize: "2rem", color: "#6c757d" }} />
            <span className="small text-muted text-center text-truncate w-100 mt-1">
              {item.fileName || item.path.split("/").pop() || "Dosya"}
            </span>
          </div>
        )}
      </div>
      <div className="card-body p-2">
        <p className="card-text small text-truncate mb-0" title={item.path}>
          {item.fileName || item.path.split("/").pop() || item.path}
        </p>
      </div>
      {!disabled && (
        <button
          type="button"
          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title={typeof window !== "undefined" ? "Kaldır" : "Remove"}
        >
          <i className="feather-x" />
        </button>
      )}
    </div>
  );
}

MediaUpload.displayName = "MediaUpload";
export default MediaUpload;
