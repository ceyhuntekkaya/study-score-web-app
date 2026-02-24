'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllBrands } from '@/generated/api/brand-rest-controller/brand-rest-controller';
import { Brand } from '@/generated/api/openAPIDefinition.schemas';
import DynamicTable from '@/components/ui/DynamicTable';
import { Column } from '@/types/ui/table';
import { useTranslation } from '@/i18n';

export default function BrandsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: brands, isLoading, error } = useGetAllBrands();

  const columns: Column<Brand>[] = [
    {
      key: 'name',
      header: t('menu.institutions') || 'Kurum Adı',
      sortable: true,
    },
    {
      key: 'description',
      header: 'Açıklama',
      sortable: true,
    },
    {
      key: 'email',
      header: 'E-posta',
      sortable: true,
    },
    {
      key: 'phone',
      header: 'Telefon',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Durum',
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
      header: 'Oluşturulma',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value as string);
        return date.toLocaleDateString('tr-TR');
      },
    },
    {
      key: 'actions',
      header: 'İşlemler',
      sortable: false,
      actions: [
        {
          label: (
            <>
              <i className="feather-edit me-1"></i>
              {t('common.edit') || 'Düzenle'}
            </>
          ),
          onClick: (item) => {
            router.push(`/admin/dashboard/brands/${item.id}/edit`);
          },
        },
        {
          label: (
            <>
              <i className="feather-list me-1"></i>
              Kampüs Listesi
            </>
          ),
          onClick: (item) => {
            router.push(`/admin/dashboard/brands/${item.id}/campuses`);
          },
        },
      ],
    },
  ];

  const handleRowClick = (row: Brand) => {
    if (row.id) {
      router.push(`/admin/dashboard/brands/${row.id}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {t('error.network') || 'Veri yüklenirken bir hata oluştu.'}
      </div>
    );
  }

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <h2>{t('menu.institutions') || 'Kurumlar'}</h2>
        <Link href="/admin/dashboard/brands/add" className="rbt-btn btn-md hover-icon-reverse">
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add') || 'Ekle'}</span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
          </span>
        </Link>
      </div>
      <DynamicTable
        data={brands || []}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
