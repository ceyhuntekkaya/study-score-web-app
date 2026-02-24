'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useGetAllEvents,
  useDeleteEvent,
} from '@/generated/api/event-rest-controller/event-rest-controller';
import { useQueryClient } from '@tanstack/react-query';
import { Event } from '@/generated/api/openAPIDefinition.schemas';
import DynamicTable from '@/components/ui/DynamicTable';
import { Column } from '@/types/ui/table';
import { useTranslation } from '@/i18n';
import { getGetAllEventsQueryKey } from '@/generated/api/event-rest-controller/event-rest-controller';

export default function EventsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: events, isLoading, error } = useGetAllEvents({ activeOnly: false });
  const deleteEvent = useDeleteEvent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAllEventsQueryKey({ activeOnly: false }) });
      },
    },
  });

  const columns: Column<Event>[] = [
    {
      key: 'startDate',
      header: t('admin.event.startDate'),
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        return new Date(value as string).toLocaleDateString('tr-TR');
      },
    },
    {
      key: 'endDate',
      header: t('admin.event.endDate'),
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        return new Date(value as string).toLocaleDateString('tr-TR');
      },
    },
    {
      key: 'time',
      header: t('admin.event.time'),
      sortable: true,
      render: (value) => (value ? String(value) : '-'),
    },
    {
      key: 'location',
      header: t('admin.event.location'),
      sortable: true,
      render: (value) => (value ? String(value) : '-'),
    },
    {
      key: 'category',
      header: t('admin.event.category'),
      sortable: true,
      render: (value) => (value ? String(value) : '-'),
    },
    {
      key: 'available',
      header: t('admin.event.available'),
      sortable: true,
      render: (value) => (value != null ? String(value) : '-'),
    },
    {
      key: 'status',
      header: t('common.status'),
      sortable: true,
      render: (value) => {
        const status = value as string;
        const statusClass =
          status === 'ACTIVE'
            ? 'badge bg-success'
            : status === 'PASSIVE'
              ? 'badge bg-warning'
              : 'badge bg-secondary';
        return <span className={statusClass}>{status || '-'}</span>;
      },
    },
    {
      key: 'actions',
      header: t('common.actions'),
      sortable: false,
      actions: [
        {
          label: (
            <>
              <i className="feather-edit me-1"></i>
              {t('common.edit')}
            </>
          ),
          onClick: (item) => item.id && router.push(`/admin/dashboard/events/${item.id}/edit`),
        },
        {
          label: (
            <>
              <i className="feather-trash-2 me-1"></i>
              {t('common.delete')}
            </>
          ),
          onClick: (item) => {
            if (!item.id || !window.confirm(t('admin.event.confirmDelete'))) return;
            deleteEvent.mutate({ eventId: item.id });
          },
        },
      ],
    },
  ];

  const handleRowClick = (row: Event) => {
    if (row.id) {
      router.push(`/admin/dashboard/events/${row.id}/edit`);
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
        <h2>{t('admin.event.title')}</h2>
        <Link href="/admin/dashboard/events/add" className="rbt-btn btn-md hover-icon-reverse">
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add')}</span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
          </span>
        </Link>
      </div>
      <DynamicTable
        data={events || []}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
