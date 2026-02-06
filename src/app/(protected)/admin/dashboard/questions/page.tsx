'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useListQuestionGroups } from '@/generated/api/question-group-controller/question-group-controller';
import { useGetQuestionsByGroup } from '@/generated/api/question-controller/question-controller';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useTranslation } from '@/i18n';
import { customInstance } from '@/lib/api-client';

/** Sentinel value for "questions without group" in the dropdown */
const STANDALONE_GROUP_ID = '__standalone__';

type QuestionGroupRow = {
  id?: string;
  code?: string;
  category?: string;
  examId?: string;
  examName?: string;
  [key: string]: unknown;
};

type QuestionRow = {
  id?: string;
  name?: string;
  questionType?: string;
  maximumScore?: number;
  difficulty?: string;
  questionText?: string;
  questionGroupId?: string;
  orderNumber?: number;
  [key: string]: unknown;
};

function normalizeGroups(data: unknown): QuestionGroupRow[] {
  if (Array.isArray(data)) return data as QuestionGroupRow[];
  if (data && typeof data === 'object' && 'content' in data) {
    const content = (data as { content?: unknown[] }).content;
    return Array.isArray(content) ? (content as QuestionGroupRow[]) : [];
  }
  return [];
}

function normalizeQuestions(data: unknown): QuestionRow[] {
  if (Array.isArray(data)) return data as QuestionRow[];
  if (data && typeof data === 'object' && 'content' in data) {
    const content = (data as { content?: unknown[] }).content;
    return Array.isArray(content) ? (content as QuestionRow[]) : [];
  }
  return [];
}

/** Fetches questions that have no question group (standalone). Backend: GET /exams/questions/standalone */
async function fetchStandaloneQuestions(): Promise<unknown> {
  return customInstance<unknown>({
    url: '/exams/questions/standalone',
    method: 'GET',
  });
}

export default function QuestionsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const isStandalone = selectedGroupId === STANDALONE_GROUP_ID;
  const groupIdForApi = isStandalone ? '' : (selectedGroupId ?? '');

  const { data: groupsData, isLoading: groupsLoading, error: groupsError } = useListQuestionGroups();
  const groups = useMemo(() => normalizeGroups(groupsData), [groupsData]);

  const { data: questionsByGroupData, isLoading: questionsByGroupLoading, error: questionsByGroupError } = useGetQuestionsByGroup(
    groupIdForApi,
    { query: { enabled: !!groupIdForApi } }
  );

  const { data: standaloneData, isLoading: standaloneLoading, error: standaloneError } = useQuery({
    queryKey: ['questions', 'standalone'],
    queryFn: fetchStandaloneQuestions,
    enabled: isStandalone,
  });

  const questionsData = isStandalone ? standaloneData : questionsByGroupData;
  const questionsLoading = isStandalone ? standaloneLoading : questionsByGroupLoading;
  const questionsError = isStandalone ? standaloneError : questionsByGroupError;
  const questions = useMemo(() => normalizeQuestions(questionsData), [questionsData]);

  const columns: Column<QuestionRow>[] = [
    {
      key: 'orderNumber',
      label: t('admin.lesson.orderNumber') ?? 'Sıra',
      sortable: true,
      render: (v) => (v != null ? String(v) : '—'),
    },
    {
      key: 'name',
      label: t('admin.exam.questionName') ?? 'Soru adı',
      sortable: true,
      render: (value) => value ?? '—',
    },
    {
      key: 'questionType',
      label: t('admin.exam.questionType') ?? 'Tip',
      sortable: true,
      render: (value) => value ?? '—',
    },
    {
      key: 'maximumScore',
      label: t('admin.exam.maxScore') ?? 'Puan',
      sortable: true,
      render: (value) => (value != null ? String(value) : '—'),
    },
    {
      key: 'difficulty',
      label: t('admin.exam.difficulty') ?? 'Zorluk',
      sortable: true,
      render: (value) => value ?? '—',
    },
    {
      key: 'actions',
      label: t('common.actions') ?? 'İşlemler',
      sortable: false,
      clickable: true,
      render: (_, row) =>
        row.id ? (
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/dashboard/questions/${row.id}/edit`);
            }}
            title={t('common.edit') ?? 'Düzenle'}
          >
            <i className="feather-edit me-1" />
            {t('common.edit') ?? 'Düzenle'}
          </button>
        ) : null,
    },
  ];

  const handleRowClick = (row: QuestionRow) => {
    if (row.id) router.push(`/admin/dashboard/questions/${row.id}/edit`);
  };

  if (groupsLoading) {
    return (
      <div className="text-center py-5">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (groupsError) {
    return (
      <div className="alert alert-danger">
        {t('error.network') ?? 'Veri yüklenirken bir hata oluştu.'}
      </div>
    );
  }

  return (
    <>
      <div className="rbt-page-title d-flex flex-wrap justify-content-between align-items-center gap-2 mb--20">
        <h2>{t('menu.questions') ?? 'Sorular'}</h2>
        <Link href="/admin/dashboard/questions/add" className="rbt-btn btn-md hover-icon-reverse">
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('admin.exam.addQuestion') ?? 'Soru Ekle'}</span>
            <span className="btn-icon"><i className="feather-plus" /></span>
            <span className="btn-icon"><i className="feather-plus" /></span>
          </span>
        </Link>
      </div>

      <div className="mb-4">
        <label className="form-label">{t('menu.questionGroups') ?? 'Soru grubu'}</label>
        <select
          className="form-select"
          value={selectedGroupId ?? ''}
          onChange={(e) => setSelectedGroupId(e.target.value || null)}
        >
          <option value="">— {t('common.search') ?? 'Seçiniz'} —</option>
          <option value={STANDALONE_GROUP_ID}>
            {t('admin.exam.standaloneQuestions') ?? 'Bağımsız sorular (grubu yok)'}
          </option>
          {groups.map((g) => (
            <option key={g.id} value={g.id ?? ''}>
              {g.code ?? g.id} {g.examName ? `(${g.examName})` : ''}
            </option>
          ))}
        </select>
      </div>

      {!selectedGroupId && (
        <p className="text-muted">{t('admin.exam.selectQuestionGroupToViewQuestions') ?? 'Soru listesini görmek için bir soru grubu seçin veya bağımsız soruları listeleyin.'}</p>
      )}

      {selectedGroupId && (
        <>
          {questionsLoading && (
            <div className="text-center py-4">
              <p>{t('common.loading')}</p>
            </div>
          )}
          {questionsError && (
            <div className="alert alert-danger">
              {t('error.network') ?? 'Sorular yüklenirken bir hata oluştu.'}
            </div>
          )}
          {!questionsLoading && !questionsError && (
            <DataTable
              data={questions}
              columns={columns}
              pageSize={20}
              searchable
              onRowClick={handleRowClick}
            />
          )}
        </>
      )}
    </>
  );
}
