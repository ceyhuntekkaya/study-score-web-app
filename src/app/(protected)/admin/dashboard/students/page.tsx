'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useTranslation } from '@/i18n';

// Student type - şimdilik boş
type Student = {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
};

export default function StudentsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  // Şimdilik boş liste
  const students: Student[] = [];

  const handleRowClick = (row: Student) => {
    if (row.id) {
      router.push(`/admin/dashboard/students/${row.id}/edit`);
    }
  };

  const columns: Column<Student>[] = [
    {
      key: 'name',
      label: 'Öğrenci Adı',
      sortable: true,
    },
    {
      key: 'email',
      label: 'E-posta',
      sortable: true,
    },
    {
      key: 'edit',
      label: 'Düzenle',
      sortable: false,
      clickable: true,
      render: (value, row) => {
        return (
          <button
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/dashboard/students/${row.id}/edit`);
            }}
          >
            <i className="feather-edit me-1"></i>
            {t('common.edit') || 'Düzenle'}
          </button>
        );
      },
    },
  ];

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <h2>{t('menu.students') || 'Öğrenciler'}</h2>
        <Link href="/admin/dashboard/students/add" className="rbt-btn btn-md hover-icon-reverse">
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add') || 'Ekle'}</span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
          </span>
        </Link>
      </div>
      <DataTable
        data={students}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
