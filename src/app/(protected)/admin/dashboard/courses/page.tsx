'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllCourses } from '@/generated/api/course-rest-controller/course-rest-controller';
import { Course } from '@/generated/api/openAPIDefinition.schemas';
import DynamicTable from '@/components/ui/DynamicTable';
import { Column } from '@/types/ui/table';
import { useTranslation } from '@/i18n';

export default function CoursesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: courses, isLoading, error } = useGetAllCourses();

  const columns: Column<Course>[] = [
    {
      key: 'name',
      header: t('menu.courses') || 'Kurs Adı',
      sortable: true,
    },
    {
      key: 'code',
      header: 'Kod',
      sortable: true,
    },
    {
      key: 'category',
      header: 'Kategori',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const category = typeof value === 'string' ? value : (value as any)?.name || value;
        return <span>{category}</span>;
      },
    },
    {
      key: 'level',
      header: 'Seviye',
      sortable: true,
    },
    {
      key: 'language',
      header: 'Dil',
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
          onClick: (item) => item.id && router.push(`/admin/dashboard/courses/${item.id}/edit`),
        },
      ],
    },
  ];

  const handleRowClick = (row: Course) => {
    if (row.id) {
      router.push(`/admin/dashboard/courses/${row.id}/edit`);
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
        <h2>{t('menu.courses') || 'Kurslar'}</h2>
        <Link href="/admin/dashboard/courses/add" className="rbt-btn btn-md hover-icon-reverse">
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add') || 'Ekle'}</span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
          </span>
        </Link>
      </div>
      <DynamicTable
        data={courses || []}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
