# templateData – Frontend Referans Dokümanı

Bu doküman, soru oluşturma/güncelleme ve sınav cevaplama akışında kullanılan **templateData** alanının tüm kullanım yerlerini, soru tiplerine göre JSON şemasını ve backend validasyon kurallarını frontend geliştiriciler için açıklar.

---

## 1. templateData nerede kullanılır?

| Kullanım | Açıklama |
|----------|----------|
| **Soru oluşturma** | `POST` (veya ilgili create endpoint) ile gönderilen `QuestionCreateRequest` içinde `questionType` + `templateData` zorunludur. |
| **Soru güncelleme** | `templateData` gönderilirse backend tarafında validate edilir; template kilitli değilse güncellenir. |
| **Soru/cevap okuma** | Soru detayı veya sınav cevap ekranında `templateData` API’den **parse edilmiş obje** (JSON değil) olarak döner; frontend doğrudan kullanır. |

**Önemli:** Her sorunun tek bir `questionType` değeri vardır. Gönderdiğiniz `templateData` objesi, aşağıdaki ilgili soru tipine ait yapıyla **bire bir uyumlu** olmalıdır.

---

## 2. Soru tipleri (questionType)

Backend enum değerleri (API’de string olarak kullanın):

```
MULTIPLE_CHOICE
TRUE_FALSE
FILL_IN_THE_BLANKS
SHORT_ANSWER
MATCHING
ESSAY
ORDERING
MULTIPLE_RESPONSE
HOT_SPOT
DRAG_AND_DROP
AUDIO_RESPONSE
VIDEO_RESPONSE
IMAGE_RESPONSE
```

---

## 3. Ortak yapı: ScoringConfig

Birçok template’te kullanılır. İsteğe bağlı; gönderilmezse backend varsayılan değerler kullanır.

| Alan | Tip | Varsayılan | Açıklama |
|------|-----|------------|----------|
| `strategy` | string | `"BINARY"` | `BINARY`, `PROPORTIONAL`, `POSITION_BASED`, `MANUAL`, `HYBRID` |
| `allowPartialCredit` | boolean | `false` | Kısmi puan verilsin mi |
| `penaltyPerWrong` | number | `0.0` | 0.0–1.0; yanlış cevap başına kesinti oranı |
| `roundScore` | boolean | `false` | Puan yuvarlansın mı (örn. 0.5 → 1) |
| `decimalPlaces` | number | `2` | Puan ondalık basamak sayısı |

---

## 4. Soru tipine göre templateData şeması

### 4.1 MULTIPLE_CHOICE

Tek doğru cevap. Seçeneklerde sadece `id`, `text`, `isCorrect` vardır.

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
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `options.choices` | array | Evet | En az 2, en fazla 10 seçenek |
| `options.choices[].id` | string | Hayır | Benzersiz önerilir |
| `options.choices[].text` | string | Evet | Boş olamaz |
| `options.choices[].isCorrect` | boolean | Evet | Tam olarak **bir** seçenek `true` olmalı |
| `shuffleChoices` | boolean | Hayır | Varsayılan: true |
| `showFeedback` | boolean | Hayır | Varsayılan: false |

---

### 4.2 MULTIPLE_RESPONSE

Birden fazla doğru cevap. Seçenek yapısı Multiple Choice ile aynı (sadece `id`, `text`, `isCorrect`).

