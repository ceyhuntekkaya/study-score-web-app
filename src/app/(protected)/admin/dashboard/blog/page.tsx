'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useGetAllBlogs,
  useDeleteBlog,
} from '@/generated/api/blog-rest-controller/blog-rest-controller';
import { useQueryClient } from '@tanstack/react-query';
import { Blog } from '@/generated/api/openAPIDefinition.schemas';
import DynamicTable from '@/components/ui/DynamicTable';
import { Column } from '@/types/ui/table';
import { useTranslation } from '@/i18n';
import { getGetAllBlogsQueryKey } from '@/generated/api/blog-rest-controller/blog-rest-controller';

export default function BlogPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: blogs, isLoading, error } = useGetAllBlogs({ activeOnly: false });
  const deleteBlog = useDeleteBlog({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAllBlogsQueryKey({ activeOnly: false }) });
      },
    },
  });

  const columns: Column<Blog>[] = [
    {
      key: 'title',
      header: t('admin.blog.titleField'),
      sortable: true,
      render: (value) => (value ? String(value) : '-'),
    },
    {
      key: 'shortDescription',
      header: t('admin.blog.shortDescription'),
      sortable: true,
      render: (value) => (value ? String(value).slice(0, 50) + (String(value).length > 50 ? '…' : '') : '-'),
    },
    {
      key: 'category',
      header: t('admin.blog.category'),
      sortable: true,
      render: (value) => (value && typeof value === 'object' && 'name' in value ? String((value as { name?: string }).name) : '-'),
    },
    {
      key: 'createdAt',
      header: t('common.createdAt'),
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        return new Date(value as string).toLocaleDateString('tr-TR');
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
          onClick: (item) => item.id && router.push(`/admin/dashboard/blog/${item.id}/edit`),
        },
        {
          label: (
            <>
              <i className="feather-trash-2 me-1"></i>
              {t('common.delete')}
            </>
          ),
          onClick: (item) => {
            if (!item.id || !window.confirm(t('admin.blog.confirmDelete'))) return;
            deleteBlog.mutate({ blogId: item.id });
          },
        },
      ],
    },
  ];

  const handleRowClick = (row: Blog) => {
    if (row.id) {
      router.push(`/admin/dashboard/blog/${row.id}/edit`);
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
        <h2>{t('admin.blog.title')}</h2>
        <Link href="/admin/dashboard/blog/add" className="rbt-btn btn-md hover-icon-reverse">
          <span className="icon-reverse-wrapper">
            <span className="btn-text">{t('common.add')}</span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
            <span className="btn-icon"><i className="feather-plus"></i></span>
          </span>
        </Link>
      </div>
      <DynamicTable
        data={blogs || []}
        columns={columns}
        pageSize={20}
        searchable={true}
        onRowClick={handleRowClick}
      />
    </>
  );
}
