"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { CourseLessonPartDTO } from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateCoursePart,
  useUpdateCoursePart,
} from "@/generated/api/course-lesson-part-rest-controller/course-lesson-part-rest-controller";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import LoadingButton from "@/components/ui/LoadingButton";

interface LessonPartFormProps {
  courseLessonId: string;
  initialData?: CourseLessonPartDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LessonPartForm({
  courseLessonId,
  initialData,
  onSuccess,
  onCancel,
}: LessonPartFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!initialData?.id;

  // Form state
  const [formData, setFormData] = useState<CourseLessonPartDTO>({
    name: "",
    description: "",
    orderNumber: 0,
    courseLessonId: courseLessonId,
  });

  // Mutations
  const createPart = useCreateCoursePart();
  const updatePart = useUpdateCoursePart();

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        orderNumber: initialData.orderNumber || 0,
        courseLessonId: initialData.courseLessonId || courseLessonId,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        orderNumber: 0,
        courseLessonId: courseLessonId,
      });
    }
  }, [initialData, courseLessonId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Update mode
        const id = initialData!.id!;
        await updatePart.mutateAsync({
          coursePartId: id,
          data: formData,
        });
      } else {
        // Create mode
        await createPart.mutateAsync({ data: formData });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createPart.isPending || updatePart.isPending;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row g-3">
        {/* Name - Required */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              {t('admin.part.name')} <span className="text-danger">*</span>
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

        {/* Order Number */}
        <div className="col-12">
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
