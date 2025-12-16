'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import EntityForm from '@/components/admin/EntityForm';

export default function AddInstitutionPage() {
  const { t } = useTranslation();
  const params = useParams();
  const campusId = params?.id as string;

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>Yeni Kurum Ekle</h2>
          <Link href={`/admin/dashboard/campuses/${campusId}/institutions`} className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            Kurumlar Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <EntityForm entityType="institution" parentId={campusId} />
      </div>
    </>
  );
}
