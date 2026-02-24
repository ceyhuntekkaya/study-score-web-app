'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { useGetEventById } from '@/generated/api/event-rest-controller/event-rest-controller';
import EventForm from '@/components/admin/EventForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EditEventPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const { data: event, isLoading, error } = useGetEventById(eventId, {
    query: { enabled: !!eventId },
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <LoadingSpinner />
        <p className="mt-3">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="alert alert-danger">
        {t('error.network') || 'Etkinlik yüklenirken bir hata oluştu.'}
        <div className="mt-2">
          <Link href="/admin/dashboard/events" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.event.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.event.edit')}</h2>
          <Link href="/admin/dashboard/events" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.event.backToList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <div className="rbt-card rbt-card-body">
          <EventForm
            initialData={event}
            onSuccess={() => router.push('/admin/dashboard/events')}
            onCancel={() => router.push('/admin/dashboard/events')}
          />
        </div>
      </div>
    </>
  );
}
