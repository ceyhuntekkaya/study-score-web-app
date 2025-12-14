# Progress Tracking Analizi

Bu dokümantasyon, `updatePartProgress` ve `updateMaterialProgress` API çağrılarının ne zaman ve hangi koşullarda yapıldığını detaylı olarak açıklar.

## 📍 Dosya Konumu
- **Hook**: `src/components/learner/content/useProgressTracking.ts`
- **Component**: `src/components/learner/content/LessonContent.tsx`

---

## 🔄 updatePartProgress (Part İlerlemesi)

### API Endpoint
```
POST /learner/progress/part
```

### Ne Zaman Çağrılıyor?

#### 1️⃣ **Part İlk Açıldığında** (Satır 137)
```typescript
// Koşul: selectedPartId değiştiğinde ve yeni bir part seçildiğinde
// Zaman: Part açılır açılmaz
savePartProgress(selectedPartId, 0, 0);
```
**Gönderilen Data:**
- `partId`: Seçilen part ID
- `progressPercentage`: 0 (başlangıç)
- `timeSpentSeconds`: 0
- `currentMaterialId`: undefined
- `currentMaterialPositionSeconds`: undefined

**Tetiklendiği Yer:** `useEffect` - `selectedPartId` değiştiğinde (Satır 116-166)

---

#### 2️⃣ **Part Değiştiğinde (Önceki Part'tan Çıkarken)** (Satır 120-126)
```typescript
// Koşul: previousPartIdRef.current !== selectedPartId
// Zaman: Kullanıcı bir part'tan başka bir part'a geçtiğinde
if (previousPartIdRef.current && previousPartIdRef.current !== selectedPartId) {
  const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
  savePartProgress(
    previousPartIdRef.current,
    calculatePartProgressRef.current,
    timeSpent,
    currentMaterialIdRef.current,
    currentMaterialPositionRef.current
  );
}
```
**Gönderilen Data:**
- `partId`: Önceki part ID
- `progressPercentage`: Hesaplanan ilerleme yüzdesi
- `timeSpentSeconds`: Part'ta geçirilen toplam süre (saniye)
- `currentMaterialId`: Son görüntülenen material ID
- `currentMaterialPositionSeconds`: Material içindeki son pozisyon

**Tetiklendiği Yer:** `useEffect` - `selectedPartId` değiştiğinde (Satır 116-166)

---

#### 3️⃣ **Her 30 Saniyede Bir (Otomatik)** (Satır 140-149)
```typescript
// Koşul: Part açıkken, her 30 saniyede bir
// Zaman: setInterval ile otomatik
partTimeIntervalRef.current = setInterval(() => {
  const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
  savePartProgress(
    selectedPartId,
    calculatePartProgressRef.current,
    timeSpent,
    currentMaterialIdRef.current,
    currentMaterialPositionRef.current
  );
}, 30000); // 30 saniye
```
**Gönderilen Data:**
- `partId`: Mevcut part ID
- `progressPercentage`: Güncel ilerleme yüzdesi
- `timeSpentSeconds`: Part'ta geçirilen toplam süre
- `currentMaterialId`: Mevcut material ID (varsa)
- `currentMaterialPositionSeconds`: Material pozisyonu (varsa)

**Tetiklendiği Yer:** `setInterval` - Part açıkken sürekli çalışır

---

#### 4️⃣ **Component Unmount Olduğunda / Part'tan Çıkarken** (Satır 152-163)
```typescript
// Koşul: useEffect cleanup fonksiyonu çalıştığında
// Zaman: Component unmount veya selectedPartId değiştiğinde
return () => {
  cleanupPartProgress();
  if (selectedPartId) {
    const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
    savePartProgress(
      selectedPartId,
      calculatePartProgressRef.current,
      timeSpent,
      currentMaterialIdRef.current,
      currentMaterialPositionRef.current
    );
  }
};
```
**Gönderilen Data:**
- `partId`: Mevcut part ID
- `progressPercentage`: Son hesaplanan ilerleme
- `timeSpentSeconds`: Part'ta geçirilen toplam süre
- `currentMaterialId`: Son material ID
- `currentMaterialPositionSeconds`: Son material pozisyonu

**Tetiklendiği Yer:** `useEffect` cleanup - Component unmount veya dependency değiştiğinde

---

