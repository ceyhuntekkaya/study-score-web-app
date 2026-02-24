'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { useGetLearner } from '@/generated/api/admin-learner-controller/admin-learner-controller';

export default function StudentDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params?.id as string;

  const { data: learner, isLoading, isError } = useGetLearner(id, {
    query: { enabled: !!id },
  });

  if (!id) {
    return (
      <div className="alert alert-warning">
        {t('admin.learner.view') ?? 'Öğrenci'} — ID gerekli.
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
          <div>
            <h2>{t('admin.learner.view') ?? 'Öğrenci Görüntüle'}</h2>
            <Link href="/admin/dashboard/students" className="rbt-btn-link">
              <i className="feather-arrow-left me-1" />
              {t('admin.entity.backToStudentsList')}
            </Link>
          </div>
        </div>
        <div className="rbt-dashboard-content bg-color-white rbt-shadow-box p-4">
          <p className="text-muted mb-0">{t('common.loading')}</p>
        </div>
      </>
    );
  }

  if (isError || !learner) {
    return (
      <>
        <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
          <div>
            <h2>{t('admin.learner.view') ?? 'Öğrenci Görüntüle'}</h2>
            <Link href="/admin/dashboard/students" className="rbt-btn-link">
              <i className="feather-arrow-left me-1" />
              {t('admin.entity.backToStudentsList')}
            </Link>
          </div>
        </div>
        <div className="rbt-dashboard-content bg-color-white rbt-shadow-box p-4">
          <p className="text-danger mb-0">
            {t('error.network') ?? 'Öğrenci yüklenemedi.'} (ID: {id})
          </p>
        </div>
      </>
    );
  }

  const fullName = [learner.name, learner.lastName].filter(Boolean).join(' ') || '—';
  const isIndividual = learner.individualLearner ?? !learner.branch;

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{fullName}</h2>
          <Link href="/admin/dashboard/students" className="rbt-btn-link">
            <i className="feather-arrow-left me-1" />
            {t('admin.entity.backToStudentsList')}
          </Link>
        </div>
        <Link
          href={`/admin/dashboard/students/${id}/edit`}
          className="rbt-btn btn-md btn-border-gradient"
        >
          <i className="feather-edit me-1" />
          {t('common.edit') ?? 'Düzenle'}
        </Link>
      </div>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box p-4">
        <dl className="row mb-0">
          <dt className="col-sm-3 text-muted">{t('admin.learner.username') ?? 'Kullanıcı adı'}</dt>
          <dd className="col-sm-9">{learner.username ?? '—'}</dd>

          <dt className="col-sm-3 text-muted">{t('form.label.name') ?? 'Ad'}</dt>
          <dd className="col-sm-9">{learner.name ?? '—'}</dd>

          <dt className="col-sm-3 text-muted">{t('form.label.lastName') ?? 'Soyad'}</dt>
          <dd className="col-sm-9">{learner.lastName ?? '—'}</dd>

          <dt className="col-sm-3 text-muted">{t('common.email') ?? 'E-posta'}</dt>
          <dd className="col-sm-9">{learner.email ?? '—'}</dd>

          <dt className="col-sm-3 text-muted">{t('form.label.mobilePhone') ?? 'Cep telefonu'}</dt>
          <dd className="col-sm-9">{learner.mobilePhone ?? '—'}</dd>

          <dt className="col-sm-3 text-muted">{t('admin.learner.type') ?? 'Tip'}</dt>
          <dd className="col-sm-9">
            {isIndividual ? (t('admin.learner.individual') ?? 'Bireysel') : (t('admin.learner.corporate') ?? 'Kurumsal')}
          </dd>

          {!isIndividual && (
            <>
              <dt className="col-sm-3 text-muted">{t('admin.entity.branch') ?? 'Şube'}</dt>
              <dd className="col-sm-9">{learner.branch?.name ?? '—'}</dd>
              <dt className="col-sm-3 text-muted">{t('admin.entity.institution') ?? 'Kurum'}</dt>
              <dd className="col-sm-9">{learner.institution?.name ?? '—'}</dd>
              <dt className="col-sm-3 text-muted">{t('admin.entity.campus') ?? 'Kampüs'}</dt>
              <dd className="col-sm-9">{learner.campus?.name ?? '—'}</dd>
              <dt className="col-sm-3 text-muted">{t('admin.entity.brand') ?? 'Marka'}</dt>
              <dd className="col-sm-9">{learner.brand?.name ?? '—'}</dd>
            </>
          )}

          <dt className="col-sm-3 text-muted">{t('common.status') ?? 'Durum'}</dt>
          <dd className="col-sm-9">
            <span className={`badge ${learner.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
              {learner.status ?? '—'}
            </span>
          </dd>
        </dl>
      </div>
    </>
  );
}
