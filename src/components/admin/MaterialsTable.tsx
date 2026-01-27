"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";
import {
  useGetCourseLessonPartMaterialByCourseLessonId,
} from "@/generated/api/course-lesson-part-material-rest-controller/course-lesson-part-material-rest-controller";
import { CourseLessonPartMaterial, CourseLessonPartMaterialDetailDTO } from "@/generated/api/openAPIDefinition.schemas";
import DynamicTable from "@/components/ui/DynamicTable";
import { Column } from "@/types/ui/table";
import MaterialForm from "./MaterialForm";
import MaterialRenderer from "@/components/learner/content/MaterialRenderer";
import { Button } from "@/components/ui/Button";

interface MaterialsTableProps {
  partId: string;
  onClose?: () => void;
}

export default function MaterialsTable({ partId, onClose }: MaterialsTableProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<CourseLessonPartMaterial | null>(null);
  const [previewData, setPreviewData] = useState<CourseLessonPartMaterialDetailDTO | null>(null);

  const { data: materials, isLoading, error, refetch } = useGetCourseLessonPartMaterialByCourseLessonId(
    partId,
    {
      query: { enabled: !!partId },
    }
  );

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingMaterial(null);
    setPreviewData(null);
  };

  const handleEditClick = (material: CourseLessonPartMaterial) => {
    setEditingMaterial(material);
    setShowAddForm(false);
    // Set initial preview data - try to get name and description from various sources
    const materialWithDetails = material as any;
    const name = 
      materialWithDetails.name || 
      materialWithDetails.uploadedFileName ||
      "";
    const description = materialWithDetails.description || "";
    
    setPreviewData({
      id: material.id,
      name: name,
      description: description,
      content: material.content || "",
      mediaType: material.mediaType as any,
      orderNumber: material.orderNumber || 0,
      duration: material.duration || 0,
      courseLessonPartId: partId,
      uploadedFileId: materialWithDetails.uploadedFileId || material.uploadedFile?.id,
      uploadedFileName: materialWithDetails.uploadedFileName || material.uploadedFile?.fileOriginalName || material.uploadedFile?.fileName,
    });
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingMaterial(null);
    setPreviewData(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingMaterial(null);
    setPreviewData(null);
  };

  const columns: Column<CourseLessonPartMaterial>[] = [
    {
      key: "id" as any, // Using id as key since name doesn't exist in type
      header: t('admin.material.name') || "Name",
      sortable: true,
      render: (value, item) => {
        // Try to get name from various sources
        const material = item as CourseLessonPartMaterial;
        const materialWithDetails = material as any;
        const name = 
          materialWithDetails.name || 
          materialWithDetails.uploadedFileName ||
          material.uploadedFile?.id || 
          material.content?.substring(0, 50) || 
          material.id || 
          "-";
        return <span>{name}</span>;
      },
    },
    {
      key: "mediaType",
      header: t('admin.material.mediaType'),
      sortable: true,
      render: (value) => {
        const mediaType = value as string;
        return <span>{mediaType || "-"}</span>;
      },
    },
    {
      key: "orderNumber",
      header: t('admin.material.orderNumber'),
      sortable: true,
    },
    {
      key: "duration",
      header: t('admin.material.duration'),
      sortable: true,
      render: (value) => {
        const duration = value as number;
        return <span>{duration ? `${duration} sn` : "-"}</span>;
      },
    },
    {
      key: "actions",
      header: t('common.actions'),
      sortable: false,
      actions: [
        {
          label: (
            <>
              <i className="feather-edit me-1"></i>
              {t("common.edit") || "Düzenle"}
            </>
          ),
          onClick: (item) => handleEditClick(item),
          className: "rbt-btn btn-sm btn-border-gradient",
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <p>{t("common.loading") || "Yükleniyor..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {t("error.network") || "Veri yüklenirken bir hata oluştu."}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
       
        <div className="d-flex gap-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleAddClick}
          >
            <i className="feather-plus me-1"></i>
            {t("common.add") || "Ekle"}
          </Button>
          {onClose && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
            >
              {t("common.close") || "Kapat"}
            </Button>
          )}
        </div>
      </div>

      <DynamicTable
        data={materials || []}
        columns={columns}
        pageSize={20}
        searchable={true}
      />

      {(showAddForm || editingMaterial) && (
        <div className="rbt-card rbt-card-body mt-3" style={{ overflow: 'visible' }}>
          <MaterialForm
            courseLessonPartId={partId}
            initialData={editingMaterial ? (() => {
              // Try to get name and description from various sources
              const materialWithDetails = editingMaterial as any;
              const name = 
                materialWithDetails.name || 
                materialWithDetails.uploadedFileName ||
                "";
              const description = materialWithDetails.description || "";
              
              return {
                id: editingMaterial.id,
                name: name,
                description: description,
                content: editingMaterial.content || "",
                mediaType: editingMaterial.mediaType as any,
                orderNumber: editingMaterial.orderNumber || 0,
                duration: editingMaterial.duration || 0,
                courseLessonPartId: partId,
                uploadedFileId: materialWithDetails.uploadedFileId || editingMaterial.uploadedFile?.id,
                uploadedFileName: materialWithDetails.uploadedFileName || editingMaterial.uploadedFile?.fileOriginalName || editingMaterial.uploadedFile?.fileName,
              };
            })() : undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            onFormDataChange={(data) => {
              setPreviewData(data);
            }}
          />
          
          {previewData && (
            (previewData.mediaType === 'TEXT' && previewData.content) ||
            (previewData.mediaType !== 'TEXT' && previewData.mediaType !== 'LINK' && (previewData.content || previewData.uploadedFileId)) ||
            (previewData.mediaType === 'LINK' && previewData.content)
          ) && (
            <div className="mt-4">
              <h4 className="mb-3">{t('admin.material.preview')}</h4>
              <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
                <MaterialRenderer
                  material={previewData}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
