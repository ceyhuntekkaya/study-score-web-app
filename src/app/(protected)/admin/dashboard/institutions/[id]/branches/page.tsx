'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllBranchs } from '@/generated/api/branch-rest-controller/branch-rest-controller';
import { useGetInstitutionById } from '@/generated/api/institution-rest-controller/institution-rest-controller';
import { Branch } from '@/generated/api/openAPIDefinition.schemas';
import DynamicTable from '@/components/ui/DynamicTable';
import { Column } from '@/types/ui/table';
import { useTranslation } from '@/i18n';
import { useMemo } from 'react';

export default function InstitutionBranchesPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const institutionId = params?.id as string;

  const { data: institution, isLoading: institutionLoading } = useGetInstitutionById(institutionId, {
    query: { enabled: !!institutionId },
  });
  const { data: allBranches, isLoading: branchesLoading } = useGetAllBranchs();

  // Filter branches by institution ID
  const branches = useMemo(() => {
    if (!allBranches || !institutionId) return [];
    return allBranches.filter((branch) => branch.institution?.id === institutionId);
  }, [allBranches, institutionId]);

  const columns: Column<Branch>[] = [
    {
      key: 'name',
      header: t('admin.entity.branchName'),
      sortable: true,
    },
    {
      key: 'grade',
      header: t('form.label.grade'),
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        return <span>{String(value)}</span>;
      },
    },
    {
      key: 'status',
      header: t('admin.entity.status'),
      sortable: true,
      render: (value) => {
        const status = value as string;
        const statusClass =
          status === 'ACTIVE'
            ? 'badge bg-success'
            : status === 'PASSIVE'
            ? 'badge bg-warning'
            : 'badge bg-secondary';
        return <span className={statusClass}>{status || '-'}</span>;
      },
    },
    {
      key: 'createdAt',
      header: t('admin.entity.createdAt'),
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value as string);
        return date.toLocaleDateString('tr-TR');
      },
    },
    {
      key: 'actions',
      header: t('common.actions'),
      sortable: false,
      actions: [
        {
          label: (
            <>
              <i className="feather-edit me-1"></i>
              {t('common.edit') || 'Düzenle'}
            </>
          ),
          onClick: (item) => item.id && router.push(`/admin/dashboard/branches/${item.id}/edit`),
        },
      ],
    },
  ];

  const handleRowClick = (row: Branch) => {
    if (row.id) {
      router.push(`/admin/dashboard/branches/${row.id}/edit`);
    }
  };

  if (institutionLoading || branchesLoading) {
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
          <h2>{institution?.name || t('admin.entity.institution')} - {t('admin.entity.branches')}</h2>
          <Link href={`/admin/dashboard/campuses/${institution?.campus?.id}/institutions`} className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.entity.institutionsList')}
          </Link>
        </div>
        <Link
          href={`/admin/dashboard/institutions/${institutionId}/branches/add`}
          className="rbt-btn btn-md hover-icon-reverse"
        >
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add') || 'Ekle'}</span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
          </span>
        </Link>
      </div>
      <DynamicTable
        data={branches}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