#### 5️⃣ **Video/Audio Pause Edildiğinde** (Satır 216-234)
```typescript
// Koşul: Video veya audio pause event'i tetiklendiğinde
// Zaman: Kullanıcı video/audio'yu duraklattığında
const handlePause = async () => {
  // ... material progress kaydedilir
  if (selectedPartId) {
    const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
    await savePartProgress(
      selectedPartId,
      calculatePartProgressRef.current,
      timeSpent,
      material.id!,
      currentPosition
    );
  }
};
```
**Gönderilen Data:**
- `partId`: Mevcut part ID
- `progressPercentage`: Güncel ilerleme yüzdesi
- `timeSpentSeconds`: Part'ta geçirilen toplam süre
- `currentMaterialId`: Video/audio material ID
- `currentMaterialPositionSeconds`: Video/audio içindeki pozisyon

**Tetiklendiği Yer:** Video/Audio element'in `pause` event listener'ı

---

#### 6️⃣ **Video/Audio İzlenirken (Her 10 Saniyede)** (Satır 262-277)
```typescript
// Koşul: Video/audio oynatılırken, her 10 saniyede bir
// Zaman: setInterval ile otomatik (video/audio playing ise)
const materialInterval = setInterval(async () => {
  if (tracking.isPlaying && !element.paused) {
    // ... material progress kaydedilir
    if (selectedPartId) {
      const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
      await savePartProgress(
        selectedPartId,
        calculatePartProgressRef.current,
        timeSpent,
        material.id!,
        currentPosition
      );
    }
  }
}, 10000); // 10 saniye
```
**Gönderilen Data:**
- `partId`: Mevcut part ID
- `progressPercentage`: Güncel ilerleme yüzdesi
- `timeSpentSeconds`: Part'ta geçirilen toplam süre
- `currentMaterialId`: Video/audio material ID
- `currentMaterialPositionSeconds`: Video/audio içindeki pozisyon

**Tetiklendiği Yer:** `setInterval` - Video/audio oynatılırken sürekli çalışır

---

## 🎬 updateMaterialProgress (Material İlerlemesi)

### API Endpoint
```
POST /learner/progress/material
```

### Ne Zaman Çağrılıyor?

