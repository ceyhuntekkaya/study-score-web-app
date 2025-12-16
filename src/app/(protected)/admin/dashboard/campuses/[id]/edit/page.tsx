'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { useGetCampusById } from '@/generated/api/campus-rest-controller/campus-rest-controller';
import EntityForm from '@/components/admin/EntityForm';

export default function EditCampusPage() {
  const { t } = useTranslation();
  const params = useParams();
  const campusId = params?.id as string;

  const { data: campus, isLoading } = useGetCampusById(campusId, {
    query: { enabled: !!campusId },
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
          <h2>Kampüs Düzenle</h2>
          <Link 
            href={campus?.brand?.id ? `/admin/dashboard/brands/${campus.brand.id}/campuses` : '/admin/dashboard/brands'} 
            className="rbt-btn-link"
          >
            <i className="feather-arrow-left me-1"></i>
            Kampüsler Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        {campus && <EntityForm entityType="campus" initialData={campus} />}
      </div>
    </>
  );
}
