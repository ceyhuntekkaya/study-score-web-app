'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllActiveExams } from '@/generated/api/exam-controller/exam-controller';
import type { Exam } from '@/generated/api/openAPIDefinition.schemas';
import DynamicTable from '@/components/ui/DynamicTable';
import { Column } from '@/types/ui/table';
import { useTranslation } from '@/i18n';

export default function ExamsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: exams, isLoading, error } = useGetAllActiveExams();

  const examList: Exam[] = Array.isArray(exams) ? exams : exams ? [exams] : [];

  const columns: Column<Exam>[] = [
    {
      key: 'name',
      header: t('menu.exams') || 'Sınav Adı',
      sortable: true,
    },
    {
      key: 'code',
      header: 'Kod',
      sortable: true,
    },
    {
      key: 'category',
      header: t('admin.exam.category') || 'Kategori',
      sortable: true,
    },
    {
      key: 'examType',
      header: t('admin.exam.examType') || 'Sınav Tipi',
      sortable: true,
    },
    {
      key: 'examLevel',
      header: t('admin.exam.examLevel') || 'Seviye',
      sortable: true,
    },
    {
      key: 'examParts',
      header: t('admin.exam.parts') || 'Bölümler',
      sortable: false,
      render: (_value, row) => {
        const parts = row.examParts;
        if (!parts?.length) return '0';
        return String(parts.length);
      },
    },
    {
      key: 'status',
      header: t('common.status') || 'Durum',
      sortable: true,
    },
    {
      key: 'createdAt',
      header: t('common.createdAt') || 'Oluşturulma',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value as string);
        return date.toLocaleDateString('tr-TR');
      },
    },
    {
      key: 'actions',
      header: t('common.actions') || 'İşlemler',
      sortable: false,
      actions: [
        {
          label: (
            <>
              <i className="feather-edit me-1"></i>
              {t('common.edit') || 'Düzenle'}
            </>
          ),
          onClick: (item) => item.id && router.push(`/admin/dashboard/exams/${item.id}/edit`),
        },
        {
          label: (
            <>
              <i className="feather-list me-1"></i>
              {t('admin.exam.questionGroups') || 'Soru Grupları'}
            </>
          ),
          onClick: (item) => item.id && router.push(`/admin/dashboard/exams/${item.id}/question-groups`),
        },
      ],
    },
  ];

  const handleRowClick = (row: Exam) => {
    if (row.id) {
      router.push(`/admin/dashboard/exams/${row.id}/edit`);
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
        <h2>{t('menu.exams') || 'Sınavlar'}</h2>
        <Link href="/admin/dashboard/exams/add" className="rbt-btn btn-md hover-icon-reverse">
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add') || 'Ekle'}</span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
          </span>
        </Link>
      </div>
      <DynamicTable
        data={examList}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
