# Backend talebi: Material / Quiz sorusu response alanları

**Amaç:** Öğrenci tarafında ders materyali içindeki quiz soruları açıldığında soru metni, header’lar (metin/görsel/video vb.) ve şablon verisi ekranda görünsün. Bu veriler API’den gelmezse frontend’de gösterilecek bir şey yok; bu yüzden aşağıdaki alanların **mutlaka** response’ta dönmesi gerekiyor.

---

## ✅ Karşılandı (2026-02-08)

Backend bu talebi karşıladı:

- **questionGroup.questions** artık material GET cevabında dolu (ek istek yok).
- **QuestionDetailDTO**: `templateData`, `headers` eklendi; `name` soru metni için kullanılıyor.
- **QuestionGroupDetailDTO**: `headers`, `questions` (her biri templateData ve headers ile).
- **Header**: `mediaType`, `content`, `orderNumber`.

Endpoint'ler: `GET /api/course-part-material/{id}`, `GET /api/course-part-material/`, `GET /api/course-part-material/part/{partId}`.

---

## Hangi endpoint?

Öğrenci için **course part material** (ders parçası materyali) dönen endpoint – muhtemelen:

- `GET /course-part-material/...` veya
- Lesson part / material detay dönen ve içinde **quizItems** (ve her item’da **question** / **questionGroup**) olan herhangi bir endpoint.

Yani response’ta şu yapı var:

```json
{
  "quizItems": [
    {
      "id": "...",
      "type": "QUESTION",
      "orderNumber": 0,
      "question": { ... }   // ← Bu obje aşağıdaki alanları içermeli
    },
    {
      "id": "...",
      "type": "QUESTION_GROUP",
      "orderNumber": 1,
      "questionGroup": {
        "headers": [ ... ],   // ← Grup header'ları
        "questions": [ { ... }, ... ]   // ← Her biri aşağıdaki soru objesi gibi olmalı
      }
    }
  ]
}
```

---

## 1. Tek soru: `question` objesinde olması gerekenler

Her **quiz item** `type: "QUESTION"` ise `question` alanı bir obje. Bu objede **mutlaka** olması gerekenler:

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|--------|----------|
| **id** | string | Evet | Soru ID. |
| **questionType** | string | Evet | Örn. `MULTIPLE_CHOICE`, `TRUE_FALSE`, `ESSAY`, `SHORT_ANSWER`, `FILL_IN_THE_BLANKS`, `MATCHING`, `ORDERING`, `MULTIPLE_RESPONSE`, `DRAG_AND_DROP`, `HOT_SPOT`, `AUDIO_RESPONSE`, `VIDEO_RESPONSE`, `IMAGE_RESPONSE`. |
| **templateData** | object veya string | Evet | Soru şablonunun verisi (seçenekler, boşluklar, eşleştirme çiftleri, vb.). JSON object veya stringify edilmiş JSON. |
| **headers** | array | Evet (en az boş array) | Soruya ait materyaller: metin, görsel, video, ses, doküman, link vb. Her eleman aşağıdaki header formatında. |
| **name** veya **questionText** | string | Evet (en az biri) | Soru metni (gövde). `headers` içinde TEXT varsa oradan da üretilebilir ama yine de tek bir “soru metni” için `name` veya `questionText` dönmek güvenli. |
| **maximumScore** | number | Hayır | Soru puanı. |

### 1.1. `headers` dizisinin eleman formatı

Her header objesi:

| Alan | Tip | Açıklama |
|------|-----|----------|
| **mediaType** | string | `TEXT` \| `IMAGE` \| `VIDEO` \| `AUDIO` \| `DOCUMENT` \| `PDF` \| `LINK` \| `OTHER` |
| **content** | string | Metin (TEXT için HTML/plain), görsel/video/ses/doküman için URL veya dosya yolu. |
| **orderNumber** | number | Sıralama (opsiyonel). |

Örnek:

```json
"headers": [
  { "mediaType": "TEXT", "content": "<p>Soru metni burada.</p>", "orderNumber": 0 },
  { "mediaType": "IMAGE", "content": "/uploads/diagram.png", "orderNumber": 1 }
]
```

---

## 2. Soru grubu: `questionGroup` objesinde olması gerekenler

`type: "QUESTION_GROUP"` ise `questionGroup` kullanılıyor. Grupta:

| Alan | Tip | Açıklama |
|------|-----|----------|
| **id** | string | Grup ID. |
| **code** / **name** | string | Grup adı. |
| **headers** | array | Gruba ait materyaller (yukarıdaki header formatında). |
| **questions** | array | Gruptaki her soru – **her biri** “Tek soru” maddesindeki gibi **id**, **questionType**, **templateData**, **headers**, **name**/ **questionText** içermeli. |

Yani gruptaki her `questions[i]` objesi de aynı şekilde `headers`, `templateData`, `name`/`questionText`, `questionType` içermeli.

---

## 3. Özet checklist (backend’e verilebilir)

- [x] Material/quiz response’ta her **question** objesinde: **id**, **questionType**, **templateData**, **headers** (en az `[]`), **name** veya **questionText** var mı?
- [x] **headers** içinde **mediaType** ve **content** her eleman için dolu mu?
- [x] **questionGroup** kullanılıyorsa: **headers** ve **questions** dönüyor mu, **questions** içindeki her eleman da yukarıdaki soru alanlarına sahip mi?
- [x] OpenAPI/şema tarafında **QuestionDetailDTO** (veya ilgili tip) bu alanları tanımlıyor mu? (headers, templateData, questionText/name)

Bu alanlar API’den gelmeden öğrenci ekranında soru gövdesi ve header’lar boş kalır; sistem doğru çalışması için backend’in bu response’u sağlaması gerekir.
