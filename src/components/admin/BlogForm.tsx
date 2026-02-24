'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n';
import type { Blog } from '@/generated/api/openAPIDefinition.schemas';
import {
  useCreateBlog,
  useUpdateBlog,
  useGetAllCategories,
  useGetAllLabels,
} from '@/generated/api/blog-rest-controller/blog-rest-controller';
import { useMutation } from '@tanstack/react-query';
import { customInstance } from '@/lib/api-client';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import LoadingButton from '@/components/ui/LoadingButton';
import SimpleHtmlEditor from '@/components/ui/SimpleHtmlEditor';

interface BlogFormProps {
  initialData?: Blog | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function buildBlogPayload(form: {
  id?: string;
  title: string;
  shortDescription: string;
  banner: string;
  summary: string;
  slogan: string;
  content: string;
  categoryId?: string;
  labelIds: string[];
  authorId?: string;
}): Blog {
  const payload: Blog = {
    title: form.title,
    shortDescription: form.shortDescription || undefined,
    banner: form.banner || undefined,
    summary: form.summary || undefined,
    slogan: form.slogan || undefined,
    content: form.content || undefined,
    labels: form.labelIds.length ? form.labelIds.map((id) => ({ id })) : undefined,
  };
  if (form.id) payload.id = form.id;
  if (form.categoryId) payload.category = { id: form.categoryId };
  if (form.authorId) payload.author = { id: form.authorId };
  return payload;
}

export default function BlogForm({
  initialData,
  onSuccess,
  onCancel,
}: BlogFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!initialData?.id;

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    banner: '',
    summary: '',
    slogan: '',
    content: '',
    categoryId: '',
    labelIds: [] as string[],
    authorId: '',
  });

  const { data: categories = [] } = useGetAllCategories({ activeOnly: false });
  const { data: labels = [] } = useGetAllLabels({ activeOnly: false });
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      objectType,
      fileProp,
    }: {
      file: File;
      objectType: string;
      fileProp: string;
    }) => {
      const fd = new FormData();
      fd.append('files', file);
      fd.append('objectType', objectType);
      fd.append('fileProp', fileProp);
      return customInstance<string[]>({
        url: '/files/upload',
        method: 'POST',
        data: fd,
      });
    },
  });
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        shortDescription: initialData.shortDescription || '',
        banner: initialData.banner || '',
        summary: initialData.summary || '',
        slogan: initialData.slogan || '',
        content: initialData.content || '',
        categoryId: initialData.category?.id || '',
        labelIds: (initialData.labels || []).map((l) => l?.id).filter(Boolean) as string[],
        authorId: initialData.author?.id || '',
      });
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        banner: '',
        summary: '',
        slogan: '',
        content: '',
        categoryId: '',
        labelIds: [],
        authorId: '',
      });
    }
  }, [initialData?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const paths = await uploadMutation.mutateAsync({
        file,
        objectType: 'Blog',
        fileProp: 'banner',
      });
      if (paths?.length) {
        setFormData((prev) => ({ ...prev, banner: paths[0] }));
      }
    } catch (err) {
      console.error('Banner upload error:', err);
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const handleLabelToggle = (labelId: string) => {
    setFormData((prev) => ({
      ...prev,
      labelIds: prev.labelIds.includes(labelId)
        ? prev.labelIds.filter((id) => id !== labelId)
        : [...prev.labelIds, labelId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildBlogPayload({
      ...formData,
      ...(initialData?.id && { id: initialData.id }),
    });
    try {
      if (isEditMode && initialData?.id) {
        await updateBlog.mutateAsync({ blogId: initialData.id, data: payload });
      } else {
        await createBlog.mutateAsync({ data: payload });
      }
      onSuccess?.();
    } catch (err) {
      console.error('Blog form error:', err);
    }
  };

  const isLoading =
    createBlog.isPending || updateBlog.isPending || uploadingBanner;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row g-3">
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="title">
              {t('admin.blog.titleField')} <span className="text-danger">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="shortDescription">{t('admin.blog.shortDescription')}</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              rows={2}
              value={formData.shortDescription}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <Label>{t('admin.blog.banner')}</Label>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <input
                ref={bannerInputRef}
                type="file"
                className="form-control form-control-sm"
                accept="image/*"
                onChange={handleBannerChange}
                disabled={uploadingBanner}
              />
              {uploadingBanner && (
                <span className="text-muted small">
                  <i className="feather-loader me-1"></i>
                  {t('common.uploading')}
                </span>
              )}
              {formData.banner && (
                <a
                  href={formData.banner}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="small"
                >
                  {t('admin.material.fileUploaded')}
                </a>
              )}
            </div>
            {formData.banner && (
              <div className="mt-2">
                <img
                  src={formData.banner}
                  alt="Banner"
                  className="img-thumbnail"
                  style={{ maxHeight: 120 }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="summary">{t('admin.blog.summary')}</Label>
            <Textarea
              id="summary"
              name="summary"
              rows={3}
              value={formData.summary}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="slogan">{t('admin.blog.slogan')}</Label>
            <Input
              id="slogan"
              name="slogan"
              type="text"
              value={formData.slogan}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <Label>{t('admin.blog.content')}</Label>
            <SimpleHtmlEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder=""
              className="min-h-[200px]"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="categoryId">{t('admin.blog.category')}</Label>
            <select
              id="categoryId"
              name="categoryId"
              className="form-control"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <Label>{t('admin.blog.labels')}</Label>
            <div className="d-flex flex-wrap gap-2">
              {labels.map((label) => (
                <label key={label.id} className="form-check form-check-inline mb-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.labelIds.includes(label.id!)}
                    onChange={() => label.id && handleLabelToggle(label.id!)}
                  />
                  <span className="form-check-label">{label.name}</span>
                </label>
              ))}
              {labels.length === 0 && (
                <span className="text-muted small">{t('common.noData') || 'Kayıt yok'}</span>
              )}
            </div>
          </div>
        </div>
        <div className="col-12 d-flex gap-2 justify-content-end pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          )}
          <LoadingButton type="submit" isLoading={isLoading} disabled={isLoading}>
            {isEditMode ? t('common.save') : t('common.add')}
          </LoadingButton>
        </div>
      </div>
    </form>
  );
}
