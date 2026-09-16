# STT (Speech-to-Text) Servisi Kullanımı (Study Score)

Bu doküman, bu projedeki **ses kaydı/medya yükleme akışını** ve aynı yapıyı kullanarak **STT (speech-to-text)** entegrasyonunu başka bir projede nasıl kurabileceğini anlatır.

> Not: Bu repoda STT için **base URL** tanımı `src/config/config.json` içinde var; ancak mevcut frontend kodunda STT’ye doğrudan istek atan bir istemci/servis görünmüyor. Ses/video kayıt akışı, kaydı backend’e **dosya olarak yükleyip** onun URL’ini cevap kaydına yazma şeklinde çalışıyor. STT’yi bu akışın üzerine “yüklenmiş audio URL → transcribe” şeklinde eklemek en stabil yöntem.

## Mevcut Akış (Bu Projede)

### 1) Tarayıcıda ses kaydı alınır

- **Bileşen**: `src/components/learner/exam/questions/AudioResponseQuestion.tsx`
- **Teknik**: `navigator.mediaDevices.getUserMedia({ audio: true })` + `MediaRecorder`
- **Format**: Kayıt `Blob` olarak oluşturulur:
  - `type`: pratikte `audio/webm`
  - dosya adı varsayılan: `recording.webm`

### 2) Kayıt backend’e yüklenir (`/files/upload`)

- **Servis**: `src/services/api/questionResponseMediaUpload.ts`
- **Endpoint**: `POST /files/upload`
- **Body**: `FormData`
  - `files`: 1+ adet dosya/blob
  - `objectType`: `QUESTION_RESPONSE`
  - `fileProp`: `audio` (veya video için `video`)
- **Dönüş**: backend “path listesi” döndürür; frontend bunu `getFilePreviewUrl` ile **serve URL**’e çevirir ve UI’da/cevap verisinde bunu saklar.

### 3) Cevap verisi kaydedilir

- **Servis**: `src/services/api/questionResponseService.ts`
- **Endpoint**: `POST /api/question-responses` (orval ile)
- **AudioResponse için tipik payload**: cevap içinde `audioUrl`, `durationSeconds`, `mimeType`, `fileSize` alanları saklanır.

Bu noktada STT’yi eklemek için elinde iki seçenek var:

- **Seçenek A (Önerilen)**: “Önce upload → audioUrl elde et → STT’ye audioUrl/Blob ile transcribe → transcription’ı da answerData’ya ekle”.
- **Seçenek B**: “Upload etmeden direkt STT’ye Blob gönder → text döndür → sonra upload + save”.
  - B daha hızlı “ilk text” verir ama tekrar deneme/hata durumlarında senkronizasyon zorlaşır.

## STT Servisinin Konfigürasyonu

STT base URL’leri `src/config/config.json` içinde tanımlı:

- `api.stt`: ör. `https://speaking.stt.eltaexams.com`
- alternatif ortam için: `https://stt.studyscore.ai`

> Dikkat: `src/config/index.ts` içinde `Config` arayüzü sadece `tts`’yi expose ediyor; `stt` alanı arayüzde yok. Başka projeye taşırken `getSttUrl()` gibi bir helper eklemek işini kolaylaştırır.

## Başka Projede Aynı Yapıyı Kurma (Önerilen Mimari)

Bu bölüm “aynı API ile” tekrar kullanabileceğin, **CORS ve token sızıntısı** gibi sorunları azaltan bir kurulum önerir.

### Öneri 1: STT’yi server üzerinden çağır (Next.js Route Handler / API Route)

Tarayıcıdan STT domain’ine direkt istek atmak yerine:

- STT key/token varsa bunu **server-side** sakla
- tarayıcı sadece kendi app’ine (`/api/stt/transcribe`) konuşsun
- server, STT servisine forward etsin

Avantajlar:

- **CORS** problemleri azalır
- **API key** tarayıcıya düşmez
- audio dosyasını tek noktada normalize edersin (format/size limit)

