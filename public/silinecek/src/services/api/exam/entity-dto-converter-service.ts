import {RecordType} from "@/types/table";


export interface CeyhunObject extends RecordType{
    id: string;
    createdAt: Date | null;
    deletedAt?: Date | null;
}

/*
import {
    AudioResponseTemplate,
    AudioResponseTemplateDto,
    BaseQuestionTemplate,
    BaseQuestionTemplateDto,
    CurriculumContentDto,
    CurriculumDto,
    DatabaseObjectDto,
    DragAndDropTemplate,
    DragAndDropTemplateDto,
    EducationAssignment,
    EducationAssignmentDto,
    ESessionLogType,
    EssayTemplate,
    EssayTemplateDto,
    Exam,
    ExamAnswer,
    ExamAnswerDto,
    ExamDto,
    ExamExecutionSettings,
    ExamExecutionSettingsDto,
    ExamPart,
    ExamPartDto,
    ExamQuestion,
    ExamQuestionDto,
    ExamQuestionExtraSection,
    ExamQuestionExtraSectionDto,
    ExamQuestionReadyDto,
    ExamReadyDto,
    ExamSession,
    ExamSessionDto,
    ExamSessionLog,
    ExamSessionLogDto,
    FillInTheBlanksTemplate,
    FillInTheBlanksTemplateDto,
    HotSpotTemplate,
    HotSpotTemplateDto,
    ImageResponseTemplate,
    ImageResponseTemplateDto,
    MatchingTemplate,
    MatchingTemplateDto,
    MultipleChoiceTemplate,
    MultipleChoiceTemplateDto,
    MultipleResponseTemplate,
    MultipleResponseTemplateDto,
    OrderingTemplate,
    OrderingTemplateDto,
    ShortAnswerTemplate,
    ShortAnswerTemplateDto,
    TrueFalseTemplate,
    TrueFalseTemplateDto,
    VideoResponseTemplate,
    VideoResponseTemplateDto,
} from '@/types/exam/exam-type';
import {EQuestionTemplateType} from '@/types/exam/question-content-section';
import {UploadedFile, UploadedFileDto} from "@/types/definition/uploaded-file";
import {Curriculum} from "@/types/definition/curriculum";
import { CurriculumContent } from '@/types/definition/curriculum-content';
import {DatabaseObject} from "@/types/base";
import {EStatus} from "@/types/enumeration";
import {User} from "@/types/auth";


export class EntityDtoConverterService {
    // Base mapping methods for DatabaseObject
    private mapDatabaseObjectToDto<T extends DatabaseObjectDto>(entity: DatabaseObject, dto: T): void {
        if (entity && dto) {
            dto.id = entity.id;
            dto.createdAt = entity.createdAt;
            dto.deletedAt = entity.deletedAt;
            dto.status = entity.status;
            dto.createdById = entity.createdBy?.id || null;
            dto.deletedById = entity.deletedBy?.id || null;
        }
    }

    private mapDtoToDatabaseObject<T extends DatabaseObjectDto>(dto: T, entity: DatabaseObject): void {
        if (dto && entity) {
            entity.id = dto.id;
            entity.createdAt = dto.createdAt;
            entity.deletedAt = dto.deletedAt;
            entity.status = dto.status;
            // User entities would need to be fetched separately for createdBy/deletedBy
        }
    }

    // ExamSessionLog converters
    toExamSessionLogDto(entity: ExamSessionLog | null): ExamSessionLogDto | null {
        if (!entity) return null;

        const dto: ExamSessionLogDto = {} as ExamSessionLogDto;
        this.mapDatabaseObjectToDto(entity, dto);
        dto.sessionId = entity.session?.id || null;
        dto.logType = entity.logType || ESessionLogType.ACTION;
        dto.actionData = entity.actionData;
        dto.actionTime = entity.actionTime;
        dto.ipAddress = entity.ipAddress || null;
        dto.userAgent = entity.userAgent || null;
        dto.questionId = entity.questionId || null;
        dto.questionIndex = entity.questionIndex || null;
        dto.additionalInfo = entity.additionalInfo || null;
        return dto;
    }

    toExamSessionLogEntity(dto: ExamSessionLogDto | null): ExamSessionLog | null {
        if (!dto) return null;

        const entity: ExamSessionLog = {} as ExamSessionLog;
        this.mapDtoToDatabaseObject(dto, entity);
        entity.logType = dto.logType;
        entity.actionData = dto.actionData;
        entity.actionTime = dto.actionTime;
        entity.ipAddress = dto.ipAddress;
        entity.userAgent = dto.userAgent;
        entity.questionId = dto.questionId;
        entity.questionIndex = dto.questionIndex;
        entity.additionalInfo = dto.additionalInfo;
        // Session entity would need to be loaded separately
        return entity;
    }

    // UploadedFile converters
    toUploadedFileDto(entity: UploadedFile | null): UploadedFileDto | null {
        if (!entity) return null;

        const dto: UploadedFileDto = {} as UploadedFileDto;
        this.mapDatabaseObjectToDto(entity, dto);
        dto.path = entity.path;
        dto.fileOriginalName = entity.fileOriginalName;
        dto.fileName = entity.fileName;
        dto.documentType = entity.documentType;
        dto.fileSize = entity.fileSize || 0;
        dto.updatedAt = entity.updatedAt || null;
        dto.version = entity.version || 0;
        return dto;
    }

    toUploadedFileEntity(dto: UploadedFileDto | null): UploadedFile | null {
        if (!dto) return null;

        const entity: UploadedFile = {} as UploadedFile;
        this.mapDtoToDatabaseObject(dto, entity);
        entity.path = dto.path;
        entity.fileOriginalName = dto.fileOriginalName;
        entity.fileName = dto.fileName;
        entity.documentType = dto.documentType;
        entity.fileSize = dto.fileSize;
        entity.updatedAt = dto.updatedAt || null;
        entity.version = dto.version;
        return entity;
    }

    // Curriculum converters
    toCurriculumDto(entity: Curriculum | null): CurriculumDto | null {
        if (!entity) return null;

        const dto: CurriculumDto = {} as CurriculumDto;
        this.mapDatabaseObjectToDto(entity, dto);
        dto.name = entity.name;
        dto.description = entity.description;
        dto.category = entity.category;
        dto.updatedAt = entity.updatedAt || new Date();
        dto.version = entity.version || null;
        return dto;
    }

    toCurriculumEntity(dto: CurriculumDto | null): Curriculum | null {
        if (!dto) return null;

        const entity: Curriculum = {} as Curriculum;
        this.mapDtoToDatabaseObject(dto, entity);
        entity.name = dto.name;
        entity.description = dto.description;
        entity.category = dto.category;
        entity.updatedAt = dto.updatedAt;
        entity.version = dto.version;
        return entity;
    }

    // CurriculumContent converters
    toCurriculumContentDto(entity: CurriculumContent | null): CurriculumContentDto | null {
        if (!entity) return null;

        const dto: CurriculumContentDto = {} as CurriculumContentDto;
        this.mapDatabaseObjectToDto(entity, dto);
        dto.code = entity.code;
        dto.curriculum = this.toCurriculumDto(entity.curriculum) || null;
        dto.level = entity.level;
        dto.content = entity.content;
        dto.orderNumber = entity.orderNumber || 0;
        dto.parentId = entity.parent?.id || null;
        dto.children = entity.children?.map(child => this.toCurriculumContentDto(child)).filter(Boolean) as CurriculumContentDto[] || null;
        dto.updatedAt = entity.updatedAt;
        dto.version = entity.version;
        return dto;
    }

    toCurriculumContentEntity(dto: CurriculumContentDto | null): CurriculumContent | null {
        if (!dto) return null;

        const entity: CurriculumContent = {} as CurriculumContent;
        this.mapDtoToDatabaseObject(dto, entity);
        entity.code = dto.code;
        entity.curriculum = this.toCurriculumEntity(dto.curriculum);
        entity.level = dto.level;
        entity.content = dto.content;
        entity.orderNumber = dto.orderNumber;
        entity.updatedAt = dto.updatedAt;
        entity.version = dto.version;
        // Parent and children would need special handling to avoid circular references
        return entity;
    }

    // ExamPart converters
    toExamPartDto(entity: ExamPart | null): ExamPartDto | null {
        if (!entity) return null;

        const dto: ExamPartDto = {} as ExamPartDto;
        this.mapDatabaseObjectToDto(entity, dto);
        dto.name = entity.name || '';
        dto.orderNumber = entity.orderNumber || 1;
        dto.description = entity.description || '';
        dto.skill = entity.skill;
        return dto;
    }

    toExamPartEntity(dto: ExamPartDto | null): ExamPart | null {
        if (!dto) return null;

        const entity: ExamPart = {} as ExamPart;
        this.mapDtoToDatabaseObject(dto, entity);
        entity.name = dto.name;
        entity.orderNumber = dto.orderNumber;
        entity.description = dto.description;
        entity.skill = dto.skill;
        return entity;
    }

    // ExamQuestionExtraSection converters
    toExamQuestionExtraSectionDto(entity: ExamQuestionExtraSection | null): ExamQuestionExtraSectionDto | null {
        if (!entity) return null;

        const dto: ExamQuestionExtraSectionDto = {} as ExamQuestionExtraSectionDto;
        this.mapDatabaseObjectToDto(entity, dto);
        dto.orderNumber = entity.orderNumber;
        dto.mediaType = entity.mediaType;
        dto.content = entity.content;
        dto.extraSectionType = entity.extraSectionType;
        dto.url = entity.url;
        dto.file = this.toUploadedFileDto(entity.file);
        return dto;
    }

    toExamQuestionExtraSectionEntity(dto: ExamQuestionExtraSectionDto | null): ExamQuestionExtraSection | null {
        if (!dto) return null;

        const entity: ExamQuestionExtraSection = {} as ExamQuestionExtraSection;
        this.mapDtoToDatabaseObject(dto, entity);
        entity.orderNumber = dto.orderNumber;
        entity.mediaType = dto.mediaType;
        entity.content = dto.content;
        entity.extraSectionType = dto.extraSectionType;
        entity.url = dto.url;
        entity.file = this.toUploadedFileEntity(dto.file);
        return entity;
    }

    // Base template mapping methods
    private mapBaseTemplateToDto(entity: BaseQuestionTemplate, dto: BaseQuestionTemplateDto): void {
        if (entity && dto) {
            dto.id = entity.id;
            dto.createdAt = entity.createdAt;
            dto.deletedAt = entity.deletedAt;
            dto.status = entity.status;
            dto.createdById = entity.createdBy?.id || null;
            dto.deletedById = entity.deletedBy?.id || null;

            dto.title = entity.title;
            dto.description = entity.description;
            dto.subject = entity.subject;
            dto.difficulty = entity.difficulty;
            dto.points = entity.points;
            dto.timeLimit = entity.timeLimit;
            dto.instructions = entity.instructions;
            dto.tags = entity.tags;
            dto.isActive = entity.isActive;
        }
    }

    private mapDtoToBaseTemplate(dto: BaseQuestionTemplateDto, entity: BaseQuestionTemplate): void {
        if (dto && entity) {
            entity.id = dto.id;
            entity.createdAt = dto.createdAt;
            entity.deletedAt = dto.deletedAt;
            entity.status = dto.status;

            entity.title = dto.title;
            entity.description = dto.description;
            entity.subject = dto.subject;
            entity.difficulty = dto.difficulty;
            entity.points = dto.points;
            entity.timeLimit = dto.timeLimit;
            entity.instructions = dto.instructions;
            entity.tags = dto.tags;
            entity.isActive = dto.isActive;
        }
    }

    // MultipleChoiceTemplate converters
    toMultipleChoiceTemplateDto(entity: MultipleChoiceTemplate | null): MultipleChoiceTemplateDto | null {
        if (!entity) return null;

        const dto: MultipleChoiceTemplateDto = {} as MultipleChoiceTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.MULTIPLE_CHOICE;
        dto.question = entity.question;
        dto.options = entity.options;
        dto.correctOptionIndex = entity.correctOptionIndex;
        dto.explanation = entity.explanation;
        dto.shuffleOptions = entity.shuffleOptions;
        return dto;
    }

    toMultipleChoiceTemplateEntity(dto: MultipleChoiceTemplateDto | null): MultipleChoiceTemplate | null {
        if (!dto) return null;

        const entity: MultipleChoiceTemplate = {} as MultipleChoiceTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.question = dto.question;
        entity.options = dto.options;
        entity.correctOptionIndex = dto.correctOptionIndex;
        entity.explanation = dto.explanation;
        entity.shuffleOptions = dto.shuffleOptions;
        return entity;
    }

    // TrueFalseTemplate converters
    toTrueFalseTemplateDto(entity: TrueFalseTemplate | null): TrueFalseTemplateDto | null {
        if (!entity) return null;

        const dto: TrueFalseTemplateDto = {} as TrueFalseTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.TRUE_FALSE;
        dto.statement = entity.statement;
        dto.correctAnswer = entity.correctAnswer;
        dto.explanation = entity.explanation;
        return dto;
    }

    toTrueFalseTemplateEntity(dto: TrueFalseTemplateDto | null): TrueFalseTemplate | null {
        if (!dto) return null;

        const entity: TrueFalseTemplate = {} as TrueFalseTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.statement = dto.statement;
        entity.correctAnswer = dto.correctAnswer;
        entity.explanation = dto.explanation;
        return entity;
    }

    // FillInTheBlanksTemplate converters
    toFillInTheBlanksTemplateDto(entity: FillInTheBlanksTemplate | null): FillInTheBlanksTemplateDto | null {
        if (!entity) return null;

        const dto: FillInTheBlanksTemplateDto = {} as FillInTheBlanksTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.FILL_IN_THE_BLANKS;
        dto.textWithBlanks = entity.textWithBlanks;
        dto.correctAnswers = entity.correctAnswers;
        dto.alternativeAnswers = entity.alternativeAnswers;
        dto.caseSensitive = entity.caseSensitive;
        dto.exactMatch = entity.exactMatch;
        dto.explanation = entity.explanation;
        return dto;
    }

    toFillInTheBlanksTemplateEntity(dto: FillInTheBlanksTemplateDto | null): FillInTheBlanksTemplate | null {
        if (!dto) return null;

        const entity: FillInTheBlanksTemplate = {} as FillInTheBlanksTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.textWithBlanks = dto.textWithBlanks;
        entity.correctAnswers = dto.correctAnswers;
        entity.alternativeAnswers = dto.alternativeAnswers;
        entity.caseSensitive = dto.caseSensitive;
        entity.exactMatch = dto.exactMatch;
        entity.explanation = dto.explanation;
        return entity;
    }

    // ShortAnswerTemplate converters
    toShortAnswerTemplateDto(entity: ShortAnswerTemplate | null): ShortAnswerTemplateDto | null {
        if (!entity) return null;

        const dto: ShortAnswerTemplateDto = {} as ShortAnswerTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.SHORT_ANSWER;
        dto.question = entity.question;
        dto.expectedKeywords = entity.expectedKeywords;
        dto.sampleAnswers = entity.sampleAnswers;
        dto.maxCharacters = entity.maxCharacters;
        dto.minCharacters = entity.minCharacters;
        dto.rubric = entity.rubric;
        dto.requiresManualGrading = entity.requiresManualGrading;
        return dto;
    }

    toShortAnswerTemplateEntity(dto: ShortAnswerTemplateDto | null): ShortAnswerTemplate | null {
        if (!dto) return null;

        const entity: ShortAnswerTemplate = {} as ShortAnswerTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.question = dto.question;
        entity.expectedKeywords = dto.expectedKeywords;
        entity.sampleAnswers = dto.sampleAnswers;
        entity.maxCharacters = dto.maxCharacters;
        entity.minCharacters = dto.minCharacters;
        entity.rubric = dto.rubric;
        entity.requiresManualGrading = dto.requiresManualGrading;
        return entity;
    }

    // MatchingTemplate converters
    toMatchingTemplateDto(entity: MatchingTemplate | null): MatchingTemplateDto | null {
        if (!entity) return null;

        const dto: MatchingTemplateDto = {} as MatchingTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.MATCHING;
        dto.instructions = entity.instructions;
        dto.leftItems = entity.leftItems;
        dto.rightItems = entity.rightItems;
        dto.correctMatches = entity.correctMatches;
        dto.shuffleItems = entity.shuffleItems;
        dto.explanation = entity.explanation;
        return dto;
    }

    toMatchingTemplateEntity(dto: MatchingTemplateDto | null): MatchingTemplate | null {
        if (!dto) return null;

        const entity: MatchingTemplate = {} as MatchingTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.instructions = dto.instructions;
        entity.leftItems = dto.leftItems;
        entity.rightItems = dto.rightItems;
        entity.correctMatches = dto.correctMatches;
        entity.shuffleItems = dto.shuffleItems;
        entity.explanation = dto.explanation;
        return entity;
    }

    // EssayTemplate converters
    toEssayTemplateDto(entity: EssayTemplate | null): EssayTemplateDto | null {
        if (!entity) return null;

        const dto: EssayTemplateDto = {} as EssayTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.ESSAY;
        dto.prompt = entity.prompt;
        dto.gradingCriteria = entity.gradingCriteria;
        dto.minWords = entity.minWords;
        dto.maxWords = entity.maxWords;
        dto.requiredTopics = entity.requiredTopics;
        dto.rubric = entity.rubric;
        dto.requiresManualGrading = entity.requiresManualGrading;
        return dto;
    }

    toEssayTemplateEntity(dto: EssayTemplateDto | null): EssayTemplate | null {
        if (!dto) return null;

        const entity: EssayTemplate = {} as EssayTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.prompt = dto.prompt;
        entity.gradingCriteria = dto.gradingCriteria;
        entity.minWords = dto.minWords;
        entity.maxWords = dto.maxWords;
        entity.requiredTopics = dto.requiredTopics;
        entity.rubric = dto.rubric;
        entity.requiresManualGrading = dto.requiresManualGrading;
        return entity;
    }

    // OrderingTemplate converters
    toOrderingTemplateDto(entity: OrderingTemplate | null): OrderingTemplateDto | null {
        if (!entity) return null;

        const dto: OrderingTemplateDto = {} as OrderingTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.ORDERING;
        dto.instructions = entity.instructions;
        dto.items = entity.items;
        dto.correctOrder = entity.correctOrder;
        dto.shuffleItems = entity.shuffleItems;
        dto.explanation = entity.explanation;
        return dto;
    }

    toOrderingTemplateEntity(dto: OrderingTemplateDto | null): OrderingTemplate | null {
        if (!dto) return null;

        const entity: OrderingTemplate = {} as OrderingTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.instructions = dto.instructions;
        entity.items = dto.items;
        entity.correctOrder = dto.correctOrder;
        entity.shuffleItems = dto.shuffleItems;
        entity.explanation = dto.explanation;
        return entity;
    }

    // MultipleResponseTemplate converters
    toMultipleResponseTemplateDto(entity: MultipleResponseTemplate | null): MultipleResponseTemplateDto | null {
        if (!entity) return null;

        const dto: MultipleResponseTemplateDto = {} as MultipleResponseTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.MULTIPLE_RESPONSE;
        dto.question = entity.question;
        dto.options = entity.options;
        dto.correctOptionIndices = entity.correctOptionIndices;
        dto.minSelections = entity.minSelections;
        dto.maxSelections = entity.maxSelections;
        dto.shuffleOptions = entity.shuffleOptions;
        dto.explanation = entity.explanation;
        return dto;
    }

    toMultipleResponseTemplateEntity(dto: MultipleResponseTemplateDto | null): MultipleResponseTemplate | null {
        if (!dto) return null;

        const entity: MultipleResponseTemplate = {} as MultipleResponseTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.question = dto.question;
        entity.options = dto.options;
        entity.correctOptionIndices = dto.correctOptionIndices;
        entity.minSelections = dto.minSelections;
        entity.maxSelections = dto.maxSelections;
        entity.shuffleOptions = dto.shuffleOptions;
        entity.explanation = dto.explanation;
        return entity;
    }

    // HotSpotTemplate converters
    toHotSpotTemplateDto(entity: HotSpotTemplate | null): HotSpotTemplateDto | null {
        if (!entity) return null;

        const dto: HotSpotTemplateDto = {} as HotSpotTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.HOT_SPOT;
        dto.instructions = entity.instructions;
        dto.imageUrl = entity.imageUrl;
        dto.hotSpotAreas = entity.hotSpotAreas;
        dto.maxSelections = entity.maxSelections;
        dto.allowMultipleSpots = entity.allowMultipleSpots;
        dto.explanation = entity.explanation;
        return dto;
    }

    toHotSpotTemplateEntity(dto: HotSpotTemplateDto | null): HotSpotTemplate | null {
        if (!dto) return null;

        const entity: HotSpotTemplate = {} as HotSpotTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.instructions = dto.instructions;
        entity.imageUrl = dto.imageUrl;
        entity.hotSpotAreas = dto.hotSpotAreas;
        entity.maxSelections = dto.maxSelections;
        entity.allowMultipleSpots = dto.allowMultipleSpots;
        entity.explanation = dto.explanation;
        return entity;
    }

    // DragAndDropTemplate converters
    toDragAndDropTemplateDto(entity: DragAndDropTemplate | null): DragAndDropTemplateDto | null {
        if (!entity) return null;

        const dto: DragAndDropTemplateDto = {} as DragAndDropTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.DRAG_AND_DROP;
        dto.instructions = entity.instructions;
        dto.draggableItems = entity.draggableItems;
        dto.targetZones = entity.targetZones;
        dto.correctMappings = entity.correctMappings;
        dto.allowMultipleItemsPerZone = entity.allowMultipleItemsPerZone;
        dto.shuffleDraggableItems = entity.shuffleDraggableItems;
        dto.explanation = entity.explanation;
        return dto;
    }

    toDragAndDropTemplateEntity(dto: DragAndDropTemplateDto | null): DragAndDropTemplate | null {
        if (!dto) return null;

        const entity: DragAndDropTemplate = {} as DragAndDropTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.instructions = dto.instructions;
        entity.draggableItems = dto.draggableItems;
        entity.targetZones = dto.targetZones;
        entity.correctMappings = dto.correctMappings;
        entity.allowMultipleItemsPerZone = dto.allowMultipleItemsPerZone;
        entity.shuffleDraggableItems = dto.shuffleDraggableItems;
        entity.explanation = dto.explanation;
        return entity;
    }

    // AudioResponseTemplate converters
    toAudioResponseTemplateDto(entity: AudioResponseTemplate | null): AudioResponseTemplateDto | null {
        if (!entity) return null;

        const dto: AudioResponseTemplateDto = {} as AudioResponseTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.AUDIO_RESPONSE;
        dto.prompt = entity.prompt;
        dto.audioPromptUrl = entity.audioPromptUrl;
        dto.maxRecordingDuration = entity.maxRecordingDuration;
        dto.minRecordingDuration = entity.minRecordingDuration;
        dto.gradingCriteria = entity.gradingCriteria;
        dto.rubric = entity.rubric;
        dto.requiresManualGrading = entity.requiresManualGrading;
        dto.allowedFormats = entity.allowedFormats;
        return dto;
    }

    toAudioResponseTemplateEntity(dto: AudioResponseTemplateDto | null): AudioResponseTemplate | null {
        if (!dto) return null;

        const entity: AudioResponseTemplate = {} as AudioResponseTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.prompt = dto.prompt;
        entity.audioPromptUrl = dto.audioPromptUrl;
        entity.maxRecordingDuration = dto.maxRecordingDuration;
        entity.minRecordingDuration = dto.minRecordingDuration;
        entity.gradingCriteria = dto.gradingCriteria;
        entity.rubric = dto.rubric;
        entity.requiresManualGrading = dto.requiresManualGrading;
        entity.allowedFormats = dto.allowedFormats;
        return entity;
    }

    // VideoResponseTemplate converters
    toVideoResponseTemplateDto(entity: VideoResponseTemplate | null): VideoResponseTemplateDto | null {
        if (!entity) return null;

        const dto: VideoResponseTemplateDto = {} as VideoResponseTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.VIDEO_RESPONSE;
        dto.prompt = entity.prompt;
        dto.videoPromptUrl = entity.videoPromptUrl;
        dto.maxRecordingDuration = entity.maxRecordingDuration;
        dto.minRecordingDuration = entity.minRecordingDuration;
        dto.gradingCriteria = entity.gradingCriteria;
        dto.rubric = entity.rubric;
        dto.requiresManualGrading = entity.requiresManualGrading;
        dto.allowedFormats = entity.allowedFormats;
        dto.allowScreenRecording = entity.allowScreenRecording;
        return dto;
    }

    toVideoResponseTemplateEntity(dto: VideoResponseTemplateDto | null): VideoResponseTemplate | null {
        if (!dto) return null;

        const entity: VideoResponseTemplate = {} as VideoResponseTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.prompt = dto.prompt;
        entity.videoPromptUrl = dto.videoPromptUrl;
        entity.maxRecordingDuration = dto.maxRecordingDuration;
        entity.minRecordingDuration = dto.minRecordingDuration;
        entity.gradingCriteria = dto.gradingCriteria;
        entity.rubric = dto.rubric;
        entity.requiresManualGrading = dto.requiresManualGrading;
        entity.allowedFormats = dto.allowedFormats;
        entity.allowScreenRecording = dto.allowScreenRecording;
        return entity;
    }

    // ImageResponseTemplate converters
    toImageResponseTemplateDto(entity: ImageResponseTemplate | null): ImageResponseTemplateDto | null {
        if (!entity) return null;

        const dto: ImageResponseTemplateDto = {} as ImageResponseTemplateDto;
        this.mapBaseTemplateToDto(entity, dto);
        dto.templateType = EQuestionTemplateType.IMAGE_RESPONSE;
        dto.prompt = entity.prompt;
        dto.referenceImageUrl = entity.referenceImageUrl;
        dto.maxFileSize = entity.maxFileSize;
        dto.gradingCriteria = entity.gradingCriteria;
        dto.rubric = entity.rubric;
        dto.requiresManualGrading = entity.requiresManualGrading;
        dto.allowedFormats = entity.allowedFormats;
        dto.requiresDrawing = entity.requiresDrawing;
        dto.allowsUpload = entity.allowsUpload;
        return dto;
    }

    toImageResponseTemplateEntity(dto: ImageResponseTemplateDto | null): ImageResponseTemplate | null {
        if (!dto) return null;

        const entity: ImageResponseTemplate = {} as ImageResponseTemplate;
        this.mapDtoToBaseTemplate(dto, entity);
        entity.prompt = dto.prompt;
        entity.referenceImageUrl = dto.referenceImageUrl;
        entity.maxFileSize = dto.maxFileSize;
        entity.gradingCriteria = dto.gradingCriteria;
        entity.rubric = dto.rubric;
        entity.requiresManualGrading = dto.requiresManualGrading;
        entity.allowedFormats = dto.allowedFormats;
        entity.requiresDrawing = dto.requiresDrawing;
        entity.allowsUpload = dto.allowsUpload;
        return entity;
    }

    // Generic Template converter based on type
    toTemplateDto(entity: BaseQuestionTemplate | null): BaseQuestionTemplateDto | null {
        if (!entity) return null;

        // Type checking would need to be done based on your entity structure
        // This is a simplified version - you might need to adjust based on your actual types
        const entityType = entity.templateType || this.getTemplateTypeFromEntity(entity);

        switch (entityType) {
            case EQuestionTemplateType.MULTIPLE_CHOICE:
                return this.toMultipleChoiceTemplateDto(entity as MultipleChoiceTemplate);
            case EQuestionTemplateType.TRUE_FALSE:
                return this.toTrueFalseTemplateDto(entity as TrueFalseTemplate);
            case EQuestionTemplateType.FILL_IN_THE_BLANKS:
                return this.toFillInTheBlanksTemplateDto(entity as FillInTheBlanksTemplate);
            case EQuestionTemplateType.SHORT_ANSWER:
                return this.toShortAnswerTemplateDto(entity as ShortAnswerTemplate);
            case EQuestionTemplateType.MATCHING:
                return this.toMatchingTemplateDto(entity as MatchingTemplate);
            case EQuestionTemplateType.ESSAY:
                return this.toEssayTemplateDto(entity as EssayTemplate);
            case EQuestionTemplateType.ORDERING:
                return this.toOrderingTemplateDto(entity as OrderingTemplate);
            case EQuestionTemplateType.MULTIPLE_RESPONSE:
                return this.toMultipleResponseTemplateDto(entity as MultipleResponseTemplate);
            case EQuestionTemplateType.HOT_SPOT:
                return this.toHotSpotTemplateDto(entity as HotSpotTemplate);
            case EQuestionTemplateType.DRAG_AND_DROP:
                return this.toDragAndDropTemplateDto(entity as DragAndDropTemplate);
            case EQuestionTemplateType.AUDIO_RESPONSE:
                return this.toAudioResponseTemplateDto(entity as AudioResponseTemplate);
            case EQuestionTemplateType.VIDEO_RESPONSE:
                return this.toVideoResponseTemplateDto(entity as VideoResponseTemplate);
            case EQuestionTemplateType.IMAGE_RESPONSE:
                return this.toImageResponseTemplateDto(entity as ImageResponseTemplate);
            default:
                throw new Error(`Unknown template type: ${entityType}`);
        }
    }

    toTemplateEntity(dto: BaseQuestionTemplateDto | null): BaseQuestionTemplate | null {
        if (!dto) return null;

        switch (dto.templateType) {
            case EQuestionTemplateType.MULTIPLE_CHOICE:
                return this.toMultipleChoiceTemplateEntity(dto as MultipleChoiceTemplateDto);
            case EQuestionTemplateType.TRUE_FALSE:
                return this.toTrueFalseTemplateEntity(dto as TrueFalseTemplateDto);
            case EQuestionTemplateType.FILL_IN_THE_BLANKS:
                return this.toFillInTheBlanksTemplateEntity(dto as FillInTheBlanksTemplateDto);
            case EQuestionTemplateType.SHORT_ANSWER:
                return this.toShortAnswerTemplateEntity(dto as ShortAnswerTemplateDto);
            case EQuestionTemplateType.MATCHING:
                return this.toMatchingTemplateEntity(dto as MatchingTemplateDto);
            case EQuestionTemplateType.ESSAY:
                return this.toEssayTemplateEntity(dto as EssayTemplateDto);
            case EQuestionTemplateType.ORDERING:
                return this.toOrderingTemplateEntity(dto as OrderingTemplateDto);
            case EQuestionTemplateType.MULTIPLE_RESPONSE:
                return this.toMultipleResponseTemplateEntity(dto as MultipleResponseTemplateDto);
            case EQuestionTemplateType.HOT_SPOT:
                return this.toHotSpotTemplateEntity(dto as HotSpotTemplateDto);
            case EQuestionTemplateType.DRAG_AND_DROP:
                return this.toDragAndDropTemplateEntity(dto as DragAndDropTemplateDto);
            case EQuestionTemplateType.AUDIO_RESPONSE:
                return this.toAudioResponseTemplateEntity(dto as AudioResponseTemplateDto);
            case EQuestionTemplateType.VIDEO_RESPONSE:
                return this.toVideoResponseTemplateEntity(dto as VideoResponseTemplateDto);
            case EQuestionTemplateType.IMAGE_RESPONSE:
                return this.toImageResponseTemplateEntity(dto as ImageResponseTemplateDto);
            default:
                throw new Error(`Unknown template DTO type: ${dto.templateType}`);
        }
    }

    // ExamQuestion converters
    toExamQuestionDto(entity: ExamQuestion | null): ExamQuestionDto | null {
        if (!entity) return null;

        const dto: ExamQuestionDto = {} as ExamQuestionDto;
        this.mapDatabaseObjectToDto(entity, dto);
        dto.isMain = entity.isMain;
        dto.duration = entity.duration;
        dto.repeatCount = entity.repeatCount;
        dto.score = entity.score;
        dto.examPart = this.toExamPartDto(entity.examPart);
        dto.curriculumContentSet = entity.curriculumContentSet?.map(content => this.toCurriculumContentDto(content)).filter(Boolean) as CurriculumContentDto[] || null;
        dto.questionTemplateId = entity.questionTemplateId;
        dto.questionType = entity.questionType;
        dto.questionOrder = entity.questionOrder;
        dto.points = entity.points;
        dto.isActive = entity.isActive;
        dto.shuffleOptions = entity.shuffleOptions;
        dto.timeLimit = entity.timeLimit;
        dto.additionalTags = entity.additionalTags;
        return dto;
    }

    toExamQuestionEntity(dto: ExamQuestionDto | null): ExamQuestion | null {
        if (!dto) return null;

        const entity: ExamQuestion = {} as ExamQuestion;
        this.mapDtoToDatabaseObject(dto, entity);
        entity.isMain = dto.isMain;
        entity.duration = dto.duration;
        entity.repeatCount = dto.repeatCount;
        entity.score = dto.score;
        entity.examPart = this.toExamPartEntity(dto.examPart);
        entity.curriculumContentSet = dto.curriculumContentSet?.map(content => this.toCurriculumContentEntity(content)).filter(Boolean) as CurriculumContent[] || null;
        entity.questionTemplateId = dto.questionTemplateId;
        entity.questionType = dto.questionType;
        entity.questionOrder = dto.questionOrder;
        entity.points = dto.points;
        entity.isActive = dto.isActive;
        entity.shuffleOptions = dto.shuffleOptions;
        entity.timeLimit = dto.timeLimit;
        entity.additionalTags = dto.additionalTags;
        return entity;
    }

    // Exam converters
    toExamDto(entity: Exam | null): ExamDto | null {
        if (!entity) return null;

        const dto: ExamDto = {} as ExamDto;
        this.mapDatabaseObjectToDto(entity, dto);
        dto.name = entity.name;
        dto.category = entity.category;
        dto.imageUrl = entity.imageUrl;
        dto.description = entity.description;
        dto.code = entity.code;
        dto.language = entity.language;
        dto.level = entity.level;
        dto.introText = entity.introText;
        dto.examParts = entity.examParts?.map(part => this.toExamPartDto(part)).filter(Boolean) as ExamPartDto[] || null;
        dto.maxScore = entity.maxScore;
        dto.examQuestions = entity.examQuestions?.map(question => this.toExamQuestionDto(question)).filter(Boolean) as ExamQuestionDto[] || null;
        return dto;
    }

    toExamEntity(dto: ExamDto | null): Exam | null {
        if (!dto) return null;

        const entity: Exam = {} as Exam;
        this.mapDtoToDatabaseObject(dto, entity);
        entity.name = dto.name;
        entity.category = dto.category;
        entity.imageUrl = dto.imageUrl;
        entity.description = dto.description;
        entity.code = dto.code;
        entity.language = dto.language;
        entity.level = dto.level;
        entity.introText = dto.introText;
        entity.examParts = dto.examParts?.map(part => this.toExamPartEntity(part)).filter(Boolean) as ExamPart[] || null;
        entity.maxScore = dto.maxScore;
        entity.examQuestions = dto.examQuestions?.map(question => this.toExamQuestionEntity(question)).filter(Boolean) as ExamQuestion[] || null;
        return entity;
    }

    // ExamExecutionSettings converters
    toExamExecutionSettingsDto(entity: ExamExecutionSettings | null): ExamExecutionSettingsDto | null {
        if (!entity) return null;

        const dto: ExamExecutionSettingsDto = {} as ExamExecutionSettingsDto;

        dto.allowNavigation = entity.allowNavigation;
        dto.allowSkipping = entity.allowSkipping;
        dto.allowBackNavigation = entity.allowBackNavigation;
        dto.timeLimitType = entity.timeLimitType;
        dto.globalTimeLimit = entity.globalTimeLimit;
        dto.allowPauseResume = entity.allowPauseResume;
        dto.maxPauseDuration = entity.maxPauseDuration;
        dto.maxPauseCount = entity.maxPauseCount;
        dto.shuffleQuestions = entity.shuffleQuestions;
        dto.shuffleOptions = entity.shuffleOptions;
        dto.showQuestionNumbers = entity.showQuestionNumbers;
        dto.showProgressBar = entity.showProgressBar;
        dto.allowReview = entity.allowReview;
        dto.showResults = entity.showResults;
        dto.showCorrectAnswers = entity.showCorrectAnswers;
        dto.showScoreImmediately = entity.showScoreImmediately;
        dto.autoSave = entity.autoSave;
        dto.autoSaveInterval = entity.autoSaveInterval;
        dto.autoSubmitOnTimeExpire = entity.autoSubmitOnTimeExpire;
        dto.preventCopyPaste = entity.preventCopyPaste;
        dto.preventRightClick = entity.preventRightClick;
        dto.detectTabSwitch = entity.detectTabSwitch;
        dto.requireFullScreen = entity.requireFullScreen;
        dto.sessionWarningTime = entity.sessionWarningTime;
        dto.heartbeatInterval = entity.heartbeatInterval;
        dto.maxIdleTime = entity.maxIdleTime;

        return dto;
    }

    toExamExecutionSettingsEntity(dto: ExamExecutionSettingsDto | null): ExamExecutionSettings | null {
        if (!dto) return null;

        const entity: ExamExecutionSettings = {} as ExamExecutionSettings;

        entity.allowNavigation = dto.allowNavigation;
        entity.allowSkipping = dto.allowSkipping;
        entity.allowBackNavigation = dto.allowBackNavigation;
        entity.timeLimitType = dto.timeLimitType;
        entity.globalTimeLimit = dto.globalTimeLimit;
        entity.allowPauseResume = dto.allowPauseResume;
        entity.maxPauseDuration = dto.maxPauseDuration;
        entity.maxPauseCount = dto.maxPauseCount;
        entity.shuffleQuestions = dto.shuffleQuestions;
        entity.shuffleOptions = dto.shuffleOptions;
        entity.showQuestionNumbers = dto.showQuestionNumbers;
        entity.showProgressBar = dto.showProgressBar;
        entity.allowReview = dto.allowReview;
        entity.showResults = dto.showResults;
        entity.showCorrectAnswers = dto.showCorrectAnswers;
        entity.showScoreImmediately = dto.showScoreImmediately;
        entity.autoSave = dto.autoSave;
        entity.autoSaveInterval = dto.autoSaveInterval;
        entity.autoSubmitOnTimeExpire = dto.autoSubmitOnTimeExpire;
        entity.preventCopyPaste = dto.preventCopyPaste;
        entity.preventRightClick = dto.preventRightClick;
        entity.detectTabSwitch = dto.detectTabSwitch;
        entity.requireFullScreen = dto.requireFullScreen;
        entity.sessionWarningTime = dto.sessionWarningTime;
        entity.heartbeatInterval = dto.heartbeatInterval;
        entity.maxIdleTime = dto.maxIdleTime;

        return entity;
    }

    // EducationAssignment converters
    toEducationAssignmentDto(entity: EducationAssignment | null): EducationAssignmentDto | null {
        if (!entity) return null;

        const dto: EducationAssignmentDto = {} as EducationAssignmentDto;
        this.mapDatabaseObjectToDto(entity, dto);

        dto.brandId = entity.brand?.id || null;
        dto.institutionId = entity.institution?.id || null;
        dto.campusId = entity.campus?.id || null;
        dto.branchId = entity.branch?.id || null;
        dto.learnerUserId = entity.learnerUser?.id || null;
        dto.courseId = entity.course?.id || null;
        dto.exam = this.toExamDto(entity.exam);
        dto.academicYearId = entity.academicYear?.id || null;
        dto.assignmentLevel = entity.assignmentLevel;
        dto.assignmentStatus = entity.assignmentStatus;
        dto.startDate = entity.startDate;
        dto.endDate = entity.endDate;
        dto.assignedAt = entity.assignedAt;
        dto.executionSettings = this.toExamExecutionSettingsDto(entity.executionSettings);
        dto.assignmentTitle = entity.assignmentTitle;
        dto.assignmentDescription = entity.assignmentDescription;
        dto.maxAttempts = entity.maxAttempts;
        dto.isActive = entity.isActive;
        dto.assignedBrandIds = entity.assignedBrandIds;
        dto.assignedInstitutionIds = entity.assignedInstitutionIds;
        dto.assignedCampusIds = entity.assignedCampusIds;
        dto.assignedBranchIds = entity.assignedBranchIds;
        dto.assignedLearnerIds = entity.assignedLearnerIds;

        return dto;
    }

    toEducationAssignmentEntity(dto: EducationAssignmentDto | null): EducationAssignment | null {
        if (!dto) return null;

        const entity: EducationAssignment = {} as EducationAssignment;
        this.mapDtoToDatabaseObject(dto, entity);

        entity.assignmentLevel = dto.assignmentLevel;
        entity.assignmentStatus = dto.assignmentStatus;
        entity.startDate = dto.startDate;
        entity.endDate = dto.endDate;
        entity.assignedAt = dto.assignedAt;
        entity.executionSettings = this.toExamExecutionSettingsEntity(dto.executionSettings);
        entity.assignmentTitle = dto.assignmentTitle;
        entity.assignmentDescription = dto.assignmentDescription;
        entity.maxAttempts = dto.maxAttempts;
        entity.isActive = dto.isActive;
        entity.assignedBrandIds = dto.assignedBrandIds;
        entity.assignedInstitutionIds = dto.assignedInstitutionIds;
        entity.assignedCampusIds = dto.assignedCampusIds;
        entity.assignedBranchIds = dto.assignedBranchIds;
        entity.assignedLearnerIds = dto.assignedLearnerIds;

        return entity;
    }

    // ExamAnswer converters
    toExamAnswerDto(entity: ExamAnswer | null): ExamAnswerDto | null {
        if (!entity) return null;

        const dto: ExamAnswerDto = {} as ExamAnswerDto;
        this.mapDatabaseObjectToDto(entity, dto);

        dto.sessionId = entity.session?.id || null;
        dto.questionId = entity.question?.id || null;
        dto.answerData = entity.answerData;
        dto.previousAnswerData = entity.previousAnswerData;
        dto.firstAnsweredAt = entity.firstAnsweredAt;
        dto.lastModifiedAt = entity.lastModifiedAt;
        dto.modificationCount = entity.modificationCount;
        dto.isAnswered = entity.isAnswered;
        dto.isCorrect = entity.isCorrect;
        dto.isMarkedForReview = entity.isMarkedForReview;
        dto.isSkipped = entity.isSkipped;
        dto.isAutoSaved = entity.isAutoSaved;
        dto.score = entity.score;
        dto.feedback = entity.feedback;

        return dto;
    }

    toExamAnswerEntity(dto: ExamAnswerDto | null): ExamAnswer | null {
        if (!dto) return null;

        const entity: ExamAnswer = {} as ExamAnswer;
        this.mapDtoToDatabaseObject(dto, entity);

        if (dto.sessionId) {
            entity.session = { id: dto.sessionId } as ExamSession;
        }
        if (dto.questionId) {
            entity.question = { id: dto.questionId } as ExamQuestion;
        }
        entity.answerData = dto.answerData;
        entity.previousAnswerData = dto.previousAnswerData;
        entity.firstAnsweredAt = dto.firstAnsweredAt;
        entity.lastModifiedAt = dto.lastModifiedAt;
        entity.modificationCount = dto.modificationCount;
        entity.isAnswered = dto.isAnswered;
        entity.isCorrect = dto.isCorrect;
        entity.isMarkedForReview = dto.isMarkedForReview;
        entity.isSkipped = dto.isSkipped;
        entity.isAutoSaved = dto.isAutoSaved;
        entity.score = dto.score;
        entity.feedback = dto.feedback;

        return entity;
    }

    // ExamSession converters
    toExamSessionDto(entity: ExamSession | null): ExamSessionDto | null {
        if (!entity) return null;

        const dto: ExamSessionDto = {} as ExamSessionDto;
        this.mapDatabaseObjectToDto(entity, dto);

        dto.assignment = this.toEducationAssignmentDto(entity.assignment);
        dto.learnerId = entity.learner?.id || null;
        dto.sessionStatus = entity.sessionStatus;
        dto.sessionStartTime = entity.sessionStartTime;
        dto.sessionEndTime = entity.sessionEndTime;
        dto.lastActivityTime = entity.lastActivityTime;
        dto.pauseStartTime = entity.pauseStartTime;
        dto.totalPauseTime = entity.totalPauseTime;
        dto.pauseCount = entity.pauseCount;
        dto.remainingTime = entity.remainingTime;
        dto.timeSpentTotal = entity.timeSpentTotal;
        dto.currentQuestionIndex = entity.currentQuestionIndex;
        dto.totalQuestions = entity.totalQuestions;
        dto.visitedQuestions = entity.visitedQuestions;
        dto.answeredQuestions = entity.answeredQuestions;
        dto.markedQuestions = entity.markedQuestions;
        dto.ipAddress = entity.ipAddress;
        dto.sessionToken = entity.sessionToken;
        dto.autoSubmitted = entity.autoSubmitted;
        dto.timeExpired = entity.timeExpired;
        dto.manuallySubmitted = entity.manuallySubmitted;
        dto.securityViolationCount = entity.securityViolationCount;
        dto.suspicious = entity.suspicious;
        dto.finalScore = entity.finalScore;
        dto.percentage = entity.percentage;
        dto.correctAnswers = entity.correctAnswers;
        dto.incorrectAnswers = entity.incorrectAnswers;
        dto.unansweredQuestions = entity.unansweredQuestions;
        dto.answers = entity.answers?.map(answer => this.toExamAnswerDto(answer)).filter(Boolean) as ExamAnswerDto[] || null;

        return dto;
    }

    toExamSessionEntity(dto: ExamSessionDto | null): ExamSession | null {
        if (!dto) return null;

        const entity: ExamSession = {} as ExamSession;
        this.mapDtoToDatabaseObject(dto, entity);

        entity.sessionStatus = dto.sessionStatus;
        entity.sessionStartTime = dto.sessionStartTime;
        entity.sessionEndTime = dto.sessionEndTime;
        entity.lastActivityTime = dto.lastActivityTime;
        entity.pauseStartTime = dto.pauseStartTime;
        entity.totalPauseTime = dto.totalPauseTime;
        entity.pauseCount = dto.pauseCount;
        entity.remainingTime = dto.remainingTime;
        entity.timeSpentTotal = dto.timeSpentTotal;
        entity.currentQuestionIndex = dto.currentQuestionIndex;
        entity.totalQuestions = dto.totalQuestions;
        entity.visitedQuestions = dto.visitedQuestions;
        entity.answeredQuestions = dto.answeredQuestions;
        entity.markedQuestions = dto.markedQuestions;
        entity.ipAddress = dto.ipAddress;
        entity.sessionToken = dto.sessionToken;
        entity.autoSubmitted = dto.autoSubmitted;
        entity.timeExpired = dto.timeExpired;
        entity.manuallySubmitted = dto.manuallySubmitted;
        entity.securityViolationCount = dto.securityViolationCount;
        entity.suspicious = dto.suspicious;
        entity.finalScore = dto.finalScore;
        entity.percentage = dto.percentage;
        entity.correctAnswers = dto.correctAnswers;
        entity.incorrectAnswers = dto.incorrectAnswers;
        entity.unansweredQuestions = dto.unansweredQuestions;

        return entity;
    }

    // Special converters for Ready DTOs
    toExamQuestionReadyDto(entity: ExamQuestion, template: BaseQuestionTemplate): ExamQuestionReadyDto | null {
        if (!entity) return null;

        const dto: ExamQuestionReadyDto = {} as ExamQuestionReadyDto;
        dto.id = entity.id;
        dto.isMain = entity.isMain;
        dto.duration = entity.duration;
        dto.repeatCount = entity.repeatCount;
        dto.score = entity.score;
        dto.questionOrder = entity.questionOrder;
        dto.points = entity.points;
        dto.isActive = entity.isActive;
        dto.shuffleOptions = entity.shuffleOptions;
        dto.timeLimit = entity.timeLimit;
        dto.additionalTags = entity.additionalTags;
        dto.examPart = this.toExamPartDto(entity.examPart);
        dto.curriculumContentSet = entity.curriculumContentSet?.map(content => this.toCurriculumContentDto(content)).filter(Boolean) as CurriculumContentDto[] || null;
        dto.questionType = entity.questionType;
        dto.questionTemplate = this.toTemplateDto(template);

        return dto;
    }

    toExamReadyDto(entity: Exam, templateMap: Record<string, BaseQuestionTemplate>): ExamReadyDto | null {
        if (!entity) return null;

        const dto: ExamReadyDto = {} as ExamReadyDto;
        dto.id = entity.id;
        dto.name = entity.name;
        dto.category = entity.category;
        dto.imageUrl = entity.imageUrl;
        dto.description = entity.description;
        dto.code = entity.code;
        dto.language = entity.language;
        dto.level = entity.level;
        dto.introText = entity.introText;
        dto.maxScore = entity.maxScore;
        dto.createdAt = entity.createdAt;
        dto.examParts = entity.examParts?.map(part => this.toExamPartDto(part)).filter(Boolean) as ExamPartDto[] || null;

        // Convert questions with templates
        if (entity.examQuestions) {
            const readyQuestions = entity.examQuestions
                .map(question => {
                    const template = templateMap[question.questionTemplateId];
                    return template ? this.toExamQuestionReadyDto(question, template) : null;
                })
                .filter(Boolean) as ExamQuestionReadyDto[];
            dto.questions = readyQuestions;
        }

        // Calculate statistics
        if (entity.examQuestions) {
            dto.totalQuestions = entity.examQuestions.length;
            dto.totalPoints = entity.examQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
            dto.estimatedDuration = Math.floor(
                entity.examQuestions.reduce((sum, q) => sum + (q.timeLimit || 0), 0) / 60
            ); // Convert to minutes
        }

        return dto;
    }

    // Utility methods
    private getTemplateTypeFromEntity(entity: BaseQuestionTemplate): EQuestionTemplateType {
        // This method would need to be implemented based on how you identify template types
        // You might check for specific properties or use a type field
        // For now, returning a default value
        return EQuestionTemplateType.MULTIPLE_CHOICE;
    }

    createTemplateByType(type: EQuestionTemplateType): BaseQuestionTemplate {
        switch (type) {
            case EQuestionTemplateType.MULTIPLE_CHOICE:
                return {} as MultipleChoiceTemplate;
            case EQuestionTemplateType.TRUE_FALSE:
                return {} as TrueFalseTemplate;
            case EQuestionTemplateType.FILL_IN_THE_BLANKS:
                return {} as FillInTheBlanksTemplate;
            case EQuestionTemplateType.SHORT_ANSWER:
                return {} as ShortAnswerTemplate;
            case EQuestionTemplateType.MATCHING:
                return {} as MatchingTemplate;
            case EQuestionTemplateType.ESSAY:
                return {} as EssayTemplate;
            case EQuestionTemplateType.ORDERING:
                return {} as OrderingTemplate;
            case EQuestionTemplateType.MULTIPLE_RESPONSE:
                return {} as MultipleResponseTemplate;
            case EQuestionTemplateType.HOT_SPOT:
                return {} as HotSpotTemplate;
            case EQuestionTemplateType.DRAG_AND_DROP:
                return {} as DragAndDropTemplate;
            case EQuestionTemplateType.AUDIO_RESPONSE:
                return {} as AudioResponseTemplate;
            case EQuestionTemplateType.VIDEO_RESPONSE:
                return {} as VideoResponseTemplate;
            case EQuestionTemplateType.IMAGE_RESPONSE:
                return {} as ImageResponseTemplate;
            default:
                throw new Error(`Unknown template type: ${type}`);
        }
    }

    createTemplateDtoByType(type: EQuestionTemplateType): BaseQuestionTemplateDto {
        switch (type) {
            case EQuestionTemplateType.MULTIPLE_CHOICE:
                return {} as MultipleChoiceTemplateDto;
            case EQuestionTemplateType.TRUE_FALSE:
                return {} as TrueFalseTemplateDto;
            case EQuestionTemplateType.FILL_IN_THE_BLANKS:
                return {} as FillInTheBlanksTemplateDto;
            case EQuestionTemplateType.SHORT_ANSWER:
                return {} as ShortAnswerTemplateDto;
            case EQuestionTemplateType.MATCHING:
                return {} as MatchingTemplateDto;
            case EQuestionTemplateType.ESSAY:
                return {} as EssayTemplateDto;
            case EQuestionTemplateType.ORDERING:
                return {} as OrderingTemplateDto;
            case EQuestionTemplateType.MULTIPLE_RESPONSE:
                return {} as MultipleResponseTemplateDto;
            case EQuestionTemplateType.HOT_SPOT:
                return {} as HotSpotTemplateDto;
            case EQuestionTemplateType.DRAG_AND_DROP:
                return {} as DragAndDropTemplateDto;
            case EQuestionTemplateType.AUDIO_RESPONSE:
                return {} as AudioResponseTemplateDto;
            case EQuestionTemplateType.VIDEO_RESPONSE:
                return {} as VideoResponseTemplateDto;
            case EQuestionTemplateType.IMAGE_RESPONSE:
                return {} as ImageResponseTemplateDto;
            default:
                throw new Error(`Unknown template type: ${type}`);
        }
    }

    // Collection converters
    toUploadedFileDtoList(entities: UploadedFile[] | null): UploadedFileDto[] | null {
        return entities?.map(entity => this.toUploadedFileDto(entity)).filter(Boolean) as UploadedFileDto[] || null;
    }

    toUploadedFileEntityList(dtos: UploadedFileDto[] | null): UploadedFile[] | null {
        return dtos?.map(dto => this.toUploadedFileEntity(dto)).filter(Boolean) as UploadedFile[] || null;
    }

    toCurriculumContentDtoSet(entities: CurriculumContent[] | null): CurriculumContentDto[] | null {
        return entities?.map(entity => this.toCurriculumContentDto(entity)).filter(Boolean) as CurriculumContentDto[] || null;
    }

    toCurriculumContentEntitySet(dtos: CurriculumContentDto[] | null): CurriculumContent[] | null {
        return dtos?.map(dto => this.toCurriculumContentEntity(dto)).filter(Boolean) as CurriculumContent[] || null;
    }
}

// Export singleton instance
export const entityDtoConverter = new EntityDtoConverterService();

 */