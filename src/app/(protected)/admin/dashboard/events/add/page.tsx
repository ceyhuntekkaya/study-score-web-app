'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import EventForm from '@/components/admin/EventForm';

export default function AddEventPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/dashboard/events');
  };

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.event.add')}</h2>
          <Link href="/admin/dashboard/events" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.event.backToList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="rbt-card rbt-card-body">
          <EventForm
            onSuccess={handleSuccess}
            onCancel={() => router.push('/admin/dashboard/events')}
          />
        </div>
      </div>
    </>
  );
}
