# Exam, ExamPart, ExamItem – API Referansı (Ön Yüz Geliştiricileri)

Bu dokümanda sınav (Exam), sınav bölümü (ExamPart) ve sınav öğesi (ExamItem) ilişkisi ile ilgili tüm ekleme, çıkarma ve silme endpoint’leri özetlenmiştir.

**Base path:** `GET/POST/PUT/DELETE` için prefix: **`/exam`**  
(Örnek: `POST /exam` → sınav oluşturma, `GET /exam/{examId}/parts` → sınavın bölümlerini listeleme)

---

## 1. İlişki modeli

```
Exam (Sınav)
  └── ExamPart[] (Bölümler: Speaking, Writing, vb.)
        └── ExamItem[] (Öğeler: soru grubu veya tek soru)
```

- **Exam:** Tek bir sınav (ad, kod, kategori, tip, ayarlar).
- **ExamPart:** Sınavın bölümü (ör. "Speaking", "Writing"). Her bölümün `name` ve `orderNumber` değeri vardır.
- **ExamItem:** Bir bölüm içindeki tek öğe. Ya bir **soru grubu** (QUESTION_GROUP) ya da **tek soru** (QUESTION) olur. Her item mutlaka bir `ExamPart`’a aittir; part olmadan item eklenemez.

**Önemli:** Sınava soru veya soru grubu **doğrudan** eklenemez/çıkarılamaz. Tüm içerik yalnızca **ExamPart** (bölüm) ve **ExamItem** (öğe) üzerinden yönetilir. Listeleme de `GET /exam/{examId}/parts` ve `GET /exam/{examId}/items` ile yapılır. Item eklerken her zaman `examPartId` gönderilmelidir.

---

## 2. Ortak response / hata formatı

- **Başarılı işlem (çoğu POST):** İlgili entity objesi döner (Exam, ExamPart, ExamItem).
- **Başarılı silme / güncelleme (mesajlı):** `{ "success": true, "message": "..." }`
- **Hata:** `{ "success": false, "error": "Hata mesajı" }`
- **HTTP durumları:** `200` OK, `201` Created, `400` Bad Request, `404` Not Found, `500` Internal Server Error

---

## 3. Exam (Sınav) endpoint’leri

| Metod | Path | Açıklama |
|--------|------|----------|
| **POST** | `/exam` | Sınav oluştur |
| **PUT** | `/exam/{examId}` | Sınav güncelle |
| **GET** | `/exam/{examId}` | Tek sınav getir |
| **GET** | `/exam` | Tüm aktif sınavları listele |
| **GET** | `/exam/code/{code}` | Koda göre sınav getir |
| **GET** | `/exam/category/{category}` | Kategoriye göre sınavları listele |
| **DELETE** | `/exam/{examId}` | Sınavı sil (soft) |
| **DELETE** | `/exam/{examId}/hard` | Sınavı kalıcı sil |

**POST /exam – Body (ExamCreateRequest):**  
`name`, `code`, `category`, `examLevel` (opsiyonel), `examType` (opsiyonel), `configuration` (opsiyonel)

**PUT /exam/{examId} – Body (ExamUpdateRequest):**  
Güncellenecek alanlar (örn. `name`, `code`, `category`, `examLevel`, `examType`, `configuration`)

**GET /exam/{examId} – Response:**  
Exam objesi: `id`, `name`, `code`, `category`, `examLevel`, `examType`, `configuration`, `examParts` (liste), `createdAt`, `status`, vb.

---

## 4. ExamPart (Sınav bölümü) endpoint’leri

| Metod | Path | Açıklama |
|--------|------|----------|
| **GET** | `/exam/{examId}/parts` | Sınavın tüm bölümlerini sırayla listele |
| **POST** | `/exam/{examId}/parts` | Yeni bölüm ekle |
| **DELETE** | `/exam/{examId}/parts/{examPartId}` | Bölümü sil (içinde item varsa 400) |

### GET `/exam/{examId}/parts`

**Response:** `ExamPart[]`

Her eleman örneği:
```json
{
  "id": "uuid",
  "name": "Speaking",
  "orderNumber": 1,
  "examItems": [ ... ],
  "createdAt": "...",
  "status": "ACTIVE"
}
```

### POST `/exam/{examId}/parts`

**Request body:**
```json
{
  "name": "Writing",
  "orderNumber": 2
}
```
- `name`: **Zorunlu.** Bölüm adı (örn. "Speaking", "Writing").
- `orderNumber`: Opsiyonel. Verilmezse bölüm listenin sonuna eklenir.

**Response:** `201 Created` + oluşturulan `ExamPart` objesi.

**Hatalar:**  
- `400`: name boş.  
- `404`: examId geçersiz.

### DELETE `/exam/{examId}/parts/{examPartId}`

Bölümü siler. Bölümde en az bir item varsa **400** döner: *"Cannot delete exam part that contains items. Remove items first."*

