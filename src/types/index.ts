/**
 * Type Definitions
 */

export type UserRole = 'learner' | 'tutor' | 'manager' | 'admin' | 'writer';

export type LearnerContentType = 'quiz' | 'exam' | 'content' | 'dashboard';

export type Language = 'en' | 'tr';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

/**
 * Type Augmentations for Generated API Types
 * 
 * This augments the generated API types to add missing type definitions
 * that should be added to the backend OpenAPI schema.
 * 
 * NOTE: This should be removed once the backend API schema is updated
 * and types are properly generated.
 */
declare module '@/generated/api/openAPIDefinition.schemas' {
  // Exam Answer related types
  export interface ExamAnswerDto {
    [key: string]: unknown;
  }

  export type SaveAnswerBody = {
    [key: string]: unknown;
  };

  export type SaveMultipleAnswersBody = {
    [key: string]: unknown;
  };

  export type SubmitAnswerBody = {
    [key: string]: unknown;
  };

  export type GetAnswerStatistics200 = {
    [key: string]: unknown;
  };

  export type GetTimeSpentByQuestion200 = {
    [key: string]: unknown;
  };

  // Exam Part related types
  export interface ExamPartDto {
    [key: string]: unknown;
  }

  export type AssignSkillParams = {
    [key: string]: unknown;
  };

  export type DuplicateMultiplePartsParams = {
    [key: string]: unknown;
  };

  export type DuplicatePartParams = {
    [key: string]: unknown;
  };

  export type ExistsByName1Params = {
    [key: string]: unknown;
  };

  export type FindByNameParams = {
    [key: string]: unknown;
  };

  export type GetMostUsedPartsParams = {
    [key: string]: unknown;
  };

  export type GetPartDistributionBySkill200 = {
    [key: string]: unknown;
  };

  export type GetPartQuestionTypes200 = {
    [key: string]: unknown;
  };

  export type GetPartsPaginatedParams = {
    [key: string]: unknown;
  };

  export type GetRecentPartsParams = {
    [key: string]: unknown;
  };

  export interface PageExamPartDto {
    [key: string]: unknown;
  }

  export interface PartStatisticsDto {
    [key: string]: unknown;
  }

  export type ReorderParts1Params = {
    [key: string]: unknown;
  };

  export type SearchPartsParams = {
    [key: string]: unknown;
  };

  export type UpdatePartOrderParams = {
    [key: string]: unknown;
  };

  // Exam Question related types
  export interface ExamQuestionDto {
    [key: string]: unknown;
  }

  export type AddTagParams = {
    [key: string]: unknown;
  };

  export type BulkUpdatePointsParams = {
    [key: string]: unknown;
  };

  export type BulkUpdateTimeLimitParams = {
    [key: string]: unknown;
  };

  export type CreateQuestionFromTemplateParams = {
    [key: string]: unknown;
  };

  export type CreateQuestionsFromTemplatesParams = {
    [key: string]: unknown;
  };

  export type DuplicateQuestionsParams = {
    [key: string]: unknown;
  };


  export type GetQuestionSkillDistribution200 = {
    [key: string]: unknown;
  };

  export type GetQuestionTypeDistribution200 = {
    [key: string]: unknown;
  };

  export type GetQuestionsPaginatedParams = {
    [key: string]: unknown;
  };

  export type GetRecentQuestionsParams = {
    [key: string]: unknown;
  };

  export type LinkTemplateParams = {
    [key: string]: unknown;
  };

  export interface PageExamQuestionDto {
    [key: string]: unknown;
  }

  export interface QuestionAnalyticsDto {
    [key: string]: unknown;
  }

  export interface QuestionFilterDto {
    [key: string]: unknown;
  }

  export interface QuestionStatisticsDto {
    [key: string]: unknown;
  }

  export type RemoveTagParams = {
    [key: string]: unknown;
  };

  export type SearchQuestionsParams = {
    [key: string]: unknown;
  };

