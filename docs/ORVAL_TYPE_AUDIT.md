# ORVAL Tip Kullanım Denetimi

Bu doküman, projede ORVAL ile üretilen tipler yerine manuel tip tanımlarının kullanıldığı yerleri ve ORVAL tiplerine geçiş durumunu özetler. Amaç: Entity’lerde değişiklik olduğunda tip üzerinden ulaşabilmek; bu yüzden mümkün olan her yerde ORVAL tipleri kullanılmalı.

## 1. ORVAL ile Değiştirilen Yerler (Düzeltildi)

| Dosya | Eski tip | Yeni tip (ORVAL) |
|-------|----------|-------------------|
| `app/(protected)/admin/dashboard/exams/page.tsx` | `type Exam` (yerel) | `Exam` (openAPIDefinition.schemas) |
| `components/admin/ExamPartsManager.tsx` | `ExamPartDto`, `ExamItemDto` | `ExamPart`, `ExamItem` |
| `app/(protected)/admin/dashboard/exams/[id]/question-groups/page.tsx` | `QuestionGroup`, `Question` (yerel) | `QuestionGroup`, `Question` (schemas) |
| `components/learner/exam/HeaderRenderer.tsx` | `Header` (yerel) | `QuestionHeaderDetailDTO` |
| `components/admin/CourseLessonsAccordion.tsx` | `LessonLevel` (yerel union) | `CourseLessonDetailDTOLessonLevel` |
| `components/learner/exam/questions/QuestionRenderer.tsx` | `Question` (yerel) | ORVAL `Question` (id) tabanlı + questionType, questionText, templateData?: unknown, userAnswer, mode, aiReady |
| `app/(protected)/admin/dashboard/questions/page.tsx` | `QuestionGroupRow`, `QuestionRow` | `QuestionGroup`, `Question` (schemas) |
| `app/(protected)/admin/dashboard/question-groups/page.tsx` | `QuestionGroupRow` (yerel) | `QuestionGroup` + `QuestionGroupRow = QuestionGroup & { examId?, examName? }` (liste endpoint ek alanları) |
| `app/(protected)/admin/dashboard/questions/page.tsx` | (gruplar için examName) | `QuestionGroupOption = QuestionGroup & { examName? }` (liste endpoint ek alanı) |

## 2. Özel Tip Kalması Gereken Yerler (Gerekçeli)

### 2.1 Dashboard (Learner)
- **Dosyalar:** `app/(protected)/learner/dashboard/page.tsx`, `ActiveCourseCard.tsx`, `ActiveExamCard.tsx`, `OverallStatsCard.tsx`, `reviews/page.tsx`, `wishlist/page.tsx`
- **Tipler:** `ActiveCourseInfo`, `ActiveExamInfo`, `OverallStats`, `DashboardData`, `DashboardStats`, `ReviewFromTeacher`
- **Gerekçe:** ORVAL’da `GetDashboard200 = { [key: string]: unknown }`; backend bu endpoint için şema tanımlamıyor. Backend düzgün response şeması verene kadar bu tipler kalmalı.

### 2.2 Template / Nested JSON tipleri
- **Dosyalar:** `TrueFalseQuestion.tsx`, `ShortAnswerQuestion.tsx`, `DragAndDropQuestion.tsx`, `MatchingQuestion.tsx`, `FillInTheBlanksQuestion.tsx`, `EssayQuestion.tsx`, `MultipleChoiceQuestion.tsx`, `MultipleResponseQuestion.tsx`, `OrderingQuestion.tsx`, `HotSpotQuestion.tsx`, `ImageResponseQuestion.tsx`, `AudioResponseQuestion.tsx`, `VideoResponseQuestion.tsx`, ilgili template formları
- **Tipler:** `TrueFalseTemplateData`, `ShortAnswerTemplateData`, `DragAndDropTemplateData`, vb.
- **Gerekçe:** `template.md` ve ORVAL dokümantasyonunda belirtildiği gibi ORVAL nested JSON objeleri için tip üretmeyebilir; bu alanlar genelde `templateData` içinde serileşiyor. Bu tipler manuel kalmalı.

### 2.3 UI / View model tipleri (API entity değil)
- **CourseGridSection.tsx:** `Course` – Kart için view model (image, title, lessons, students, rating, author, currentPrice). ORVAL `Course` entity’den farklı; sunum katmanı tipi. İsim karışıklığını önlemek için ileride `CourseCardData` gibi yeniden adlandırılabilir.
- **CourseContentSection.tsx:** `Lesson`, `CourseSection` – Sayfa yapısına özel bölüm tipleri.
- **EntityForm.tsx:** `EntityType` (string union), `EntityData = Brand | Campus | Institution | Branch` – Zaten ORVAL tiplerini kullanıyor; sadece union/alias.
- **HeaderEditor.tsx:** `HeaderItem = QuestionHeaderRequest | (HeaderRequest & { orderNumber? })` – ORVAL tiplerine dayalı; ek alan sadece UI için.

### 2.4 Diğer
- **students/page.tsx:** `Student` – Backend’de “student” listesi için ayrı bir DTO/entity varsa ORVAL’da olabilir; şu an listeleme endpoint’i farklı bir modele dönüyorsa bu tip kalır.
- **QuizItemsRenderer.tsx:** `NormalizedHeader` – Header’ların quiz bağlamında normalize edilmiş hali; ORVAL’dan türetilebilir ama hesaplanmış şekil.
- **types/ui/table.ts:** `RecordType` – Orval entity’leriyle uyumlu olacak şekilde esnek bırakılmış; değiştirmeye gerek yok.
- **questionResponseService.ts:** Orval tiplerini re-export ediyor; ek tip yok, uyumlu.

## 3. ORVAL Şema Kaynağı

- Tipler: `src/generated/api/openAPIDefinition.schemas.ts`
- Hook’lar ve endpoint’ler: `src/generated/api/*/` altındaki controller dosyaları

Backend’de entity veya DTO değişikliği yapıldığında:
1. OpenAPI spec güncellenir
2. `npm run generate:api` (orval) çalıştırılır
3. Artık ORVAL kullanan tüm sayfalar ve bileşenler yeni tiplere otomatik yansır.

## 4. Özet

- **ORVAL’a geçirilen:** Exam, ExamPart, ExamItem, QuestionGroup, Question (admin listeleri ve renderer), Header (soru header’ı), LessonLevel (accordion).
- **Bilerek özel kalan:** Dashboard response tipleri (backend şema vermiyor), templateData nested tipleri, UI/view model tipleri (Course kartı, bölüm tipleri vb.).
- **Sonuç:** Entity değişikliklerinde ORVAL kullanan yerler tip üzerinden güncellenir; sadece gerçekten gerekli yerlerde özel tip kullanılıyor.
