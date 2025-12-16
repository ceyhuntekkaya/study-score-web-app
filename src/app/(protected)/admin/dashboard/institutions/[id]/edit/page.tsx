'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { useGetInstitutionById } from '@/generated/api/institution-rest-controller/institution-rest-controller';
import EntityForm from '@/components/admin/EntityForm';

export default function EditInstitutionPage() {
  const { t } = useTranslation();
  const params = useParams();
  const institutionId = params?.id as string;

  const { data: institution, isLoading } = useGetInstitutionById(institutionId, {
    query: { enabled: !!institutionId },
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
          <Link 
            href={institution?.campus?.id ? `/admin/dashboard/campuses/${institution.campus.id}/institutions` : '/admin/dashboard/brands'} 
            className="rbt-btn-link"
          >
            <i className="feather-arrow-left me-1"></i>
            Kurumlar Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        {institution && <EntityForm entityType="institution" initialData={institution} />}
      </div>
    </>
  );
}
