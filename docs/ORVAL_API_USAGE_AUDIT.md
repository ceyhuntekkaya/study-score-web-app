# Orval API Kullanım Denetimi

Bu doküman, projede Orval ile üretilen API’ler yerine elle yazılmış çağrıların nerede olduğunu ve Orval güncellemelerinin neden yansımadığını özetler.

---

## 1. Tamamen Orval Kullanan Yerler (Sorun yok)

- **Login:** `app/(public)/login/page.tsx` → `useLogin` (auth-rest-controller)
- **Sınav:** `useGetExamWithUserData`, `useStartExam` (exam-controller)
- **Soru cevapları:** `questionResponseService.ts` → Orval’ın `useGetResponses`, `useSaveOrUpdate` (question-response-controller)
- **Profil / kullanıcı:** `useGetCurrentUser` (auth-rest-controller)
- **Kurs, ders, materyal, dashboard, admin CRUD:** İlgili sayfa/bileşenler doğrudan `@/generated/api/...` hook’larını kullanıyor

Bu alanlarda Orval’ı güncellediğinizde tipler ve endpoint’ler otomatik yansır.

---

## 2. Orval Yerine Elle Yazılmış / Çakışan Yerler

### 2.1 Auth servisi (kullanılmıyor – kaldırıldı)

- **Dosyalar:** `src/services/api/authService.ts`, `src/services/api/client.ts`
- **Durum:** `authService` ve `apiClient` hiçbir dosyada import edilmiyor (dead code).
- **Orval karşılığı:** auth-rest-controller → `useLogin`, `useLogout`, `refreshToken`, `useGetCurrentUser`
- **Not:** `client.ts` içinde 401’de token yenileme için `/auth/refresh` kullanılıyor; Orval’da endpoint `/auth/refresh-token`. Bu client kullanılmadığı için şu an bir etkisi yok.
- **Yapılan:** `authService.ts` kaldırıldı. `client.ts` duruyor; ileride kullanılacaksa Orval/OpenAPI ile uyumlu hale getirilmeli.

### 2.2 Dosya yükleme (customInstance, Orval ile uyumsuz imza)

- **Dosyalar:**
  - `src/components/ui/MediaUpload.tsx` → `customInstance({ url: '/files/upload', method: 'POST', data: formData })`
  - `src/components/admin/MaterialForm.tsx` → Aynı şekilde `customInstance` ile FormData ile `/files/upload`
- **Orval:** file-rest-controller → `uploadFile(params)`, `useUploadFile`. Şu anki üretim: **params** (query string) ile çağrı; dosya upload için genelde **FormData (body)** beklenir.
- **Sonuç:** Backend gerçekten FormData bekliyorsa, Orval’ın `uploadFile(params)` imzası OpenAPI’de yanlış tanımlanmış demektir. Bu yüzden şu an **Orval’ı kullanmadan** customInstance ile FormData kullanmak doğru.
- **Öneri:** OpenAPI’de `/files/upload` multipart/form-data (body) olarak tanımlanıp Orval yeniden çalıştırılırsa, bu iki bileşende `useUploadFile` kullanılabilir; o zamana kadar mevcut custom çağrılar güncellemelerden etkilenmeyecek (Orval’da bu endpoint’i değiştirseniz bile bu iki dosya Orval’a bakmıyor).

---

## 3. Orval Güncellemesinin Yansımamasının Olası Nedenleri

1. **Sadece bu dokümandaki “Orval yerine elle yazılmış” yerler:** Auth (zaten kaldırıldı) ve file upload. Geri kalanı Orval kullanıyor; güncelleme oralara yansır.
2. **Kendi yazdığınız servis/wrapper’lar:** Örneğin `questionResponseService.ts` artık tamamen Orval’a dayanıyor; Orval’ı güncellediğinizde tipler ve endpoint’ler oradan gelir.
3. **Cache / build:** `npm run build` veya Orval’ı çalıştırdıktan sonra projeyi yeniden derleyip tarayıcı cache’ini temizlemek gerekebilir.
4. **OpenAPI spec path’i:** Orval’ın okuduğu OpenAPI dosyası güncel mi, doğru path’ten mi alınıyor kontrol edin.

---

## 4. Kısa Kontrol Listesi

| Alan            | Orval kullanılıyor mu? | Not |
|-----------------|------------------------|-----|
| Auth (login, me, logout) | Evet (login sayfası, profil) | authService kullanılmıyor, kaldırıldı |
| Question responses      | Evet (questionResponseService) | Sadece Orval + ince wrapper |
| Exam (start, with-user-data) | Evet | |
| File upload             | Hayır (customInstance + FormData) | OpenAPI multipart düzeltilirse Orval’a geçilebilir |
| Diğer tüm REST (course, exam, question, learner, vb.) | Evet | generated/api altından |

Bu doküman, “Orval yerine kendi yazdığımız ama Orval kullanılması gereken yerler” sorusuna göre güncellenmiştir.
