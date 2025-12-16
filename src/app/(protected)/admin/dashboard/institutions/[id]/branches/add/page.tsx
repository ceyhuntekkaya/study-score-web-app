'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import EntityForm from '@/components/admin/EntityForm';

export default function AddBranchPage() {
  const { t } = useTranslation();
  const params = useParams();
  const institutionId = params?.id as string;

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>Yeni Branch Ekle</h2>
          <Link href={`/admin/dashboard/institutions/${institutionId}/branches`} className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            Branch'ler Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <EntityForm entityType="branch" parentId={institutionId} />
      </div>
    </>
  );
}
