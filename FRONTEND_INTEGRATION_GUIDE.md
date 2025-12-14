# Frontend Entegrasyon Kılavuzu - Öğrenci İlerleme Takibi

## 📋 Genel Bakış

Öğrencinin kurs içindeki ilerlemesini takip etmek için **3 ana endpoint** kullanılacak:

1. **Dashboard verilerini getir** → Öğrenci ne durumda?
2. **Kurs içeriği + İlerleme verilerini getir** → Kurs sayfası için
3. **İlerleme kaydet** → Öğrenci bir şey yaptığında

---

## 🎯 Endpoint'ler ve Kullanım Zamanları

### 1. Dashboard Endpoint
```
GET /learner/dashboard
```

**Ne zaman çağrılır:**
- Öğrenci dashboard sayfasını açtığında
- Ana sayfa yüklendiğinde

**Ne döner:**
- Aktif tüm kurslar (ilerleme % ile birlikte)
- Aktif tüm exam'ler (deneme sayısı, en iyi skor vb.)
- Genel istatistikler (toplam çalışma süresi, bu hafta/ay aktivite)
- Her kurs için "kaldığı yer" bilgisi

**Response yapısı:**
```
{
  activeCourses: [
    {
      courseId, courseName, imageUrl,
      progressPercentage: 45,  // Kursu %45 tamamlamış
      lastAccessDate,
      totalTimeSpentSeconds,
      nextContent: {           // Kaldığı yer
        partId, partName, materialId, materialName
      },
      totalParts: 20,
      completedParts: 9,
      thisWeekTimeSpentSeconds,
      daysRemaining: 90        // Erişim bitiş tarihi
    }
  ],
  activeExams: [...],
  overallStats: {
    totalActiveCourses: 2,
    totalStudyTimeSeconds: 14400,
    averageProgressPercentage: 52
  }
}
```

**Frontend'de kullanım:**
- Dashboard kartlarını göster
- "Kaldığın yerden devam et" butonu için nextContent kullan
- İstatistikleri göster (bugün X saat çalıştın, bu hafta Y kurs tamamladın)

---

### 2. Kurs Sayfası Endpoint'leri (İKİ AYRI ÇAĞRI)

#### 2A. Kurs İçeriği
```
GET /courses/{courseId}/details
```

**Ne zaman çağrılır:**
- Öğrenci bir kursu açtığında (sayfa ilk yüklendiğinde)

**Ne döner:**
- Kurs bilgileri (ad, açıklama, resim)
- Tüm Lesson'lar
- Tüm Part'lar
- Tüm Material'lar (videolar, PDF'ler)
- **PROGRESS BİLGİSİ YOK** (sadece kurs yapısı)

**Response yapısı:**
```
{
  id, name, description, imageUrl,
  lessons: [
    {
      id, name, orderNumber,
      lessonParts: [
        {
          id, name, orderNumber,
          materials: [
            {
              id, name, mediaType, duration, uploadedFileId
            }
          ]
        }
      ]
    }
  ]
}
```

**Önemli:** Bu endpoint cache'lenebilir (localStorage). Kurs içeriği sık değişmez.

---

#### 2B. Kullanıcı İlerleme Verisi
```
GET /learner/progress/course/{courseId}
```

**Ne zaman çağrılır:**
- Kurs sayfası açıldığında (2A ile **paralel** çağrılır)
- Video izlenirken/part değiştirilirken progress güncellendiğinde (yeni data almak için)

**Ne döner:**
- Kurs özet bilgileri (kaçta kaç tamamlandı)
- Her Part için progress bilgisi
- Her Material için progress bilgisi

**Response yapısı:**
```
{
  summary: {
    courseId, courseName,
    overallProgressPercentage: 45,
    totalParts: 20,
    completedParts: 9,
    currentPartId,        // Şu anda hangi part'ta
    currentMaterialId,
    thisWeekTimeSpentSeconds
  },
  partProgresses: [
    {
      partId: "part-123",           // ← BUNUNLA EŞLEŞTİRECEKSİN
      completionStatus: "COMPLETED", // NOT_STARTED, IN_PROGRESS, COMPLETED
      progressPercentage: 100,
      totalTimeSpentSeconds: 450
    }
  ],
  materialProgresses: [
    {
      materialId: "material-456",   // ← BUNUNLA EŞLEŞTİRECEKSİN
      isCompleted: true,
      completionPercentage: 100,
      currentPositionSeconds: 300    // Video kaldığı saniye
    }
  ]
}
```

**Frontend'de nasıl kullanılır:**

1. **İki endpoint'i paralel çağır** (sayfa yüklenirken)
2. **ID bazlı merge et:**
   - `part.id` ile `partProgress.partId` eşleştir
   - `material.id` ile `materialProgress.materialId` eşleştir