**Response:** `200` + `{ "success": true, "message": "Exam part deleted" }`

**Hatalar:**  
- `400`: Bölümde item var.  
- `404`: Bölüm veya sınav bulunamadı.

---

## 5. ExamItem (Sınav öğesi) endpoint’leri

| Metod | Path | Açıklama |
|--------|------|----------|
| **GET** | `/exam/{examId}/items` | Sınavın tüm item’larını getir (önce part sırası, sonra item sırası) |
| **POST** | `/exam/{examId}/items` | Sınavın bir bölümüne item ekle (soru grubu veya tek soru) |
| **DELETE** | `/exam/{examId}/items/{examItemId}` | Item’ı sınavdan kaldır |

### GET `/exam/{examId}/items`

**Response:** `ExamItem[]` (part order, sonra item order).

Her eleman örneği:
```json
{
  "id": "uuid",
  "examPart": { "id": "...", "name": "Speaking", "orderNumber": 1 },
  "itemType": "QUESTION_GROUP",
  "questionGroup": { "id": "...", "code": "..." },
  "question": null,
  "orderNumber": 1,
  "score": 10.0,
  "createdAt": "...",
  "status": "ACTIVE"
}
```
- `itemType`: `"QUESTION_GROUP"` veya `"QUESTION"`.
- Soru grubu item’ında `questionGroup` dolu, `question` null.
- Tek soru item’ında `question` dolu, `questionGroup` null.

### POST `/exam/{examId}/items`

**Request body (ExamAddItemRequest):**
```json
{
  "itemType": "QUESTION_GROUP",
  "questionGroupId": "uuid-of-question-group",
  "examPartId": "uuid-of-exam-part",
  "orderNumber": 1,
  "score": 10.0
}
```
veya tek soru için:
```json
{
  "itemType": "QUESTION",
  "questionId": "uuid-of-question",
  "examPartId": "uuid-of-exam-part",
  "orderNumber": 2,
  "score": 2.5
}
```

| Alan | Zorunlu | Açıklama |
|------|--------|----------|
| `itemType` | Evet | `"QUESTION_GROUP"` veya `"QUESTION"` |
| `questionGroupId` | itemType=QUESTION_GROUP ise | Soru grubunun id’si |
| `questionId` | itemType=QUESTION ise | Sorunun id’si |
| `examPartId` | Evet | Item’ın ekleneceği bölümün id’si |
| `orderNumber` | Hayır | Verilmezse bölümün sonuna eklenir |
| `score` | Hayır | Ondalıklı puan |

**Response:** `201 Created` + oluşturulan `ExamItem` objesi.

**Hatalar:**  
- `400`: Eksik/yanlış alan, aynı grup/soru zaten sınavda.  
- `404`: examId, examPartId, questionGroupId veya questionId geçersiz.

### DELETE `/exam/{examId}/items/{examItemId}`

Item’ı sınavdan kaldırır (silme; bir daha o sınavda görünmez).

**Response:** `200` + `{ "success": true, "message": "Item removed from exam" }`

**Hatalar:**  
- `404`: examItemId veya examId eşleşmiyor / bulunamadı.

---

## 6. Örnek akışlar (ön yüz için)

### Sınav + bölümler + item’lar (tam kontrol)

1. **Sınav oluştur:** `POST /exam` (name, code, category, vb.).
2. **Bölümleri oluştur:**  
   `POST /exam/{examId}/parts` → `{ "name": "Speaking", "orderNumber": 1 }`  
   `POST /exam/{examId}/parts` → `{ "name": "Writing", "orderNumber": 2 }`
3. **Bölümleri listele:** `GET /exam/{examId}/parts` → part id’leri alınır.
4. **Item ekle (soru grubu):**  
   `POST /exam/{examId}/items` → `{ "itemType": "QUESTION_GROUP", "questionGroupId": "...", "examPartId": "<Speaking part id>" }`
5. **Item ekle (tek soru):**  
   `POST /exam/{examId}/items` → `{ "itemType": "QUESTION", "questionId": "...", "examPartId": "<Writing part id>" }`
6. **Sınav yapısını göstermek:** `GET /exam/{examId}/items` (veya `GET /exam/{examId}/parts` ile part’lar ve her part’ın item’ları).
7. **Item çıkarmak:** `DELETE /exam/{examId}/items/{examItemId}`.
8. **Bölüm silmek (içi boşsa):** `DELETE /exam/{examId}/parts/{examPartId}`.



---

## 7. Enum değeri

- **itemType:** `"QUESTION_GROUP"` | `"QUESTION"`  
  (Item’ın bir soru grubu mu yoksa tek soru mu olduğunu belirtir.)

Bu dokümandaki endpoint’ler ve body’ler, mevcut backend ile uyumludur; ön yüz bu akışlara göre ekleme, çıkarma ve silme işlemlerini uygulayabilir.
