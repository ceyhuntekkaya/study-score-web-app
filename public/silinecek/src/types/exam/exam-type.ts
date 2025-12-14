import {ECourseCategory, ECurriculumLevel, EMediaType, EStatus} from "@/types/enumeration";
import {Campus} from "@/types/management/campus";
import {Branch} from "@/types/management/branch";
import {Course} from "@/types/course/course";
import {AcademicYear} from "@/types/definition/academic-year";
import {Brand} from "@/types/management/brand";
import {Institution} from "@/types/management/institution";
import {DatabaseObject} from "@/types/base";
import {CurriculumContent} from "@/types/definition/curriculum-content";
import { UploadedFile, UploadedFileDto } from "../definition/uploaded-file";
import {LearnerUser} from "@/types/auth";
import {RecordType} from "@/types/table";



export enum EQuestionTemplateType {
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    TRUE_FALSE = "TRUE_FALSE",
    FILL_IN_THE_BLANKS = "FILL_IN_THE_BLANKS",
    SHORT_ANSWER = "SHORT_ANSWER",
    MATCHING = "MATCHING",
    ESSAY = "ESSAY",
    ORDERING = "ORDERING",
    MULTIPLE_RESPONSE = "MULTIPLE_RESPONSE",
    HOT_SPOT = "HOT_SPOT",
    DRAG_AND_DROP = "DRAG_AND_DROP",
    AUDIO_RESPONSE = "AUDIO_RESPONSE",
    VIDEO_RESPONSE = "VIDEO_RESPONSE",
    IMAGE_RESPONSE = "IMAGE_RESPONSE"
}


export enum ESkill {
    READING = "READING",
    WRITING = "WRITING"
}

export enum ESessionStatus {
    NOT_STARTED = "NOT_STARTED",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED"
}

export enum EAssignmentLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

export enum EAssignmentStatus {
    NEW = "NEW",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}

export enum ETimeLimitType {
    GLOBAL = "GLOBAL",
    PER_QUESTION = "PER_QUESTION"
}



export enum EQuestionExtraSectionType {
    INSTRUCTION = "INSTRUCTION",
    HINT = "HINT"
}

export enum SecurityRiskLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

export enum SecurityViolationType {
    COPY_PASTE = "COPY_PASTE",
    TAB_SWITCH = "TAB_SWITCH"
}

export enum SecurityAction {
    WARNING = "WARNING",
    TERMINATION = "TERMINATION"
}

export enum ESessionLogType {
    LOGIN = "LOGIN",
    ACTION = "ACTION"
}

// SHARED INTERFACES
export interface DatabaseObjectDto extends RecordType {
    id: string;
    createdAt: Date | null;
    deletedAt?: Date | null;
    status: EStatus | null;
    createdById?: string | null;
    deletedById?: string | null;
}



// INTERFACES
export interface AnswerDto {
    questionType: EQuestionTemplateType;
    timestamp: string;
    selectedOption?: number;
    selectedOptions?: number[];
    optionText?: string;
    selectedAnswer?: boolean;
    blankAnswers?: string[];
    textAnswer?: string;
    wordCount?: number;
    matchedPairs?: { [key: string]: string };
    orderedItems?: string[];
    selectedAreas?: number[];
    coordinates?: number[][];
    dropMappings?: { [key: string]: string };
    audioFileUrl?: string;
    videoFileUrl?: string;
    imageFileUrl?: string;
    recordingDuration?: number;
    drawingData?: string;
    confidence?: string;
    additionalData?: string;
    rawData?: string;
}

export interface CurriculumFilterDto {
    name: string;
    category: ECourseCategory;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
}

export interface ExamComplexityDto {
    examId: string;
    questionTypeDistribution: { [key: string]: number };
    difficultyDistribution: { [key: string]: number };
    timeComplexity: string;
    pointComplexity: string;
    complexityScore: number;
}

export interface ExamFilterDto {
    name: string;
    category: ECourseCategory;
    level?: string;
    language?: string;
    createdFrom?: string;
    createdTo?: string;
    minQuestions?: number;
    maxQuestions?: number;
    minPoints?: number;
    maxPoints?: number;
}

export interface ExamReadyFilterDto {
    questionType: EQuestionTemplateType;
    minPoints?: number;
    maxPoints?: number;
    isActive?: boolean;
    partId?: string;
}

export interface ExamSettingsDto {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    timeLimit: number;
    maxQuestions: number;
}

