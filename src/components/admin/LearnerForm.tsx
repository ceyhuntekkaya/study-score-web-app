'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/i18n';
import type { AdminCreateLearnerRequest } from '@/generated/api/openAPIDefinition.schemas';
import { useCreateLearner, getListLearnersQueryKey } from '@/generated/api/admin-learner-controller/admin-learner-controller';
import { useGetAllBrands } from '@/generated/api/brand-rest-controller/brand-rest-controller';
import { useGetAllCampuss } from '@/generated/api/campus-rest-controller/campus-rest-controller';
import { useGetAllInstitutions } from '@/generated/api/institution-rest-controller/institution-rest-controller';
import { useGetAllBranchs } from '@/generated/api/branch-rest-controller/branch-rest-controller';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import LoadingButton from '@/components/ui/LoadingButton';
import { Select } from '@/components/ui/Select';

type LearnerType = 'individual' | 'corporate';

interface LearnerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LearnerForm({ onSuccess, onCancel }: LearnerFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [learnerType, setLearnerType] = useState<LearnerType>('individual');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    lastName: '',
    email: '',
    mobilePhone: '',
    brandId: '',
    campusId: '',
    institutionId: '',
    branchId: '',
  });

  const createLearner = useCreateLearner();
  const { data: brands } = useGetAllBrands();
  const { data: campuses } = useGetAllCampuss();
  const { data: institutions } = useGetAllInstitutions();
  const { data: branches } = useGetAllBranchs();

  const campusesByBrand = useMemo(() => {
    if (!brands || !campuses || !formData.brandId) return [];
    return campuses.filter((c) => c.brand?.id === formData.brandId);
  }, [brands, campuses, formData.brandId]);

  const institutionsByCampus = useMemo(() => {
    if (!institutions || !formData.campusId) return [];
    return institutions.filter((i) => i.campus?.id === formData.campusId);
  }, [institutions, formData.campusId]);

  const branchesByInstitution = useMemo(() => {
    if (!branches || !formData.institutionId) return [];
    return branches.filter((b) => b.institution?.id === formData.institutionId);
  }, [branches, formData.institutionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'brandId') {
        next.campusId = '';
        next.institutionId = '';
        next.branchId = '';
      } else if (name === 'campusId') {
        next.institutionId = '';
        next.branchId = '';
      } else if (name === 'institutionId') {
        next.branchId = '';
      }
      return next;
    });
  };

  const getPayload = (): AdminCreateLearnerRequest => {
    const base = {
      username: formData.username.trim(),
      password: formData.password,
      name: formData.name.trim() || undefined,
      lastName: formData.lastName.trim() || undefined,
    };
    if (learnerType === 'individual') {
      return {
        ...base,
        individual: true,
      };
    }
    return {
      ...base,
      email: formData.email.trim() || undefined,
      mobilePhone: formData.mobilePhone.trim() || undefined,
      branchId: formData.branchId || undefined,
      individual: false,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = getPayload();
    if (learnerType === 'corporate' && !payload.branchId) {
      return;
    }
    try {
      await createLearner.mutateAsync({ data: payload });
      await queryClient.invalidateQueries({ queryKey: getListLearnersQueryKey() });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/dashboard/students');
      }
    } catch (err) {
      console.error('Create learner error:', err);
    }
  };

  const isLoading = createLearner.isPending;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row g-3">
        {/* Learner type */}
        <div className="col-12">
          <div className="form-group">
            <Label>{t('admin.learner.type') ?? 'Tip'}</Label>
            <div className="d-flex gap-4 mt-2">
              <label className="d-flex align-items-center gap-2">
                <input
                  type="radio"
                  name="learnerType"
                  checked={learnerType === 'individual'}
                  onChange={() => setLearnerType('individual')}
                />
                {t('admin.learner.individual') ?? 'Bireysel'}
              </label>
              <label className="d-flex align-items-center gap-2">
                <input
                  type="radio"
                  name="learnerType"
                  checked={learnerType === 'corporate'}
                  onChange={() => setLearnerType('corporate')}
                />
                {t('admin.learner.corporate') ?? 'Kurumsal'}
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="username">
              {t('form.label.username') ?? 'Kullanıcı adı'} <span className="text-danger">*</span>
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="password">
              {t('form.label.password') ?? 'Şifre'} <span className="text-danger">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="name">
              {t('form.label.name') ?? 'Ad'} <span className="text-danger">*</span>
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
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="lastName">
              {t('form.label.lastName') ?? 'Soyad'} <span className="text-danger">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {learnerType === 'corporate' && (
          <>
            <div className="col-md-6">
              <div className="form-group">
                <Label htmlFor="email">{t('form.label.email') ?? 'E-posta'}</Label>
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
                <Label htmlFor="mobilePhone">{t('form.label.mobilePhone') ?? 'Cep telefonu'}</Label>
                <Input
                  id="mobilePhone"
                  name="mobilePhone"
                  type="tel"
                  value={formData.mobilePhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-12">
              <Label>{t('admin.entity.branch') ?? 'Şube'} <span className="text-danger">*</span></Label>
              <div className="row g-2 mt-1">
                <div className="col-md-3">
                  <Select
                    id="brandId"
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleChange}
                    required={learnerType === 'corporate'}
                  >
                    <option value="">{t('admin.learner.selectBrand') ?? 'Marka seçin'}</option>
                    {brands?.map((b) => (
                      <option key={b.id} value={b.id ?? ''}>{b.name ?? b.id}</option>
                    ))}
                  </Select>
                </div>
                <div className="col-md-3">
                  <Select
                    id="campusId"
                    name="campusId"
                    value={formData.campusId}
                    onChange={handleChange}
                    required={learnerType === 'corporate'}
                    disabled={!formData.brandId}
                  >
                    <option value="">{t('admin.entity.selectCampus') ?? 'Kampüs seçin'}</option>
                    {campusesByBrand.map((c) => (
                      <option key={c.id} value={c.id ?? ''}>{c.name ?? c.id}</option>
                    ))}
                  </Select>
                </div>
                <div className="col-md-3">
                  <Select
                    id="institutionId"
                    name="institutionId"
                    value={formData.institutionId}
                    onChange={handleChange}
                    required={learnerType === 'corporate'}
                    disabled={!formData.campusId}
                  >
                    <option value="">{t('admin.entity.selectInstitution') ?? 'Kurum seçin'}</option>
                    {institutionsByCampus.map((i) => (
                      <option key={i.id} value={i.id ?? ''}>{i.name ?? i.id}</option>
                    ))}
                  </Select>
                </div>
                <div className="col-md-3">
                  <Select
                    id="branchId"
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                    required={learnerType === 'corporate'}
                    disabled={!formData.institutionId}
                  >
                    <option value="">{t('admin.learner.selectBranch') ?? 'Şube seçin'}</option>
                    {branchesByInstitution.map((b) => (
                      <option key={b.id} value={b.id ?? ''}>{b.name ?? b.id}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="col-12">
          <div className="form-group d-flex gap-3">
            <LoadingButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              loadingText={t('common.loading') ?? 'Yükleniyor...'}
              disabled={isLoading || (learnerType === 'corporate' && !formData.branchId)}
            >
              {t('common.add') ?? 'Ekle'}
            </LoadingButton>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t('common.cancel') ?? 'İptal'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
