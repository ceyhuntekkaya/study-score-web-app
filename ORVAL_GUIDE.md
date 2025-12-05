# Orval API Generation - StudyScore Dokümantasyonu

## 📋 İçindekiler
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Güncelleme](#güncelleme)
- [Örnekler](#örnekler)
- [Sorun Giderme](#sorun-giderme)

---

## 🚀 Kurulum

### 1. Backend Hazırlık

**Spring Boot'ta OpenAPI aktif olmalı:**

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

**Test et:**
```
http://localhost:8080/api/v3/api-docs
http://localhost:8080/api/swagger-ui/index.html
```

### 2. Frontend Paketleri

```bash
npm install --save-dev orval
npm install @tanstack/react-query axios
npm install --save-dev prettier  # opsiyonel
```

### 3. Konfigürasyon Dosyaları

**orval.config.ts** (root dizinde)
```typescript
import { defineConfig } from 'orval';

export default defineConfig({
  studyscore: {
    input: {
      target: 'http://localhost:8080/api/v3/api-docs',
    },
    output: {
      mode: 'tags-split',
      target: 'src/generated/api',
      client: 'react-query',
      override: {
        mutator: {
          path: 'src/lib/api-client.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
```

**src/lib/api-client.ts**
```typescript
import Axios, { AxiosRequestConfig, AxiosError } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token ekleme
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('token') 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - error handling
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Custom instance for orval
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;
```

**src/providers/query-provider.tsx**
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

**app/layout.tsx'e ekle:**
```typescript
import { QueryProvider } from '@/providers/query-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

**.env.local**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. package.json Script

```json
{
  "scripts": {
    "generate:api": "orval"
  }
}
```

### 5. İlk Generate

```bash
# Backend'i çalıştır
cd backend && ./mvnw spring-boot:run

# Frontend'de generate et
cd frontend && npm run generate:api
```

**Oluşan yapı:**
```
src/generated/api/
├── exam-rest-controller/
│   └── exam-rest-controller.ts
├── user-rest-controller/
│   └── user-rest-controller.ts
├── branch-rest-controller/
│   └── branch-rest-controller.ts
└── openAPIDefinition.schemas.ts  # Tüm DTO & Enum'lar
```

---

## 💻 Kullanım

### Query (GET) Hook Kullanımı

```typescript
import { useGetAllExams } from '@/generated/api/exam-rest-controller/exam-rest-controller';
import { ExamDto } from '@/generated/api/openAPIDefinition.schemas';

function ExamsPage() {
  const { data, isLoading, error, refetch } = useGetAllExams({
    page: 0,
    size: 10,
  });

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <div>
      {data?.content?.map((exam: ExamDto) => (
        <div key={exam.id}>{exam.name}</div>
      ))}
    </div>
  );
}
```

### Mutation (POST/PUT/DELETE) Hook Kullanımı

```typescript
import { 
  useCreateExam,
  useUpdateExam,
  useDeleteExam 
} from '@/generated/api/exam-rest-controller/exam-rest-controller';

function ExamActions() {
  const createMutation = useCreateExam();
  const updateMutation = useUpdateExam();
  const deleteMutation = useDeleteExam();

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        data: {
          name: 'Yeni Sınav',
          duration: 60,
        }
      });
      alert('Başarılı!');
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const handleUpdate = async (examId: string) => {
    await updateMutation.mutateAsync({
      examId,
      data: { name: 'Güncellenmiş Sınav' }
    });
  };

  const handleDelete = async (examId: string) => {
    await deleteMutation.mutateAsync({ examId });
  };

  return (
    <div>
      <button 
        onClick={handleCreate}
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Oluşturuluyor...' : 'Yeni Sınav'}
      </button>
    </div>
  );
}
```

### Enum Kullanımı

```typescript
import { 
  BranchGrade,
  BranchStatus 
} from '@/generated/api/openAPIDefinition.schemas';

// Dropdown için
const GRADE_OPTIONS = Object.values(BranchGrade);

// Tip güvenli kullanım
const activeBranches = branches?.filter(
  b => b.status === BranchStatus.ACTIVE
);

