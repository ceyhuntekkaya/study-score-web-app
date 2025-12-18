"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import {
  CourseLessonPartMaterialDetailDTO,
  CourseLessonPartMaterialDetailDTOMediaType,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateCoursePartMaterial,
  useUpdateCoursePartMaterial,
} from "@/generated/api/course-lesson-part-material-rest-controller/course-lesson-part-material-rest-controller";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import LoadingButton from "@/components/ui/LoadingButton";
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
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
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

  const isLoading = createMaterial.isPending || updateMaterial.isPending;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row">
        {/* Name - Required */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              Materyal Adı <span className="text-danger">*</span>
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
            <Label htmlFor="description">Açıklama</Label>
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
              Medya Tipi <span className="text-danger">*</span>
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
                <SelectValue placeholder="Medya tipi seçiniz" />
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
            <Label htmlFor="orderNumber">Sıra Numarası</Label>
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
            <Label htmlFor="duration">Süre (saniye)</Label>
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

        {/* Uploaded File ID */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="uploadedFileId">Yüklenen Dosya ID</Label>
            <Input
              id="uploadedFileId"
              name="uploadedFileId"
              type="text"
              value={formData.uploadedFileId || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Content */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="content">İçerik</Label>
            <Textarea
              id="content"
              name="content"
              rows={4}
              value={formData.content}
              onChange={handleChange}
            />
          </div>
        </div>

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
