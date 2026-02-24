'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllCampuss } from '@/generated/api/campus-rest-controller/campus-rest-controller';
import { useGetBrandById } from '@/generated/api/brand-rest-controller/brand-rest-controller';
import { Campus } from '@/generated/api/openAPIDefinition.schemas';
import DynamicTable from '@/components/ui/DynamicTable';
import { Column } from '@/types/ui/table';
import { useTranslation } from '@/i18n';
import { useMemo } from 'react';

export default function BrandCampusesPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const brandId = params?.id as string;

  const { data: brand, isLoading: brandLoading } = useGetBrandById(brandId, {
    query: { enabled: !!brandId },
  });
  const { data: allCampuses, isLoading: campusesLoading } = useGetAllCampuss();

  // Filter campuses by brand ID
  const campuses = useMemo(() => {
    if (!allCampuses || !brandId) return [];
    return allCampuses.filter((campus) => campus.brand?.id === brandId);
  }, [allCampuses, brandId]);

  const columns: Column<Campus>[] = [
    {
      key: 'name',
      header: t('admin.entity.campusName'),
      sortable: true,
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
          onClick: (item) => item.id && router.push(`/admin/dashboard/campuses/${item.id}/edit`),
        },
        {
          label: (
            <>
              <i className="feather-list me-1"></i>
              {t('admin.entity.institutions')}
            </>
          ),
          onClick: (item) => item.id && router.push(`/admin/dashboard/campuses/${item.id}/institutions`),
        },
      ],
    },
  ];

  const handleRowClick = (row: Campus) => {
    if (row.id) {
      router.push(`/admin/dashboard/campuses/${row.id}/edit`);
    }
  };

  if (brandLoading || campusesLoading) {
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
          <h2>{brand?.name || t('admin.entity.institution')} - {t('admin.entity.campuses')}</h2>
          <Link href="/admin/dashboard/brands" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.entity.institutionsList')}
          </Link>
        </div>
        <Link
          href={`/admin/dashboard/brands/${brandId}/campuses/add`}
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
        data={campuses}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