// Label mapping
const GRADE_LABELS: Record<BranchGrade, string> = {
  [BranchGrade.GRADE_1]: '1. Sınıf',
  [BranchGrade.GRADE_2]: '2. Sınıf',
  // ...
};
```

### Manuel Refetch

```typescript
function ExamsList() {
  const { data, refetch } = useGetAllExams();

  const handleRefresh = () => {
    refetch(); // Manuel yenileme
  };

  return <button onClick={handleRefresh}>Yenile</button>;
}
```

### Mutation Sonrası Refetch

```typescript
import { useQueryClient } from '@tanstack/react-query';

function CreateExamForm() {
  const queryClient = useQueryClient();
  const createMutation = useCreateExam();

  const handleSubmit = async (data: any) => {
    await createMutation.mutateAsync({ data });
    
    // İlgili query'leri invalidate et
    queryClient.invalidateQueries({ 
      queryKey: ['exam-rest-controller'] 
    });
  };
}
```

---

## 🔄 Güncelleme

### Backend Değişiklik Sonrası

```bash
# 1. Backend'i çalıştır (yeni değişikliklerle)
cd backend
./mvnw spring-boot:run

# 2. Frontend'de API'leri güncelle
cd frontend
npm run generate:api

# 3. TypeScript hatalarını kontrol et
npm run build
# veya
npx tsc --noEmit

# 4. Hataları düzelt ve commit et
git add src/generated
git commit -m "chore: update API types"
```

### Ne Zaman Generate Etmeli?

✅ Backend'de yeni endpoint eklendi
✅ DTO'ya prop eklendi/silindi
✅ Enum değeri değişti
✅ API path veya parametreler değişti
✅ Git pull sonrası backend değişmişse

### Değişiklik Senaryoları

**DTO'dan prop silindi:**
```typescript
// Önceki generate:
interface ExamDto {
  id?: string;
  name?: string;
  description?: string; // Bu silindi backend'de
}

// npm run generate:api sonrası:
interface ExamDto {
  id?: string;
  name?: string;
  // description artık yok
}

// TypeScript uyarır:
exam.description // ❌ Error: Property 'description' does not exist
```

**Yeni enum eklendi:**
```typescript
// Otomatik oluşur:
export const ExamType = {
  QUIZ: 'QUIZ',
  MIDTERM: 'MIDTERM',
  FINAL: 'FINAL',
} as const;
```

**Endpoint silindi:**
```typescript
import { useDeleteExam } from '...'; 
// ❌ Error: Cannot find module
```

---

## 📝 Örnekler

### Tam CRUD Örneği

```typescript
'use client';

import {
  useGetAllExams,
  useGetExamById,
  useCreateExam,
  useUpdateExam,
  useDeleteExam,
} from '@/generated/api/exam-rest-controller/exam-rest-controller';
import { ExamDto } from '@/generated/api/openAPIDefinition.schemas';
import { useState } from 'react';

