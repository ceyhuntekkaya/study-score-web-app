# Frontend Developer Guide: Question & Template System

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [QuestionGroup Yapısı](#questiongroup-yapısı)
3. [Question Yapısı](#question-yapısı)
4. [Template Data Formatı](#template-data-formatı)
5. [Question Type'ları ve Template'leri](#question-typeları-ve-templateleri)
6. [API Endpoint'leri](#api-endpointleri)
7. [TypeScript Type Definitions](#typescript-type-definitions)
8. [Form Örnekleri](#form-örnekleri)
9. [Validation Kuralları](#validation-kuralları)

---

## Genel Bakış

Sistem 3 ana bileşenden oluşur:

```
Exam
  └── QuestionGroup (Soru Grubu)
      ├── QuestionGroupHeader[] (Başlıklar: passage, image, etc.)
      └── Question[] (Sorular)
          └── templateData (JSON) - Template tipine göre değişir
```

**Önemli Not:** `templateData` her zaman **JSON string** olarak saklanır ve API'den **Object/Map** olarak döner. ORVAL nested JSON objeleri için tip üretmeyebilir, bu yüzden manuel TypeScript tipleri tanımlanmalıdır.

---

## QuestionGroup Yapısı

### Entity Yapısı

```typescript
interface QuestionGroup {
  id: string;
  code: string; // Unique kod (örn: "GROUP_1")
  examId: string;
  maximumScore?: number;
  orderNumber: number;
  questions?: Question[];
  headers?: QuestionGroupHeader[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}
```

### QuestionGroupHeader

```typescript
interface QuestionGroupHeader {
  id: string;
  questionGroupId: string;
  orderNumber: number;
  mediaType: EMediaType; // IMAGE, VIDEO, AUDIO, DOCUMENT, PDF, TEXT, LINK, OTHER
  content: string; // HTML/text içerik
}
```

### API Endpoints

#### QuestionGroup CRUD

```typescript
// GET /exams/question-groups/{groupId}
GET /exams/question-groups/{groupId}

// GET /exams/question-groups/exam/{examId}
GET /exams/question-groups/exam/{examId}

// POST /exams/question-groups
POST /exams/question-groups
Body: QuestionGroupCreateRequest

// PUT /exams/question-groups/{groupId}
PUT /exams/question-groups/{groupId}
Body: QuestionGroupCreateRequest

// DELETE /exams/question-groups/{groupId}
DELETE /exams/question-groups/{groupId}

// PATCH /exams/question-groups/{groupId}/reorder?orderNumber={number}
PATCH /exams/question-groups/{groupId}/reorder?orderNumber={number}
```

#### QuestionGroupCreateRequest

```typescript
interface QuestionGroupCreateRequest {
  code: string; // Pattern: ^[A-Z0-9_-]+$
  examId: string;
  maximumScore?: number;
  headers?: HeaderRequest[];
}

interface HeaderRequest {
  mediaType: EMediaType;
  content?: string; // Max 50000 karakter
}
```

---

## Question Yapısı

### Entity Yapısı

```typescript
interface Question {
  id: string;
  name: string; // 3-255 karakter
  questionGroupId: string;
  questionType: EQuestionType;
  orderNumber: number;
  maximumScore: number; // 0.1 - 1000.0
  subject?: string; // Max 100 karakter
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  questionText: string; // 10-10000 karakter
  templateData: string; // JSON string (backend'de)
  // API response'da Object olarak gelir
  isTemplateLocked: boolean;
  templateLockedAt?: string;
  status: "ACTIVE" | "DELETED";
  createdAt?: string;
  updatedAt?: string;
}
```

### API Endpoints

#### Question CRUD

```typescript
// GET /exams/questions/{questionId}
GET /exams/questions/{questionId}

// GET /exams/questions/group/{groupId}
GET /exams/questions/group/{groupId}

// GET /exams/questions/group/{groupId}/count
GET /exams/questions/group/{groupId}/count

// POST /exams/questions
POST /exams/questions
Body: QuestionCreateRequest

// PUT /exams/questions/{questionId}
PUT /exams/questions/{questionId}
Body: QuestionCreateRequest

// DELETE /exams/questions/{questionId}
DELETE /exams/questions/{questionId}

// DELETE /exams/questions/{questionId}/hard
DELETE /exams/questions/{questionId}/hard

// POST /exams/questions/{questionId}/lock
POST /exams/questions/{questionId}/lock

// POST /exams/questions/group/{groupId}/lock-all
POST /exams/questions/group/{groupId}/lock-all

// PATCH /exams/questions/{questionId}/reorder?orderNumber={number}
PATCH /exams/questions/{questionId}/reorder?orderNumber={number}
```

#### QuestionCreateRequest

```typescript
interface QuestionCreateRequest {
  name: string; // 3-255 karakter, required
  questionGroupId: string; // required
  questionType: EQuestionType; // required
  maximumScore: number; // 0.1-1000.0, required
  subject?: string; // Max 100 karakter
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  questionText: string; // 10-10000 karakter, required
  templateData: object; // Template tipine göre değişir, required
}
```

---

## Template Data Formatı

**ÖNEMLİ:** `templateData` API'ye gönderilirken **Object** olarak gönderilir, backend JSON string'e çevirir. API'den dönerken **Object/Map** olarak gelir.

Her question type'ı için farklı template yapısı vardır. Aşağıda her tip için detaylı yapılar verilmiştir.

---

## Question Type'ları ve Template'leri

### Enum: EQuestionType

```typescript
enum EQuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  MULTIPLE_RESPONSE = "MULTIPLE_RESPONSE",
  TRUE_FALSE = "TRUE_FALSE",
  SHORT_ANSWER = "SHORT_ANSWER",
  FILL_IN_THE_BLANKS = "FILL_IN_THE_BLANKS",
  ORDERING = "ORDERING",
  MATCHING = "MATCHING",
  DRAG_AND_DROP = "DRAG_AND_DROP",
  HOT_SPOT = "HOT_SPOT",
  ESSAY = "ESSAY",
  AUDIO_RESPONSE = "AUDIO_RESPONSE",
  VIDEO_RESPONSE = "VIDEO_RESPONSE",
  IMAGE_RESPONSE = "IMAGE_RESPONSE"
}
```

### Enum: EMediaType

```typescript
enum EMediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
  PDF = "PDF",
  TEXT = "TEXT",
  LINK = "LINK",
  OTHER = "OTHER"
}
```

### Enum: ScoringStrategy

```typescript
enum ScoringStrategy {
  BINARY = "BINARY",           // All or nothing
  PROPORTIONAL = "PROPORTIONAL", // Partial credit
  POSITION_BASED = "POSITION_BASED", // Position-based scoring
  MANUAL = "MANUAL",           // Human grading
  HYBRID = "HYBRID"            // AI + Human
}
```

---

## 1. MULTIPLE_CHOICE Template

### Template Yapısı

```typescript
interface MultipleChoiceTemplateData {
  options: {
    choices: ChoiceOption[];
  };
  shuffleChoices?: boolean; // Default: true
  showFeedback?: boolean; // Default: false
  scoringConfig?: ScoringConfig;
}

interface ChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean; // Sadece BİR tane true olmalı
  mediaUrl?: string;
  mediaType?: EMediaType;
}
```

### Validation Kuralları

- En az 2, en fazla 10 seçenek olmalı
- Tam olarak **1** seçenek `isCorrect: true` olmalı
- Her seçeneğin `text` alanı dolu olmalı

### Örnek JSON

```json
{
  "options": {
    "choices": [
      {
        "id": "choice_1",
        "text": "İstanbul",
        "isCorrect": true,
        "mediaUrl": null,
        "mediaType": null
      },
      {
        "id": "choice_2",
        "text": "Ankara",
        "isCorrect": false,
        "mediaUrl": null,
        "mediaType": null
      },
      {
        "id": "choice_3",
        "text": "İzmir",
        "isCorrect": false,
        "mediaUrl": null,
        "mediaType": null
      }
    ]
  },
  "shuffleChoices": true,
  "showFeedback": false,
  "scoringConfig": {
    "strategy": "BINARY",
    "allowPartialCredit": false,
    "penaltyPerWrong": 0.0,
    "roundScore": false,
    "decimalPlaces": 2
  }
}
```

---

## 2. MULTIPLE_RESPONSE Template

### Template Yapısı

```typescript
interface MultipleResponseTemplateData {
  options: {
    choices: ResponseOption[];
  };
  shuffleChoices?: boolean; // Default: true
  showFeedback?: boolean; // Default: false
  scoringConfig?: ScoringConfig;
}

interface ResponseOption {
  id: string;
  text: string;
  isCorrect: boolean;
  mediaUrl?: string;
  mediaType?: EMediaType;
}
```

### Validation Kuralları

- En az 2 seçenek olmalı
- En az **2** seçenek `isCorrect: true` olmalı


### Örnek JSON

```json
{
  "options": {
    "choices": [
      {
        "id": "choice_1",
        "text": "Java",
        "isCorrect": true
      },
      {
        "id": "choice_2",
        "text": "Python",
        "isCorrect": true
      },
      {
        "id": "choice_3",
        "text": "HTML",
        "isCorrect": false
      }
    ]
  },

  "shuffleChoices": true,
  "showFeedback": false
}
```

---

## 3. TRUE_FALSE Template

### Template Yapısı

```typescript
interface TrueFalseTemplateData {
  optionList: {
    questionText?: string;
    correctAnswer: boolean; // true veya false
    trueLabel?: string; // Default: "True"
    falseLabel?: string; // Default: "False"
  };
  showFeedback?: boolean; // Default: false
  scoringConfig?: ScoringConfig;
}
```

### Validation Kuralları

- `correctAnswer` mutlaka belirtilmeli (true veya false)

### Örnek JSON

```json
{
  "optionList": {
    "questionText": "Java bir programlama dilidir.",
    "correctAnswer": true,
    "trueLabel": "Doğru",
    "falseLabel": "Yanlış"
  },
  "showFeedback": false
}
```

---

## 4. SHORT_ANSWER Template

### Template Yapısı

```typescript
interface ShortAnswerTemplateData {
  options: {
    acceptableAnswers: string[]; // Kabul edilebilir cevaplar
    caseSensitive?: boolean; // Default: false
    exactMatch?: boolean; // Default: false
    placeholder?: string;
  };
  maxCharacters?: number; // Default: 500
  minCharacters?: number; // Default: 10
  trimWhitespace?: boolean; // Default: true
  scoringConfig?: ScoringConfig;
}
```

### Validation Kuralları

- En az 1 `acceptableAnswer` olmalı
- `minCharacters <= maxCharacters` olmalı

### Örnek JSON

```json
{
  "options": {
    "acceptableAnswers": ["Java", "java", "JAVA"],
    "caseSensitive": false,
    "exactMatch": false,
    "placeholder": "Cevabınızı yazın..."
  },
  "maxCharacters": 500,
  "minCharacters": 10,
  "trimWhitespace": true
}
```

---

## 5. FILL_IN_THE_BLANKS Template

### Template Yapısı

```typescript
interface FillInTheBlanksTemplateData {
  textWithBlanks: string; // {{BLANK_1}}, {{BLANK_2}} gibi placeholder'lar içerir
  options: {
    blanks: BlankAnswer[];
  };
  caseSensitive?: boolean; // Default: false
  exactMatch?: boolean; // Default: false
}

interface BlankAnswer {
  blankId: string; // "BLANK_1", "BLANK_2", etc.
  acceptableAnswers: string; // Virgülle ayrılmış kabul edilebilir cevaplar
  caseSensitive?: boolean;
  exactMatch?: boolean;
}
```

### Validation Kuralları

- `textWithBlanks` içinde en az 1 `{{BLANK_X}}` marker olmalı
- Marker sayısı ile `blanks` array uzunluğu eşit olmalı
- Her blank için `blankId` ve `acceptableAnswers` olmalı

### Örnek JSON

```json
{
  "textWithBlanks": "Java bir {{BLANK_1}} dilidir ve {{BLANK_2}} paradigmasını destekler.",
  "options": {
    "blanks": [
      {
        "blankId": "BLANK_1",
        "acceptableAnswers": "programlama, kodlama",
        "caseSensitive": false,
        "exactMatch": false
      },
      {
        "blankId": "BLANK_2",
        "acceptableAnswers": "OOP, nesne yönelimli",
        "caseSensitive": false,
        "exactMatch": false
      }
    ]
  },
  "caseSensitive": false,
  "exactMatch": false
}
```

---

## 6. ORDERING Template

### Template Yapısı

```typescript
interface OrderingTemplateData {
  options: {
    items: OrderingItem[];
    orderingType?: string; // "SEQUENTIAL", "CHRONOLOGICAL", "PRIORITY"
  };
  shuffleItems?: boolean; // Default: true
  showFeedback?: boolean; // Default: false
  scoringConfig?: ScoringConfig;
}

interface OrderingItem {
  id: string;
  text: string;
  correctPosition: number; // 1-based pozisyon
  mediaUrl?: string;
  mediaType?: EMediaType;
  feedback?: string;
}
```

### Validation Kuralları

- En az 2, en fazla 20 item olmalı

### Örnek JSON

```json
{
  "options": {
    "items": [
      {
        "id": "item_1",
        "text": "İlk adım",
        "correctPosition": 1
      },
      {
        "id": "item_2",
        "text": "İkinci adım",
        "correctPosition": 2
      },
      {
        "id": "item_3",
        "text": "Üçüncü adım",
        "correctPosition": 3
      }
    ],
    "orderingType": "SEQUENTIAL"
  },
  "shuffleItems": true,
  "showFeedback": false
}
```

---

## 7. MATCHING Template

### Template Yapısı

```typescript
interface MatchingTemplateData {
  options: {
    pairs: MatchingPair[];
    distractors?: string[]; // Ek seçenekler (zorluk için)
  };
  shuffleLeftItems?: boolean; // Default: true
  shuffleRightItems?: boolean; // Default: true
  showFeedback?: boolean; // Default: false
  scoringConfig?: ScoringConfig;
}

interface MatchingPair {
  leftId: string;
  leftText: string;
  leftMediaUrl?: string;
  rightId: string;
  rightText: string;
  rightMediaUrl?: string;
  feedback?: string;
}
```

### Validation Kuralları

- En az 2, en fazla 15 pair olmalı

### Örnek JSON

```json
{
  "options": {
    "pairs": [
      {
        "leftId": "left_1",
        "leftText": "Java",
        "rightId": "right_1",
        "rightText": "Programlama Dili"
      },
      {
        "leftId": "left_2",
        "leftText": "Python",
        "rightId": "right_2",
        "rightText": "Programlama Dili"
      }
    ],
    "distractors": ["Framework", "Database"]
  },
  "shuffleLeftItems": true,
  "shuffleRightItems": true
}
```

---

## 8. DRAG_AND_DROP Template

### Template Yapısı

```typescript
interface DragAndDropTemplateData {
  options: {
    draggableItems: DraggableItem[];
    dropZones: DropZone[];
  };
  layout?: string; // "VERTICAL", "HORIZONTAL", "GRID", "CUSTOM"
  shuffleItems?: boolean; // Default: true
  showFeedback?: boolean; // Default: false
  scoringConfig?: ScoringConfig;
}

interface DraggableItem {
  id: string;
  text: string;
  mediaUrl?: string;
  mediaType?: EMediaType;
  correctZones: string[]; // Bu item'ın gidebileceği zone ID'leri
}

interface DropZone {
  id: string;
  label: string;
  maxItems?: number; // Default: 1
  feedback?: string;
  position?: string; // JSON coordinates if visual
}
```

### Validation Kuralları

- En az 1 `draggableItem` olmalı
- En az 1 `dropZone` olmalı

### Örnek JSON

```json
{
  "options": {
    "draggableItems": [
      {
        "id": "item_1",
        "text": "Java",
        "correctZones": ["zone_1"]
      },
      {
        "id": "item_2",
        "text": "Python",
        "correctZones": ["zone_2"]
      }
    ],
    "dropZones": [
      {
        "id": "zone_1",
        "label": "Programlama Dilleri",
        "maxItems": 1
      },
      {
        "id": "zone_2",
        "label": "Script Dilleri",
        "maxItems": 1
      }
    ]
  },
  "layout": "VERTICAL",
  "shuffleItems": true
}
```

---

## 9. HOT_SPOT Template

### Template Yapısı

```typescript
interface HotSpotTemplateData {
  imageUrl: string; // Görsel URL'i (required)
  options: {
    hotSpots: HotSpotArea[];
    selectionType?: string; // "CLICK", "DRAG_RECTANGLE"
  };
  maxSelections?: number; // Default: 1
  allowMultipleSpots?: boolean; // Default: false
  scoringConfig?: ScoringConfig;
}

interface HotSpotArea {
  id: string;
  shape: string; // "RECTANGLE", "CIRCLE", "POLYGON"
  coordinates: string; // JSON coordinates
  isCorrect: boolean;
  label?: string;
}
```

### Validation Kuralları

- `imageUrl` mutlaka belirtilmeli

### Örnek JSON

```json
{
  "imageUrl": "https://example.com/image.jpg",
  "options": {
    "hotSpots": [
      {
        "id": "spot_1",
        "shape": "RECTANGLE",
        "coordinates": "{\"x\": 100, \"y\": 100, \"width\": 50, \"height\": 50}",
        "isCorrect": true,
        "label": "Doğru Bölge"
      }
    ],
    "selectionType": "CLICK"
  },
  "maxSelections": 1,
  "allowMultipleSpots": false
}
```

---

## 10. ESSAY Template

### Template Yapısı

```typescript
interface EssayTemplateData {
  prompt: string; // Soru metni (required)
  minWords?: number; // Default: 100
  maxWords?: number; // Default: 1000
  requiredTopics?: string; // Virgülle ayrılmış konular
  gradingType?: string; // "MANUAL", "AI", "HYBRID"
  rubric?: GradingCriterion[]; // Değerlendirme kriterleri
  requireOutline?: boolean; // Default: false
  allowedFormats?: string[]; // ["HTML", "MARKDOWN", "PLAIN_TEXT"]
  scoringConfig?: ScoringConfig;
}

interface GradingCriterion {
  name: string; // Örn: "Content Quality", "Grammar"
  description?: string;
  maxScore: number;
  rubricLevel?: string; // "BASIC", "INTERMEDIATE", "ADVANCED"
}
```

### Validation Kuralları

- `prompt` mutlaka belirtilmeli
- `minWords >= 10` olmalı
- `minWords <= maxWords` olmalı

### Örnek JSON

```json
{
  "prompt": "Java programlama dilinin avantajlarını açıklayın.",
  "minWords": 100,
  "maxWords": 1000,
  "requiredTopics": "OOP, Memory Management, Performance",
  "gradingType": "MANUAL",
  "rubric": [
    {
      "name": "Content Quality",
      "description": "İçerik kalitesi",
      "maxScore": 40,
      "rubricLevel": "ADVANCED"
    },
    {
      "name": "Grammar",
      "description": "Dilbilgisi",
      "maxScore": 20,
      "rubricLevel": "INTERMEDIATE"
    }
  ],
  "requireOutline": false,
  "allowedFormats": ["PLAIN_TEXT", "MARKDOWN"]
}
```

---

## 11. AUDIO_RESPONSE Template

### Template Yapısı

```typescript
interface AudioResponseTemplateData {
  prompt: string; // Soru metni (required)
  maxRecordingDuration?: number; // Saniye, Default: 300 (5 dakika)
  minRecordingDuration?: number; // Saniye, Default: 5
  gradingType?: string; // "MANUAL", "AI", "HYBRID"
  criteria?: GradingCriterion[]; // Örn: Fluency, Pronunciation, Content
  allowRetake?: boolean; // Default: true
  maxRetakes?: number; // Default: 3
  scoringConfig?: ScoringConfig;
}
```

### Validation Kuralları

- `prompt` mutlaka belirtilmeli
- `minRecordingDuration <= maxRecordingDuration` olmalı
- `maxRecordingDuration <= 600` (10 dakika) olmalı

### Örnek JSON

```json
{
  "prompt": "Kendinizi İngilizce olarak tanıtın.",
  "maxRecordingDuration": 300,
  "minRecordingDuration": 5,
  "gradingType": "MANUAL",
  "criteria": [
    {
      "name": "Fluency",
      "description": "Akıcılık",
      "maxScore": 30
    },
    {
      "name": "Pronunciation",
      "description": "Telaffuz",
      "maxScore": 30
    },
    {
      "name": "Content",
      "description": "İçerik",
      "maxScore": 40
    }
  ],
  "allowRetake": true,
  "maxRetakes": 3
}
```

---

## 12. VIDEO_RESPONSE Template

### Template Yapısı

```typescript
interface VideoResponseTemplateData {
  prompt: string; // Soru metni (required)
  maxRecordingDuration?: number; // Saniye, Default: 600 (10 dakika)
  minRecordingDuration?: number; // Saniye, Default: 10
  gradingType?: string; // "MANUAL", "AI", "HYBRID"
  criteria?: GradingCriterion[]; // Örn: Presentation, Body Language, Content
  allowRetake?: boolean; // Default: true
  maxRetakes?: number; // Default: 3
  requiredQuality?: string; // "480p", "720p", "1080p"
  scoringConfig?: ScoringConfig;
}
```

### Validation Kuralları

- `prompt` mutlaka belirtilmeli
- `minRecordingDuration <= maxRecordingDuration` olmalı
- `maxRecordingDuration <= 1800` (30 dakika) olmalı

### Örnek JSON

```json
{
  "prompt": "5 dakikalık bir sunum hazırlayın.",
  "maxRecordingDuration": 600,
  "minRecordingDuration": 10,
  "gradingType": "MANUAL",
  "criteria": [
    {
      "name": "Presentation",
      "description": "Sunum becerisi",
      "maxScore": 30
    },
    {
      "name": "Body Language",
      "description": "Beden dili",
      "maxScore": 20
    },
    {
      "name": "Content",
      "description": "İçerik",
      "maxScore": 50
    }
  ],
  "allowRetake": true,
  "maxRetakes": 3,
  "requiredQuality": "720p"
}
```

---

## 13. IMAGE_RESPONSE Template

### Template Yapısı

```typescript
interface ImageResponseTemplateData {
  prompt: string; // Soru metni (required)
  maxFileSize?: number; // Bytes, Default: 5242880 (5MB)
  allowedFormats?: string; // "JPG, PNG, PDF" gibi
  gradingType?: string; // "MANUAL", "AI", "HYBRID"
  criteria?: GradingCriterion[]; // Örn: Creativity, Clarity, Relevance
  allowMultipleImages?: boolean; // Default: false
  maxImages?: number; // Default: 1
  requiredResolution?: string; // "1024x768" (optional)
  scoringConfig?: ScoringConfig;
}
```

### Validation Kuralları

- `prompt` mutlaka belirtilmeli
- `maxImages <= 10` olmalı
- `maxFileSize <= 10485760` (10MB) olmalı

### Örnek JSON

```json
{
  "prompt": "Bir logo tasarımı yapın.",
  "maxFileSize": 5242880,
  "allowedFormats": "JPG, PNG",
  "gradingType": "MANUAL",
  "criteria": [
    {
      "name": "Creativity",
      "description": "Yaratıcılık",
      "maxScore": 40
    },
    {
      "name": "Clarity",
      "description": "Netlik",
      "maxScore": 30
    },
    {
      "name": "Relevance",
      "description": "Uygunluk",
      "maxScore": 30
    }
  ],
  "allowMultipleImages": false,
  "maxImages": 1,
  "requiredResolution": "1024x768"
}
```

---

## ScoringConfig Yapısı

Tüm template'lerde kullanılabilir (opsiyonel):

```typescript
interface ScoringConfig {
  strategy: ScoringStrategy;
  allowPartialCredit?: boolean; // Default: false
  penaltyPerWrong?: number; // 0.0 - 1.0 (yanlış cevap başına puan kesintisi)
  roundScore?: boolean; // Default: false (0.5 → 1.0 or 0.0)
  decimalPlaces?: number; // Default: 2
}
```

---

## TypeScript Type Definitions

ORVAL nested JSON objeleri için tip üretmeyebilir, bu yüzden aşağıdaki tipleri manuel olarak tanımlayın:

```typescript
// Enums
export enum EQuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  MULTIPLE_RESPONSE = "MULTIPLE_RESPONSE",
  TRUE_FALSE = "TRUE_FALSE",
  SHORT_ANSWER = "SHORT_ANSWER",
  FILL_IN_THE_BLANKS = "FILL_IN_THE_BLANKS",
  ORDERING = "ORDERING",
  MATCHING = "MATCHING",
  DRAG_AND_DROP = "DRAG_AND_DROP",
  HOT_SPOT = "HOT_SPOT",
  ESSAY = "ESSAY",
  AUDIO_RESPONSE = "AUDIO_RESPONSE",
  VIDEO_RESPONSE = "VIDEO_RESPONSE",
  IMAGE_RESPONSE = "IMAGE_RESPONSE"
}

export enum EMediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
  PDF = "PDF",
  TEXT = "TEXT",
  LINK = "LINK",
  OTHER = "OTHER"
}

export enum ScoringStrategy {
  BINARY = "BINARY",
  PROPORTIONAL = "PROPORTIONAL",
  POSITION_BASED = "POSITION_BASED",
  MANUAL = "MANUAL",
  HYBRID = "HYBRID"
}

// Common Types
export interface ScoringConfig {
  strategy: ScoringStrategy;
  allowPartialCredit?: boolean;
  penaltyPerWrong?: number;
  roundScore?: boolean;
  decimalPlaces?: number;
}

export interface GradingCriterion {
  name: string;
  description?: string;
  maxScore: number;
  rubricLevel?: string;
}

// Template Types (Union Type)
export type TemplateData =
  | MultipleChoiceTemplateData
  | MultipleResponseTemplateData
  | TrueFalseTemplateData
  | ShortAnswerTemplateData
  | FillInTheBlanksTemplateData
  | OrderingTemplateData
  | MatchingTemplateData
  | DragAndDropTemplateData
  | HotSpotTemplateData
  | EssayTemplateData
  | AudioResponseTemplateData
  | VideoResponseTemplateData
  | ImageResponseTemplateData;

// Individual Template Types (yukarıdaki bölümlerde tanımlı)
// ... (tüm template interface'leri)
```

---

## Form Örnekleri

### React Hook Form Örneği - Multiple Choice

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const multipleChoiceSchema = z.object({
  name: z.string().min(3).max(255),
  questionGroupId: z.string(),
  questionType: z.literal(EQuestionType.MULTIPLE_CHOICE),
  maximumScore: z.number().min(0.1).max(1000),
  questionText: z.string().min(10).max(10000),
  templateData: z.object({
    options: z.object({
      choices: z.array(
        z.object({
          id: z.string(),
          text: z.string().min(1),
          isCorrect: z.boolean(),
          mediaUrl: z.string().optional(),
          mediaType: z.nativeEnum(EMediaType).optional(),
        })
      ).min(2).max(10),
    }),
    shuffleChoices: z.boolean().optional(),
    showFeedback: z.boolean().optional(),
  }),
});

type MultipleChoiceFormData = z.infer<typeof multipleChoiceSchema>;

function MultipleChoiceForm() {
  const { register, handleSubmit, watch, setValue } = useForm<MultipleChoiceFormData>({
    resolver: zodResolver(multipleChoiceSchema),
  });

  const choices = watch('templateData.options.choices') || [];

  const addChoice = () => {
    const currentChoices = watch('templateData.options.choices') || [];
    setValue('templateData.options.choices', [
      ...currentChoices,
      {
        id: `choice_${Date.now()}`,
        text: '',
        isCorrect: false,
      },
    ]);
  };

  const onSubmit = async (data: MultipleChoiceFormData) => {
    // Validate: exactly one correct answer
    const correctCount = data.templateData.options.choices.filter(
      (c) => c.isCorrect
    ).length;
    
    if (correctCount !== 1) {
      alert('Tam olarak 1 doğru cevap seçmelisiniz!');
      return;
    }

    // API call
    await createQuestion(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Validation Kuralları

### Genel Validation

1. **Question Level:**
   - `name`: 3-255 karakter
   - `questionText`: 10-10000 karakter
   - `maximumScore`: 0.1 - 1000.0
   - `difficulty`: "EASY" | "MEDIUM" | "HARD"

2. **Template Level:**
   - Her template tipinin kendi validation kuralları vardır (yukarıda belirtildi)
   - Backend `TemplateValidator` tüm kuralları kontrol eder

3. **Lock Mechanism:**
   - Template lock'landıktan sonra `templateData` değiştirilemez
   - Lock kontrolü: `isTemplateLocked` field'ına bakın

### Error Handling

API hataları şu formatta döner:

```typescript
interface ErrorResponse {
  success: false;
  error: string; // Hata mesajı
}

interface SuccessResponse {
  success: true;
  message?: string;
}
```

Örnek hata mesajları:
- `"Template validation failed: Multiple choice must have at least one correct answer"`
- `"Cannot update question with locked template. Question was locked at: 2024-01-15T10:30:00"`
- `"Question name must be between 3 and 255 characters"`

---

## Önemli Notlar

1. **Template Data Format:**
   - API'ye gönderirken: **Object** olarak gönderin
   - API'den alırken: **Object/Map** olarak gelir
   - Backend'de: **JSON string** olarak saklanır

2. **ORVAL Kullanımı:**
   - ORVAL nested JSON objeleri için tip üretmeyebilir
   - `templateData` için manuel TypeScript tipleri tanımlayın (yukarıdaki örneklerde)

3. **Type Safety:**
   - Her question type için ayrı form component'i oluşturun
   - Union type kullanarak type-safe form handling yapın

4. **Lock Mechanism:**
   - Template lock'landıktan sonra sadece `questionText`, `name` gibi alanlar güncellenebilir
   - `templateData` güncellemesi yapılamaz

5. **Default Values:**
   - Tüm opsiyonel alanlar için default değerler backend'de set edilir
   - Frontend'de göndermeseniz de sorun olmaz

---

## Örnek API Kullanımı

```typescript
// Question oluşturma
const createQuestion = async (data: QuestionCreateRequest) => {
  const response = await fetch('/exams/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};

// Question güncelleme
const updateQuestion = async (
  questionId: string,
  data: QuestionCreateRequest
) => {
  const response = await fetch(`/exams/questions/${questionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};

// Question listesi
const getQuestionsByGroup = async (groupId: string) => {
  const response = await fetch(`/exams/questions/group/${groupId}`);
  return response.json();
};
```

---

## Sorular ve Destek

Herhangi bir sorunuz veya belirsizlik olursa backend ekibiyle iletişime geçin.

**Son Güncelleme:** 2024-01-27
