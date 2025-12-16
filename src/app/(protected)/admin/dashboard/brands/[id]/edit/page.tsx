'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { useGetBrandById } from '@/generated/api/brand-rest-controller/brand-rest-controller';
import EntityForm from '@/components/admin/EntityForm';

export default function EditBrandPage() {
  const { t } = useTranslation();
  const params = useParams();
  const brandId = params?.id as string;

  const { data: brand, isLoading } = useGetBrandById(brandId, {
    query: { enabled: !!brandId },
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>Kurum Düzenle</h2>
          <Link href="/admin/dashboard/brands" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            Kurumlar Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        {brand && <EntityForm entityType="brand" initialData={brand} />}
      </div>
    </>
  );
}