export interface ExamStatisticsDto {
    examId: string;
    examName: string;
    category: ECourseCategory;
    level: string;
    totalQuestions: number;
    activeQuestions: number;
    inactiveQuestions: number;
    totalParts: number;
    totalPoints: number;
    estimatedDuration: number;
    questionTypeDistribution: { [key in EQuestionTemplateType]?: number };
    isValid: boolean;
    validationErrors: string[];
}

export interface HeartbeatResponseDto {
    sessionId: string;
    success: boolean;
    message: string;
    timestamp: string;
    remainingTime: number;
    sessionStatus: ESessionStatus;
    currentQuestionIndex: number;
    nextHeartbeatInterval: number;
    warnings: { [key: string]: string };
}

export interface PartStatisticsDto {
    partId: string;
    partName: string;
    skill: ESkill;
    questionCount: number;
    totalPoints: number;
    estimatedDuration: number;
    questionTypeDistribution: { [key in EQuestionTemplateType]?: number };
}

export interface QuestionFilterDto {
    questionType: EQuestionTemplateType;
    partId?: string;
    minPoints?: number;
    maxPoints?: number;
    minTimeLimit?: number;
    maxTimeLimit?: number;
    isActive?: boolean;
    isMain?: boolean;
    tags?: string[];
}

export interface QuestionStatisticsDto {
    questionId: string;
    questionType: EQuestionTemplateType;
    points: number;
    timeLimit: number;
    isActive: boolean;
    isMain: boolean;
    usageCount: number;
    averageScore: number;
    difficultyLevel: string;
}

export interface SecurityIncidentDto {
    sessionId: string;
    userId: string;
    examId: string;
    incidentTime: string;
    violationCount: number;
    suspicious: boolean;
    violations: SecurityViolationDto[];
}

export interface SecurityRiskLevelDto {
    sessionId: string;
    riskLevel: SecurityRiskLevel;
    riskScore: number;
    riskFactors: string[];
    recommendations: string[];
    assessmentTime: string;
}

export interface SecuritySettingsDto {
    preventCopyPaste: boolean;
    preventRightClick: boolean;
    detectTabSwitch: boolean;
    requireFullScreen: boolean;
    heartbeatInterval: number;
    maxIdleTime: number;
    ipValidationEnabled: boolean;
    userAgentValidationEnabled: boolean;
    sessionTokenValidationEnabled: boolean;
    maxViolationsBeforeWarning: number;
    maxViolationsBeforeTermination: number;
}

export interface SecurityViolationDto {
    sessionId: string;
    userId: string;
    violationType: SecurityViolationType;
    details: string;
    timestamp: string;
    ipAddress: string;
    userAgent: string;
    metadata: { [key: string]: string | number | boolean | null };
    action: SecurityAction;
}

export interface TemplateFilterDto {
    type: EQuestionTemplateType;
    subject?: string;
    difficulty?: string;
    minPoints?: number;
    maxPoints?: number;
    minTimeLimit?: number;
    maxTimeLimit?: number;
    isActive?: boolean;
    tags?: string[];
}

export interface TemplateUsageStatsDto {
    templateId: string;
    usageCount: number;
    examCount: number;
    lastUsed: string;
}

export interface CurriculumContentDto extends DatabaseObjectDto {
    code: string;
    curriculum: CurriculumDto | null;
    level: ECurriculumLevel;
    content: string;
    orderNumber: number;
    parentId?: string | null;
    children: CurriculumContentDto[];
    updatedAt: Date | null;
    version: number | null;
}

export interface CurriculumDto extends DatabaseObjectDto {
    name: string;
    description: string;
    category: ECourseCategory;
    updatedAt: Date | null;
    version: number | null;
}

export interface ExamDto extends DatabaseObjectDto {
    name: string;
    category: ECourseCategory;
    imageUrl?: string;
    description?: string;
    code?: string;
    language?: string;
    level?: string;
    introText?: string;
    examParts: ExamPartDto[];
    maxScore: number;
    examQuestions: ExamQuestionDto[];
    duration?: number | null;
    isPublished?: boolean | true;
    isActive?: boolean | true;
}


