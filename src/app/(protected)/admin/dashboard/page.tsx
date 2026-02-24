'use client';

import { useTranslation } from '@/i18n';
import DashboardStatsCard from '@/components/learner/dashboard/DashboardStatsCard';
import { useGetStatistics } from '@/generated/api/admin-statistics-controller/admin-statistics-controller';

const STAT_CONFIG: Array<{
  key: keyof import('@/generated/api/openAPIDefinition.schemas').AdminStatisticsDto;
  i18nKey: string;
  icon: string;
  iconBg: string;
  color: string;
}> = [
  { key: 'institutionCount', i18nKey: 'admin.stats.institutionCount', icon: 'feather-briefcase', iconBg: 'bg-primary-opacity', color: 'color-primary' },
  { key: 'branchCount', i18nKey: 'admin.stats.branchCount', icon: 'feather-map-pin', iconBg: 'bg-secondary-opacity', color: 'color-secondary' },
  { key: 'campusCount', i18nKey: 'admin.stats.campusCount', icon: 'feather-home', iconBg: 'bg-pink-opacity', color: 'color-pink' },
  { key: 'brandCount', i18nKey: 'admin.stats.brandCount', icon: 'feather-award', iconBg: 'bg-coral-opacity', color: 'color-coral' },
  { key: 'courseCount', i18nKey: 'admin.stats.courseCount', icon: 'feather-book-open', iconBg: 'bg-primary-opacity', color: 'color-primary' },
  { key: 'examCount', i18nKey: 'admin.stats.examCount', icon: 'feather-file-text', iconBg: 'bg-warning-opacity', color: 'color-warning' },
  { key: 'questionCount', i18nKey: 'admin.stats.questionCount', icon: 'feather-help-circle', iconBg: 'bg-pink-opacity', color: 'color-pink' },
  { key: 'questionGroupCount', i18nKey: 'admin.stats.questionGroupCount', icon: 'feather-layers', iconBg: 'bg-coral-opacity', color: 'color-coral' },
  { key: 'userCount', i18nKey: 'admin.stats.userCount', icon: 'feather-users', iconBg: 'bg-secondary-opacity', color: 'color-secondary' },
  { key: 'learnerCount', i18nKey: 'admin.stats.learnerCount', icon: 'feather-user-check', iconBg: 'bg-primary-opacity', color: 'color-primary' },
  { key: 'institutionalSubscriptionCount', i18nKey: 'admin.stats.institutionalSubscriptionCount', icon: 'feather-building', iconBg: 'bg-warning-opacity', color: 'color-warning' },
  { key: 'individualSubscriptionCount', i18nKey: 'admin.stats.individualSubscriptionCount', icon: 'feather-user', iconBg: 'bg-pink-opacity', color: 'color-pink' },
  { key: 'examAttemptCount', i18nKey: 'admin.stats.examAttemptCount', icon: 'feather-edit-3', iconBg: 'bg-coral-opacity', color: 'color-coral' },
];

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError } = useGetStatistics();

  if (isLoading) {
    return (
      <>
        <div className="rbt-page-title">
          <h2>{t('admin.stats.title')}</h2>
        </div>
        <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
          <p className="text-muted">{t('admin.stats.loading')}</p>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="rbt-page-title">
          <h2>{t('admin.stats.title')}</h2>
        </div>
        <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
          <p className="text-danger">{t('admin.stats.error')}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="rbt-page-title">
        <h2>{t('admin.stats.title')}</h2>
      </div>
      <div className="row g-5">
        {STAT_CONFIG.map(({ key, i18nKey, icon, iconBg, color }) => (
          <div key={key} className="col-lg-3 col-md-4 col-sm-6 col-12">
            <DashboardStatsCard
              icon={icon}
              iconBg={iconBg}
              count={stats?.[key] ?? 0}
              label={t(i18nKey)}
              color={color}
            />
          </div>
        ))}
      </div>
    </>
  );
}
