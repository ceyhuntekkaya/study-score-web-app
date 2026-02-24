'use client';

import { type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useListQuestionGroups } from '@/generated/api/question-group-controller/question-group-controller';
import type { QuestionGroup } from '@/generated/api/openAPIDefinition.schemas';
import DynamicTable from '@/components/ui/DynamicTable';
import { Column } from '@/types/ui/table';
import { useTranslation } from '@/i18n';

/** Liste endpoint'i bazen examId/examName döndürebilir. */
type QuestionGroupRow = QuestionGroup & { examId?: string; examName?: string };

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
      header: t('admin.exam.groupCode') || 'Kod',
      sortable: true,
    },
    {
      key: 'category',
      header: t('admin.exam.category') || 'Kategori',
      sortable: true,
    },
    {
      key: 'examName',
      header: t('menu.exams') || 'Sınav',
      sortable: true,
      render: (value, row): ReactNode => (value != null ? String(value) : (row.examId ?? '—')),
    },
    {
      key: 'maximumScore',
      header: t('admin.exam.maxScore') || 'Maks. Puan',
      sortable: true,
      render: (value): ReactNode => (value != null ? String(value) : '—'),
    },
    {
      key: 'difficultyLevel',
      header: t('admin.exam.difficulty') || 'Zorluk',
      sortable: true,
      render: (value): ReactNode => (value != null ? String(value) : '—'),
    },
    {
      key: 'courseSection',
      header: t('admin.exam.courseSection') || 'Kurs Bölümü',
      sortable: true,
      render: (value): ReactNode => (value ?? '—') as ReactNode,
    },
    {
      key: 'usagePart',
      header: t('admin.exam.usagePart') || 'Kullanım',
      sortable: true,
      render: (value): ReactNode => (value ?? '—') as ReactNode,
    },
    {
      key: 'createdAt',
      header: t('admin.entity.createdAt') || 'Oluşturulma',
      sortable: true,
      render: (value): ReactNode => {
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
      header: t('common.actions') || 'İşlemler',
      sortable: false,
      actions: [
        {
          label: (
            <>
              <i className="feather-edit me-1" />
              {t('common.edit') || 'Düzenle'}
            </>
          ),
          onClick: (item) => item.id && router.push(`/admin/dashboard/question-groups/${item.id}/edit`),
        },
      ],
    },
  ];

  const handleRowClick = (row: QuestionGroup) => {
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
      <DynamicTable
        data={list}
        columns={columns}
        pageSize={20}
        searchable
        onRowClick={handleRowClick}
      />
    </>
  );
}