export interface EducationAssignmentDto extends DatabaseObjectDto {
    brandId: string;
    institutionId: string;
    campusId: string;
    branchId: string;
    learnerUserId: string;
    courseId: string;
    exam: ExamDto;
    academicYearId: string;
    assignmentLevel: EAssignmentLevel;
    assignmentStatus: EAssignmentStatus;
    startDate: string;
    endDate: string;
    assignedAt: string;
    executionSettings: ExamExecutionSettingsDto;
    assignmentTitle: string;
    assignmentDescription: string;
    maxAttempts: number;
    isActive: boolean;
    assignedBrandIds: string;
    assignedInstitutionIds: string;
    assignedCampusIds: string;
    assignedBranchIds: string;
    assignedLearnerIds: string;
}

export interface ExamAnswerDto extends DatabaseObjectDto {
    sessionId: string;
    questionId: string;
    answerData: string;
    previousAnswerData: string;
    firstAnsweredAt: string;
    lastModifiedAt: string;
    timeSpentOnQuestion: number;
    modificationCount: number;
    isAnswered: boolean;
    isMarkedForReview: boolean;
    isSkipped: boolean;
    isAutoSaved: boolean;
    score: number;
    isCorrect: boolean;
    feedback: string;
}

export interface ExamExecutionSettingsDto {
    allowNavigation: boolean;
    allowSkipping: boolean;
    allowBackNavigation: boolean;
    timeLimitType: ETimeLimitType;
    globalTimeLimit: number;
    allowPauseResume: boolean;
    maxPauseDuration: number;
    maxPauseCount: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showQuestionNumbers: boolean;
    showProgressBar: boolean;
    allowReview: boolean;
    showResults: boolean;
    showCorrectAnswers: boolean;
    showScoreImmediately: boolean;
    autoSave: boolean;
    autoSaveInterval: number;
    autoSubmitOnTimeExpire: boolean;
    preventCopyPaste: boolean;
    preventRightClick: boolean;
    detectTabSwitch: boolean;
    requireFullScreen: boolean;
    sessionWarningTime: number;
    heartbeatInterval: number;
    maxIdleTime: number;
}

export interface ExamPartDto extends DatabaseObjectDto {
    name: string;
    orderNumber: number;
    description: string;
    skill?: ESkill;
}
export type QuestionTemplateUnion =
    | AudioResponseTemplateDto
    | DragAndDropTemplateDto
    | EssayTemplateDto
    | FillInTheBlanksTemplateDto
    | HotSpotTemplateDto
    | ImageResponseTemplateDto
    | MatchingTemplateDto
    | MultipleChoiceTemplateDto
    | MultipleResponseTemplateDto
    | OrderingTemplateDto
    | ShortAnswerTemplateDto
    | TrueFalseTemplateDto
    | VideoResponseTemplateDto;


export interface ExamQuestionDto extends DatabaseObjectDto {
    isMain: boolean;
    duration: number;
    repeatCount: number;
    score: number;
    examPart: ExamPartDto;
    curriculumContentSet: CurriculumContentDto[];
    questionTemplateId: string;
    questionType: EQuestionTemplateType;
    questionOrder: number;
    points: number;
    isActive: boolean;
    shuffleOptions: boolean;
    timeLimit: number;
    additionalTags: string[];
    questionTemplate: QuestionTemplateUnion; // replace with actual BaseQuestionTemplateDto if defined
}

export interface ExamQuestionExtraSectionDto extends DatabaseObjectDto {
    orderNumber: number;
    mediaType: EMediaType;
    content: string;
    extraSectionType: EQuestionExtraSectionType;
    url: string;
    file: UploadedFileDto;
}

export interface QuestionAnalyticsDto  {
    totalQuestions: number;
    questionsByType: number;
    questionsBySkill: number;
    totalPoints: number;
    totalTimeLimit: number;
    inactiveQuestions: number;
    activeQuestions: number;
    questionsWithTemplate: number;
    questionsWithoutTemplate: number;

}



export interface ExamQuestionReadyDto {
    id: string;
    isMain: boolean;
    duration: number;
    repeatCount: number;
    score: number;
    questionOrder: number;
    points: number;
    isActive: boolean;
    shuffleOptions: boolean;
    timeLimit: number;
    additionalTags: string[];
    examPart: ExamPartDto;
    curriculumContentSet: CurriculumContentDto[];
    questionType: EQuestionTemplateType;
    questionTemplate: QuestionTemplateUnion;
    extraSections: ExamQuestionExtraSectionDto[];
}

export interface ExamReadyDto {
    id: string;
    name: string;
    category: ECourseCategory;
    imageUrl: string;
    description: string;
    code: string;
    language: string;
    level: string;
    introText: string;
    maxScore: number;
    createdAt: string;
    examParts: ExamPartDto[];
    questions: ExamQuestionReadyDto[];
    totalQuestions: number;
    totalPoints: number;
    estimatedDuration: number;
}

