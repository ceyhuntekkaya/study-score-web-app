'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n';
import EntityForm from '@/components/admin/EntityForm';

export default function AddBrandPage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>Yeni Kurum Ekle</h2>
          <Link href="/admin/dashboard/brands" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            Kurumlar Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <EntityForm entityType="brand" />
      </div>
    </>
  );
}
