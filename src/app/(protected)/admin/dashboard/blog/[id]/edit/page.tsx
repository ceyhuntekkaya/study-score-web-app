'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { useGetBlogById } from '@/generated/api/blog-rest-controller/blog-rest-controller';
import BlogForm from '@/components/admin/BlogForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EditBlogPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;

  const { data: blog, isLoading, error } = useGetBlogById(blogId, {
    query: { enabled: !!blogId },
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <LoadingSpinner />
        <p className="mt-3">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="alert alert-danger">
        {t('error.network') || 'Blog yazısı yüklenirken bir hata oluştu.'}
        <div className="mt-2">
          <Link href="/admin/dashboard/blog" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.blog.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.blog.edit')}</h2>
          <Link href="/admin/dashboard/blog" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.blog.backToList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="rbt-card rbt-card-body">
          <BlogForm
            initialData={blog}
            onSuccess={() => router.push('/admin/dashboard/blog')}
            onCancel={() => router.push('/admin/dashboard/blog')}
          />
        </div>
      </div>
    </>
  );
}
