# Exam, QuestionGroup, Question – Template Verileri ve API Referansı

Bu doküman, ön yüz geliştiricileri için **Exam**, **QuestionGroup** ve **Question** işlemlerini, **soru template'lerini** (templateData yapıları) ve ilgili **API endpoint'lerini** tek yerde toplar.

---

## 1. Model İlişkileri ve İş Kuralları

### 1.1 Genel Yapı

- **Exam**: Sınav. İçinde **soru grupları** (QuestionGroup) bulunur; doğrudan soru tutmaz.
- **QuestionGroup**: Soru grubu. Birden fazla **Question** içerir. **Exam'e bağlı olabilir veya olmayabilir.**
- **Question**: Tekil soru. `templateData` (JSON) ile tipine göre şekil alır.

### 1.2 Önemli Kurallar

| Kural | Açıklama |
|-------|----------|
| **Sadece Question** | `questionGroupId` gönderilmeden tek başına soru oluşturulabilir (standalone). Bu sorular exam dışında da kullanılabilir. |
| **QuestionGroup olmadan Question** | Evet. Soru, gruba bağlı olmadan oluşturulabilir. |
| **QuestionGroup, Exam olmadan** | Evet. Soru grupları önce oluşturulup sonra bir veya birden fazla Exam'e atanabilir. |
| **Exam'e atama** | Soru grupları hazırlanır, ardından Exam'e `POST /api/exam/{examId}/question-groups` ile eklenir. |
| **Template kilidi** | Soru kilitlendikten sonra `templateData` değiştirilemez (`isTemplateLocked`, `templateLockedAt`). |

### 1.3 İlişki Özeti

```
Exam 1───* ExamQuestionGroup *───1 QuestionGroup
                (orderNumber)           |
                                       1───* Question (orderNumber, templateData)
                                       1───* QuestionGroupHeader (soru başlık/metin)
```

- **Question**: `question_group_id` nullable; null ise standalone soru.
- **QuestionGroup**: Exam ile ilişki `ExamQuestionGroup` üzerinden; bir grup birden fazla sınava eklenebilir.

---

## 2. Soru Tipleri ve templateData (Ön Yüz İçin)

