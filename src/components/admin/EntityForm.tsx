"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";
import {
  Brand,
  Campus,
  Institution,
  Branch,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  useCreateBrand,
  useUpdateBrand,
} from "@/generated/api/brand-rest-controller/brand-rest-controller";
import {
  useCreateCampus,
  useUpdateCampus,
} from "@/generated/api/campus-rest-controller/campus-rest-controller";
import {
  useCreateInstitution,
  useUpdateInstitution,
} from "@/generated/api/institution-rest-controller/institution-rest-controller";
import {
  useCreateBranch,
  useUpdateBranch,
} from "@/generated/api/branch-rest-controller/branch-rest-controller";
import { useGetAllBrands } from "@/generated/api/brand-rest-controller/brand-rest-controller";
import { useGetAllCampuss } from "@/generated/api/campus-rest-controller/campus-rest-controller";
import { useGetAllInstitutions } from "@/generated/api/institution-rest-controller/institution-rest-controller";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import LoadingButton from "@/components/ui/LoadingButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/Select";

type EntityType = "brand" | "campus" | "institution" | "branch";
type EntityData = Brand | Campus | Institution | Branch;

interface EntityFormProps {
  entityType: EntityType;
  initialData?: EntityData;
  parentId?: string; // For campus: brandId, institution: campusId, branch: institutionId
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EntityForm({
  entityType,
  initialData,
  parentId,
  onSuccess,
  onCancel,
}: EntityFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const isEditMode = !!initialData?.id;

  // Form state
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    logo: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    contactPerson: "",
    status: "ACTIVE",
    grade: "",
    ...(entityType === "campus" && { brand: { id: parentId } }),
    ...(entityType === "institution" && { campus: { id: parentId } }),
    ...(entityType === "branch" && { institution: { id: parentId } }),
  });

  // Mutations
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const createCampus = useCreateCampus();
  const updateCampus = useUpdateCampus();
  const createInstitution = useCreateInstitution();
  const updateInstitution = useUpdateInstitution();
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();

  // For dropdowns
  const { data: brands } = useGetAllBrands();
  const { data: campuses } = useGetAllCampuss();
  const { data: institutions } = useGetAllInstitutions();

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: (initialData as Brand).description || "",
        logo: (initialData as Brand).logo || "",
        website: (initialData as Brand).website || "",
        phone: (initialData as Brand).phone || "",
        email: (initialData as Brand).email || "",
        address: (initialData as Brand).address || "",
        contactPerson: (initialData as Brand).contactPerson || "",
        status: initialData.status || "ACTIVE",
        grade: (initialData as Branch).grade || "",
        ...(entityType === "campus" && {
          brand: (initialData as Campus).brand,
        }),
        ...(entityType === "institution" && {
          campus: (initialData as Institution).campus,
        }),
        ...(entityType === "branch" && {
          institution: (initialData as Branch).institution,
        }),
      });
    }
  }, [initialData, entityType]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "brandId" && entityType === "campus") {
      setFormData({ ...formData, brand: { id: value } });
    } else if (name === "campusId" && entityType === "institution") {
      setFormData({ ...formData, campus: { id: value } });
    } else if (name === "institutionId" && entityType === "branch") {
      setFormData({ ...formData, institution: { id: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Update mode
        const id = initialData!.id!;
        switch (entityType) {
          case "brand":
            await updateBrand.mutateAsync({
              brandId: id,
              data: formData as Brand,
            });
            break;
          case "campus":
            await updateCampus.mutateAsync({
              campusId: id,
              data: formData as Campus,
            });
            break;
          case "institution":
            await updateInstitution.mutateAsync({
              institutionId: id,
              data: formData as Institution,
            });
            break;
          case "branch":
            await updateBranch.mutateAsync({
              branchId: id,
              data: formData as Branch,
            });
            break;
        }
      } else {
        // Create mode
        switch (entityType) {
          case "brand":
            await createBrand.mutateAsync({ data: formData as Brand });
            break;
          case "campus":
            await createCampus.mutateAsync({ data: formData as Campus });
            break;
          case "institution":
            await createInstitution.mutateAsync({
              data: formData as Institution,
            });
            break;
          case "branch":
            await createBranch.mutateAsync({ data: formData as Branch });
            break;
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        // Default redirect
        if (entityType === "brand") {
          router.push("/admin/dashboard/brands");
        } else if (entityType === "campus") {
          const brandId = parentId || (initialData as Campus)?.brand?.id;
          if (brandId) {
            router.push(`/admin/dashboard/brands/${brandId}/campuses`);
          } else {
            router.push("/admin/dashboard/brands");
          }
        } else if (entityType === "institution") {
          const campusId = parentId || (initialData as Institution)?.campus?.id;
          if (campusId) {
            router.push(`/admin/dashboard/campuses/${campusId}/institutions`);
          } else {
            router.push("/admin/dashboard/brands");
          }
        } else if (entityType === "branch") {
          const institutionId =
            parentId || (initialData as Branch)?.institution?.id;
          if (institutionId) {
            router.push(
              `/admin/dashboard/institutions/${institutionId}/branches`
            );
          } else {
            router.push("/admin/dashboard/brands");
          }
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isLoading =
    createBrand.isPending ||
    updateBrand.isPending ||
    createCampus.isPending ||
    updateCampus.isPending ||
    createInstitution.isPending ||
    updateInstitution.isPending ||
    createBranch.isPending ||
    updateBranch.isPending;

  const getEntityLabel = () => {
    switch (entityType) {
      case "brand":
        return t("admin.entity.institution");
      case "campus":
        return t("admin.entity.campus");
      case "institution":
        return t("admin.entity.institution");
      case "branch":
        return t("admin.entity.branch");
      default:
        return "Entity";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row">
        {/* Name - Required for all */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="name">
              {getEntityLabel()} {t('admin.entity.name')} <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Brand specific fields */}
        {entityType === "brand" && (
          <>
            <div className="col-12">
              <div className="form-group">
                <Label htmlFor="description">{t('form.label.description')}</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Label htmlFor="email">{t('form.label.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Label htmlFor="phone">{t('form.label.phone')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Label htmlFor="website">{t('form.label.website')}</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Label htmlFor="contactPerson">{t('form.label.contactPerson')}</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  type="text"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <Label htmlFor="address">{t('form.label.address')}</Label>
                <Textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <Label htmlFor="logo">{t('form.label.logoUrl')}</Label>
                <Input
                  id="logo"
                  name="logo"
                  type="url"
                  value={formData.logo}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        {/* Campus - Brand selection */}
        {entityType === "campus" && (
          <div className="col-12">
            <div className="form-group">
                <Label htmlFor="brandId">
                {t('admin.entity.institution')} <span className="text-danger">*</span>
              </Label>
              <select
                id="brandId"
                name="brandId"
                className="form-control"
                value={formData.brand?.id || parentId || ""}
                onChange={handleChange}
                required
                disabled={!!parentId} // Disable if parentId is provided (from URL)
              >
                <option value="">{t('admin.entity.selectInstitution')}</option>
                {brands?.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Institution - Campus selection */}
        {entityType === "institution" && (
          <div className="col-12">
            <div className="form-group">
              <Label htmlFor="campusId">
                {t('admin.entity.campus')} <span className="text-danger">*</span>
              </Label>
              <select
                id="campusId"
                name="campusId"
                className="form-control"
                value={formData.campus?.id || parentId || ""}
                onChange={handleChange}
                required
                disabled={!!parentId}
              >
                <option value="">{t('admin.entity.selectCampus')}</option>
                {campuses
                  ?.filter((campus) => !parentId || campus.id === parentId)
                  .map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {/* Branch - Institution selection and grade */}
        {entityType === "branch" && (
          <>
            <div className="col-md-6">
              <div className="form-group">
                <Label htmlFor="institutionId">
                  {t('admin.entity.institution')} <span className="text-danger">*</span>
                </Label>
                <select
                  id="institutionId"
                  name="institutionId"
                  className="form-control"
                  value={formData.institution?.id || parentId || ""}
                  onChange={handleChange}
                  required
                  disabled={!!parentId}
                >
                  <option value="">{t('admin.entity.selectInstitution')}</option>
                  {institutions
                    ?.filter((inst) => !parentId || inst.id === parentId)
                    .map((institution) => (
                      <option key={institution.id} value={institution.id}>
                        {institution.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Label htmlFor="grade">{t('form.label.grade')}</Label>
                <Input
                  id="grade"
                  name="grade"
                  type="text"
                  value={formData.grade}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        {/* Status - For all */}
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="status">{t('admin.entity.status')}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleChange({ target: { name: "status", value } } as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('admin.entity.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ACTIVE">{t('admin.entity.active')}</SelectItem>
                  <SelectItem value="PASSIVE">{t('admin.entity.passive')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="col-12">
          <div className="form-group d-flex gap-3">
            <LoadingButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              loadingText={t("common.loading") || "Yükleniyor..."}
              disabled={isLoading}
            >
              {isEditMode
                ? t("common.save") || "Kaydet"
                : t("common.add") || "Ekle"}
            </LoadingButton>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t("common.cancel") || "İptal"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