export interface ExamSessionDto extends DatabaseObjectDto {
    assignment: EducationAssignmentDto;
    learnerId: string;
    sessionStatus: ESessionStatus;
    sessionStartTime: string;
    sessionEndTime: string;
    lastActivityTime: string;
    pauseStartTime: string;
    totalPauseTime: number;
    pauseCount: number;
    remainingTime: number;
    timeSpentTotal: number;
    currentQuestionIndex: number;
    totalQuestions: number;
    visitedQuestions: string;
    answeredQuestions: string;
    markedQuestions: string;
    ipAddress: string;
    sessionToken: string;
    autoSubmitted: boolean;
    timeExpired: boolean;
    manuallySubmitted: boolean;
    securityViolationCount: number;
    suspicious: boolean;
    finalScore: number;
    percentage: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    answers: ExamAnswerDto[];
}

export interface ExamSessionLogDto extends DatabaseObjectDto {
    sessionId: string | null;
    logType: ESessionLogType;
    actionData: string;
    actionTime: string;
    ipAddress: string | null;
    userAgent: string | null;
    questionId: string | null;
    questionIndex: number | null;
    additionalInfo: string | null;
}



// TEMPLATE DTOs

export interface BaseQuestionTemplateDto extends DatabaseObjectDto {
    title: string;
    description: string;
    subject: string;
    difficulty: string;
    points: number;
    timeLimit: number;
    instructions: string;
    tags: string[];
    isActive: boolean;
    templateType: EQuestionTemplateType;
}

export interface AudioResponseTemplateDto extends BaseQuestionTemplateDto {
    prompt: string;
    audioPromptUrl: string;
    maxRecordingDuration: number;
    minRecordingDuration: number;
    gradingCriteria: string[];
    rubric: string;
    requiresManualGrading: boolean;
    allowedFormats: string;
}

export interface DragAndDropTemplateDto extends BaseQuestionTemplateDto {
    instructions: string;
    draggableItems: string[];
    targetZones: string[];
    correctMappings: string[];
    allowMultipleItemsPerZone: boolean;
    shuffleDraggableItems: boolean;
    explanation: string;
}

export interface EssayTemplateDto extends BaseQuestionTemplateDto {
    prompt: string;
    gradingCriteria: string[];
    minWords: number;
    maxWords: number;
    requiredTopics: string[];
    rubric: string;
    requiresManualGrading: boolean;
}

export interface FillInTheBlanksTemplateDto extends BaseQuestionTemplateDto {
    textWithBlanks: string;
    correctAnswers: string[];
    alternativeAnswers: string[];
    caseSensitive: boolean;
    exactMatch: boolean;
    explanation: string;
}

export interface HotSpotTemplateDto extends BaseQuestionTemplateDto {
    instructions: string;
    imageUrl: string;
    hotSpotAreas: string[];
    maxSelections: number;
    allowMultipleSpots: boolean;
    explanation: string;
}

export interface ImageResponseTemplateDto extends BaseQuestionTemplateDto {
    prompt: string;
    referenceImageUrl: string;
    maxFileSize: number;
    gradingCriteria: string[];
    rubric: string;
    requiresManualGrading: boolean;
    allowedFormats: string;
    requiresDrawing: boolean;
    allowsUpload: boolean;
}

export interface MatchingTemplateDto extends BaseQuestionTemplateDto {
    instructions: string;
    leftItems: string[];
    rightItems: string[];
    correctMatches: string[];
    shuffleItems: boolean;
    explanation: string;
}

export interface MultipleChoiceTemplateDto extends BaseQuestionTemplateDto {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
    shuffleOptions: boolean;
}

export interface MultipleResponseTemplateDto extends BaseQuestionTemplateDto {
    question: string;
    options: string[];
    correctOptionIndices: number[];
    minSelections: number;
    maxSelections: number;
    shuffleOptions: boolean;
    explanation: string;
}

export interface OrderingTemplateDto extends BaseQuestionTemplateDto {
    instructions: string;
    items: string[];
    correctOrder: number[];
    shuffleItems: boolean;
    explanation: string;
}

export interface ShortAnswerTemplateDto extends BaseQuestionTemplateDto {
    question: string;
    expectedKeywords: string[];
    sampleAnswers: string[];
    maxCharacters: number;
    minCharacters: number;
    rubric: string;
    requiresManualGrading: boolean;
}