`Question` nesnesinde:
- `questionType`: Aşağıdaki enum değerlerinden biri.
- `templateData`: JSON string (API'de object olarak gidip gelir). Tipine göre aşağıdaki yapılardan biri kullanılır.

**Soru tipi enum'u (`EQuestionType`):**

`MULTIPLE_CHOICE`, `TRUE_FALSE`, `FILL_IN_THE_BLANKS`, `SHORT_ANSWER`, `MATCHING`, `ESSAY`, `ORDERING`, `MULTIPLE_RESPONSE`, `HOT_SPOT`, `DRAG_AND_DROP`, `AUDIO_RESPONSE`, `VIDEO_RESPONSE`, `IMAGE_RESPONSE`

---

### 2.1 Ortak: ScoringConfig

Birçok template'te `scoringConfig` kullanılır:

```json
{
  "strategy": "BINARY | PROPORTIONAL | POSITION_BASED | MANUAL | HYBRID",
  "allowPartialCredit": false,
  "penaltyPerWrong": 0.0,
  "roundScore": false,
  "decimalPlaces": 2
}
```

| Alan | Açıklama |
|------|----------|
| strategy | BINARY: Tümü doğru/yanlış. PROPORTIONAL: Kısmi puan. POSITION_BASED: Sıralama. MANUAL: Elle puanlama. HYBRID: AI + insan. |
| allowPartialCredit | Kısmi puan verilsin mi |
| penaltyPerWrong | Yanlış cevap başına kesinti oranı (0.0–1.0) |
| roundScore | true ise 0.5 → 1.0 veya 0.0 gibi yuvarlanır |
| decimalPlaces | Puan ondalık basamak sayısı |

---

### 2.2 MULTIPLE_CHOICE

- **Doğru cevap**: Tam olarak **bir** tane `isCorrect: true` olmalı.
- **Validasyon**: En az 2, en fazla 10 seçenek.

```json
{
  "options": {
    "choices": [
      { "id": "opt1", "text": "Seçenek A", "isCorrect": false },
      { "id": "opt2", "text": "Seçenek B", "isCorrect": true }
    ]
  },
  "shuffleChoices": true,
  "showFeedback": false,
  "scoringConfig": { "strategy": "BINARY", "allowPartialCredit": false, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

---

### 2.3 MULTIPLE_RESPONSE

- **Doğru cevaplar**: En az **iki** seçenek `isCorrect: true` olmalı.
- **Validasyon**: En az 2 seçenek; minSelections/maxSelections tutarlı olmalı.

```json
{
  "options": {
    "choices": [
      { "id": "r1", "text": "A", "isCorrect": true },
      { "id": "r2", "text": "B", "isCorrect": true },
      { "id": "r3", "text": "C", "isCorrect": false }
    ]
  },
  "minSelections": 1,
  "maxSelections": 999,
  "shuffleChoices": true,
  "showFeedback": false,
  "scoringConfig": { "strategy": "PROPORTIONAL", "allowPartialCredit": true, "penaltyPerWrong": 0.25, "roundScore": false, "decimalPlaces": 2 }
}
```

---

### 2.4 TRUE_FALSE

- **Zorunlu**: `correctAnswer` dolu olmalı (örn. `"true"` veya `"false"`).

```json
{
  "optionList": {
    "questionText": "İsteğe bağlı soru metni",
    "correctAnswer": "true",
    "trueLabel": "True",
    "falseLabel": "False",
    "noGivenLabel": "NOT GİVEN"
  },
  "showFeedback": false,
  "scoringConfig": { "strategy": "BINARY", "allowPartialCredit": false, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

---

### 2.5 SHORT_ANSWER

- **Zorunlu**: `options.acceptableAnswers` en az bir eleman içermeli.
- **Validasyon**: minCharacters ≤ maxCharacters.

```json
{
  "options": {
    "acceptableAnswers": ["cevap1", "cevap2"],
    "caseSensitive": false,
    "exactMatch": false,
    "placeholder": "Cevabınızı yazın..."
  },
  "maxCharacters": 500,
  "minCharacters": 10,
  "trimWhitespace": true,
  "scoringConfig": { "strategy": "PROPORTIONAL", "allowPartialCredit": true, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

---

### 2.6 FILL_IN_THE_BLANKS

- **Zorunlu**: `textWithBlanks` ve `options.blanks`; metinde `{{BLANK_1}}`, `{{BLANK_2}}` gibi placeholder'lar, blank sayısı ile `blanks` dizisi uzunluğu eşleşmeli.
- **Validasyon**: En az bir blank tanımı.

```json
{
  "textWithBlanks": "Başkent {{BLANK_1}} ve para birimi {{BLANK_2}}.",
  "options": {
    "blanks": [
      { "blankId": "BLANK_1", "acceptableAnswers": "Ankara", "caseSensitive": false, "exactMatch": false },
      { "blankId": "BLANK_2", "acceptableAnswers": "TL", "caseSensitive": false, "exactMatch": false }
    ]
  },
  "caseSensitive": false,
  "exactMatch": false
}
```

`acceptableAnswers` backend'de string; virgülle ayrılmış alternatifler kullanılıyorsa backend tarafıyla netleştirilmelidir.

---

### 2.7 ORDERING

- **Validasyon**: En az 2, en fazla 20 öğe.

```json
{
  "options": {
    "items": [
      { "id": "i1", "text": "İlk adım", "correctPosition": 1 },
      { "id": "i2", "text": "İkinci adım", "correctPosition": 2 }
    ],
    "orderingType": "SEQUENTIAL"
  },
  "shuffleItems": true,
  "showFeedback": false,
  "scoringConfig": { "strategy": "POSITION_BASED", "allowPartialCredit": true, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

`orderingType`: `SEQUENTIAL`, `CHRONOLOGICAL`, `PRIORITY`.

---

### 2.8 MATCHING

- **Validasyon**: En az 2, en fazla 15 çift.

```json
{
  "options": {
    "pairs": [
      { "leftText": "Sol 1", "rightText": "Sağ 1" },
      { "leftText": "Sol 2", "rightText": "Sağ 2" }
    ]
  },
  "shuffleLeftItems": true,
  "shuffleRightItems": true,
  "showFeedback": false,
  "scoringConfig": { "strategy": "PROPORTIONAL", "allowPartialCredit": true, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

---

### 2.9 DRAG_AND_DROP

- **Zorunlu**: En az bir `draggableItems`, en az bir `dropZones`.
- **EMediaType**: `IMAGE`, `VIDEO`, `AUDIO`, `DOCUMENT`, `PDF`, `TEXT`, `LINK`, `OTHER`.

```json
{
  "options": {
    "draggableItems": [
      { "id": "d1", "text": "Öğe 1", "mediaUrl": null, "mediaType": null, "correctZones": [{ "id": "z1", "label": "Bölge A", "maxItems": 1, "feedback": null, "position": null }] }
    ],
    "dropZones": [
      { "id": "z1", "label": "Bölge A", "maxItems": 1, "feedback": null, "position": null }
    ]
  },
  "layout": "VERTICAL",
  "shuffleItems": true,
  "showFeedback": false,
  "scoringConfig": { "strategy": "PROPORTIONAL", "allowPartialCredit": true, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

`layout`: `VERTICAL`, `HORIZONTAL`, `GRID`, `CUSTOM`.

---

### 2.10 HOT_SPOT

- **Zorunlu**: `imageUrl` dolu olmalı (template seviyesinde validasyon buna bakıyor; options içinde `backgroundImageUrl` da kullanılıyor olabilir, ön yüzde ikisi de desteklenebilir).

```json
{
  "imageUrl": "https://...",
  "options": {
    "backgroundImageUrl": "https://...",
    "hotSpots": [
      { "id": "h1", "shape": "RECTANGLE", "coordinates": "{...}", "isCorrect": true, "label": "Doğru bölge" }
    ],
    "selectionType": "CLICK"
  },
  "maxSelections": 1,
  "allowMultipleSpots": false,
  "scoringConfig": { "strategy": "PROPORTIONAL", "allowPartialCredit": true, "penaltyPerWrong": 0.25, "roundScore": false, "decimalPlaces": 2 }
}
```

`shape`: `RECTANGLE`, `CIRCLE`, `POLYGON`. `selectionType`: `CLICK`, `DRAG_RECTANGLE`.

---

### 2.11 ESSAY

- **Zorunlu**: `prompt` dolu.
- **Validasyon**: minWords ≤ maxWords; minWords en az 10 önerilir.

```json
{
  "prompt": "Konu hakkında en az 200 kelimelik bir deneme yazın.",
  "minWords": 100,
  "maxWords": 1000,
  "requiredTopics": null,
  "gradingType": "MANUAL",
  "rubrik": null,
  "requireOutline": false,
  "allowedFormats": "HTML,MARKDOWN,PLAIN_TEXT",
  "scoringConfig": { "strategy": "MANUAL", "allowPartialCredit": false, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

`gradingType`: `MANUAL`, `AI`, `HYBRID`.

---

### 2.12 AUDIO_RESPONSE

- **Zorunlu**: `prompt` dolu.
- **Validasyon**: minRecordingDuration ≤ maxRecordingDuration; maxRecordingDuration ≤ 600 (10 dk).

```json
{
  "prompt": "Soruyu sesli yanıtlayın.",
  "maxRecordingDuration": 300,
  "minRecordingDuration": 5,
  "gradingType": "MANUAL",
  "criteria": null,
  "allowRetake": true,
  "maxRetakes": 3,
  "scoringConfig": { "strategy": "MANUAL", "allowPartialCredit": false, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

---

### 2.13 VIDEO_RESPONSE

- **Zorunlu**: `prompt` dolu.
- **Validasyon**: min ≤ max süre; maxRecordingDuration ≤ 1800 (30 dk).

```json
{
  "prompt": "Videoda yanıt verin.",
  "maxRecordingDuration": 600,
  "minRecordingDuration": 10,
  "gradingType": "MANUAL",
  "criteria": null,
  "allowRetake": true,
  "maxRetakes": 3,
  "requiredQuality": "720p",
  "scoringConfig": { "strategy": "MANUAL", "allowPartialCredit": false, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

`requiredQuality`: `480p`, `720p`, `1080p`.

---

### 2.14 IMAGE_RESPONSE

- **Zorunlu**: `prompt` dolu.
- **Validasyon**: maxImages ≤ 10; maxFileSize ≤ 10MB (10485760 byte).

```json
{
  "prompt": "İstenen çizimi yükleyin.",
  "maxFileSize": 5242880,
  "allowedFormats": "JPG,PNG,PDF",
  "gradingType": "MANUAL",
  "criteria": null,
  "allowMultipleImages": false,
  "maxImages": 1,
  "requiredResolution": "1024x768",
  "scoringConfig": { "strategy": "MANUAL", "allowPartialCredit": false, "penaltyPerWrong": 0.0, "roundScore": false, "decimalPlaces": 2 }
}
```

---

## 3. Question Objesi (API'den Dönen / Gönderilen)

- **id**, **name**, **questionType**, **orderNumber**, **maximumScore**
- **questionGroupId**: null ise standalone soru.
- **subject**, **difficulty** (EASY | MEDIUM | HARD), **difficultyLevel**, **category** (ECourseCategory), **courseSection**
- **curriculumContents**: ilişkili müfredat içerikleri
- **headers**: `QuestionGroupHeader` listesi (orderNumber, mediaType, content) — soru metni/başlık için
- **templateData**: Yukarıdaki tiplere göre JSON object
- **version**, **originalTemplateData**, **templateLockedAt**, **isTemplateLocked**

Ön yüzde: `questionType` ile hangi template yapısının kullanıldığını seçip, `templateData` ile render/editing yapılır.

---

## 4. API Endpoint'leri

Tüm endpoint'ler **`/api`** context path'i altındadır. Örnek: `POST /api/exam`, `GET /api/exams/questions/standalone`.

---

### 4.1 Exam (`/api/exam`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/exam` | Sınav oluştur. Body: `ExamCreateRequest` (name, code, category, examLevel, examType, timeLimitMinutes, passingScorePercentage, maxAttempts, shuffleQuestions, shuffleAnswers, allowBackward, showQuestionsOneAtTime, requireCompleteAttempt, resultsReleaseType, availableFrom, availableUntil, accessCode, requireProctoring). |
| PUT | `/api/exam/{examId}` | Sınav güncelle. Body: `ExamUpdateRequest` (name, examLevel, examType, timeLimitMinutes, passingScorePercentage, maxAttempts, shuffle*, allowBackward, resultsReleaseType, availableFrom, availableUntil, accessCode, requireProctoring). |
| DELETE | `/api/exam/{examId}` | Soft delete. |
| DELETE | `/api/exam/{examId}/hard` | Kalıcı silme. |
| GET | `/api/exam/{examId}` | Sınav detayı. |
| GET | `/api/exam/code/{code}` | Koda göre sınav. |
| GET | `/api/exam` | Tüm aktif sınavlar. |
| GET | `/api/exam/category/{category}` | Kategoriye göre sınavlar. |
| GET | `/api/exam/{examId}/with-user-data?userId=` | Sınav + kullanıcı cevap/puanlama verisi (userId opsiyonel). |
| POST | `/api/exam/{examId}/start?userId=` | Kullanıcı için sınav denemesi başlat. |
| GET | `/api/exam/{examId}/question-groups` | Sınava ait soru grupları (sıralı). |
| POST | `/api/exam/{examId}/question-groups` | Sınava soru grubu ekle. Body: `{ "questionGroupId": "id" }` veya `{ "questionGroupIds": ["id1","id2"] }`. |
| DELETE | `/api/exam/{examId}/question-groups/{questionGroupId}` | Sınavdan tek soru grubunu çıkar. |
| DELETE | `/api/exam/{examId}/question-groups` | Sınavdan birden fazla soru grubunu çıkar. Body: `{ "questionGroupIds": ["id1","id2"] }`. |

---

### 4.2 Question Group (`/api/exams/question-groups`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/exams/question-groups` | Soru grubu oluştur. Body: `QuestionGroupCreateRequest`: code (zorunlu, A-Z0-9_-), examId (opsiyonel), maximumScore, category, difficultyLevel, courseSection, usagePart, curriculumContentIds, headers (mediaType, content). |
| PUT | `/api/exams/question-groups/{groupId}` | Soru grubunu güncelle. Body: aynı request. |
| DELETE | `/api/exams/question-groups/{groupId}` | Soft delete. |
| DELETE | `/api/exams/question-groups/{groupId}/hard` | Kalıcı silme. |
| PATCH | `/api/exams/question-groups/{groupId}/reorder?examId=&orderNumber=` | Grubu bir sınav içindeki sırada değiştirir (examId zorunlu). |
| GET | `/api/exams/question-groups/{groupId}` | Grup detayı. |
| GET | `/api/exams/question-groups/exam/{examId}` | Bir sınava ait soru grupları. |
| GET | `/api/exams/question-groups?page=&size=&category=&code=&courseSection=&usagePart=&difficultyLevel=` | Sayfalı listeleme ve filtreleme. |

---

### 4.3 Question (`/api/exams/questions`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/exams/questions` | Soru oluştur. Body: `QuestionCreateRequest`: name, questionGroupId (opsiyonel; yoksa standalone), questionType, maximumScore, subject, difficulty, difficultyLevel, category, courseSection, curriculumContentIds, headers (orderNumber, mediaType, content), **templateData** (yukarıdaki tiplere uygun JSON). |
| PUT | `/api/exams/questions/{questionId}` | Soru güncelle. Body: aynı request. Kilitli soruda templateData değişmez. |
| POST | `/api/exams/questions/{questionId}/lock` | Soru template'ini kilitle (templateData artık değiştirilemez). |
| POST | `/api/exams/questions/group/{groupId}/lock-all` | Gruptaki tüm soruların template'ini kilitle. |
| DELETE | `/api/exams/questions/{questionId}` | Soft delete. |
| DELETE | `/api/exams/questions/{questionId}/hard` | Kalıcı silme. |
| PATCH | `/api/exams/questions/{questionId}/reorder?orderNumber=` | Sorunun gruptaki sırasını değiştir. |
| GET | `/api/exams/questions/standalone` | Gruba bağlı olmayan (standalone) sorular. |
| GET | `/api/exams/questions/{questionId}` | Soru detayı. |
| GET | `/api/exams/questions/group/{groupId}` | Bir gruba ait sorular. |
| GET | `/api/exams/questions/group/{groupId}/count` | Gruptaki soru sayısı. |

---

## 5. Ön Yüz İş Akışı Özeti

1. **Standalone soru**: `POST /api/exams/questions` ile `questionGroupId` göndermeden soru oluştur; `templateData` ilgili `questionType` şemasına uygun olsun.
2. **Soru grubu (exam'sız)**: `POST /api/exams/question-groups` (examId vermeden). Sonra `POST /api/exams/questions` ile `questionGroupId` vererek soruları ekle.
3. **Sınav oluşturma**: `POST /api/exam` ile sınav oluştur. `POST /api/exam/{examId}/question-groups` ile hazır grupları sınava ekle.
4. **Soru/grup sıralama**: Soru için `PATCH .../questions/{questionId}/reorder?orderNumber=`, grup için `PATCH .../question-groups/{groupId}/reorder?examId=&orderNumber=`.
5. **Template kilidi**: Cevap verildikten veya yayına alındıktan sonra `POST .../questions/{questionId}/lock` veya `POST .../questions/group/{groupId}/lock-all` ile template değişikliği kapatılır.
6. **Render**: `Question.headers` ile başlık/metin, `Question.questionType` + `Question.templateData` ile soru gövdesi ve cevap alanları render edilir; her tip için yukarıdaki JSON şemaları kullanılır.

Bu doküman, template verileri ve API'lerle ilgili ön yüz gereksinimlerini tek referansta toplar.
