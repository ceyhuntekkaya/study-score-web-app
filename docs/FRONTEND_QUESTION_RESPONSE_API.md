# Soru Cevabı (Question Response) API – Ön Yüz Entegrasyonu

Bu doküman, öğrencinin bir soruya verdiği cevabın **kaydedilmesi** ve **cevapların listelenmesi** için kullanılacak API’leri ve veri formatlarını açıklar. Hem **sınav (Exam)** hem **ders materyali quiz (Course Lesson Part Material)** akışları aynı endpoint’leri kullanır.

---

## 1. Genel Mantık

- **Tek cevap kaynağı:** Tüm soru cevapları `question_responses` tablosunda tutulur; bağlam (context) ile ayrılır.
- **İki bağlam türü:**
  - **EXAM_ATTEMPT** – Soru bir sınav denemesi içinde cevaplanıyorsa (`examAttemptId` gerekli).
  - **COURSE_LESSON_PART_MATERIAL** – Soru bir ders materyali (quiz) içinde cevaplanıyorsa (`courseLessonPartMaterialId` ve `userId` gerekli).
- **Aynı soru, aynı bağlam:** Aynı kullanıcı + aynı soru + aynı deneme/materyal için tekrar gönderim **güncelleme** yapar; önceki cevap `oldAnswer` alanına eklenir.
- **Boş cevap:** `answerData` null veya boş gönderilirse kayıt yine oluşturulur/güncellenir; puan **0** atanır.
- **Otomatik puanlama:** Çoktan seçim, doğru/yanlış, kısa cevap, çoklu seçim, boşluk doldurma gibi net cevaplı tipler otomatik puanlanır. Açık uçlu (deneme, ses/video/görsel cevap) tipler manuel puanlama bekler.

**Base URL:** Tüm endpoint’ler `/api` context path’i altındadır (örn. `POST https://<host>/api/question-responses`).

---

## 2. Cevap Kaydetme / Güncelleme

**Endpoint:** `POST /api/question-responses`  
**Content-Type:** `application/json`

### 2.1 Request body (QuestionResponseRequest)

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|--------|----------|
| `userId` | string | Evet | Cevabı veren kullanıcı (öğrenci) ID. |
| `questionId` | string | Evet | Soru ID. |
| `contextType` | string | Evet | `"EXAM_ATTEMPT"` veya `"COURSE_LESSON_PART_MATERIAL"`. |
| `examAttemptId` | string | contextType = EXAM_ATTEMPT ise | Sınav denemesi ID. |
| `courseLessonPartMaterialId` | string | contextType = COURSE_LESSON_PART_MATERIAL ise | Ders materyali (quiz) ID. |
| `questionGroupId` | string | Hayır | Soru bir soru grubunda ise grup ID (bilgi amaçlı saklanır). |
| `answerData` | object / string / null | Hayır | Cevap verisi. **null veya boş = soru boş bırakıldı** (kayıt oluşur, puan 0). Soru tipine göre aşağıdaki formatlar kullanılır. |
| `timeSpentSeconds` | number | Hayır | Soruda geçen süre (saniye). |

### 2.2 answerData formatları (soru tipine göre)

Backend otomatik puanlama için aşağıdaki anahtarları kullanır. Ön yüz bu isimleri kullanırsa puan anında döner.

| Soru tipi | answerData örnek yapı | Açıklama |
|-----------|------------------------|----------|
| **MULTIPLE_CHOICE** | `{ "selectedChoiceId": "opt2" }` veya `{ "choiceId": "opt2" }` | Seçilen şıkkın `id` değeri (template’teki `options.choices[].id`). |
| **TRUE_FALSE** | `{ "answer": "true" }` veya `{ "value": "true" }` | `"true"` veya `"false"` (template’teki `correctAnswer` ile karşılaştırılır). |
| **SHORT_ANSWER** | `{ "answer": "Ankara" }` veya `{ "text": "Ankara" }` | Metin cevap (template’teki `acceptableAnswers` ve `caseSensitive` kullanılır). |
| **MULTIPLE_RESPONSE** | `{ "selectedIds": ["r1","r2"] }` veya `{ "choiceIds": ["r1","r2"] }` | Seçilen şıkların `id` listesi. |
| **FILL_IN_THE_BLANKS** | `{ "blanks": { "BLANK_1": "Ankara", "BLANK_2": "TL" } }` | Her boşluk ID’si için verilen cevap (template’teki `options.blanks[].blankId` ile eşleşmeli). |
| **ESSAY / AUDIO_RESPONSE / VIDEO_RESPONSE / IMAGE_RESPONSE** | Serbest (metin, URL, vb.) | Otomatik puan yok; `requiresManualGrading: true` döner, puan sonradan öğretmen tarafından girilir. |

