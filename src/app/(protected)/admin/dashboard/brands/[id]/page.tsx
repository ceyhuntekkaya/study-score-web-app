'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import Link from 'next/link';

export default function BrandDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <h2>{t('menu.institutions') || 'Kurumlar'} - Detay</h2>
        <div className="d-flex gap-2">
          <Link href={`/admin/dashboard/brands/${id}/edit`} className="rbt-btn btn-md btn-border-gradient">
            <i className="feather-edit me-1"></i>
            {t('common.edit') || 'Düzenle'}
          </Link>
          <Link href="/admin/dashboard/brands" className="rbt-btn btn-md btn-border-gradient">
            <i className="feather-arrow-left me-1"></i>
            {t('common.back') || 'Geri'}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="alert alert-info">
          <p>Detay içeriği yakında eklenecek.</p>
          <p>ID: {id}</p>
        </div>
      </div>
    </>
  );
}
