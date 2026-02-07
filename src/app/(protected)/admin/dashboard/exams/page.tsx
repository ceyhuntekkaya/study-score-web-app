'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllActiveExams } from '@/generated/api/exam-controller/exam-controller';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useTranslation } from '@/i18n';

// Exam type - API referansına göre (Exam, ExamPart, ExamItem yapısı)
type Exam = {
  id?: string;
  name?: string;
  code?: string;
  category?: string;
  examLevel?: string;
  examType?: string;
  configuration?: Record<string, unknown>;
  examParts?: Array<{ id: string; name: string; orderNumber?: number }>;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export default function ExamsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: exams, isLoading, error } = useGetAllActiveExams();

  // API'den dönen veriyi Exam array'ine dönüştür
  const examList: Exam[] = Array.isArray(exams) ? exams : exams ? [exams] : [];

  const columns: Column<Exam>[] = [
    {
      key: 'name',
      label: t('menu.exams') || 'Sınav Adı',
      sortable: true,
    },
    {
      key: 'code',
      label: 'Kod',
      sortable: true,
    },
    {
      key: 'category',
      label: t('admin.exam.category') || 'Kategori',
      sortable: true,
    },
    {
      key: 'examType',
      label: t('admin.exam.examType') || 'Sınav Tipi',
      sortable: true,
    },
    {
      key: 'examLevel',
      label: t('admin.exam.examLevel') || 'Seviye',
      sortable: true,
    },
    {
      key: 'examParts',
      label: t('admin.exam.parts') || 'Bölümler',
      sortable: false,
      render: (_value, row) => {
        const parts = row.examParts;
        if (!parts?.length) return '0';
        return String(parts.length);
      },
    },
    {
      key: 'status',
      label: t('common.status') || 'Durum',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: t('common.createdAt') || 'Oluşturulma Tarihi',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value as string);
        return date.toLocaleDateString('tr-TR');
      },
    },
    {
      key: 'actions',
      label: t('common.actions') || 'İşlemler',
      sortable: false,
      clickable: true,
      render: (value, row) => {
        return (
          <div className="d-flex gap-2">
            <button
              className="rbt-btn btn-sm btn-border-gradient"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/dashboard/exams/${row.id}/edit`);
              }}
              title={t('common.edit') || 'Düzenle'}
            >
              <i className="feather-edit me-1"></i>
              {t('common.edit') || 'Düzenle'}
            </button>
            <button
              className="rbt-btn btn-sm btn-border"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/dashboard/exams/${row.id}/question-groups`);
              }}
              title={t('admin.exam.questionGroups') || 'Soru Grupları'}
            >
              <i className="feather-list me-1"></i>
              {t('admin.exam.questionGroups') || 'Soru Grupları'}
            </button>
          </div>
        );
      },
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
      <DataTable
        data={examList}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
