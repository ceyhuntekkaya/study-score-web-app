'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import BlogForm from '@/components/admin/BlogForm';

export default function AddBlogPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/dashboard/blog');
  };

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.blog.add')}</h2>
          <Link href="/admin/dashboard/blog" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.blog.backToList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="rbt-card rbt-card-body">
          <BlogForm
            onSuccess={handleSuccess}
            onCancel={() => router.push('/admin/dashboard/blog')}
          />
        </div>
      </div>
    </>
  );
}
