"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { CourseLessonDTO, CourseLessonDTOLessonLevel } from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateCourseLesson,
  useUpdateCourseLesson,
} from "@/generated/api/course-lesson-rest-controller/course-lesson-rest-controller";
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

interface LessonFormProps {
  courseId: string;
  parentLessonId?: string;
  initialData?: CourseLessonDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LessonForm({
  courseId,
  parentLessonId,
  initialData,
  onSuccess,
  onCancel,
}: LessonFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!initialData?.id;

  // Form state
  const [formData, setFormData] = useState<CourseLessonDTO>({
    name: "",
    description: "",
    lessonLevel: CourseLessonDTOLessonLevel.LESSON,
    orderNumber: 0,
    courseId: courseId,
    parentLessonId: parentLessonId,
  });

  // Mutations
  const createLesson = useCreateCourseLesson();
  const updateLesson = useUpdateCourseLesson();

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        lessonLevel: initialData.lessonLevel || CourseLessonDTOLessonLevel.LESSON,
        orderNumber: initialData.orderNumber || 0,
        courseId: initialData.courseId || courseId,
        parentLessonId: initialData.parentLessonId || parentLessonId,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        lessonLevel: CourseLessonDTOLessonLevel.LESSON,
        orderNumber: 0,
        courseId: courseId,
        parentLessonId: parentLessonId,
      });
    }
  }, [initialData, courseId, parentLessonId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Update mode
        const id = initialData!.id!;
        await updateLesson.mutateAsync({
          courseLessonId: id,
          data: formData,
        });
      } else {
        // Create mode
        await createLesson.mutateAsync({ data: formData });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createLesson.isPending || updateLesson.isPending;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row">
        {/* Name - Required */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              {t('admin.lesson.name')} <span className="text-danger">*</span>
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

        {/* Lesson Level */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="lessonLevel">
              {t('admin.lesson.level')} <span className="text-danger">*</span>
            </Label>
            <Select
              value={formData.lessonLevel || CourseLessonDTOLessonLevel.LESSON}
              onValueChange={(value) =>
                handleSelectChange("lessonLevel", String(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('admin.lesson.selectLevel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={CourseLessonDTOLessonLevel.UNIT}>
                    UNIT
                  </SelectItem>
                  <SelectItem value={CourseLessonDTOLessonLevel.TOPIC}>
                    TOPIC
                  </SelectItem>
                  <SelectItem value={CourseLessonDTOLessonLevel.LESSON}>
                    LESSON
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