Diğer tipler (MATCHING, ORDERING, DRAG_AND_DROP, HOT_SPOT) şu an backend’de otomatik puanlanmıyor; cevap kaydedilir, puanlama manuel veya ileride eklenebilir.

### 2.3 Response (QuestionResponseResponse) – 200 OK

```json
{
  "id": "response-uuid",
  "questionId": "question-uuid",
  "contextType": "EXAM_ATTEMPT",
  "examAttemptId": "attempt-uuid",
  "courseLessonPartMaterialId": null,
  "questionGroupId": "group-uuid",
  "answerData": { "selectedChoiceId": "opt2" },
  "oldAnswer": null,
  "feedback": null,
  "gradingStatus": "GRADED",
  "scoreEarned": 5.0,
  "maximumScore": 5.0,
  "scorePercentage": 100.0,
  "isCorrect": true,
  "isPartiallyCorrect": false,
  "answeredAt": "2025-02-12T14:30:00",
  "timeSpentSeconds": 45,
  "requiresManualGrading": false,
  "gradedAt": "2025-02-12T14:30:00",
  "answerChangedCount": 1
}
```

| Alan | Açıklama |
|------|----------|
| `oldAnswer` | Önceki cevapların metin olarak biriktirildiği alan; her güncellemede bir önceki cevap buraya eklenir. |
| `feedback` | Öğretmenin yazacağı yorum (manuel puanlama sonrası doldurulur). |
| `gradingStatus` | `PENDING`, `GRADED`, `AUTO_GRADED`, `MANUALLY_GRADED`, `FAILED_TO_GRADE`. |
| `requiresManualGrading` | `true` ise henüz puan verilmemiş (açık uçlu soru vb.). |

### 2.4 Hata yanıtları

- **400 Bad Request:** Eksik/hatalı parametre (örn. `contextType=EXAM_ATTEMPT` ama `examAttemptId` yok). Body: `{ "success": false, "error": "..." }`.
- **404 Not Found:** `userId`, `questionId`, `examAttemptId` veya `courseLessonPartMaterialId` bulunamadı. Body: `{ "success": false, "error": "..." }`.

---

## 3. Cevapları Listeleme (Öğrenci Cevaplarını Alma)

**Endpoint:** `GET /api/question-responses`  
**Content-Type:** Yanıt `application/json`.

İki kullanım şekli vardır; **query parametreleri** ile seçilir.

### 3.1 Sınav denemesi cevapları (Exam)

Aynı denemedeki tüm soru cevaplarını getirir (soru sırasına göre).

**Query parametreleri:**

| Parametre | Zorunlu | Değer |
|-----------|--------|-------|
| `contextType` | Evet | `EXAM_ATTEMPT` |
| `examAttemptId` | Evet | Deneme ID |

**Örnek:**  
`GET /api/question-responses?contextType=EXAM_ATTEMPT&examAttemptId=<attemptId>`

**Yanıt:** `200 OK` – Yukarıdaki **QuestionResponseResponse** nesnelerinden oluşan **dizi**.

```json
[
  {
    "id": "resp-1",
    "questionId": "q1",
    "contextType": "EXAM_ATTEMPT",
    "examAttemptId": "attempt-1",
    "answerData": { "selectedChoiceId": "opt2" },
    "oldAnswer": null,
    "feedback": null,
    "gradingStatus": "GRADED",
    "scoreEarned": 5.0,
    "maximumScore": 5.0,
    "scorePercentage": 100.0,
    "isCorrect": true,
    "isPartiallyCorrect": false,
    "answeredAt": "2025-02-12T14:30:00",
    "timeSpentSeconds": 45,
    "requiresManualGrading": false,
    "gradedAt": "2025-02-12T14:30:00",
    "answerChangedCount": 1
  }
]
```

### 3.2 Ders materyali (quiz) cevapları (Material)

Belirli bir kullanıcının, belirli bir materyaldeki tüm soru cevaplarını getirir.

**Query parametreleri:**