export interface TrueFalseTemplateDto extends BaseQuestionTemplateDto {
    statement: string;
    correctAnswer: boolean;
    explanation: string;
}

export interface VideoResponseTemplateDto extends BaseQuestionTemplateDto {
    prompt: string;
    videoPromptUrl: string;
    maxRecordingDuration: number;
    minRecordingDuration: number;
    gradingCriteria: string[];
    rubric: string;
    requiresManualGrading: boolean;
    allowedFormats: string;
    allowScreenRecording: boolean;
}


export interface BaseQuestionTemplate extends DatabaseObject {
    title: string;
    description?: string;
    subject: string;
    difficulty: string;
    points: number;
    timeLimit: number;
    instructions?: string;
    tags?: string[];
    isActive: boolean;
}

export interface AudioResponseTemplate extends BaseQuestionTemplate {
    prompt: string;
    audioPromptUrl?: string;
    maxRecordingDuration: number;
    minRecordingDuration: number;
    gradingCriteria?: string[];
    rubric?: string;
    requiresManualGrading: boolean;
    allowedFormats: string;
}

export interface DragAndDropTemplate extends BaseQuestionTemplate {
    instructions: string;
    draggableItems?: string[];
    targetZones?: string[];
    correctMappings?: string[];
    allowMultipleItemsPerZone: boolean;
    shuffleDraggableItems: boolean;
    explanation?: string;
}

export interface EssayTemplate extends BaseQuestionTemplate {
    prompt: string;
    gradingCriteria?: string[];
    minWords: number;
    maxWords: number;
    requiredTopics?: string[];
    rubric?: string;
    requiresManualGrading: boolean;
}

export interface FillInTheBlanksTemplate extends BaseQuestionTemplate {
    textWithBlanks: string;
    correctAnswers?: string[];
    alternativeAnswers?: string[];
    caseSensitive: boolean;
    exactMatch: boolean;
    explanation?: string;
}

export interface HotSpotTemplate extends BaseQuestionTemplate {
    instructions: string;
    imageUrl: string;
    hotSpotAreas?: string[];
    maxSelections: number;
    allowMultipleSpots: boolean;
    explanation?: string;
}

export interface ImageResponseTemplate extends BaseQuestionTemplate {
    prompt: string;
    referenceImageUrl?: string;
    maxFileSize: number;
    gradingCriteria?: string[];
    rubric?: string;
    requiresManualGrading: boolean;
    allowedFormats: string;
    requiresDrawing: boolean;
    allowsUpload: boolean;
}

export interface MatchingTemplate extends BaseQuestionTemplate {
    instructions: string;
    leftItems?: string[];
    rightItems?: string[];
    correctMatches?: string[];
    shuffleItems: boolean;
    explanation?: string;
}

export interface MultipleChoiceTemplate extends BaseQuestionTemplate {
    question: string;
    options?: string[];
    correctOptionIndex: number;
    explanation?: string;
    shuffleOptions: boolean;
}

export interface MultipleResponseTemplate extends BaseQuestionTemplate {
    question: string;
    options?: string[];
    correctOptionIndices?: number[];
    minSelections: number;
    maxSelections: number;
    shuffleOptions: boolean;
    explanation?: string;
}

export interface OrderingTemplate extends BaseQuestionTemplate {
    instructions: string;
    items?: string[];
    correctOrder?: number[];
    shuffleItems: boolean;
    explanation?: string;
}

export interface ShortAnswerTemplate extends BaseQuestionTemplate {
    question: string;
    expectedKeywords?: string[];
    sampleAnswers?: string[];
    maxCharacters: number;
    minCharacters: number;
    rubric?: string;
    requiresManualGrading: boolean;
}

export interface TrueFalseTemplate extends BaseQuestionTemplate {
    statement: string;
    correctAnswer: boolean;
    explanation?: string;
}

export interface VideoResponseTemplate extends BaseQuestionTemplate {
    prompt: string;
    videoPromptUrl?: string;
    maxRecordingDuration: number;
    minRecordingDuration: number;
    gradingCriteria?: string[];
    rubric?: string;
    requiresManualGrading: boolean;
    allowedFormats: string;
    allowScreenRecording: boolean;
}



