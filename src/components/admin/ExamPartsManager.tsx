'use client';

import { useState } from 'react';
import { useTranslation } from '@/i18n';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetExam,
  useGetExamParts,
  useCreateExamPart,
  useDeleteExamPart,
  useAddItemToExam,
  useRemoveItemFromExam,
  getGetExamQueryKey,
  getGetExamPartsQueryKey,
  getGetExamItemsQueryKey,
} from '@/generated/api/exam-controller/exam-controller';
import { useListQuestionGroups } from '@/generated/api/question-group-controller/question-group-controller';
import { useGetStandaloneQuestions } from '@/generated/api/question-controller/question-controller';
import {
  ExamAddItemRequestItemType,
  type ExamPart,
  type ExamItem,
} from '@/generated/api/openAPIDefinition.schemas';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';

/** Normalize API list response: may be array, or paged { content: [] }, or single object. */
function normalizeListResponse(data: unknown): unknown[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && 'content' in data && Array.isArray((data as { content: unknown[] }).content)) {
    return (data as { content: unknown[] }).content;
  }
  if (typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown[] }).data)) {
    return (data as { data: unknown[] }).data;
  }
  return [data];
}

interface ExamPartsManagerProps {
  examId: string;
}

export default function ExamPartsManager({ examId }: ExamPartsManagerProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showAddPart, setShowAddPart] = useState(false);
  const [newPartName, setNewPartName] = useState('');
  const [newPartOrder, setNewPartOrder] = useState<number | ''>('');
  const [addItemPartId, setAddItemPartId] = useState<string | null>(null);
  const [addItemType, setAddItemType] = useState<ExamAddItemRequestItemType>(ExamAddItemRequestItemType.QUESTION_GROUP);
  const [addItemGroupId, setAddItemGroupId] = useState('');
  const [addItemQuestionGroupId, setAddItemQuestionGroupId] = useState('');
  const [addItemQuestionId, setAddItemQuestionId] = useState('');
  const [addItemScore, setAddItemScore] = useState<number | ''>('');
  const [addItemOrder, setAddItemOrder] = useState<number | ''>('');

  const { data: examData, isLoading: examLoading } = useGetExam(examId, {
    query: { enabled: !!examId },
  });

  const createPart = useCreateExamPart();
  const deletePart = useDeleteExamPart();
  const addItem = useAddItemToExam();
  const removeItem = useRemoveItemFromExam();

  const exam = examData as { examParts?: ExamPart[] } | undefined;
  const parts: ExamPart[] = exam?.examParts ?? [];
  const itemsByPartId: Record<string, ExamItem[]> = parts.reduce<Record<string, ExamItem[]>>((acc, part) => {
    acc[part.id ?? ''] = part.examItems ?? [];
    return acc;
  }, {});

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetExamQueryKey(examId) });
    queryClient.invalidateQueries({ queryKey: getGetExamPartsQueryKey(examId) });
    queryClient.invalidateQueries({ queryKey: getGetExamItemsQueryKey(examId) });
  };

  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;
    try {
      await createPart.mutateAsync({
        examId,
        data: {
          name: newPartName.trim(),
          ...(newPartOrder !== '' ? { orderNumber: Number(newPartOrder) } : {}),
        },
      });
      setNewPartName('');
      setNewPartOrder('');
      setShowAddPart(false);
      invalidate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePart = async (partId: string, itemCount: number) => {
    if (itemCount > 0) {
      alert(t('admin.exam.cannotDeletePartWithItems') || 'Bu bölümde öğe varken silinemez. Önce öğeleri kaldırın.');
      return;
    }
    if (!confirm(t('admin.exam.confirmDeletePart') || 'Bu bölümü silmek istediğinize emin misiniz?')) return;
    try {
      await deletePart.mutateAsync({ examId, examPartId: partId });
      invalidate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const partId = addItemPartId;
    if (!partId) return;
    if (addItemType === ExamAddItemRequestItemType.QUESTION_GROUP) {
      if (!addItemQuestionGroupId) return;
      try {
        await addItem.mutateAsync({
          examId,
          data: {
            itemType: ExamAddItemRequestItemType.QUESTION_GROUP,
            questionGroupId: addItemQuestionGroupId,
            examPartId: partId,
            ...(addItemScore !== '' ? { score: Number(addItemScore) } : {}),
            ...(addItemOrder !== '' ? { orderNumber: Number(addItemOrder) } : {}),
          },
        });
        closeAddItemModal();
        invalidate();
      } catch (err) {
        console.error(err);
      }
    } else {
      if (!addItemQuestionId) return;
      try {
        await addItem.mutateAsync({
          examId,
          data: {
            itemType: ExamAddItemRequestItemType.QUESTION,
            questionId: addItemQuestionId,
            examPartId: partId,
            ...(addItemScore !== '' ? { score: Number(addItemScore) } : {}),
            ...(addItemOrder !== '' ? { orderNumber: Number(addItemOrder) } : {}),
          },
        });
        closeAddItemModal();
        invalidate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveItem = async (examItemId: string) => {
    if (!confirm(t('admin.exam.confirmRemoveItem') || 'Bu öğeyi sınavdan kaldırmak istediğinize emin misiniz?')) return;
    try {
      await removeItem.mutateAsync({ examId, examItemId });
      invalidate();
    } catch (err) {
      console.error(err);
    }
  };

  const closeAddItemModal = () => {
    setAddItemPartId(null);
    setAddItemGroupId('');
    setAddItemQuestionGroupId('');
    setAddItemQuestionId('');
    setAddItemScore('');
    setAddItemOrder('');
  };

  if (examLoading) {
    return (
      <div className="text-center py-4">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="rbt-shadow-box mt--30">
      <div className="d-flex justify-content-between align-items-center mb--30">
        <h4 className="rbt-title-style-3 mb--0">{t('admin.exam.examParts')}</h4>
        {!showAddPart && (
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={() => setShowAddPart(true)}
          >
            <i className="feather-plus me-1"></i>
            {t('admin.exam.addPart')}
          </button>
        )}
      </div>

      {showAddPart && (
        <form onSubmit={handleCreatePart} className="rbt-card rbt-card-body mb--30" style={{ backgroundColor: '#f9fafb' }}>
          <h5 className="mb--20">{t('admin.exam.addPart')}</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <Label htmlFor="partName">{t('admin.exam.partName')} <span className="text-danger">*</span></Label>
              <Input
                id="partName"
                value={newPartName}
                onChange={(e) => setNewPartName(e.target.value)}
                placeholder={t('admin.exam.partNamePlaceholder') || 'Örn. Speaking'}
                required
              />
            </div>
            <div className="col-md-4">
              <Label htmlFor="partOrder">{t('admin.exam.partOrder')}</Label>
              <Input
                id="partOrder"
                type="number"
                min={1}
                value={newPartOrder}
                onChange={(e) => setNewPartOrder(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="1"
              />
            </div>
            <div className="col-md-2 d-flex align-items-end gap-2">
              <button type="submit" className="rbt-btn btn-sm btn-gradient" disabled={createPart.isPending || !newPartName.trim()}>
                {createPart.isPending ? t('common.loading') : t('common.add')}
              </button>
              <button type="button" className="rbt-btn btn-sm btn-border" onClick={() => { setShowAddPart(false); setNewPartName(''); setNewPartOrder(''); }}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </form>
      )}

      {parts.length === 0 && !showAddPart ? (
        <p className="text-muted text-center py--30">{t('admin.exam.noParts')}</p>
      ) : (
        <div className="rbt-course-list">
          {parts.map((part, index) => {
            const partItems = itemsByPartId[part.id ?? ''] || [];
            return (
              <div key={part.id ?? `part-${index}`} className="rbt-course rbt-course-wrape mb--20 border rounded p--20">
                <div className="d-flex justify-content-between align-items-center mb--15">
                  <h5 className="mb--0">
                    {part.name || t('admin.exam.part')} {(part.orderNumber ?? 0) > 0 ? `(${part.orderNumber})` : ''}
                  </h5>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="rbt-btn btn-sm btn-border-gradient"
                      onClick={() => {
                        setAddItemPartId(part.id ?? null);
                        setAddItemType(ExamAddItemRequestItemType.QUESTION_GROUP);
                        setAddItemQuestionGroupId('');
                        setAddItemQuestionId('');
                        setAddItemGroupId('');
                      }}
                    >
                      <i className="feather-plus me-1"></i>
                      {t('admin.exam.addItem')}
                    </button>
                    <button
                      type="button"
                      className="rbt-btn btn-sm btn-border text-danger"
                      onClick={() => part.id != null && handleDeletePart(part.id, partItems.length)}
                      title={t('common.delete')}
                    >
                      <i className="feather-trash-2"></i>
                    </button>
                  </div>
                </div>
                <ExamPartItemsList
                  items={partItems}
                  onRemove={handleRemoveItem}
                />
              </div>
            );
          })}
        </div>
      )}

      {addItemPartId && (
        <AddExamItemModal
          examId={examId}
          examPartId={addItemPartId}
          itemType={addItemType}
          setItemType={setAddItemType}
          questionGroupId={addItemQuestionGroupId}
          setQuestionGroupId={setAddItemQuestionGroupId}
          selectedGroupIdForQuestion={addItemGroupId}
          setSelectedGroupIdForQuestion={setAddItemGroupId}
          questionId={addItemQuestionId}
          setQuestionId={setAddItemQuestionId}
          score={addItemScore}
          setScore={setAddItemScore}
          orderNumber={addItemOrder}
          setOrderNumber={setAddItemOrder}
          onSubmit={handleAddItem}
          onCancel={closeAddItemModal}
          isSubmitting={addItem.isPending}
          t={t}
        />
      )}
    </div>
  );
}

function ExamPartItemsList({
  items,
  onRemove,
}: {
  items: ExamItem[];
  onRemove: (examItemId: string) => void;
}) {
  const { t } = useTranslation();
  if (items.length === 0) {
    return <p className="text-muted small mb--0">{t('admin.exam.noItemsInPart')}</p>;
  }
  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover mb-0">
        <thead>
          <tr>
            <th className="text-muted small">{t('admin.exam.itemType')}</th>
            <th className="text-muted small">{t('admin.exam.questionGroup')} / {t('admin.exam.questionName')}</th>
            <th className="text-muted small">{t('admin.exam.orderNumber')}</th>
            <th className="text-muted small">{t('admin.exam.score')}</th>
            <th className="text-muted small text-end" style={{ width: 80 }}>{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const typeLabel = item.itemType === 'QUESTION_GROUP'
              ? t('admin.exam.questionGroup')
              : t('admin.exam.singleQuestion');
            const codeOrName = item.itemType === 'QUESTION_GROUP'
              ? (item.questionGroup?.code ?? '—')
              : (item.question?.name ?? item.question?.questionType ?? '—');
            return (
              <tr key={item.id}>
                <td>
                  <span className="badge bg-secondary">{typeLabel}</span>
                </td>
                <td>{codeOrName}</td>
                <td>{item.orderNumber != null ? item.orderNumber : '—'}</td>
                <td>{item.score != null ? item.score : '—'}</td>
                <td className="text-end">
                  <button
                    type="button"
                    className="rbt-btn btn-sm btn-border text-danger"
                    onClick={() => item.id != null && onRemove(item.id)}
                    title={t('admin.exam.removeItem')}
                  >
                    <i className="feather-trash-2"></i>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AddExamItemModal({
  examId,
  examPartId,
  itemType,
  setItemType,
  questionGroupId,
  setQuestionGroupId,
  selectedGroupIdForQuestion,
  setSelectedGroupIdForQuestion,
  questionId,
  setQuestionId,
  score,
  setScore,
  orderNumber,
  setOrderNumber,
  onSubmit,
  onCancel,
  isSubmitting,
  t,
}: {
  examId: string;
  examPartId: string;
  itemType: ExamAddItemRequestItemType;
  setItemType: (v: ExamAddItemRequestItemType) => void;
  questionGroupId: string;
  setQuestionGroupId: (v: string) => void;
  selectedGroupIdForQuestion: string;
  setSelectedGroupIdForQuestion: (v: string) => void;
  questionId: string;
  setQuestionId: (v: string) => void;
  score: number | '';
  setScore: (v: number | '') => void;
  orderNumber: number | '';
  setOrderNumber: (v: number | '') => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  t: (key: string) => string;
}) {
  const { data: groupsData } = useListQuestionGroups(
    { page: 0, size: 500 },
    { query: { enabled: itemType === ExamAddItemRequestItemType.QUESTION_GROUP } }
  );
  const groups = normalizeListResponse(groupsData);
  const { data: standaloneData } = useGetStandaloneQuestions({
    query: { enabled: itemType === ExamAddItemRequestItemType.QUESTION },
  });
  const standaloneQuestions = normalizeListResponse(standaloneData);

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center overflow-auto bg-dark bg-opacity-25" style={{ zIndex: 1050 }}>
      <div className="bg-white rounded shadow-lg p--30 mx-3" style={{ maxWidth: 480, width: '100%' }}>
        <h5 className="mb--20">{t('admin.exam.addItem')}</h5>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <Label>{t('admin.exam.itemType')}</Label>
            <Select
              value={itemType}
              onChange={(e) => {
                setItemType(e.target.value as ExamAddItemRequestItemType);
                setQuestionGroupId('');
                setQuestionId('');
                setSelectedGroupIdForQuestion('');
              }}
            >
              <option value={ExamAddItemRequestItemType.QUESTION_GROUP}>{t('admin.exam.questionGroup')}</option>
              <option value={ExamAddItemRequestItemType.QUESTION}>{t('admin.exam.singleQuestion')}</option>
            </Select>
          </div>
          {itemType === ExamAddItemRequestItemType.QUESTION_GROUP && (
            <div className="mb-3">
              <Label>{t('admin.exam.selectQuestionGroup')}</Label>
              <Select
                value={questionGroupId}
                onChange={(e) => setQuestionGroupId(e.target.value)}
                required
              >
                <option value="">{t('form.label.select')}</option>
                {(groups as Array<{ id?: string; code?: string }>)
                  .filter((g) => g?.id)
                  .map((g) => (
                    <option key={g.id!} value={g.id}>{g.code ?? g.id}</option>
                  ))}
              </Select>
            </div>
          )}
          {itemType === ExamAddItemRequestItemType.QUESTION && (
            <div className="mb-3">
              <Label>{t('admin.exam.selectQuestion')}</Label>
              <Select
                value={questionId}
                onChange={(e) => setQuestionId(e.target.value)}
                required
              >
                <option value="">{t('form.label.select')}</option>
                {(standaloneQuestions as Array<{ id?: string; name?: string; questionType?: string }>)
                  .filter((q) => q?.id)
                  .map((q) => (
                    <option key={q.id!} value={q.id}>{q.name || q.questionType || q.id}</option>
                  ))}
              </Select>
              <p className="text-muted small mt-1 mb-0">{t('admin.exam.standaloneQuestionsOnly')}</p>
            </div>
          )}
          <div className="row g-2">
            <div className="col-6">
              <Label>{t('admin.exam.scoreOptional')}</Label>
              <Input
                type="number"
                step="0.5"
                min={0}
                value={score}
                onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="—"
              />
            </div>
            <div className="col-6">
              <Label>{t('admin.exam.orderOptional')}</Label>
              <Input
                type="number"
                min={1}
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="—"
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt--20">
            <button type="button" className="rbt-btn btn-border" onClick={onCancel}>
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="rbt-btn btn-gradient"
              disabled={
                isSubmitting ||
                (itemType === ExamAddItemRequestItemType.QUESTION_GROUP && !questionGroupId) ||
                (itemType === ExamAddItemRequestItemType.QUESTION && !questionId)
              }
            >
              {isSubmitting ? t('common.loading') : t('common.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
