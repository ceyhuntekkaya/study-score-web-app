'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { useGetBranchById } from '@/generated/api/branch-rest-controller/branch-rest-controller';
import EntityForm from '@/components/admin/EntityForm';

export default function EditBranchPage() {
  const { t } = useTranslation();
  const params = useParams();
  const branchId = params?.id as string;

  const { data: branch, isLoading } = useGetBranchById(branchId, {
    query: { enabled: !!branchId },
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
          <h2>Branch Düzenle</h2>
          <Link 
            href={branch?.institution?.id ? `/admin/dashboard/institutions/${branch.institution.id}/branches` : '/admin/dashboard/brands'} 
            className="rbt-btn-link"
          >
            <i className="feather-arrow-left me-1"></i>
            Branch'ler Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        {branch && <EntityForm entityType="branch" initialData={branch} />}
      </div>
    </>
  );
}
