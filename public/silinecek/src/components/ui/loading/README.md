# Loading Components Usage Guide

This file explains how to use the created loading components.

## Import

```tsx
import { 
  PageLoading, 
  SimpleLoading, 
  InlineLoading, 
  LoadingSpinner,
  SkeletonLoading,
  LoadingDots
} from '@/components/ui/loading';
```

## 1. Page Loading (Full Page Loading)

Main page loading screen. Usually used in Next.js automatic loading.tsx file.

```tsx
// Automatically used in loading.tsx file
// Manual usage:
function MyPage() {
    const [isLoading, setIsLoading] = useState(true);
    
    if (isLoading) {
        return <PageLoading />;
    }
    
    return <div>Content...</div>;
}
```

## 2. Simple Loading (Simple Loading)

A more minimal full page loading screen.

```tsx
function MyComponent() {
    return <SimpleLoading />;
}
```

## 3. Inline Loading (Inline Loading)

Loading indicator for small areas within the page.

```tsx
function MyComponent() {
    return (
        <div>
            <h1>Title</h1>
            <InlineLoading 
                text="Loading data..." 
                size="medium"
                showSkeleton={true}
            />
        </div>
    );
}
```

### InlineLoading Props:

- `text?: string` - Text to display (default: "Loading...")
- `size?: 'small' | 'medium' | 'large'` - Size (default: 'medium')  
- `showSkeleton?: boolean` - Show skeleton content (default: false)

## 4. Loading Spinner (Spinner Component)

Used to show only a spinner.

```tsx
function MyComponent() {
    return (
        <div>
            <LoadingSpinner size="md" color="primary" />
            <p>Loading...</p>
        </div>
    );
}
```

### LoadingSpinner Props:

- `size?: 'sm' | 'md' | 'lg'` - Size (default: 'md')
- `color?: 'primary' | 'white' | 'gray' | 'custom'` - Color theme (default: 'primary')
- `className?: string` - Additional CSS classes

## 5. Skeleton Loading (Skeleton Loading)

Used to show content skeleton.

```tsx
function MyComponent() {
    return (
        <SkeletonLoading 
            lines={5}
            showHeader={true}
            theme="light"
        />
    );
}
```

### SkeletonLoading Props:

- `lines?: number` - Number of skeleton lines (default: 4)
- `showHeader?: boolean` - Show header skeleton (default: true)
- `theme?: 'light' | 'dark'` - Theme (default: 'light')
- `className?: string` - Additional CSS classes

## 6. Loading Dots (Loading Dots Animation)

Animated dots for loading states, especially useful for chat messages.

```tsx
function MyComponent() {
    return (
        <div>
            <p>AI is typing...</p>
            <LoadingDots 
                size="md"
                color="white"
                enhanced={true}
            />
        </div>
    );
}
```

### LoadingDots Props:

- `size?: 'sm' | 'md' | 'lg'` - Size of dots (default: 'md')
- `color?: 'primary' | 'white' | 'gray'` - Color theme (default: 'white')
- `enhanced?: boolean` - Use enhanced bounce animation (default: false)
- `className?: string` - Additional CSS classes

## 7. Button Loading (Button Loading State)

CSS class to add loading state to buttons.

```tsx
function MyButton() {
    const [isLoading, setIsLoading] = useState(false);
    
    return (
        <button 
            className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
            onClick={handleClick}
            disabled={isLoading}
        >
            <span className="buttonText">
                {isLoading ? 'Saving...' : 'Save'}
            </span>
        </button>
    );
}
```

## 7. Light Theme Support

Light theme support for InlineLoading:

```tsx
<div className="inline-loading-light">
    <InlineLoading text="Loading..." size="small" />
</div>
```

## Design Features

- **Color Scheme**: Uses your existing color palette (#0a2e5e, #b7113d)
- **Responsive**: Looks good on all devices
- **Animations**: Smooth and professional animations
- **Logo Integration**: Uses your existing logo file
- **Background Pattern**: Mimics your existing design pattern
- **Modular Structure**: Each component can be used independently

## CSS Classes

Available CSS classes:

- `.page-loading-container` - Full page loading container
- `.loading-spinner` - Spinning loader
- `.loading-skeleton` - Skeleton placeholder
- `.btn-loading` - Button loading state
- `.inline-loading-light` - Light theme wrapper
- `.skeleton-light` - Light skeleton theme
- `.skeleton-dark` - Dark skeleton theme

Bu dosya, oluşturulan loading component'lerinin nasıl kullanılacağını açıklar.

## 1. Page Loading (Tam Sayfa Yükleme)

Ana sayfa yükleme ekranı. Genellikle Next.js'in otomatik loading.tsx dosyasında kullanılır.

```tsx
import { PageLoading } from '@/components/loading';

// Otomatik olarak loading.tsx dosyasında kullanılır
// Manuel kullanım:
function MyPage() {
    const [isLoading, setIsLoading] = useState(true);
    
    if (isLoading) {
        return <PageLoading />;
    }
    
    return <div>İçerik...</div>;
}
```

## 2. Simple Loading (Basit Yükleme)

Daha minimal bir tam sayfa yükleme ekranı.

```tsx
import { SimpleLoading } from '@/components/loading';

function MyComponent() {
    return <SimpleLoading />;
}
```

## 3. Inline Loading (Satır İçi Yükleme)

Sayfa içerisinde küçük alanlar için loading göstergesi.

```tsx
import { InlineLoading } from '@/components/loading';

function MyComponent() {
    return (
        <div>
            <h1>Title</h1>
            <InlineLoading 
                text="Loading data..." 
                size="medium"
                showSkeleton={true}
            />
        </div>
    );
}
```

### InlineLoading Props:

- `text?: string` - Text to display (default: "Loading...")
- `size?: 'small' | 'medium' | 'large'` - Size (default: 'medium')  
- `showSkeleton?: boolean` - Show skeleton content (default: false)

## 4. Button Loading (Buton Yükleme Durumu)

Butonlara loading durumu eklemek için CSS sınıfı.

```tsx
function MyButton() {
    const [isLoading, setIsLoading] = useState(false);
    
    return (
        <button 
            className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
            onClick={handleClick}
            disabled={isLoading}
        >
            <span className="buttonText">
                {isLoading ? 'Saving...' : 'Save'}
            </span>
        </button>
    );
}
```

## 5. Light Theme Support

InlineLoading için açık tema desteği:

```tsx
<div className="inline-loading-light">
    <InlineLoading text="Loading..." size="small" />
</div>
```

## Tasarım Özellikleri

- **Renk Şeması**: Projenizin mevcut renk paletini (#0a2e5e, #b7113d) kullanır
- **Responsive**: Tüm cihazlarda düzgün görünür
- **Animasyonlar**: Smooth ve professional animasyonlar
- **Logo Entegrasyonu**: Mevcut logo dosyanızı kullanır
- **Background Pattern**: Mevcut tasarım deseninizi taklit eder

## CSS Sınıfları

Kullanılabilir CSS sınıfları:
- `.page-loading-container` - Tam sayfa loading container'ı
- `.loading-content` - Loading içerik wrapper'ı
- `.loading-spinner` - Dönen loading göstergesi
- `.loading-skeleton` - Skeleton placeholder'lar
- `.btn-loading` - Buton loading durumu
- `.inline-loading-light` - Açık tema wrapper'ı