| Parametre | Zorunlu | Değer |
|-----------|--------|-------|
| `contextType` | Evet | `COURSE_LESSON_PART_MATERIAL` |
| `courseLessonPartMaterialId` | Evet | Materyal ID |
| `userId` | Evet | Kullanıcı ID |

**Örnek:**  
`GET /api/question-responses?contextType=COURSE_LESSON_PART_MATERIAL&courseLessonPartMaterialId=<materialId>&userId=<userId>`

**Yanıt:** `200 OK` – Aynı response nesnelerinden oluşan **dizi**.

### 3.3 Geçersiz parametre

Eksik veya yanlış parametre kombinasyonunda **400 Bad Request** döner; body’de hata mesajı yer alır:  
`"Use contextType=EXAM_ATTEMPT with examAttemptId, or contextType=COURSE_LESSON_PART_MATERIAL with courseLessonPartMaterialId and userId"`

---

## 4. Sınav Ekranında Cevaplar (Exam + User Data)

Sınav sayfasında sadece cevapları değil, sınav yapısı + deneme bilgisi + her soru için cevabı birlikte almak için mevcut endpoint kullanılır; cevaplar artık **QuestionResponse** (question_responses) kaynaklıdır.

**Endpoint:** `GET /api/exam/{examId}/with-user-data?userId=<userId>`

Yanıtta her soru için `userAnswer` alanı, yukarıdaki cevap bilgisini (answerData, oldAnswer, feedback, puan, gradingStatus vb.) içerir. Detay için mevcut **Exam With User Data** dokümantasyonuna bakılabilir; alan anlamları bu dokümandaki **UserAnswerInfo** ile uyumludur (answerId, answerData, oldAnswer, feedback, scoreEarned, maximumScore, gradingStatus, requiresManualGrading, vb.).

---

## 5. Ön Yüz Akış Önerileri

### 5.1 Sınav (Exam) akışı

1. Sınavı başlat: `POST /api/exam/{examId}/start?userId=...` → `attemptId` alınır.
2. Sınav + sorular + mevcut cevaplar: `GET /api/exam/{examId}/with-user-data?userId=...` → Sorular ve varsa `userAnswer` doldurulur.
3. Öğrenci bir soruya cevap verince/güncelleyince:  
   `POST /api/question-responses`  
   Body: `userId`, `questionId`, `contextType: "EXAM_ATTEMPT"`, `examAttemptId`, (isteğe bağlı `questionGroupId`), `answerData`, (isteğe bağlı `timeSpentSeconds`).
4. Cevapları ayrı listelemek gerekirse:  
   `GET /api/question-responses?contextType=EXAM_ATTEMPT&examAttemptId=...`

### 5.2 Ders materyali (Quiz) akışı

1. Materyal + sorular: Mevcut course/lesson/material API’leri ile materyal ve içindeki sorular (quiz items) alınır.
2. Öğrenci bir soruya cevap verince:  
   `POST /api/question-responses`  
   Body: `userId`, `questionId`, `contextType: "COURSE_LESSON_PART_MATERIAL"`, `courseLessonPartMaterialId`, (isteğe bağlı `questionGroupId`), `answerData`, (isteğe bağlı `timeSpentSeconds`).
3. O materyaldeki kullanıcı cevaplarını listelemek için:  
   `GET /api/question-responses?contextType=COURSE_LESSON_PART_MATERIAL&courseLessonPartMaterialId=...&userId=...`

### 5.3 Boş bırakma / silme

Cevabı “boş” yapmak için aynı `POST /api/question-responses` çağrılır; `answerData: null` veya boş string/object gönderilir. Kayıt güncellenir, puan 0 atanır.

### 5.4 Cevap değişikliği ve oldAnswer

Aynı (userId, questionId, context) için ikinci ve sonraki kayıtlarda önceki cevap otomatik olarak `oldAnswer` alanına eklenir. Ön yüzde “önceki cevap” göstermek için response’taki `oldAnswer` kullanılabilir.

---

## 6. Kısa Referans

| İşlem | Method | URL | Önemli body/param |
|-------|--------|-----|--------------------|
| Cevap kaydet/güncelle | POST | `/api/question-responses` | userId, questionId, contextType, examAttemptId **veya** courseLessonPartMaterialId, answerData |
| Exam cevaplarını listele | GET | `/api/question-responses?contextType=EXAM_ATTEMPT&examAttemptId=<id>` | - |
| Material cevaplarını listele | GET | `/api/question-responses?contextType=COURSE_LESSON_PART_MATERIAL&courseLessonPartMaterialId=<id>&userId=<id>` | - |
| Sınav + deneme + cevaplar | GET | `/api/exam/{examId}/with-user-data?userId=<id>` | - |