```json
{
  "options": {
    "choices": [
      { "id": "opt1", "text": "A", "isCorrect": true },
      { "id": "opt2", "text": "B", "isCorrect": false },
      { "id": "opt3", "text": "C", "isCorrect": true }
    ]
  },
  "minSelections": 1,
  "maxSelections": 999,
  "shuffleChoices": true,
  "showFeedback": false,
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `options.choices` | array | Evet | En az 2 seçenek |
| `options.choices[].id` | string | Hayır | |
| `options.choices[].text` | string | Evet | |
| `options.choices[].isCorrect` | boolean | Evet | En az **iki** seçenek `true` olmalı |
| `minSelections` | number | Hayır | ≥ 1 |
| `maxSelections` | number | Hayır | choices sayısını aşmamalı; min ≤ max |
| `shuffleChoices` | boolean | Hayır | |
| `showFeedback` | boolean | Hayır | |

---

### 4.3 TRUE_FALSE

Doğru/yanlış. Doğru cevap **string** olarak gönderilir (`"true"` veya `"false"`).

```json
{
  "optionList": {
    "questionText": "Dünya yuvarlaktır.",
    "correctAnswer": "true",
    "trueLabel": "True",
    "falseLabel": "False",
    "noGivenLabel": "NOT GİVEN"
  },
  "showFeedback": false,
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `optionList` | object | Evet | |
| `optionList.questionText` | string | Hayır | Soru metni (isteğe bağlı) |
| `optionList.correctAnswer` | string | Evet | Boş olamaz; genelde `"true"` veya `"false"` |
| `optionList.trueLabel` | string | Hayır | Varsayılan: "True" |
| `optionList.falseLabel` | string | Hayır | Varsayılan: "False" |
| `optionList.noGivenLabel` | string | Hayır | Varsayılan: "NOT GİVEN" |
| `showFeedback` | boolean | Hayır | |

---

### 4.4 SHORT_ANSWER

Kısa metin cevap. Kabul edilen cevaplar liste halinde.

```json
{
  "options": {
    "acceptableAnswers": ["cevap1", "cevap2", "alternatif yazım"],
    "caseSensitive": false,
    "exactMatch": false,
    "placeholder": "Cevabınızı yazın..."
  },
  "maxCharacters": 500,
  "minCharacters": 10,
  "trimWhitespace": true,
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `options.acceptableAnswers` | string[] | Evet | En az bir eleman |
| `options.caseSensitive` | boolean | Hayır | |
| `options.exactMatch` | boolean | Hayır | |
| `options.placeholder` | string | Hayır | |
| `maxCharacters` | number | Hayır | |
| `minCharacters` | number | Hayır | minCharacters ≤ maxCharacters |
| `trimWhitespace` | boolean | Hayır | |

---

### 4.5 FILL_IN_THE_BLANKS

Metin içinde boşluklar. Metinde `{{BLANK_1}}`, `{{BLANK_2}}` gibi placeholder’lar kullanılır; `options.blanks` ile eşleşmelidir.

```json
{
  "textWithBlanks": "Başkent {{BLANK_1}}, para birimi {{BLANK_2}}.",
  "options": {
    "blanks": [
      { "blankId": "BLANK_1", "acceptableAnswers": "Ankara", "caseSensitive": false, "exactMatch": false },
      { "blankId": "BLANK_2", "acceptableAnswers": "TL,Türk Lirası", "caseSensitive": false, "exactMatch": false }
    ]
  },
  "caseSensitive": false,
  "exactMatch": false
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `textWithBlanks` | string | Evet | En az bir `{{...}}` ifadesi içermeli |
| `options.blanks` | array | Evet | En az bir blank; metindeki placeholder sayısı ile aynı olmalı |
| `options.blanks[].blankId` | string | Evet | Örn. BLANK_1, BLANK_2 |
| `options.blanks[].acceptableAnswers` | string | Evet | Tek string; virgülle ayrılmış alternatifler kullanılabilir |
| `options.blanks[].caseSensitive` | boolean | Hayır | |
| `options.blanks[].exactMatch` | boolean | Hayır | |
| `caseSensitive` | boolean | Hayır | Şablon seviyesi |
| `exactMatch` | boolean | Hayır | |

---

### 4.6 ORDERING

Sıralama sorusu. Her öğede sadece `id`, `text`, `correctPosition` (1 tabanlı) vardır.

```json
{
  "options": {
    "items": [
      { "id": "i1", "text": "İlk adım", "correctPosition": 1 },
      { "id": "i2", "text": "İkinci adım", "correctPosition": 2 },
      { "id": "i3", "text": "Üçüncü adım", "correctPosition": 3 }
    ],
    "orderingType": "SEQUENTIAL"
  },
  "shuffleItems": true,
  "showFeedback": false,
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `options.items` | array | Evet | En az 2, en fazla 20 öğe |
| `options.items[].id` | string | Hayır | |
| `options.items[].text` | string | Evet | |
| `options.items[].correctPosition` | number | Evet | 1 tabanlı sıra |
| `options.orderingType` | string | Hayır | SEQUENTIAL, CHRONOLOGICAL, PRIORITY |
| `shuffleItems` | boolean | Hayır | |
| `showFeedback` | boolean | Hayır | |

---

### 4.7 MATCHING

Eşleştirme. Her çiftte sadece **leftText** ve **rightText** vardır (id/media/feedback yok).

```json
{
  "options": {
    "pairs": [
      { "leftText": "Başkent", "rightText": "Ankara" },
      { "leftText": "Para birimi", "rightText": "TL" }
    ]
  },
  "shuffleLeftItems": true,
  "shuffleRightItems": true,
  "showFeedback": false,
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `options.pairs` | array | Evet | En az 2, en fazla 15 çift |
| `options.pairs[].leftText` | string | Evet | Sol sütun metni |
| `options.pairs[].rightText` | string | Evet | Sağ sütun (doğru eşleşme) metni |
| `shuffleLeftItems` | boolean | Hayır | |
| `shuffleRightItems` | boolean | Hayır | |
| `showFeedback` | boolean | Hayır | |

---

### 4.8 DRAG_AND_DROP

Sürükle-bırak. Her **DraggableItem** için doğru bırakma alanları **DropZone objeleri** listesi (`correctZones`) olarak verilir; string id listesi değil.

```json
{
  "options": {
    "draggableItems": [
      {
        "id": "d1",
        "text": "Öğe A",
        "mediaUrl": null,
        "mediaType": null,
        "correctZones": [
          { "id": "z1", "label": "Bölge 1", "maxItems": 1, "feedback": null, "position": null }
        ]
      }
    ],
    "dropZones": [
      { "id": "z1", "label": "Bölge 1", "maxItems": 1, "feedback": "Doğru!", "position": null },
      { "id": "z2", "label": "Bölge 2", "maxItems": 1, "feedback": null, "position": null }
    ]
  },
  "layout": "VERTICAL",
  "shuffleItems": true,
  "showFeedback": false,
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `options.draggableItems` | array | Evet | En az bir öğe |
| `options.draggableItems[].id` | string | Hayır | |
| `options.draggableItems[].text` | string | Evet | |
| `options.draggableItems[].mediaUrl` | string | Hayır | |
| `options.draggableItems[].mediaType` | string | Hayır | IMAGE, AUDIO, VIDEO |
| `options.draggableItems[].correctZones` | **DropZone[]** | Evet | Doğru bırakma alanları (obje listesi) |
| `options.dropZones` | array | Evet | En az bir drop zone |
| `options.dropZones[].id` | string | Hayır | |
| `options.dropZones[].label` | string | Hayır | |
| `options.dropZones[].maxItems` | number | Hayır | Varsayılan: 1 |
| `options.dropZones[].feedback` | string | Hayır | |
| `options.dropZones[].position` | string | Hayır | Görsel koordinatlar için (örn. JSON) |
| `layout` | string | Hayır | VERTICAL, HORIZONTAL, GRID, CUSTOM |
| `shuffleItems` | boolean | Hayır | |
| `showFeedback` | boolean | Hayır | |

**Not:** `correctZones` artık string id listesi değil; her eleman `DropZone` objesidir (id, label, maxItems, feedback, position). Frontend’de doğrulama/ eşleme yaparken genelde `id` kullanılır; gönderirken backend’in beklediği obje listesini kullanın.

---

### 4.9 HOT_SPOT

Görsel üzerinde tıklanabilir alanlar. `imageUrl` zorunlu.

```json
{
  "imageUrl": "https://example.com/harita.png",
  "options": {
    "backgroundImageUrl": "https://example.com/harita.png",
    "hotSpots": [
      {
        "id": "hs1",
        "shape": "RECTANGLE",
        "coordinates": "{\"x\":10,\"y\":20,\"width\":50,\"height\":40}",
        "isCorrect": true,
        "label": "Ankara"
      }
    ],
    "selectionType": "CLICK"
  },
  "maxSelections": 1,
  "allowMultipleSpots": false,
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `imageUrl` | string | Evet | Boş olamaz |
| `options.backgroundImageUrl` | string | Hayır | |
| `options.hotSpots` | array | Hayır | |
| `options.hotSpots[].id` | string | Hayır | |
| `options.hotSpots[].shape` | string | Hayır | RECTANGLE, CIRCLE, POLYGON |
| `options.hotSpots[].coordinates` | string | Hayır | JSON string (koordinatlar) |
| `options.hotSpots[].isCorrect` | boolean | Hayır | |
| `options.hotSpots[].label` | string | Hayır | |
| `options.selectionType` | string | Hayır | CLICK, DRAG_RECTANGLE |
| `maxSelections` | number | Hayır | |
| `allowMultipleSpots` | boolean | Hayır | |

---

### 4.10 ESSAY

Uzun metin (kompozisyon). **Rubrik** ve **allowedFormats** string; liste değil.

```json
{
  "prompt": "Aşağıdaki konuda 300 kelimelik bir deneme yazın.",
  "minWords": 100,
  "maxWords": 1000,
  "requiredTopics": null,
  "gradingType": "MANUAL",
  "rubrik": "İçerik 40%, Dil 30%, Organizasyon 30%",
  "requireOutline": false,
  "allowedFormats": "HTML,MARKDOWN,PLAIN_TEXT",
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `prompt` | string | Evet | Boş olamaz |
| `minWords` | number | Hayır | ≥ 10; maxWords’ten büyük olamaz |
| `maxWords` | number | Hayır | |
| `requiredTopics` | string | Hayır | |
| `gradingType` | string | Hayır | MANUAL, AI, HYBRID |
| `rubrik` | string | Hayır | Değerlendirme kriterleri (TEXT; uzun metin olabilir) |
| `requireOutline` | boolean | Hayır | |
| `allowedFormats` | string | Hayır | Virgülle ayrılmış: HTML, MARKDOWN, PLAIN_TEXT |
| `scoringConfig` | object | Hayır | |

---

### 4.11 AUDIO_RESPONSE

Ses kaydı cevabı. **criteria** string (TEXT); liste değil.

```json
{
  "prompt": "Şu konuda 2 dakikalık bir konuşma kaydedin.",
  "maxRecordingDuration": 300,
  "minRecordingDuration": 5,
  "gradingType": "MANUAL",
  "criteria": "Akıcılık, Telaffuz, İçerik notları (serbest metin)",
  "allowRetake": true,
  "maxRetakes": 3,
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `prompt` | string | Evet | Boş olamaz |
| `maxRecordingDuration` | number | Hayır | Saniye; en fazla 600 (10 dk) |
| `minRecordingDuration` | number | Hayır | max’tan büyük olamaz |
| `gradingType` | string | Hayır | MANUAL, AI, HYBRID |
| `criteria` | string | Hayır | Değerlendirme kriterleri (uzun metin) |
| `allowRetake` | boolean | Hayır | |
| `maxRetakes` | number | Hayır | |
| `scoringConfig` | object | Hayır | |

---

### 4.12 VIDEO_RESPONSE

Video kaydı cevabı. **criteria** string (TEXT).

```json
{
  "prompt": "Kendinizi tanıtan 2 dakikalık bir video çekin.",
  "maxRecordingDuration": 600,
  "minRecordingDuration": 10,
  "gradingType": "MANUAL",
  "criteria": "Sunum, Beden dili, İçerik (serbest metin)",
  "allowRetake": true,
  "maxRetakes": 3,
  "requiredQuality": "720p",
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `prompt` | string | Evet | Boş olamaz |
| `maxRecordingDuration` | number | Hayır | Saniye; en fazla 1800 (30 dk) |
| `minRecordingDuration` | number | Hayır | max’tan büyük olamaz |
| `gradingType` | string | Hayır | MANUAL, AI, HYBRID |
| `criteria` | string | Hayır | Değerlendirme kriterleri (uzun metin) |
| `allowRetake` | boolean | Hayır | |
| `maxRetakes` | number | Hayır | |
| `requiredQuality` | string | Hayır | 480p, 720p, 1080p |
| `scoringConfig` | object | Hayır | |

---

### 4.13 IMAGE_RESPONSE

Görsel yükleme cevabı. **criteria** string (TEXT).

```json
{
  "prompt": "Konuyu anlatan bir diyagram yükleyin.",
  "maxFileSize": 5242880,
  "allowedFormats": "JPG, PNG, PDF",
  "gradingType": "MANUAL",
  "criteria": "Yaratıcılık, Netlik, Konuyla uyum (serbest metin)",
  "allowMultipleImages": false,
  "maxImages": 1,
  "requiredResolution": null,
  "scoringConfig": { ... }
}
```

| Alan | Tip | Zorunlu | Kural / Not |
|------|-----|---------|--------------|
| `prompt` | string | Evet | Boş olamaz |
| `maxFileSize` | number | Hayır | Byte; en fazla 10485760 (10MB) |
| `allowedFormats` | string | Hayır | Örn. "JPG, PNG, PDF" |
| `gradingType` | string | Hayır | MANUAL, AI, HYBRID |
| `criteria` | string | Hayır | Değerlendirme kriterleri (uzun metin) |
| `allowMultipleImages` | boolean | Hayır | |
| `maxImages` | number | Hayır | En fazla 10 |
| `requiredResolution` | string | Hayır | Örn. "1024x768" |
| `scoringConfig` | object | Hayır | |

---

## 5. Backend validasyon özeti

- **Genel:** `templateData` geçerli bir JSON objesi olmalı; soru tipi ile uyumlu yapıda olmalı.
- **MULTIPLE_CHOICE:** 2–10 seçenek; tam 1 doğru; her seçeneğin `text` dolu.
- **MULTIPLE_RESPONSE:** En az 2 seçenek; en az 2 doğru; min/max seçim tutarlı.
- **TRUE_FALSE:** `optionList` ve `optionList.correctAnswer` (string) dolu olmalı.
- **SHORT_ANSWER:** `options.acceptableAnswers` en az bir eleman; min/max karakter tutarlı.
- **FILL_IN_THE_BLANKS:** `textWithBlanks` ve en az bir `{{...}}`; blanks sayısı placeholder sayısına eşit.
- **ORDERING:** 2–20 öğe.
- **MATCHING:** 2–15 çift.
- **DRAG_AND_DROP:** En az bir draggable item ve en az bir drop zone.
- **HOT_SPOT:** `imageUrl` dolu.
- **ESSAY:** `prompt` dolu; minWords ≥ 10 ve minWords ≤ maxWords.
- **AUDIO_RESPONSE:** `prompt` dolu; max duration ≤ 600 sn; min ≤ max duration.
- **VIDEO_RESPONSE:** `prompt` dolu; max duration ≤ 1800 sn; min ≤ max duration.
- **IMAGE_RESPONSE:** `prompt` dolu; maxImages ≤ 10; maxFileSize ≤ 10MB.

Validasyon hatası durumunda API, `"Template validation failed: ..."` benzeri bir mesaj döner; mesajda hangi kuralın ihlal edildiği belirtilir.

---

## 6. Tip eşlemesi (TypeScript örnek)

Frontend’de `questionType` ile templateData tipini eşleştirmek için:

```ts
type QuestionType = 
  | 'MULTIPLE_CHOICE' 
  | 'MULTIPLE_RESPONSE' 
  | 'TRUE_FALSE' 
  | 'FILL_IN_THE_BLANKS' 
  | 'SHORT_ANSWER' 
  | 'MATCHING' 
  | 'ESSAY' 
  | 'ORDERING' 
  | 'HOT_SPOT' 
  | 'DRAG_AND_DROP' 
  | 'AUDIO_RESPONSE' 
  | 'VIDEO_RESPONSE' 
  | 'IMAGE_RESPONSE';

// Her questionType için templateData yapısı yukarıdaki ilgili bölümle aynı olmalı
interface QuestionCreateRequest {
  name: string;
  questionGroupId: string;
  questionType: QuestionType;
  maximumScore: number;
  subject?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  headers?: Array<{ orderNumber: number; mediaType?: string; content?: string }>;
  templateData: object; // questionType'a göre yukarıdaki şemalardan biri
}
```

---

## 7. Kısa referans: String/liste farkları

Backend’de aşağıdakiler **string** (virgülle ayrılmış kullanılabilir); **dizi göndermeyin:**

| Soru tipi | Alan | Frontend’de |
|-----------|------|-------------|
| ESSAY | `rubrik` | string (uzun metin) |
| ESSAY | `allowedFormats` | string, örn. `"HTML,MARKDOWN,PLAIN_TEXT"` |
| AUDIO_RESPONSE | `criteria` | string |
| VIDEO_RESPONSE | `criteria` | string |
| IMAGE_RESPONSE | `criteria` | string |
| TRUE_FALSE | `correctAnswer` | string (örn. `"true"` / `"false"`) |

**DRAG_AND_DROP:** `correctZones` artık **DropZone objesi listesi**; string id listesi değil.

Bu doküman, backend entity ve `TemplateValidator` kurallarına göre güncellenmiştir. API sürümü değişirse ilgili endpoint dokümanı ve bu şemalar birlikte kontrol edilmelidir.
