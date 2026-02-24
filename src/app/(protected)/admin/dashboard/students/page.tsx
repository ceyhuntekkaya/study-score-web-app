'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useTranslation } from '@/i18n';
import { useListLearners } from '@/generated/api/admin-learner-controller/admin-learner-controller';
import type { User } from '@/generated/api/openAPIDefinition.schemas';
import { useGetAllBranchs } from '@/generated/api/branch-rest-controller/branch-rest-controller';
import { useGetAllInstitutions } from '@/generated/api/institution-rest-controller/institution-rest-controller';

const PAGE_SIZE = 20;

export default function StudentsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [branchId, setBranchId] = useState<string>('');
  const [institutionId, setInstitutionId] = useState<string>('');
  const [individualOnly, setIndividualOnly] = useState<boolean | ''>('');

  const { data, isLoading, isError } = useListLearners({
    pageable: { page, size: PAGE_SIZE },
    ...(branchId ? { branchId } : {}),
    ...(institutionId ? { institutionId } : {}),
    ...(individualOnly === true || individualOnly === false ? { individualOnly } : {}),
  });

  const { data: branches } = useGetAllBranchs();
  const { data: institutions } = useGetAllInstitutions();

  const content = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const handleRowClick = (row: User) => {
    if (row.id) {
      router.push(`/admin/dashboard/students/${row.id}`);
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'username',
      label: t('admin.learner.username') ?? 'Kullanıcı adı',
      sortable: true,
      render: (v) => v ?? '—',
    },
    {
      key: 'name',
      label: t('admin.learner.name') ?? 'Ad',
      sortable: true,
      render: (_, row) => [row.name, row.lastName].filter(Boolean).join(' ') || '—',
    },
    {
      key: 'email',
      label: t('common.email') ?? 'E-posta',
      sortable: true,
      render: (v) => v ?? '—',
    },
    {
      key: 'branch',
      label: t('admin.entity.branch') ?? 'Şube',
      sortable: false,
      render: (_, row) => row.branch?.name ?? (row.individualLearner ? (t('admin.learner.individual') ?? 'Bireysel') : '—'),
    },
    {
      key: 'actions',
      label: t('common.actions') ?? 'İşlemler',
      sortable: false,
      clickable: true,
      render: (_, row) =>
        row.id ? (
          <>
            <button
              type="button"
              className="rbt-btn btn-sm btn-border-gradient me-1"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/dashboard/students/${row.id}`);
              }}
              title={t('admin.learner.view') ?? 'Görüntüle'}
            >
              <i className="feather-eye me-1" />
              {t('admin.learner.view') ?? 'Görüntüle'}
            </button>
            <button
              type="button"
              className="rbt-btn btn-sm btn-border-gradient"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/dashboard/students/${row.id}/edit`);
              }}
              title={t('common.edit') ?? 'Düzenle'}
            >
              <i className="feather-edit me-1" />
              {t('common.edit') ?? 'Düzenle'}
            </button>
          </>
        ) : null,
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger">
        {t('error.network') ?? 'Veri yüklenirken bir hata oluştu.'}
      </div>
    );
  }

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <h2>{t('menu.students') ?? 'Öğrenciler'}</h2>
        <Link href="/admin/dashboard/students/add" className="rbt-btn btn-md hover-icon-reverse">
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add') ?? 'Ekle'}</span>
            <span className="btn-icon"><i className="feather-plus" /></span>
            <span className="btn-icon"><i className="feather-plus" /></span>
          </span>
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">{t('admin.entity.branch') ?? 'Şube'}</label>
          <select
            className="form-select"
            value={branchId}
            onChange={(e) => {
              setBranchId(e.target.value);
              setPage(0);
            }}
          >
            <option value="">— {t('common.search') ?? 'Tümü'}</option>
            {branches?.map((b) => (
              <option key={b.id} value={b.id ?? ''}>{b.name ?? b.id}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">{t('admin.entity.institution') ?? 'Kurum'}</label>
          <select
            className="form-select"
            value={institutionId}
            onChange={(e) => {
              setInstitutionId(e.target.value);
              setPage(0);
            }}
          >
            <option value="">— {t('common.search') ?? 'Tümü'}</option>
            {institutions?.map((i) => (
              <option key={i.id} value={i.id ?? ''}>{i.name ?? i.id}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">{t('admin.learner.type') ?? 'Tip'}</label>
          <select
            className="form-select"
            value={individualOnly === '' ? '' : String(individualOnly)}
            onChange={(e) => {
              const v = e.target.value;
              setIndividualOnly(v === '' ? '' : v === 'true');
              setPage(0);
            }}
          >
            <option value="">{t('admin.learner.all') ?? 'Tümü'}</option>
            <option value="true">{t('admin.learner.individualOnly') ?? 'Bireysel'}</option>
            <option value="false">{t('admin.learner.corporateOnly') ?? 'Kurumsal'}</option>
          </select>
        </div>
      </div>

      <DataTable
        data={content}
        columns={columns}
        pageSize={PAGE_SIZE}
        searchable={true}
        onRowClick={handleRowClick}
      />

      {totalPages > 1 && (
        <div className="rbt-pagination-wrapper mt--20">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <i className="feather-chevron-left" />
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {t('common.showing') ?? 'Showing'} {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalElements)} {t('common.of') ?? 'of'} {totalElements}
                </span>
              </li>
              <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  <i className="feather-chevron-right" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