3. **Merge sonrası data:**
   ```
   part {
     id, name,
     progress: {                    // ← EKLENEN
       completionStatus: "COMPLETED",
       progressPercentage: 100
     },
     materials: [
       {
         id, name,
         progress: {                // ← EKLENEN
           isCompleted: true,
           currentPositionSeconds: 300
         }
       }
     ]
   }
   ```

**Ne gösterilir:**
- ✅ Tamamlanan part'lara yeşil tik
- 📊 Part progress bar'ı
- ▶️ Video kaldığı saniyeden başlat
- 🔒 Henüz başlanmamış part'ları kilitle (opsiyonel)

---

### 3. İlerleme Kaydetme Endpoint'leri

#### 3A. Material İlerlemesi Kaydet
```
POST /learner/progress/material
```

**Ne zaman çağrılır:**
- Video/audio **izlenirken** (her 10 saniyede bir)
- Video/audio **duraklatıldığında**
- Video/audio **tamamlandığında**
- PDF **indirildiğinde**

**Request body (Video için):**
```
{
  materialId: "material-123",
  currentPositionSeconds: 125,      // Video'da hangi saniyede
  totalDurationSeconds: 300,        // Video'nun toplam süresi
  watchDurationSeconds: 10          // Bu çağrıda izlenen süre (10 sn)
}
```

**Request body (PDF için):**
```
{
  materialId: "material-456",
  isDownloaded: true,
  watchDurationSeconds: 60
}
```

**Backend ne yapar:**
- Material progress'i günceller
- %90+ izlendiyse otomatik `isCompleted = true` yapar
- Part progress'i otomatik günceller (material'lardan hesaplar)

**Frontend ne yapmalı:**
- Video player'da her 10 saniyede bir bu endpoint'i çağır
- Video bittiğinde son durumu gönder
- PDF indirme butonuna tıklandığında gönder

---

#### 3B. Part İlerlemesi Kaydet
```
POST /learner/progress/part
```

**İKİ FARKLI KULLANIM MOD VAR:**

##### **MODE 1: Video/PDF İçeren Part'lar (AUTO-CALCULATE)**
**Ne zaman çağrılır:**
- Part **ilk açıldığında**
- Part içinde **gezinirken** (her 30 saniyede)
- Part'tan **çıkarken**

**Request body:**
```
{
  partId: "part-123",
  progressPercentage: null,         // ← NULL gönder, backend hesaplasın
  timeSpentSeconds: 30,
  currentMaterialId: "material-5",  // Hangi material'da kaldı
  currentMaterialPositionSeconds: 125
}
```

**Backend ne yapar:**
- Material'lara bakarak part progress'i hesaplar
- Örnek: 5 material'dan 3'ü tamamlanmış → %60

##### **MODE 2: Quiz/Test Part'ları (MANUAL)**
**Ne zaman çağrılır:**
- Quiz **başladığında**
- Quiz **tamamlandığında**

**Request body:**
```
{
  partId: "quiz-part-123",
  progressPercentage: 80,           // ← Frontend hesapladı (10 sorudan 8'i doğru)
  timeSpentSeconds: 120
}
```

**Backend ne yapar:**
- Frontend'in gönderdiği % değerini kullanır
- %100 ise otomatik `completionStatus = COMPLETED` yapar

**Frontend nasıl karar verir:**
```
Part'ta material varsa (video, PDF):
  → progressPercentage = null gönder (AUTO)

Part'ta material yoksa (quiz, test):
  → progressPercentage = hesapla ve gönder (MANUAL)
```

---

## 🔄 Tipik Kullanım Akışları

### Akış 1: Öğrenci Dashboard'u Açıyor
```
1. Sayfa yüklenir
2. GET /learner/dashboard çağrılır
3. Response'daki kurslara tıklanabilir kartlar oluşturulur
4. "Kaldığın yerden devam et" butonu nextContent.partId'ye gider
```

---

### Akış 2: Öğrenci Kurs Sayfasını Açıyor
```
1. Sayfa yüklenir
2. Paralel iki çağrı:
   - GET /courses/{courseId}/details
   - GET /learner/progress/course/{courseId}
3. İki data merge edilir (ID bazlı)
4. UI render edilir:
   - Tamamlanan part'lara ✅
   - Part progress bar'ları
   - "Kaldığın yerden devam et" butonu currentPartId'ye gider
```

---

### Akış 3: Öğrenci Video İzliyor
```
1. Video player açılır
2. Material progress'e bak:
   - currentPositionSeconds varsa → oradan başlat
   - yoksa → 0'dan başlat

3. Her 10 saniyede bir:
   POST /learner/progress/material
   {
     materialId, 
     currentPositionSeconds: video.currentTime,
     totalDurationSeconds: video.duration,
     watchDurationSeconds: 10
   }

4. Her 30 saniyede bir:
   POST /learner/progress/part
   {
     partId,
     progressPercentage: null,  // AUTO mode
     timeSpentSeconds: 30,
     currentMaterialId,
     currentMaterialPositionSeconds: video.currentTime
   }

5. Video %90'a geldiğinde:
   - Backend otomatik material'i COMPLETED yapar
   - Part progress otomatik güncellenir
   - Tüm materyaller bitince part otomatik COMPLETED olur

6. Progress güncellenince:
   - GET /learner/progress/course/{courseId} çağrılır (fresh data)
   - UI güncellenir (progress bar, completed badge)
```

