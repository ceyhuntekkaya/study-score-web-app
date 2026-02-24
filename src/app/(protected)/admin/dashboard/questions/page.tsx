'use client';

import { useState, useMemo, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useListQuestionGroups } from '@/generated/api/question-group-controller/question-group-controller';
import { useGetQuestionsByGroup } from '@/generated/api/question-controller/question-controller';
import type { QuestionGroup, Question } from '@/generated/api/openAPIDefinition.schemas';
import DynamicTable from '@/components/ui/DynamicTable';
import { Column } from '@/types/ui/table';
import { useTranslation } from '@/i18n';
import { customInstance } from '@/lib/api-client';
import { Select } from '@/components/ui/Select';

/** Sentinel value for "questions without group" in the dropdown */
const STANDALONE_GROUP_ID = '__standalone__';

/** Liste endpoint'i bazen examName döndürebilir. */
type QuestionGroupOption = QuestionGroup & { examName?: string };

function normalizeGroups(data: unknown): QuestionGroupOption[] {
  if (Array.isArray(data)) return data as QuestionGroupOption[];
  if (data && typeof data === 'object' && 'content' in data) {
    const content = (data as { content?: unknown[] }).content;
    return Array.isArray(content) ? (content as QuestionGroupOption[]) : [];
  }
  return [];
}

function normalizeQuestions(data: unknown): Question[] {
  if (Array.isArray(data)) return data as Question[];
  if (data && typeof data === 'object' && 'content' in data) {
    const content = (data as { content?: unknown[] }).content;
    return Array.isArray(content) ? (content as Question[]) : [];
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

  const columns: Column<Question>[] = [
    {
      key: 'orderNumber',
      header: t('admin.lesson.orderNumber') ?? 'Sıra',
      sortable: true,
      render: (v) => (v != null ? String(v) : '—'),
    },
    {
      key: 'name',
      header: t('admin.exam.questionName') ?? 'Soru adı',
      sortable: true,
      render: (value): ReactNode => (value ?? '—') as ReactNode,
    },
    {
      key: 'questionType',
      header: t('admin.exam.questionType') ?? 'Tip',
      sortable: true,
      render: (value): ReactNode => (value ?? '—') as ReactNode,
    },
    {
      key: 'maximumScore',
      header: t('admin.exam.maxScore') ?? 'Puan',
      sortable: true,
      render: (value) => (value != null ? String(value) : '—'),
    },
    {
      key: 'difficulty',
      header: t('admin.exam.difficulty') ?? 'Zorluk',
      sortable: true,
      render: (value): ReactNode => (value ?? '—') as ReactNode,
    },
    {
      key: 'actions',
      header: t('common.actions') ?? 'İşlemler',
      sortable: false,
      actions: [
        {
          label: (
            <>
              <i className="feather-edit me-1" />
              {t('common.edit') ?? 'Düzenle'}
            </>
          ),
          onClick: (item) => item.id && router.push(`/admin/dashboard/questions/${item.id}/edit`),
        },
      ],
    },
  ];

  const handleRowClick = (row: Question) => {
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
        <Select
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
        </Select>
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
            <DynamicTable
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