### Öneri 2: İstek sözleşmesini sabitle

Yeni projede STT servisini şu iki girişten biriyle standartlaştırmanı öneririm:

#### A) `multipart/form-data` ile `file` upload

- **Request**:
  - `file`: audio blob/file (`audio/webm`, `audio/wav`, vb.)
  - opsiyonel: `language`, `model`, `prompt`
- **Response**:
  - `text`: transkript
  - opsiyonel: `segments`, `confidence`, `durationMs`

#### B) `audioUrl` ile transcribe

Upload sonrası oluşan `audioUrl`’i STT’ye verirsin.

- **Request**: JSON
  - `audioUrl`: string
  - opsiyonel: `language`, `model`, `prompt`
- **Response**: aynı (text + opsiyonel alanlar)

Bu projedeki mevcut akış “upload → serve URL” zaten verdiği için **B yaklaşımı** çoğu zaman daha rahat olur.

## Uçtan Uca Örnek Akış (Re-usable)

### 1) Kaydı al (browser)

- MediaRecorder ile `Blob` üret (bu projede olduğu gibi)

### 2) Upload et ve `audioUrl` al

- `POST /files/upload` (FormData: `files`, `objectType`, `fileProp`)
- `audioUrl` = serve URL

### 3) STT’ye transcribe ettir

İki yaygın pattern:

- **Pattern-1**: `POST /api/stt/transcribe` (kendi backend’in) → backend STT’ye gider
- **Pattern-2**: `POST ${STT_BASE_URL}/...` (doğrudan STT’ye)

### 4) Cevabı kaydet (transcription dahil)

- `POST /api/question-responses` body içine:
  - `audioUrl`
  - `durationSeconds`
  - `mimeType`
  - `fileSize`
  - `transcription` (STT sonucu)

## Hata Yönetimi ve Edge Case’ler

- **Mikrofon izni**: kullanıcı izin vermezse kayıt başlamaz; kullanıcıya net hata göster.
- **Dosya formatı**: MediaRecorder her tarayıcıda aynı codec üretmeyebilir.
  - En azından `audio/webm` (Chrome/Edge) ve iOS/Safari farklarını göz önünde bulundur.
- **Dosya boyutu**: STT servisleri genelde boyut/süre limiti koyar.
  - Kaydı parça parça gönderme (chunking) veya süre limitini UI’dan kısıtlama gerekebilir.
- **Tekrar deneme (retake)**: yeni Blob üretildiğinde eski object URL’leri revoke et.
- **Zaman aşımı**: STT çağrıları uzun sürebilir; client-side “processing” state’i koy.
- **Gizlilik**: kullanıcı sesini üçüncü parti STT’ye göndereceksen KVKK/GDPR metinleri ve açık rıza akışı gerekebilir.

## Bu Repoda İlgili Dosyalar

- **STT base URL konfigürasyonu**: `src/config/config.json`
- **Ses kaydı (AudioResponse)**: `src/components/learner/exam/questions/AudioResponseQuestion.tsx`
- **Video kaydı (VideoResponse)**: `src/components/learner/exam/questions/VideoResponseQuestion.tsx`
- **Audio/Video upload**: `src/services/api/questionResponseMediaUpload.ts`
- **Cevap kaydetme**: `src/services/api/questionResponseService.ts`

## Taşıma Checklist’i (Yeni Proje)

- [ ] `config` içine `stt` base URL’i ekle (env veya json)
- [ ] `getSttUrl()` gibi tek bir yerden yönet
- [ ] STT çağrısını mümkünse server-side proxy üzerinden yap (`/api/stt/transcribe`)
- [ ] “upload → audioUrl → stt → transcription → save” akışını tek fonksiyonda birleştir
- [ ] UI’da `uploading` ve `transcribing` state’lerini ayır
- [ ] Hata durumunda transcription boş kalsa bile cevap kaydının bozulmamasını sağla