#### 1️⃣ **Video/Audio Pause Edildiğinde** (Satır 216-223)
```typescript
// Koşul: Video veya audio pause event'i tetiklendiğinde
// Zaman: Kullanıcı video/audio'yu duraklattığında
const handlePause = async () => {
  tracking.isPlaying = false;
  const pauseTime = Date.now();
  const watchDuration = Math.floor((pauseTime - tracking.watchStartTime) / 1000);
  const currentPosition = Math.floor(element.currentTime);
  const totalDuration = Math.floor(element.duration) || 0;

  await saveMaterialProgress(material.id!, currentPosition, totalDuration, watchDuration);
};
```
**Gönderilen Data:**
- `materialId`: Video/audio material ID
- `currentPositionSeconds`: Duraklatıldığı andaki pozisyon
- `totalDurationSeconds`: Toplam video/audio süresi
- `watchDurationSeconds`: İzlenen süre (pause'a kadar)
- `isDownloaded`: undefined

**Tetiklendiği Yer:** Video/Audio element'in `pause` event listener'ı

---

#### 2️⃣ **Video/Audio Tamamlandığında (Ended)** (Satır 246-252)
```typescript
// Koşul: Video veya audio ended event'i tetiklendiğinde
// Zaman: Video/audio sonuna geldiğinde
const handleEnded = async () => {
  tracking.isPlaying = false;
  const endTime = Date.now();
  const watchDuration = Math.floor((endTime - tracking.watchStartTime) / 1000);
  const currentPosition = Math.floor(element.duration) || 0;
  const totalDuration = Math.floor(element.duration) || 0;
  await saveMaterialProgress(material.id!, currentPosition, totalDuration, watchDuration);
};
```
**Gönderilen Data:**
- `materialId`: Video/audio material ID
- `currentPositionSeconds`: Video/audio sonu (duration)
- `totalDurationSeconds`: Toplam süre
- `watchDurationSeconds`: Toplam izlenen süre
- `isDownloaded`: undefined

**Tetiklendiği Yer:** Video/Audio element'in `ended` event listener'ı

---

#### 3️⃣ **Video/Audio İzlenirken (Her 10 Saniyede)** (Satır 262-266)
```typescript
// Koşul: Video/audio oynatılırken, her 10 saniyede bir
// Zaman: setInterval ile otomatik (video/audio playing ise)
const materialInterval = setInterval(async () => {
  if (tracking.isPlaying && !element.paused) {
    const currentPosition = Math.floor(element.currentTime);
    const totalDuration = Math.floor(element.duration) || 0;
    await saveMaterialProgress(material.id!, currentPosition, totalDuration, 10);
    // ... part progress de kaydedilir
  }
}, 10000); // 10 saniye
```
**Gönderilen Data:**
- `materialId`: Video/audio material ID
- `currentPositionSeconds`: Mevcut pozisyon
- `totalDurationSeconds`: Toplam süre
- `watchDurationSeconds`: 10 (son 10 saniyede izlenen)
- `isDownloaded`: undefined

**Tetiklendiği Yer:** `setInterval` - Video/audio oynatılırken sürekli çalışır

---

#### 4️⃣ **PDF İndirildiğinde** (Satır 317-319)
```typescript
// Koşul: PDF download butonuna tıklandığında
// Zaman: Kullanıcı PDF'i indirdiğinde
const handlePdfDownload = useCallback(async (materialId: string) => {
  await saveMaterialProgress(materialId, undefined, undefined, undefined, true);
}, [saveMaterialProgress]);
```
**Gönderilen Data:**
- `materialId`: PDF material ID
- `currentPositionSeconds`: undefined
- `totalDurationSeconds`: undefined
- `watchDurationSeconds`: undefined
- `isDownloaded`: true

**Tetiklendiği Yer:** `MaterialRenderer` component'inde PDF download butonu onClick event'i

---

## 📊 Özet Tablo

### updatePartProgress Çağrıları

| Senaryo | Sıklık | Koşul | Tetikleyici |
|---------|--------|-------|-------------|
| Part açıldı | 1 kez | Part seçildiğinde | useEffect (selectedPartId değişti) |
| Part değişti | 1 kez | Önceki part'tan çıkarken | useEffect (selectedPartId değişti) |
| Part içinde | Her 30 saniye | Part açıkken | setInterval |
| Component unmount | 1 kez | Component kapanırken | useEffect cleanup |
| Video pause | 1 kez | Video duraklatıldığında | pause event |
| Video izlenirken | Her 10 saniye | Video oynatılırken | setInterval (video için) |

### updateMaterialProgress Çağrıları

| Senaryo | Sıklık | Koşul | Tetikleyici |
|---------|--------|-------|-------------|
| Video pause | 1 kez | Video duraklatıldığında | pause event |
| Video ended | 1 kez | Video tamamlandığında | ended event |
| Video izlenirken | Her 10 saniye | Video oynatılırken | setInterval |
| PDF indirildi | 1 kez | PDF download butonuna tıklandığında | onClick event |

---

## 🔍 Önemli Notlar

1. **Çift Kayıt:** Video/audio pause ve izlenirken hem `updateMaterialProgress` hem de `updatePartProgress` çağrılıyor. Bu normal ve istenen bir davranış.

2. **Interval Temizleme:** Tüm interval'lar component unmount veya part değiştiğinde temizleniyor (cleanup fonksiyonları).

3. **Ref Kullanımı:** State yerine ref kullanılarak gereksiz re-render'lar önleniyor.

4. **Progress Hesaplama:** Part progress yüzdesi, mevcut material'ın materials array'indeki index'ine göre hesaplanıyor.

5. **Time Tracking:** Part'ta geçirilen süre, `partStartTimeRef` ile başlangıç zamanı tutularak hesaplanıyor.

---

## 🐛 Potansiyel Sorunlar

1. **Çok Fazla İstek:** Video izlenirken her 10 saniyede hem material hem part progress kaydediliyor. Bu çok fazla API çağrısı yapabilir.

2. **Race Condition:** Aynı anda birden fazla API çağrısı yapılabilir (pause + interval).

3. **Network Hataları:** API çağrıları try-catch ile yakalanıyor ama retry mekanizması yok.

---

## ✅ Öneriler

1. **Debouncing:** API çağrılarını debounce edebilirsiniz (özellikle interval'lar için).

2. **Batch Requests:** Birden fazla progress update'i tek bir request'te toplayabilirsiniz.

3. **Offline Support:** Network hatası durumunda progress'i local storage'a kaydedip sonra sync edebilirsiniz.

4. **Progress Calculation:** Material progress'ine göre part progress'i daha doğru hesaplanabilir.