---

### Akış 4: Öğrenci Quiz Çözüyor
```
1. Quiz açılır
2. POST /learner/progress/part
   {
     partId,
     progressPercentage: 0,     // MANUAL mode - başlangıç
     timeSpentSeconds: 0
   }

3. Quiz tamamlanır
4. Frontend doğru/yanlış hesaplar:
   10 sorudan 8'i doğru = %80

5. POST /learner/progress/part
   {
     partId,
     progressPercentage: 80,    // MANUAL mode - frontend hesapladı
     timeSpentSeconds: quiz süresi
   }

6. %100 ise backend otomatik COMPLETED yapar
```

---

### Akış 5: Öğrenci Part Değiştiriyor
```
1. Yeni part'a tıklanır
2. Video durursa son durum kaydedilir (3B endpoint)
3. Yeni part açılır
4. GET /learner/progress/course/{courseId} çağrılır (güncel progress için)
5. UI güncellenir
```

---

## ⚠️ Önemli Notlar

### 1. Cache Stratejisi
- **Kurs içeriği** (2A endpoint): Cache'lenebilir (localStorage, 1 saat)
- **Progress bilgileri** (2B endpoint): Asla cache'leme, her zaman fresh

### 2. Paralel Çağrılar
- Kurs sayfası açılırken 2A ve 2B **paralel** çağrılmalı (daha hızlı)
- Dashboard endpoint tek başına çağrılır

### 3. Progress Güncelleme Sıklığı
- **Material progress**: Her 10 saniye
- **Part progress**: Her 30 saniye
- **Çok sık çağırma** → Backend yüklenebilir
- **Çok seyrek çağırma** → Kullanıcı kapanırsa kayıp olur

### 4. Completion Kriterleri
- **Material**: %90 izlendi → otomatik completed
- **Part (material bazlı)**: Tüm materyaller completed → otomatik completed
- **Part (quiz bazlı)**: %100 gönderilirse → otomatik completed

### 5. ID Eşleştirme
```
ÇOK ÖNEMLİ: Progress data'sı ID bazlı merge edilecek!

partProgress.partId === part.id
materialProgress.materialId === material.id

Eşleşmezse progress gösterilemez!
```

### 6. Completion Status Değerleri
```
NOT_STARTED  → Hiç açılmamış (gri)
IN_PROGRESS  → Başlanmış ama bitmemiş (mavi)
COMPLETED    → Tamamlanmış (yeşil ✅)
LOCKED       → Kilitli (opsiyonel, kullanılmayabilir)
```

### 7. Video Kaldığı Yerden Başlatma
```
material.progress.currentPositionSeconds varsa:
  → video.currentTime = currentPositionSeconds
  → "Kaldığın yerden devam ediliyor" mesajı göster
yoksa:
  → video.currentTime = 0
```

### 8. Hata Durumları
```
Progress endpoint'leri başarısız olursa:
  → Kullanıcıya hata gösterme (silent fail)
  → Console'a log at
  → Sonraki interval'da tekrar dene
  
Kurs içeriği endpoint'i başarısız olursa:
  → Hata sayfası göster
  → Yeniden dene butonu
```

---

## 🎯 Özet: Frontend Developer Checklist

### Dashboard Sayfası:
- [ ] GET /learner/dashboard çağır
- [ ] activeCourses kartlarını render et
- [ ] "Kaldığın yerden devam et" butonu → nextContent.partId'ye git
- [ ] İstatistikleri göster

### Kurs Sayfası:
- [ ] GET /courses/{id}/details çağır
- [ ] GET /learner/progress/course/{id} çağır (paralel)
- [ ] İki data'yı ID bazlı merge et
- [ ] Part'lara completion badge ekle
- [ ] Progress bar'ları göster
- [ ] Kaldığı yeri işaretle

### Video Player:
- [ ] currentPositionSeconds'tan başlat
- [ ] Her 10 sn POST /material
- [ ] Her 30 sn POST /part (progressPercentage = null)
- [ ] Video durdurulunca/bitince son durumu kaydet
- [ ] Progress güncellenince UI'ı refresh et

### Quiz/Test:
- [ ] Başlarken POST /part (progressPercentage = 0)
- [ ] Bitince doğru/yanlış hesapla
- [ ] POST /part (progressPercentage = hesaplanan)
- [ ] %100 ise success mesajı göster

---

**Hazırlayan:** Backend Team  
**Tarih:** 2024-12-14  
**Versiyon:** 1.0
