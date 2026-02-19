/**
 * Question Response API – Cevap kaydetme ve listeleme.
 * Orval ile üretilen tipler ve controller kullanılır; ek tip tanımlanmaz.
 * Backend: POST/GET /api/question-responses (docs/FRONTEND_QUESTION_RESPONSE_API.md)
 */

import { useQueryClient } from '@tanstack/react-query';
import {
  type QuestionResponseRequest,
  QuestionResponseRequestContextType,
} from '@/generated/api/openAPIDefinition.schemas';
import {
  useGetResponses,
  useSaveOrUpdate,
} from '@/generated/api/question-response-controller/question-response-controller';

/** Orval'dan gelen context type; mevcut CONTEXT_TYPE kullanımı için re-export */
export const CONTEXT_TYPE = QuestionResponseRequestContextType;

/** Request body tipi – Orval şemasından re-export */
export type { QuestionResponseRequest } from '@/generated/api/openAPIDefinition.schemas';

// —— React Query keys (Orval key'leri ile uyumlu, invalidation için) ——
export const questionResponseKeys = {
  all: ['question-responses'] as const,
  exam: (examAttemptId: string) =>
    [...questionResponseKeys.all, 'exam', examAttemptId] as const,
  material: (materialId: string, userId: string) =>
    [...questionResponseKeys.all, 'material', materialId, userId] as const,
};

/** Cevap kaydet/güncelle – Orval saveOrUpdate kullanır, body doğrudan verilir */
export function useSaveQuestionResponse(options?: {
  onSuccess?: () => void;
  invalidateExamAttemptId?: string;
  invalidateMaterialId?: string;
  invalidateUserId?: string;
}) {
  const queryClient = useQueryClient();
  const orvalMutation = useSaveOrUpdate({
    mutation: {
      onSuccess: (_, variables) => {
        const body = variables.data;
        if (options?.invalidateExamAttemptId && body.examAttemptId) {
          queryClient.invalidateQueries({
            queryKey: questionResponseKeys.exam(options.invalidateExamAttemptId),
          });
        }
        if (
          options?.invalidateMaterialId &&
          options?.invalidateUserId &&
          body.courseLessonPartMaterialId
        ) {
          queryClient.invalidateQueries({
            queryKey: questionResponseKeys.material(
              options.invalidateMaterialId,
              options.invalidateUserId
            ),
          });
        }
        options?.onSuccess?.();
      },
    },
  });

  return {
    ...orvalMutation,
    mutate: (body: QuestionResponseRequest) =>
      orvalMutation.mutate({ data: body }),
    mutateAsync: (body: QuestionResponseRequest) =>
      orvalMutation.mutateAsync({ data: body }),
  };
}

/** Sınav denemesi cevapları – Orval getResponses, params: contextType=EXAM_ATTEMPT, examAttemptId */
export function useQuestionResponsesForExam(
  examAttemptId: string | undefined,
  queryOptions?: { enabled?: boolean }
) {
  return useGetResponses(
    examAttemptId
      ? {
          contextType: QuestionResponseRequestContextType.EXAM_ATTEMPT,
          examAttemptId,
        }
      : undefined,
    {
      query: {
        queryKey: questionResponseKeys.exam(examAttemptId ?? ''),
        enabled: !!examAttemptId && (queryOptions?.enabled !== false),
      },
    }
  );
}

/** Materyal (quiz) cevapları – Orval getResponses, params: contextType=COURSE_LESSON_PART_MATERIAL, courseLessonPartMaterialId, userId */
export function useQuestionResponsesForMaterial(
  courseLessonPartMaterialId: string | undefined,
  userId: string | undefined,
  queryOptions?: { enabled?: boolean }
) {
  const params =
    courseLessonPartMaterialId && userId
      ? {
          contextType:
            QuestionResponseRequestContextType.COURSE_LESSON_PART_MATERIAL,
          courseLessonPartMaterialId,
          userId,
        }
      : undefined;

  return useGetResponses(params, {
    query: {
      queryKey: questionResponseKeys.material(
        courseLessonPartMaterialId ?? '',
        userId ?? ''
      ),
      enabled:
        !!courseLessonPartMaterialId &&
        !!userId &&
        (queryOptions?.enabled !== false),
    },
  });
}
