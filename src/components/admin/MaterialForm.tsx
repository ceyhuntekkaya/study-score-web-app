"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n";
import {
  CourseLessonPartMaterialDetailDTO,
  CourseLessonPartMaterialDetailDTOMediaType,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateCoursePartMaterial,
  useUpdateCoursePartMaterial,
} from "@/generated/api/course-lesson-part-material-rest-controller/course-lesson-part-material-rest-controller";
import { useUploadFile } from "@/generated/api/file-rest-controller/file-rest-controller";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import LoadingButton from "@/components/ui/LoadingButton";
import SimpleHtmlEditor from "@/components/ui/SimpleHtmlEditor";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/Select";

interface MaterialFormProps {
  courseLessonPartId: string;
  initialData?: CourseLessonPartMaterialDetailDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
  onFormDataChange?: (data: CourseLessonPartMaterialDetailDTO) => void;
}

export default function MaterialForm({
  courseLessonPartId,
  initialData,
  onSuccess,
  onCancel,
  onFormDataChange,
}: MaterialFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!initialData?.id;

  // Form state
  const [formData, setFormData] = useState<CourseLessonPartMaterialDetailDTO>({
    name: "",
    description: "",
    content: "",
    mediaType: CourseLessonPartMaterialDetailDTOMediaType.VIDEO,
    orderNumber: 0,
    duration: 0,
    courseLessonPartId: courseLessonPartId,
  });

  // Mutations
  const createMaterial = useCreateCoursePartMaterial();
  const updateMaterial = useUpdateCoursePartMaterial();
  const uploadFileMutation = useUploadFile();
  
  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Initialize form with initial data - only when initialData.id changes (not the whole object)
  useEffect(() => {
    if (initialData?.id) {
      setFormData({
        id: initialData.id,
        name: initialData.name || "",
        description: initialData.description || "",
        content: initialData.content || "",
        mediaType: initialData.mediaType || CourseLessonPartMaterialDetailDTOMediaType.VIDEO,
        orderNumber: initialData.orderNumber || 0,
        duration: initialData.duration || 0,
        courseLessonPartId: initialData.courseLessonPartId || courseLessonPartId,
        uploadedFileId: initialData.uploadedFileId,
        uploadedFileName: initialData.uploadedFileName,
      });
    } else if (!initialData) {
      // Only reset if we're switching from edit to add mode
      setFormData({
        name: "",
        description: "",
        content: "",
        mediaType: CourseLessonPartMaterialDetailDTOMediaType.VIDEO,
        orderNumber: 0,
        duration: 0,
        courseLessonPartId: courseLessonPartId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id]); // Only depend on initialData.id, not the whole object

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const newFormData = { ...formData, [name]: value };
    // If media type changes to TEXT, clear uploadedFileId
    if (name === 'mediaType' && value === CourseLessonPartMaterialDetailDTOMediaType.TEXT) {
      newFormData.uploadedFileId = undefined;
    }
    // If media type changes to LINK, clear uploadedFileId
    if (name === 'mediaType' && value === CourseLessonPartMaterialDetailDTOMediaType.LINK) {
      newFormData.uploadedFileId = undefined;
    }
    // If media type changes from TEXT or LINK, clear content
    if (name === 'mediaType' && 
        value !== CourseLessonPartMaterialDetailDTOMediaType.TEXT && 
        value !== CourseLessonPartMaterialDetailDTOMediaType.LINK) {
      newFormData.content = '';
    }
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  const handleContentChange = (content: string) => {
    const newFormData = { ...formData, content };
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const result = await uploadFileMutation.mutateAsync({
        data: { file },
      });
      
      if (result?.id) {
        const newFormData = {
          ...formData,
          uploadedFileId: result.id,
          uploadedFileName: result.fileOriginalName || result.fileName,
        };
        setFormData(newFormData);
        if (onFormDataChange) {
          onFormDataChange(newFormData);
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('Dosya yüklenirken bir hata oluştu.');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Update mode
        const id = initialData!.id!;
        await updateMaterial.mutateAsync({
          coursePartMaterialId: id,
          data: formData,
        });
      } else {
        // Create mode
        await createMaterial.mutateAsync({ data: formData });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createMaterial.isPending || updateMaterial.isPending || uploadingFile;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row">
        {/* Name - Required */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              {t('admin.material.name')} <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="description">{t('form.label.description')}</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Media Type */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="mediaType">
              {t('admin.material.mediaType')} <span className="text-danger">*</span>
            </Label>
            <Select
              value={formData.mediaType || CourseLessonPartMaterialDetailDTOMediaType.VIDEO}
              onValueChange={(value) =>
                handleSelectChange("mediaType", value as string)
              }
              searchable={false}
              sortable={false}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('admin.material.selectMediaType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={CourseLessonPartMaterialDetailDTOMediaType.VIDEO}>
                    VIDEO
                  </SelectItem>
                  <SelectItem value={CourseLessonPartMaterialDetailDTOMediaType.AUDIO}>
                    AUDIO
                  </SelectItem>
                  <SelectItem value={CourseLessonPartMaterialDetailDTOMediaType.IMAGE}>
                    IMAGE
                  </SelectItem>
                  <SelectItem value={CourseLessonPartMaterialDetailDTOMediaType.PDF}>
                    PDF
                  </SelectItem>
                  <SelectItem value={CourseLessonPartMaterialDetailDTOMediaType.DOCUMENT}>
                    DOCUMENT
                  </SelectItem>
                  <SelectItem value={CourseLessonPartMaterialDetailDTOMediaType.TEXT}>
                    TEXT
                  </SelectItem>
                  <SelectItem value={CourseLessonPartMaterialDetailDTOMediaType.LINK}>
                    LINK
                  </SelectItem>
                  <SelectItem value={CourseLessonPartMaterialDetailDTOMediaType.OTHER}>
                    OTHER
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Order Number */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="orderNumber">{t('form.label.orderNumber')}</Label>
            <Input
              id="orderNumber"
              name="orderNumber"
              type="number"
              value={formData.orderNumber || 0}
              onChange={handleChange}
              min={0}
            />
          </div>
        </div>

        {/* Duration */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="duration">{t('form.label.duration')}</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration || 0}
              onChange={handleChange}
              min={0}
            />
          </div>
        </div>

        {/* Content / File Upload / Link URL - Conditional based on Media Type */}
        {formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.TEXT ? (
          <div className="col-12">
            <div className="form-group">
              <Label htmlFor="content">{t('admin.material.content')}</Label>
              <SimpleHtmlEditor
                value={formData.content || ''}
                onChange={handleContentChange}
                placeholder={t('admin.material.contentPlaceholder') || 'İçerik girin...'}
              />
            </div>
          </div>
        ) : formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.LINK ? (
          <div className="col-12">
            <div className="form-group">
              <Label htmlFor="content">
                {t('admin.material.linkUrl') || 'Link URL'} <span className="text-danger">*</span>
              </Label>
              <Input
                id="content"
                name="content"
                type="url"
                value={formData.content || ''}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
        ) : (
          <div className="col-12">
            <div className="form-group">
              <Label htmlFor="fileUpload">
                {t('admin.material.fileUpload') || 'Dosya Yükle'} <span className="text-danger">*</span>
              </Label>
              <div className="d-flex gap-2 align-items-center">
                <input
                  ref={fileInputRef}
                  id="fileUpload"
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  disabled={uploadingFile}
                  accept={
                    formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.IMAGE
                      ? 'image/*'
                      : formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.VIDEO
                      ? 'video/*'
                      : formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.AUDIO
                      ? 'audio/*'
                      : formData.mediaType === CourseLessonPartMaterialDetailDTOMediaType.PDF
                      ? 'application/pdf'
                      : '*/*'
                  }
                />
                {uploadingFile && (
                  <span className="text-muted">
                    <i className="feather-loader me-1"></i>
                    {t('common.uploading') || 'Yükleniyor...'}
                  </span>
                )}
              </div>
              {formData.uploadedFileId && (
                <div className="mt-2">
                  <small className="text-success">
                    <i className="feather-check-circle me-1"></i>
                    {t('admin.material.fileUploaded') || 'Dosya yüklendi:'} {formData.uploadedFileName || formData.uploadedFileId}
                  </small>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit buttons */}
        <div className="col-12">
          <div className="form-group d-flex gap-3">
            <LoadingButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              loadingText={t("common.loading") || "Yükleniyor..."}
              disabled={isLoading}
            >
              {isEditMode
                ? t("common.save") || "Kaydet"
                : t("common.add") || "Ekle"}
            </LoadingButton>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t("common.cancel") || "İptal"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