  export type ShuffleQuestionOptionsParams = {
    [key: string]: unknown;
  };

  export type UpdatePointsParams = {
    [key: string]: unknown;
  };

  export type UpdateQuestionOrderParams = {
    [key: string]: unknown;
  };

  export type UpdateTemplateReferencesParams = {
    [key: string]: unknown;
  };

  export type UpdateTimeLimitParams = {
    [key: string]: unknown;
  };

  // Exam Ready related types
  export interface BaseQuestionTemplateDto {
    [key: string]: unknown;
  }

  export interface ExamComplexityDto {
    [key: string]: unknown;
  }

  export interface ExamQuestionReadyDto {
    [key: string]: unknown;
  }

  export interface ExamReadyDto {
    [key: string]: unknown;
  }

  export interface ExamReadyFilterDto {
    [key: string]: unknown;
  }

  export interface ExamSettingsDto {
    [key: string]: unknown;
  }

  export interface ExamStatisticsDto {
    [key: string]: unknown;
  }

  export type ResolveTemplates200 = {
    [key: string]: unknown;
  };

  // Exam related types
  export interface ExamDto {
    [key: string]: unknown;
  }

  export interface ExamFilterDto {
    [key: string]: unknown;
  }

  export type AddQuestionToExamParams = {
    [key: string]: unknown;
  };

  export type AddQuestionsFromTemplatesParams = {
    [key: string]: unknown;
  };

  export type DuplicateExamParams = {
    [key: string]: unknown;
  };

  export type ExistsByCodeParams = {
    [key: string]: unknown;
  };

  export type FindByCodeParams = {
    [key: string]: unknown;
  };

  export type GetExamDistributionByCategory200 = {
    [key: string]: unknown;
  };

  export type GetExamDistributionByLevel200 = {
    [key: string]: unknown;
  };

  export type GetPopularExamsParams = {
    [key: string]: unknown;
  };

  export type GetRecentExamsParams = {
    [key: string]: unknown;
  };

  export type SearchExamsParams = {
    [key: string]: unknown;
  };

  export type UpdateQuestionPointsParams = {
    [key: string]: unknown;
  };

  // Exam Template related types
  export interface AudioResponseTemplateDto {
    [key: string]: unknown;
  }

  export interface DragAndDropTemplateDto {
    [key: string]: unknown;
  }

  export type DuplicateTemplateParams = {
    [key: string]: unknown;
  };

  export interface EssayTemplateDto {
    [key: string]: unknown;
  }

  export interface FillInTheBlanksTemplateDto {
    [key: string]: unknown;
  }

  export type GetMostUsedTemplatesParams = {
    [key: string]: unknown;
  };

  export type GetRecentTemplatesParams = {
    [key: string]: unknown;
  };

  export type GetTemplateMap200 = {
    [key: string]: unknown;
  };

  export type GetTemplateTypeStatistics200 = {
    [key: string]: unknown;
  };

  export interface HotSpotTemplateDto {
    [key: string]: unknown;
  }

  export interface ImageResponseTemplateDto {
    [key: string]: unknown;
  }

  export interface MatchingTemplateDto {
    [key: string]: unknown;
  }

  export interface MultipleChoiceTemplateDto {
    [key: string]: unknown;
  }

  export interface MultipleResponseTemplateDto {
    [key: string]: unknown;
  }

  export interface OrderingTemplateDto {
    [key: string]: unknown;
  }

  export type SearchTemplatesParams = {
    [key: string]: unknown;
  };

  export interface ShortAnswerTemplateDto {
    [key: string]: unknown;
  }

  export interface TemplateFilterDto {
    [key: string]: unknown;
  }

  export interface TemplateUsageStatsDto {
    [key: string]: unknown;
  }

  export interface TrueFalseTemplateDto {
    [key: string]: unknown;
  }

  export interface VideoResponseTemplateDto {
    [key: string]: unknown;
  }
}

