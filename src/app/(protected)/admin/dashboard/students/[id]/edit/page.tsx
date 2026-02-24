'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/i18n';
import type { AdminUpdateLearnerRequest } from '@/generated/api/openAPIDefinition.schemas';
import {
  useGetLearner,
  useUpdateLearner,
  getGetLearnerQueryKey,
  getListLearnersQueryKey,
} from '@/generated/api/admin-learner-controller/admin-learner-controller';
import { useGetAllBrands } from '@/generated/api/brand-rest-controller/brand-rest-controller';
import { useGetAllCampuss } from '@/generated/api/campus-rest-controller/campus-rest-controller';
import { useGetAllInstitutions } from '@/generated/api/institution-rest-controller/institution-rest-controller';
import { useGetAllBranchs } from '@/generated/api/branch-rest-controller/branch-rest-controller';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import LoadingButton from '@/components/ui/LoadingButton';
import { Select } from '@/components/ui/Select';

export default function EditStudentPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const learnerId = params?.id as string;

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    mobilePhone: '',
    password: '',
    brandId: '',
    campusId: '',
    institutionId: '',
    branchId: '',
  });

  const queryClient = useQueryClient();
  const { data: learner, isLoading: learnerLoading, isError: learnerError } = useGetLearner(learnerId, {
    query: { enabled: !!learnerId },
  });
  const updateLearner = useUpdateLearner();

  const { data: brands } = useGetAllBrands();
  const { data: campuses } = useGetAllCampuss();
  const { data: institutions } = useGetAllInstitutions();
  const { data: branches } = useGetAllBranchs();

  const isCorporate = useMemo(
    () => !!(learner?.branch ?? learner?.institution ?? learner?.campus ?? learner?.brand),
    [learner]
  );

  const campusesByBrand = useMemo(() => {
    if (!campuses || !formData.brandId) return [];
    return campuses.filter((c) => c.brand?.id === formData.brandId);
  }, [campuses, formData.brandId]);

  const institutionsByCampus = useMemo(() => {
    if (!institutions || !formData.campusId) return [];
    return institutions.filter((i) => i.campus?.id === formData.campusId);
  }, [institutions, formData.campusId]);

  const branchesByInstitution = useMemo(() => {
    if (!branches || !formData.institutionId) return [];
    return branches.filter((b) => b.institution?.id === formData.institutionId);
  }, [branches, formData.institutionId]);

  useEffect(() => {
    if (!learner) return;
    setFormData((prev) => ({
      ...prev,
      name: learner.name ?? '',
      lastName: learner.lastName ?? '',
      email: learner.email ?? '',
      mobilePhone: learner.mobilePhone ?? '',
      brandId: learner.brand?.id ?? '',
      campusId: learner.campus?.id ?? '',
      institutionId: learner.institution?.id ?? '',
      branchId: learner.branch?.id ?? '',
    }));
  }, [learner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const getPayload = (): AdminUpdateLearnerRequest => {
    const payload: AdminUpdateLearnerRequest = {};
    const trim = (s: string) => s?.trim();
    if (trim(formData.name) !== '') payload.name = trim(formData.name);
    if (trim(formData.lastName) !== '') payload.lastName = trim(formData.lastName);
    if (trim(formData.email) !== '') payload.email = trim(formData.email);
    if (trim(formData.mobilePhone) !== '') payload.mobilePhone = trim(formData.mobilePhone);
    if (trim(formData.password) !== '') payload.password = trim(formData.password);
    if (isCorporate && trim(formData.branchId) !== '') payload.branchId = trim(formData.branchId);
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = getPayload();
    try {
      await updateLearner.mutateAsync({ learnerId, data: payload });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetLearnerQueryKey(learnerId) }),
        queryClient.invalidateQueries({ queryKey: getListLearnersQueryKey() }),
      ]);
      router.push(`/admin/dashboard/students/${learnerId}`);
    } catch (err) {
      console.error('Update learner error:', err);
    }
  };

  const isSubmitting = updateLearner.isPending;

  if (!learnerId) {
    return (
      <div className="alert alert-warning">
        {t('common.edit') ?? 'Düzenle'} — ID gerekli.
      </div>
    );
  }

  if (learnerLoading) {
    return (
      <>
        <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
          <div>
            <h2>{t('common.edit') ?? 'Öğrenci Düzenle'}</h2>
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

  if (learnerError || !learner) {
    return (
      <>
        <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
          <div>
            <h2>{t('common.edit') ?? 'Öğrenci Düzenle'}</h2>
            <Link href="/admin/dashboard/students" className="rbt-btn-link">
              <i className="feather-arrow-left me-1" />
              {t('admin.entity.backToStudentsList')}
            </Link>
          </div>
        </div>
        <div className="rbt-dashboard-content bg-color-white rbt-shadow-box p-4">
          <p className="text-danger mb-0">
            {t('error.network') ?? 'Öğrenci yüklenemedi.'} (ID: {learnerId})
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('common.edit') ?? 'Öğrenci Düzenle'}</h2>
          <Link href="/admin/dashboard/students" className="rbt-btn-link">
            <i className="feather-arrow-left me-1" />
            {t('admin.entity.backToStudentsList')}
          </Link>
        </div>
        <Link
          href={`/admin/dashboard/students/${learnerId}`}
          className="rbt-btn btn-md btn-border-gradient"
        >
          <i className="feather-eye me-1" />
          {t('admin.learner.view') ?? 'Görüntüle'}
        </Link>
      </div>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box p-4">
        <p className="text-muted small mb-3">
          {t('admin.learner.username') ?? 'Kullanıcı adı'}: <strong>{learner.username}</strong>
        </p>
        <form onSubmit={handleSubmit} className="rbt-form-wrapper">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-group">
                <Label htmlFor="name">{t('form.label.name') ?? 'Ad'}</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Label htmlFor="lastName">{t('form.label.lastName') ?? 'Soyad'}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
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
              <div className="form-group">
                <Label htmlFor="password">{t('form.label.password') ?? 'Şifre'}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('admin.learner.passwordLeaveEmpty') ?? 'Boş bırakırsanız değişmez'}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {isCorporate && (
              <div className="col-12">
                <Label>{t('admin.entity.branch') ?? 'Şube'}</Label>
                <div className="row g-2 mt-1">
                  <div className="col-md-3">
                    <Select
                      id="brandId"
                      name="brandId"
                      value={formData.brandId}
                      onChange={handleChange}
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
            )}

            <div className="col-12">
              <div className="form-group d-flex gap-3">
                <LoadingButton
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  loadingText={t('common.loading') ?? 'Yükleniyor...'}
                  disabled={isSubmitting}
                >
                  {t('common.save') ?? 'Kaydet'}
                </LoadingButton>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => router.push(`/admin/dashboard/students/${learnerId}`)}
                  disabled={isSubmitting}
                >
                  {t('common.cancel') ?? 'İptal'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
