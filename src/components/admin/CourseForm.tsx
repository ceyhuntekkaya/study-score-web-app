'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { Course } from '@/generated/api/openAPIDefinition.schemas';
import { useUpdateCourse } from '@/generated/api/course-rest-controller/course-rest-controller';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import LoadingButton from '@/components/ui/LoadingButton';

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
    name: '',
    description: '',
    code: '',
    language: '',
    level: '',
    imageUrl: '',
    category: 'IELTS',
    status: 'ACTIVE',
  });

  // Mutation
  const updateCourse = useUpdateCourse();

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        code: initialData.code || '',
        language: initialData.language || '',
        level: initialData.level || '',
        imageUrl: initialData.imageUrl || '',
        category: initialData.category || 'IELTS',
        status: initialData.status || 'ACTIVE',
        curriculum: initialData.curriculum,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && initialData?.id) {
        await updateCourse.mutateAsync({ 
          courseId: initialData.id, 
          data: formData as Course 
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/admin/dashboard/courses');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isLoading = updateCourse.isPending;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row g-5">
        {/* Name - Required */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              Kurs Adı <span className="text-danger">*</span>
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
            <Label htmlFor="code">Kurs Kodu</Label>
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
            <Label htmlFor="category">Kategori</Label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="IELTS">IELTS</option>
              <option value="TOEFL">TOEFL</option>
            </select>
          </div>
        </div>

        {/* Language */}
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="language">Dil</Label>
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
            <Label htmlFor="level">Seviye</Label>
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
            <select
              id="status"
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Aktif</option>
              <option value="PASSIVE">Pasif</option>
              <option value="WAITING">Beklemede</option>
              <option value="IN_PROGRESS">Devam Ediyor</option>
              <option value="COMPLETED">Tamamlandı</option>
            </select>
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
              loadingText={t('common.loading') || 'Yükleniyor...'}
              disabled={isLoading}
            >
              {t('common.save') || 'Kaydet'}
            </LoadingButton>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t('common.cancel') || 'İptal'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