export default function ExamsManagement() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // LIST
  const { data: exams, isLoading, refetch } = useGetAllExams({
    page: 0,
    size: 20,
  });

  // GET BY ID
  const { data: selectedExam } = useGetExamById(
    { examId: selectedId! },
    { enabled: !!selectedId }
  );

  // CREATE
  const createMutation = useCreateExam();

  // UPDATE
  const updateMutation = useUpdateExam();

  // DELETE
  const deleteMutation = useDeleteExam();

  const handleCreate = async (formData: Partial<ExamDto>) => {
    try {
      await createMutation.mutateAsync({ data: formData });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: string, formData: Partial<ExamDto>) => {
    try {
      await updateMutation.mutateAsync({
        examId: id,
        data: formData,
      });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    
    try {
      await deleteMutation.mutateAsync({ examId: id });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <button onClick={() => handleCreate({ name: 'Yeni Sınav' })}>
        Yeni Ekle
      </button>

      {exams?.content?.map((exam) => (
        <div key={exam.id}>
          <h3>{exam.name}</h3>
          <button onClick={() => setSelectedId(exam.id!)}>
            Detay
          </button>
          <button onClick={() => handleUpdate(exam.id!, { name: 'Güncellendi' })}>
            Güncelle
          </button>
          <button onClick={() => handleDelete(exam.id!)}>
            Sil
          </button>
        </div>
      ))}

      {selectedExam && (
        <div>
          <h2>Seçili Sınav: {selectedExam.name}</h2>
          {/* Detaylar */}
        </div>
      )}
    </div>
  );
}
```

### Pagination Örneği

```typescript
function ExamsPaginated() {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading } = useGetAllExams({
    page,
    size: pageSize,
  });

  return (
    <div>
      {/* Liste */}
      {data?.content?.map(exam => <div key={exam.id}>{exam.name}</div>)}

      {/* Pagination */}
      <div>
        <button 
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          Önceki
        </button>
        
        <span>Sayfa {page + 1} / {data?.totalPages}</span>
        
        <button 
          disabled={page >= (data?.totalPages || 1) - 1}
          onClick={() => setPage(p => p + 1)}
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}
```

### Filter Örneği

```typescript
function ExamsFiltered() {
  const [filters, setFilters] = useState({
    status: 'ACTIVE',
    grade: 'GRADE_10',
    search: '',
  });

  const { data } = useGetAllExams(filters);

  return (
    <div>
      <select 
        value={filters.status}
        onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
      >
        <option value="ACTIVE">Aktif</option>
        <option value="PASSIVE">Pasif</option>
      </select>

      <input
        value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        placeholder="Ara..."
      />

      {/* Sonuçlar */}
      {data?.content?.map(exam => <div key={exam.id}>{exam.name}</div>)}
    </div>
  );
}
```

---

## 🔧 Sorun Giderme

### Hata: "Cannot find module '@/generated/api/...'"

```bash
# API'leri henüz generate etmedin
npm run generate:api
```

### Hata: "Failed to fetch http://localhost:8080/api/v3/api-docs"

```bash
# Backend çalışmıyor
cd backend && ./mvnw spring-boot:run

# Doğru URL'i kontrol et
# orval.config.ts içinde: http://localhost:8080/api/v3/api-docs
```

### TypeScript Hatası: Property does not exist

```bash
# Backend değişmiş, frontend güncel değil
npm run generate:api

# Sonra hataları düzelt
```

### CORS Hatası

**Backend'de (SecurityConfig.java):**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:3000");
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 401 Unauthorized

```typescript
// Token'ı localStorage'a kaydet
localStorage.setItem('token', 'your-jwt-token');

// api-client.ts otomatik ekler
```

### Prettier Hook Hatası

```bash
# Prettier'ı kur
npm install --save-dev prettier

# Veya hook'u kaldır (orval.config.ts'den)
```

---

## 📚 Faydalı Komutlar

```bash
# API'leri güncelle
npm run generate:api

# TypeScript kontrolü
npx tsc --noEmit

# Build (tip kontrolü dahil)
npm run build

# Generate edilen dosyaları gör
ls -la src/generated/api/

# Backend API docs'u aç
open http://localhost:8080/api/swagger-ui/index.html
```

---

## ✅ Checklist - Yeni Geliştirici İçin

- [ ] Backend çalışıyor mu? (`./mvnw spring-boot:run`)
- [ ] OpenAPI endpoint açık mı? (`/api/v3/api-docs`)
- [ ] orval kurulu mu? (`npm install`)
- [ ] `npm run generate:api` çalıştı mı?
- [ ] `QueryProvider` eklendi mi? (`app/layout.tsx`)
- [ ] `.env.local` var mı? (`NEXT_PUBLIC_API_URL`)
- [ ] İlk hook'u dene (`useGetAllExams`)

---

## 🎯 Best Practices

✅ Her backend değişikliğinden sonra `generate:api` çalıştır
✅ Generate edilen dosyaları git'e commit et
✅ TypeScript strict mode kullan
✅ Query key'leri elle yazmak yerine generated hook'ları kullan
✅ Enum'ları string yerine kullan (tip güvenliği)
✅ Loading ve error state'leri her zaman handle et
✅ Mutation sonrası ilgili query'leri invalidate et

❌ Generate edilen dosyaları elle düzenleme
❌ DTO tiplerini manuel kopyalama
❌ Enum değerlerini string olarak yazma
❌ API URL'lerini hardcode etme

---

**Son Güncelleme:** Aralık 2024  
**Proje:** StudyScore AI - Genixo
