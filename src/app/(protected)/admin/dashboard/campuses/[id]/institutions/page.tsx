'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllInstitutions } from '@/generated/api/institution-rest-controller/institution-rest-controller';
import { useGetCampusById } from '@/generated/api/campus-rest-controller/campus-rest-controller';
import { Institution } from '@/generated/api/openAPIDefinition.schemas';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useTranslation } from '@/i18n';
import { useMemo } from 'react';

export default function CampusInstitutionsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const campusId = params?.id as string;

  const { data: campus, isLoading: campusLoading } = useGetCampusById(campusId, {
    query: { enabled: !!campusId },
  });
  const { data: allInstitutions, isLoading: institutionsLoading } = useGetAllInstitutions();

  // Filter institutions by campus ID
  const institutions = useMemo(() => {
    if (!allInstitutions || !campusId) return [];
    return allInstitutions.filter((institution) => institution.campus?.id === campusId);
  }, [allInstitutions, campusId]);

  const columns: Column<Institution>[] = [
    {
      key: 'name',
      label: t('admin.entity.institutionName'),
      sortable: true,
    },
    {
      key: 'status',
      label: t('admin.entity.status'),
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
      label: t('admin.entity.createdAt'),
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value as string);
        return date.toLocaleDateString('tr-TR');
      },
    },
    {
      key: 'edit',
      label: t('common.edit'),
      sortable: false,
      clickable: true,
      render: (value, row) => {
        return (
          <button
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/dashboard/institutions/${row.id}/edit`);
            }}
          >
            <i className="feather-edit me-1"></i>
            {t('common.edit') || 'Düzenle'}
          </button>
        );
      },
    },
    {
      key: 'actions',
      label: t('common.actions'),
      sortable: false,
      clickable: true,
      render: (value, row) => {
        return (
          <button
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/dashboard/institutions/${row.id}/branches`);
            }}
          >
            <i className="feather-list me-1"></i>
            {t('admin.entity.branchList')}
          </button>
        );
      },
    },
  ];

  const handleRowClick = (row: Institution) => {
    if (row.id) {
      router.push(`/admin/dashboard/institutions/${row.id}/edit`);
    }
  };

  if (campusLoading || institutionsLoading) {
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
          <h2>{campus?.name || t('admin.entity.campus')} - {t('admin.entity.institutions')}</h2>
          <Link href={`/admin/dashboard/brands/${campus?.brand?.id}/campuses`} className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.entity.campusesList')}
          </Link>
        </div>
        <Link
          href={`/admin/dashboard/campuses/${campusId}/institutions/add`}
          className="rbt-btn btn-md hover-icon-reverse"
        >
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add') || 'Ekle'}</span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
          </span>
        </Link>
      </div>
      <DataTable
        data={institutions}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
