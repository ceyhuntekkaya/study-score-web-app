# Soru Şablonlarında Cevap Kaydetme Anı (Save Moment)

Bu doküman, her soru template’inde **cevabın ne zaman** backend’e gönderildiğini (kaydetme anı) özetler. Değerlendirme ve UX kararları için referans olarak kullanılabilir.

**Genel akış:** Sınav sayfasında `onAnswerChange` → `handleAnswerChange` → `POST /api/question-responses` (mutate). ESSAY için ek olarak "Kaydet" tıklanınca `onSaveAnswer` → `handleSaveAnswer` → aynı endpoint (mutateAsync).

---

## Özet tablo

| Template | Kaydetme anı | Tetikleyen olay | Not |
|----------|--------------|-----------------|-----|
| **MULTIPLE_CHOICE** | Seçim anında | Bir şık tıklandığında | Her seçimde tek cevap gider |
| **TRUE_FALSE** | Seçim anında | True veya False tıklandığında | |
| **MULTIPLE_RESPONSE** | Her işaretleme/kaldırma | Checkbox tıklandığında | Seçim seti güncellenir |
| **SHORT_ANSWER** | Her giriş (her tuş) | Input/textarea `onChange` | Her karakterde kayıt |
| **FILL_IN_THE_BLANKS** | Boşluk değişince | Bir boşluk alanı değiştiğinde | Tüm blanks bir payload’da |
| **MATCHING** | Eşleşme yapılınca | Sol/sağ eşleşme seçildiğinde | matches objesi |
| **ORDERING** | Sıra değişince | Sürükle-bırak veya ok ile sıra değişince | orderedItemIds |
| **DRAG_AND_DROP** | Bırakma anında | Öğe hedef alana bırakıldığında | placements |
| **HOT_SPOT** | Bölge seçilince | Harita/resimde bölge tıklandığında | Seçilen bölge ID’si |
| **ESSAY** | **"Cevabı kaydet" butonuna tıklanınca** | Sadece "Kaydet" butonu | Yazarken kayıt yok |
| **AUDIO_RESPONSE** | Kayıt durdurulunca | Kayıt bitince (Stop) | mediaRecorder.onstop |
| **VIDEO_RESPONSE** | Kayıt durdurulunca | Kayıt bitince (Stop) | mediaRecorder.onstop |
| **IMAGE_RESPONSE** | Dosya eklenince veya kaldırılınca | Dosya seçimi veya "kaldır" tıklanınca | imageUrls + metadata |

---

## Detaylı açıklamalar

### MULTIPLE_CHOICE
- **Kaydetme anı:** Kullanıcı bir şık seçtiği anda.
- **Kod:** `onAnswerChange({ selectedOptionId: optionId })` — seçim handler’ında.
- **Değerlendirme:** Anında kayıt; son seçim geçerli.

### TRUE_FALSE
- **Kaydetme anı:** True veya False butonuna tıklanınca.
- **Kod:** `onAnswerChange({ answer })` — cevap seçildiğinde.
- **Değerlendirme:** Tek seçim, anında kayıt.

### MULTIPLE_RESPONSE
- **Kaydetme anı:** Her checkbox işaretlendiğinde veya kaldırıldığında.
- **Kod:** `onAnswerChange({ selectedOptionIds: newSelection })` — seçim dizisi güncellenir.
- **Değerlendirme:** Her değişiklikte tüm seçim seti gönderilir.

### SHORT_ANSWER
- **Kaydetme anı:** Her tuş girişinde (textarea `onChange`).
- **Kod:** `handleInputChange` → `onAnswerChange({ answerText, characterCount })`.
- **Değerlendirme:** Çok sık istek gidebilir; gerekirse debounce eklenebilir.

### FILL_IN_THE_BLANKS
- **Kaydetme anı:** Herhangi bir boşluk alanı değiştiğinde.
- **Kod:** `onAnswerChange({ answers: newAnswers })` — tüm boşluklar tek objede.
- **Değerlendirme:** Her boşluk girişinde tüm cevaplar güncellenir.

### MATCHING
- **Kaydetme anı:** Kullanıcı bir eşleşme (sol öğe – sağ öğe) yaptığında.
- **Kod:** `onAnswerChange({ matches: newMatches })`.
- **Değerlendirme:** Eşleşme seti her değişiklikte güncellenir.

### ORDERING
- **Kaydetme anı:** Sıra değiştiğinde (sürükle-bırak veya yukarı/aşağı ok).
- **Kod:** `onAnswerChange({ orderedItemIds })` — sıralı ID listesi.
- **Değerlendirme:** Her sıra değişiminde kayıt.

### DRAG_AND_DROP
- **Kaydetme anı:** Öğe bir hedef alana bırakıldığında.
- **Kod:** `onAnswerChange({ placements: newPlacements })` — hem sürükle bitince hem sıra değişince.
- **Değerlendirme:** Bırakma/sıra değişimi anında.

### HOT_SPOT
- **Kaydetme anı:** Harita/resim üzerinde bir bölge (hotspot) tıklandığında.
- **Kod:** `onAnswerChange(...)` — seçilen bölge bilgisi.
- **Değerlendirme:** Her tıklamada kayıt.

### ESSAY
- **Kaydetme anı:** **Sadece "Cevabı kaydet" butonuna tıklanınca.**
- **Kod:** `handleSave` → `onSave(payload)` → parent’ta `handleSaveAnswer` → `POST /api/question-responses`. Yazarken sadece `onAnswerChange` ile local state güncellenir; backend’e gönderim yapılmaz.
- **Değerlendirme:** Bilinçli tasarım; uzun metinlerde her tuşta kayıt yok.

### AUDIO_RESPONSE
- **Kaydetme anı:** Kayıt durdurulduğunda (Stop).
- **Kod:** `mediaRecorder.onstop` içinde `onAnswerChange({ audioUrl, durationSeconds, mimeType, fileSize, ... })`.
- **Değerlendirme:** Kayıt tamamlanınca bir kez gönderilir (URL production’da yükleme sonrası olmalı).

### VIDEO_RESPONSE
- **Kaydetme anı:** Kayıt durdurulduğunda (Stop).
- **Kod:** `mediaRecorder.onstop` içinde `onAnswerChange({ videoUrl, durationSeconds, mimeType, fileSize, resolution, thumbnailUrl, ... })`.
- **Değerlendirme:** Kayıt bitince bir kez; production’da video yükleme sonrası gerçek URL kullanılmalı.

### IMAGE_RESPONSE
- **Kaydetme anı:** Dosya seçildiğinde (file input veya drag-drop) veya bir görsel "kaldır" ile silindiğinde.
- **Kod:** `handleFileSelect` ve `handleRemoveImage` içinde `onAnswerChange({ imageUrls, metadata })`.
- **Değerlendirme:** Her ekleme/çıkarmada güncel liste gönderilir; production’da önce yükleme, sonra URL ile kayıt önerilir.

---

## Sınav sayfasındaki kullanım

- **Exam take page** (`/learner/exam/[examId]/take`):
  - Çoğu tip: `onAnswerChange` → `handleAnswerChange` → `saveResponse.mutate(...)` (anında kayıt).
  - **ESSAY:** `onSaveAnswer` sadece `questionType === 'ESSAY'` için geçilir; "Kaydet" tıklanınca `handleSaveAnswer` → `saveResponse.mutateAsync(...)`.

Bu sayede tüm template’lerde kaydetme anı tutarlı şekilde tanımlıdır; gerekirse tek tek debounce veya “Kaydet” butonu eklenebilir.
