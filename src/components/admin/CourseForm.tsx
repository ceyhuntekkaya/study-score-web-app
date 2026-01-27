"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";
import { Course, CourseDetailDTO } from "@/generated/api/openAPIDefinition.schemas";
import { useUpdateCourse, useCreateCourse } from "@/generated/api/course-rest-controller/course-rest-controller";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import LoadingButton from "@/components/ui/LoadingButton";
import { Select } from "@/components/ui/Select";

interface CourseFormProps {
  initialData?: Course;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CourseForm({
  initialData,
  onSuccess,
  onCancel,
}: CourseFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const isEditMode = !!initialData?.id;

  // Form state
  const [formData, setFormData] = useState<Partial<Course>>({
    name: "",
    description: "",
    code: "",
    language: "",
    level: "",
    imageUrl: "",
    category: "IELTS",
    status: "ACTIVE",
  });

  // Mutations
  const updateCourse = useUpdateCourse();
  const createCourse = useCreateCourse();

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        code: initialData.code || "",
        language: initialData.language || "",
        level: initialData.level || "",
        imageUrl: initialData.imageUrl || "",
        category: initialData.category || "IELTS",
        status: initialData.status || "ACTIVE",
        curriculum: initialData.curriculum,
      });
    }
  }, [initialData]);

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
      if (isEditMode && initialData?.id) {
        // Update existing course
        await updateCourse.mutateAsync({
          courseId: initialData.id,
          data: formData as Course,
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin/dashboard/courses");
        }
      } else {
        // Create new course
        const courseDetailDTO: CourseDetailDTO = {
          name: formData.name,
          description: formData.description,
          code: formData.code,
          language: formData.language,
          level: formData.level,
          imageUrl: formData.imageUrl,
          category: formData.category as any,
          status: formData.status as any,
        };

        const result = await createCourse.mutateAsync({
          data: courseDetailDTO,
        });

        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect to edit page with the new course ID
          if (result?.id) {
            router.push(`/admin/dashboard/courses/${result.id}/edit`);
          } else {
            router.push("/admin/dashboard/courses");
          }
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isLoading = updateCourse.isPending || createCourse.isPending;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row g-3">
        {/* Name - Required */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              {t('admin.course.name')} <span className="text-danger">*</span>
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

        {/* Code */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="code">{t('admin.course.code')}</Label>
            <Input
              id="code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Category */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="category">{t('admin.course.category')}</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="IELTS">IELTS</option>
              <option value="TOEFL">TOEFL</option>
              <option value="SAT_ENGLISH">SAT English</option>
              <option value="SAT_MATH">SAT Math</option>
              <option value="GENERAL_ENGLISH">General English</option>
            </Select>
          </div>
        </div>

        {/* Language */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="language">{t('admin.course.language')}</Label>
            <Input
              id="language"
              name="language"
              type="text"
              value={formData.language}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Level */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="level">{t('admin.course.level')}</Label>
            <Input
              id="level"
              name="level"
              type="text"
              value={formData.level}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="imageUrl">Görsel URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
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

        {/* Status */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="status">Durum</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Aktif</option>
              <option value="PASSIVE">Pasif</option>
              <option value="WAITING">Beklemede</option>
              <option value="IN_PROGRESS">Devam Ediyor</option>
              <option value="COMPLETED">Tamamlandı</option>
            </Select>
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
              {t("common.save") || "Kaydet"}
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
