'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllActiveExams } from '@/generated/api/exam-controller/exam-controller';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useTranslation } from '@/i18n';

// Exam type - API'den dönen veri yapısına göre
type Exam = {
  id?: string;
  name?: string;
  code?: string;
  examType?: string;
  examLevel?: string;
  timeLimitMinutes?: number;
  passingScorePercentage?: number;
  maxAttempts?: number;
  status?: string;
  createdAt?: string;
  availableFrom?: string;
  availableUntil?: string;
  [key: string]: any;
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
      key: 'examType',
      label: 'Sınav Tipi',
      sortable: true,
    },
    {
      key: 'examLevel',
      label: 'Seviye',
      sortable: true,
    },
    {
      key: 'timeLimitMinutes',
      label: 'Süre (Dakika)',
      sortable: true,
      render: (value) => {
        return value ? `${value} dk` : '-';
      },
    },
    {
      key: 'passingScorePercentage',
      label: 'Geçme Notu (%)',
      sortable: true,
      render: (value) => {
        return value ? `%${value}` : '-';
      },
    },
    {
      key: 'maxAttempts',
      label: 'Maksimum Deneme',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Oluşturulma Tarihi',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value as string);
        return date.toLocaleDateString('tr-TR');
      },
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
              router.push(`/admin/dashboard/exams/${row.id}/edit`);
            }}
          >
            <i className="feather-edit me-1"></i>
            {t('common.edit') || 'Düzenle'}
          </button>
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