---

## 7. Course content (Material) – Önceki cevaplar ne zaman ve nereden çekiliyor?

**Bağlam:** Öğrenci ders içeriğinde (course content) bir **materyal** açtığında, o materyal **quiz** ise sorular `QuizItemsRenderer` ile render edilir. Exam yok; bağlam **COURSE_LESSON_PART_MATERIAL**.

### 7.1 Kullanılan API

| Ne | API | Parametreler |
|----|-----|--------------|
| **Önceki cevapları yükleme** | `GET /api/question-responses` | `contextType=COURSE_LESSON_PART_MATERIAL`, `courseLessonPartMaterialId=<materialId>`, `userId=<userId>` |
| **Cevap kaydetme** | `POST /api/question-responses` | Body: `userId`, `questionId`, `contextType: "COURSE_LESSON_PART_MATERIAL"`, `courseLessonPartMaterialId`, `answerData` |

### 7.2 Ön yüzde nerede ve ne zaman çağrılıyor?

- **Bileşen:** `QuizItemsRenderer` (`src/components/learner/content/QuizItemsRenderer.tsx`).
- **Materyal ID:** `MaterialRenderer` quiz materyalini render ederken `courseLessonPartMaterialId={material.id}` geçirir (yani **course lesson part material** kaydının ID’si).
- **Cevap yükleme (GET):**
  - Hook: `useQuestionResponsesForMaterial(courseLessonPartMaterialId, userId)` (`src/services/api/questionResponseService.ts`).
  - Çağrı: `QuizItemsRenderer` mount olduğunda, `courseLessonPartMaterialId` ve `userId` doluysa istek atılır.
  - Sonuç: Dönen dizi (veya `{ content: [] }` ise `content`) `responsesList` yapılır; her eleman için `questionId` → `answerData` eşlemesi `responseByQuestionId` Map’ine yazılır (`getUserAnswerFromResponse(item)` = `item.answerData`).
- **Soru–cevap eşlemesi:** Her soru için kayıtlı cevap şu ID ile aranır: **`question.id ?? question.questionId`** (`getEffectiveQuestionId`). Yani GET yanıtındaki her kayıtta **`questionId`** alanı, frontend’in kullandığı bu ID ile **aynı** olmalıdır (kaydetme sırasında da aynı `questionId` gönderiliyor).

### 7.3 Backend’in döndürmesi gereken format (Material cevapları)

- **GET** yanıtı: **QuestionResponseResponse** nesnelerinden oluşan **dizi** (veya sayfalı yapıda `content` dizisi). Her nesnede en az:
  - **`questionId`** – Frontend’in soru için kullandığı ID ile birebir aynı (kaydederken POST body’de gönderilen `questionId`).
  - **`answerData`** – Kaydedilen cevap (soru tipine göre obje; örn. essay için `{ essayText, wordCount, format, outline? }`).

Ön yüz hem doğrudan dizi hem de `{ content: [...] }` formatını kabul eder; backend bunlardan birini dönebilir.

### 7.4 Olası hatalar (kontrol listesi)

1. **Cevaplar hiç gelmiyorsa:** GET’e giden `courseLessonPartMaterialId` ve `userId` doğru mu? Backend bu parametrelerle `question_responses` tablosunda kayıt dönüyor mu?
2. **Cevaplar kaydediliyor ama sayfa yenilenince görünmüyorsa:** GET yanıtındaki her kayıtta **`questionId`**, POST ile kaydederken gönderilen **`questionId`** ile aynı mı? (Frontend `question.id` veya `question.questionId` kullanıyor; backend’in döndürdüğü `questionId` bunlardan biri olmalı.)
3. **Yanlış soruya cevap görünüyorsa:** Aynı materyal içinde `questionId`’ler benzersiz mi? Çakışma var mı?

---

Soru şablonları (templateData) ve soru tipleri için: **EXAM_QUESTION_TEMPLATES_AND_API_REFERENCE.md** ve **TEMPLATE_DATA_FRONTEND_REFERENCE.md** dokümanlarına bakılabilir.