export interface Exam {
    id?: number;
    name?: string;
    category?: string;
    imageUrl?: string;
    description?: string;
    code?: string;
    language?: string;
    level?: string;
    introText?: string;
    examParts?: ExamPart[];
    maxScore?: number;
    examQuestions?: ExamQuestion[];
}

export interface EducationAssignment extends DatabaseObject {
    brand?: Brand;
    institution?: Institution;
    campus?: Campus;
    branch?: Branch;
    learnerUser?: LearnerUser;
    course?: Course;
    exam?: Exam;
    academicYear?: AcademicYear;
    assignmentLevel: string;
    assignmentStatus: string;
    startDate?: string;
    endDate?: string;
    assignedAt?: string;
    executionSettings?: ExamExecutionSettings;
    assignmentTitle?: string;
    assignmentDescription?: string;
    maxAttempts: number;
    isActive: boolean;
    assignedBrandIds?: string;
    assignedInstitutionIds?: string;
    assignedCampusIds?: string;
    assignedBranchIds?: string;
    assignedLearnerIds?: string;
}

export interface ExamExecutionSettings {
    allowNavigation: boolean;
    allowSkipping: boolean;
    allowBackNavigation: boolean;
    timeLimitType: string;
    globalTimeLimit?: number;
    allowPauseResume: boolean;
    maxPauseDuration: number;
    maxPauseCount: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showQuestionNumbers: boolean;
    showProgressBar: boolean;
    allowReview: boolean;
    showResults: boolean;
    showCorrectAnswers: boolean;
    showScoreImmediately: boolean;
    autoSave: boolean;
    autoSaveInterval: number;
    autoSubmitOnTimeExpire: boolean;
    preventCopyPaste: boolean;
    preventRightClick: boolean;
    detectTabSwitch: boolean;
    requireFullScreen: boolean;
    sessionWarningTime: number;
    heartbeatInterval: number;
    maxIdleTime: number;
}

export interface ExamPart extends DatabaseObject {
    name?: string;
    orderNumber?: number;
    description?: string;
    skill?: ESkill;
}



export interface ExamQuestion extends DatabaseObject {
    isMain: boolean;
    duration?: number;
    repeatCount?: number;
    score?: number;
    examPart?: ExamPart;
    curriculumContentSet?: CurriculumContent[];
    questionTemplateId: string;
    questionType: string;
    questionOrder: number;
    points: number;
    isActive: boolean;
    shuffleOptions: boolean;
    timeLimit?: number;
    additionalTags?: string[];
}

export interface ExamQuestionExtraSection extends DatabaseObject {
    orderNumber?: number;
    mediaType?: string;
    content?: string;
    extraSectionType?: string;
    url?: string;
    file?: UploadedFile;
}

export interface ExamAnswer extends DatabaseObject {
    session?: ExamSession;
    question?: ExamQuestion;
    answerData?: string;
    previousAnswerData?: string;
    firstAnsweredAt?: string;
    lastModifiedAt?: string;
    timeSpentOnQuestion: number;
    modificationCount: number;
    isAnswered: boolean;
    isMarkedForReview: boolean;
    isSkipped: boolean;
    isAutoSaved: boolean;
    score?: number;
    isCorrect?: boolean;
    feedback?: string;
}

export interface ExamSession extends DatabaseObject {
    assignment?: EducationAssignment;
    learner?: LearnerUser;
    sessionStatus?: string;
    sessionStartTime?: string;
    sessionEndTime?: string;
    lastActivityTime?: string;
    pauseStartTime?: string;
    totalPauseTime: number;
    pauseCount: number;
    remainingTime?: number;
    timeSpentTotal: number;
    currentQuestionIndex: number;
    totalQuestions?: number;
    visitedQuestions?: string;
    answeredQuestions?: string;
    markedQuestions?: string;
    ipAddress?: string;
    userAgent?: string;
    sessionToken?: string;
    autoSubmitted: boolean;
    timeExpired: boolean;
    manuallySubmitted: boolean;
    securityViolationCount: number;
    suspicious: boolean;
    finalScore?: number;
    percentage?: number;
    correctAnswers?: number;
    incorrectAnswers?: number;
    unansweredQuestions?: number;
    answers?: ExamAnswer[];
    sessionLogs?: ExamSessionLog[];
}

export interface ExamSessionLog extends DatabaseObject {
    session?: ExamSession;
    logType: ESessionLogType;
    actionData: string;
    actionTime: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    questionId?: string | null;
    questionIndex?: number | null;
    additionalInfo?: string | null;
}
