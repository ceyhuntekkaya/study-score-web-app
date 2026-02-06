'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useListQuestionGroups } from '@/generated/api/question-group-controller/question-group-controller';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useTranslation } from '@/i18n';

type QuestionGroupRow = {
  id?: string;
  code?: string;
  category?: string;
  examId?: string;
  examName?: string;
  maximumScore?: number;
  difficultyLevel?: number;
  courseSection?: string;
  usagePart?: string;
  createdAt?: string;
  [key: string]: unknown;
};

function normalizeListResponse(data: unknown): QuestionGroupRow[] {
  if (Array.isArray(data)) return data as QuestionGroupRow[];
  if (data && typeof data === 'object' && 'content' in data) {
    const content = (data as { content?: unknown[] }).content;
    return Array.isArray(content) ? (content as QuestionGroupRow[]) : [];
  }
  return [];
}

export default function QuestionGroupsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading, error } = useListQuestionGroups();

  const list = normalizeListResponse(data);

  const columns: Column<QuestionGroupRow>[] = [
    {
      key: 'code',
      label: t('admin.exam.groupCode') || 'Kod',
      sortable: true,
    },
    {
      key: 'category',
      label: t('admin.exam.category') || 'Kategori',
      sortable: true,
    },
    {
      key: 'examName',
      label: t('menu.exams') || 'Sınav',
      sortable: true,
      render: (value, row) => value ?? row.examId ?? '—',
    },
    {
      key: 'maximumScore',
      label: t('admin.exam.maxScore') || 'Maks. Puan',
      sortable: true,
      render: (value) => (value != null ? String(value) : '—'),
    },
    {
      key: 'difficultyLevel',
      label: t('admin.exam.difficulty') || 'Zorluk',
      sortable: true,
      render: (value) => (value != null ? String(value) : '—'),
    },
    {
      key: 'courseSection',
      label: t('admin.exam.courseSection') || 'Kurs Bölümü',
      sortable: true,
      render: (value) => value ?? '—',
    },
    {
      key: 'usagePart',
      label: t('admin.exam.usagePart') || 'Kullanım',
      sortable: true,
      render: (value) => value ?? '—',
    },
    {
      key: 'createdAt',
      label: t('admin.entity.createdAt') || 'Oluşturulma',
      sortable: true,
      render: (value) => {
        if (!value) return '—';
        try {
          return new Date(value as string).toLocaleDateString('tr-TR');
        } catch {
          return '—';
        }
      },
    },
    {
      key: 'actions',
      label: t('common.actions') || 'İşlemler',
      sortable: false,
      clickable: true,
      render: (_, row) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={(e) => {
              e.stopPropagation();
              if (row.id) router.push(`/admin/dashboard/question-groups/${row.id}/edit`);
            }}
            title={t('common.edit') || 'Düzenle'}
          >
            <i className="feather-edit me-1" />
            {t('common.edit') || 'Düzenle'}
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = (row: QuestionGroupRow) => {
    if (row.id) router.push(`/admin/dashboard/question-groups/${row.id}/edit`);
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
        <h2>{t('menu.questionGroups') || 'Soru Grupları'}</h2>
        <Link
          href="/admin/dashboard/question-groups/add"
          className="rbt-btn btn-md hover-icon-reverse"
        >
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add') || 'Ekle'}</span>
            <span className="btn-icon"><i className="feather-plus" /></span>
            <span className="btn-icon"><i className="feather-plus" /></span>
          </span>
        </Link>
      </div>
      <DataTable
        data={list}
        columns={columns}
        pageSize={20}
        searchable
        onRowClick={handleRowClick}
      />
    </>
  );
}
