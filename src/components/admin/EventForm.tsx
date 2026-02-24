'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n';
import type { Event, EventFaq, EventSpeaker } from '@/generated/api/openAPIDefinition.schemas';
import {
  useCreateEvent,
  useUpdateEvent,
} from '@/generated/api/event-rest-controller/event-rest-controller';
import { useMutation } from '@tanstack/react-query';
import { customInstance } from '@/lib/api-client';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import LoadingButton from '@/components/ui/LoadingButton';
import { Select } from '@/components/ui/Select';
import SimpleHtmlEditor from '@/components/ui/SimpleHtmlEditor';

export type EventFormFaq = Pick<EventFaq, 'title' | 'description' | 'orderNumber'>;
export type EventFormParticipant = Pick<
  EventSpeaker,
  'photo' | 'name' | 'title' | 'location' | 'description' | 'instagram' | 'facebook' | 'twitter' | 'orderNumber'
>;

interface EventFormProps {
  initialData?: Event | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultFaq = (order: number): EventFormFaq => ({
  title: '',
  description: '',
  orderNumber: order,
});

const defaultParticipant = (order: number): EventFormParticipant => ({
  photo: '',
  name: '',
  title: '',
  location: '',
  description: '',
  instagram: '',
  facebook: '',
  twitter: '',
  orderNumber: order,
});

function buildEventPayload(
  form: Partial<Event>,
  faqs: EventFormFaq[],
  participants: EventFormParticipant[]
): Event {
  return {
    ...(form.id && { id: form.id }),
    startDate: form.startDate || '',
    endDate: form.endDate || '',
    time: form.time || '',
    location: form.location || '',
    category: form.category || '',
    available: form.available ?? 0,
    content: form.content || '',
    description: form.description || '',
    banner: form.banner,
    poster: form.poster,
    status: form.status,
    faqs: faqs.map((f) => ({ title: f.title, description: f.description, orderNumber: f.orderNumber ?? 0 })),
    participants: participants.map((p) => ({
      photo: p.photo,
      name: p.name,
      title: p.title,
      location: p.location,
      description: p.description,
      instagram: p.instagram,
      facebook: p.facebook,
      twitter: p.twitter,
      orderNumber: p.orderNumber ?? 0,
    })),
  };
}

export default function EventForm({
  initialData,
  onSuccess,
  onCancel,
}: EventFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!initialData?.id;

  const [formData, setFormData] = useState<Partial<Event>>({
    startDate: '',
    endDate: '',
    time: '',
    location: '',
    category: 'Workshop',
    available: 50,
    content: '',
    description: '',
    banner: '',
    poster: '',
    status: 'ACTIVE',
  });
  const [faqs, setFaqs] = useState<EventFormFaq[]>([]);
  const [participants, setParticipants] = useState<EventFormParticipant[]>([]);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      objectType,
      fileProp,
    }: {
      file: File;
      objectType: string;
      fileProp: string;
    }) => {
      const fd = new FormData();
      fd.append('files', file);
      fd.append('objectType', objectType);
      fd.append('fileProp', fileProp);
      return customInstance<string[]>({
        url: '/files/upload',
        method: 'POST',
        data: fd,
      });
    },
  });
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        time: initialData.time || '',
        location: initialData.location || '',
        category: initialData.category || 'Workshop',
        available: initialData.available ?? 50,
        content: initialData.content || '',
        description: initialData.description || '',
        banner: initialData.banner || '',
        poster: initialData.poster || '',
        status: initialData.status || 'ACTIVE',
      });
      setFaqs(
        (initialData.faqs || []).map((f) => ({
          title: f.title || '',
          description: f.description || '',
          orderNumber: f.orderNumber ?? 0,
        }))
      );
      setParticipants(
        (initialData.participants || []).map((p) => ({
          photo: p.photo || '',
          name: p.name || '',
          title: p.title || '',
          location: p.location || '',
          description: p.description || '',
          instagram: p.instagram || '',
          facebook: p.facebook || '',
          twitter: p.twitter || '',
          orderNumber: p.orderNumber ?? 0,
        }))
      );
    } else {
      setFormData({
        startDate: '',
        endDate: '',
        time: '',
        location: '',
        category: 'Workshop',
        available: 50,
        content: '',
        description: '',
        banner: '',
        poster: '',
        status: 'ACTIVE',
      });
      setFaqs([]);
      setParticipants([]);
    }
  }, [initialData?.id]);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const paths = await uploadMutation.mutateAsync({
        file,
        objectType: 'Event',
        fileProp: 'banner',
      });
      if (paths?.length) {
        setFormData((prev) => ({ ...prev, banner: paths[0] }));
      }
    } catch (err) {
      console.error('Banner upload error:', err);
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPoster(true);
    try {
      const paths = await uploadMutation.mutateAsync({
        file,
        objectType: 'Event',
        fileProp: 'poster',
      });
      if (paths?.length) {
        setFormData((prev) => ({ ...prev, poster: paths[0] }));
      }
    } catch (err) {
      console.error('Poster upload error:', err);
    } finally {
      setUploadingPoster(false);
      if (posterInputRef.current) posterInputRef.current.value = '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numKeys = ['available'];
    setFormData((prev) => ({
      ...prev,
      [name]: numKeys.includes(name) ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildEventPayload(formData, faqs, participants);
    try {
      if (isEditMode && initialData?.id) {
        await updateEvent.mutateAsync({ eventId: initialData.id, data: payload });
      } else {
        const created = await createEvent.mutateAsync({ data: payload });
        if (created?.id && onSuccess) {
          onSuccess();
          return;
        }
      }
      onSuccess?.();
    } catch (err) {
      console.error('Event form error:', err);
    }
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, defaultFaq(prev.length)]);
  };
  const updateFaq = (index: number, field: keyof EventFormFaq, value: string | number) => {
    setFaqs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };
  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const addParticipant = () => {
    setParticipants((prev) => [...prev, defaultParticipant(prev.length)]);
  };
  const updateParticipant = (
    index: number,
    field: keyof EventFormParticipant,
    value: string | number
  ) => {
    setParticipants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };
  const removeParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleParticipantPhotoChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhotoIndex(index);
    try {
      const paths = await uploadMutation.mutateAsync({
        file,
        objectType: 'EventSpeaker',
        fileProp: 'photo',
      });
      if (paths?.length) {
        updateParticipant(index, 'photo', paths[0]);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingPhotoIndex(null);
      const input = fileInputRefs.current[index];
      if (input) input.value = '';
    }
  };

  const isLoading =
    createEvent.isPending ||
    updateEvent.isPending ||
    uploadingPhotoIndex !== null ||
    uploadingBanner ||
    uploadingPoster;

  return (
    <form onSubmit={handleSubmit} className="rbt-form-wrapper">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="startDate">
              {t('admin.event.startDate')} <span className="text-danger">*</span>
            </Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="endDate">
              {t('admin.event.endDate')} <span className="text-danger">*</span>
            </Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="time">{t('admin.event.time')}</Label>
            <Input
              id="time"
              name="time"
              type="text"
              placeholder="10:00 am - 2:00 pm"
              value={formData.time || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="location">{t('admin.event.location')}</Label>
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="category">{t('admin.event.category')}</Label>
            <Select
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
            >
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Conference">Conference</option>
              <option value="Webinar">Webinar</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="available">{t('admin.event.available')}</Label>
            <Input
              id="available"
              name="available"
              type="number"
              min={0}
              value={formData.available ?? ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <Label htmlFor="description">{t('admin.event.description')}</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Banner & Poster uploads */}
        <div className="col-md-6">
          <div className="form-group">
            <Label>{t('admin.event.banner')}</Label>
            <div className="d-flex flex-column gap-2">
              <input
                ref={bannerInputRef}
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleBannerChange}
                disabled={uploadingBanner}
              />
              {uploadingBanner && (
                <span className="text-muted small">
                  <i className="feather-loader me-1"></i>
                  {t('common.uploading')}
                </span>
              )}
              {formData.banner && (
                <div className="mt-1">
                  <a href={formData.banner} target="_blank" rel="noopener noreferrer" className="small me-2">
                    {t('admin.material.fileUploaded')}
                  </a>
                  {formData.banner.startsWith('http') && (
                    <img src={formData.banner} alt="Banner" className="img-thumbnail mt-1" style={{ maxHeight: 80 }} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label>{t('admin.event.poster')}</Label>
            <div className="d-flex flex-column gap-2">
              <input
                ref={posterInputRef}
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handlePosterChange}
                disabled={uploadingPoster}
              />
              {uploadingPoster && (
                <span className="text-muted small">
                  <i className="feather-loader me-1"></i>
                  {t('common.uploading')}
                </span>
              )}
              {formData.poster && (
                <div className="mt-1">
                  <a href={formData.poster} target="_blank" rel="noopener noreferrer" className="small me-2">
                    {t('admin.material.fileUploaded')}
                  </a>
                  {formData.poster.startsWith('http') && (
                    <img src={formData.poster} alt="Poster" className="img-thumbnail mt-1" style={{ maxHeight: 80 }} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <Label>{t('admin.event.content')}</Label>
            <SimpleHtmlEditor
              value={formData.content || ''}
              onChange={handleContentChange}
              placeholder=""
              className="min-h-[200px]"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="col-12">
          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Label className="mb-0">{t('admin.event.faqs')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                <i className="feather-plus me-1"></i>
                {t('admin.event.addFaq')}
              </Button>
            </div>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="card card-body mb-2 p-3 border"
              >
                <div className="row g-2">
                  <div className="col-12">
                    <Input
                      placeholder={t('admin.event.faqTitle')}
                      value={faq.title || ''}
                      onChange={(e) => updateFaq(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <Textarea
                      placeholder={t('admin.event.faqDescription')}
                      rows={2}
                      value={faq.description || ''}
                      onChange={(e) => updateFaq(idx, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFaq(idx)}
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participants */}
        <div className="col-12">
          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Label className="mb-0">{t('admin.event.participants')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addParticipant}>
                <i className="feather-plus me-1"></i>
                {t('admin.event.addParticipant')}
              </Button>
            </div>
            {participants.map((p, idx) => (
              <div key={idx} className="card card-body mb-3 p-3 border">
                <div className="row g-2">
                  <div className="col-12">
                    <Label className="small">{t('admin.event.participantPhoto')}</Label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        ref={(el) => {
                          fileInputRefs.current[idx] = el;
                        }}
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*"
                        onChange={(e) => handleParticipantPhotoChange(idx, e)}
                        disabled={uploadingPhotoIndex === idx}
                      />
                      {uploadingPhotoIndex === idx && (
                        <span className="text-muted small">
                          <i className="feather-loader me-1"></i>
                          {t('common.uploading')}
                        </span>
                      )}
                      {p.photo && (
                        <a href={p.photo} target="_blank" rel="noopener noreferrer" className="small">
                          {t('admin.material.fileUploaded')}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Input
                      placeholder={t('admin.event.participantName')}
                      value={p.name || ''}
                      onChange={(e) => updateParticipant(idx, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      placeholder={t('admin.event.participantTitle')}
                      value={p.title || ''}
                      onChange={(e) => updateParticipant(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <Input
                      placeholder={t('admin.event.participantLocation')}
                      value={p.location || ''}
                      onChange={(e) => updateParticipant(idx, 'location', e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <Textarea
                      placeholder={t('admin.event.participantDescription')}
                      rows={2}
                      value={p.description || ''}
                      onChange={(e) => updateParticipant(idx, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <Input
                      placeholder="Instagram URL"
                      value={p.instagram || ''}
                      onChange={(e) => updateParticipant(idx, 'instagram', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <Input
                      placeholder="Facebook URL"
                      value={p.facebook || ''}
                      onChange={(e) => updateParticipant(idx, 'facebook', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <Input
                      placeholder="Twitter URL"
                      value={p.twitter || ''}
                      onChange={(e) => updateParticipant(idx, 'twitter', e.target.value)}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeParticipant(idx)}
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12">
          <div className="form-group d-flex gap-3">
            <LoadingButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              loadingText={t('common.loading')}
              disabled={isLoading}
            >
              {t('common.save')}
            </LoadingButton>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
