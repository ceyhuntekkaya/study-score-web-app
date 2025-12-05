/**
 * Internationalization (i18n)
 * Language support: English (default) and Turkish
 */

import { Language } from '@/types';
import { DEFAULT_LANGUAGE } from '@/constants';

type Translations = Record<string, string>;

const translations: Record<Language, Translations> = {
  en: {
    // Common
    'common.welcome': 'Welcome',
    'common.logout': 'Logout',
    'common.login': 'Login',
    'common.email': 'Email',
    'common.password': 'Password',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.language': 'Language',
    
    // Auth
    'auth.login.title': 'Login',
    'auth.login.subtitle': 'Sign in to your account',
    'auth.login.email.placeholder': 'Enter your email',
    'auth.login.password.placeholder': 'Enter your password',
    'auth.login.button': 'Sign In',
    'auth.login.error': 'Invalid email or password',
    'auth.logout.success': 'Logged out successfully',
    
    // Roles
    'role.learner': 'Learner',
    'role.tutor': 'Tutor',
    'role.manager': 'Manager',
    'role.admin': 'Admin',
    'role.writer': 'Writer',
    
    // Learner Content Types
    'learner.quiz': 'Quiz',
    'learner.exam': 'Exam',
    'learner.content': 'Content',
    'learner.dashboard': 'Dashboard',
    
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.courses': 'Courses',
    'nav.about': 'About',
    'nav.events': 'Events',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    
    // Menu Sections
    'menu.welcome': 'Welcome',
    'menu.instructor': 'Instructor',
    'menu.user': 'User',
    
    // Sidebar Menu Items
    'menu.dashboard': 'Dashboard',
    'menu.myProfile': 'My Profile',
    'menu.enrolledCourses': 'Enrolled Courses',
    'menu.wishlist': 'Wishlist',
    'menu.reviews': 'Reviews',
    'menu.myQuizAttempts': 'My Quiz Attempts',
    'menu.orderHistory': 'Order History',
    'menu.content': 'Content',
    'menu.myCourses': 'My Courses',
    'menu.announcements': 'Announcements',
    'menu.quizAttempts': 'Quiz Attempts',
    'menu.assignments': 'Assignments',
    
    // Header Menu Items
    'menu.myDashboard': 'My Dashboard',
    
    // User Menu Items
    'menu.bookmark': 'Bookmark',
    'menu.viewProfile': 'View Profile',
    
    // Top Menu Items
    'menu.myAccount': 'My Account',
    'menu.faq': 'FAQ',
    'menu.contactUs': 'Contact Us',
    'menu.privacyPolicy': 'Privacy Policy',
    'menu.termsCondition': 'Terms & Condition',
    'menu.registerNow': 'Register Now',
    
    // Errors
    'error.network': 'Network error. Please check your connection.',
    'error.unauthorized': 'Unauthorized. Please login again.',
    'error.forbidden': 'You do not have permission to access this page.',
    'error.notFound': 'Page not found.',
    'error.server': 'Server error. Please try again later.',
    'error.unknown': 'An unexpected error occurred.',
  },
  tr: {
    // Common
    'common.welcome': 'Hoş Geldiniz',
    'common.logout': 'Çıkış Yap',
    'common.login': 'Giriş Yap',
    'common.email': 'E-posta',
    'common.password': 'Şifre',
    'common.submit': 'Gönder',
    'common.cancel': 'İptal',
    'common.save': 'Kaydet',
    'common.delete': 'Sil',
    'common.edit': 'Düzenle',
    'common.back': 'Geri',
    'common.next': 'İleri',
    'common.previous': 'Önceki',
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.success': 'Başarılı',
    'common.confirm': 'Onayla',
    'common.language': 'Dil',
    
    // Auth
    'auth.login.title': 'Giriş Yap',
    'auth.login.subtitle': 'Hesabınıza giriş yapın',
    'auth.login.email.placeholder': 'E-posta adresinizi girin',
    'auth.login.password.placeholder': 'Şifrenizi girin',
    'auth.login.button': 'Giriş Yap',
    'auth.login.error': 'Geçersiz e-posta veya şifre',
    'auth.logout.success': 'Başarıyla çıkış yapıldı',
    
    // Roles
    'role.learner': 'Öğrenci',
    'role.tutor': 'Eğitmen',
    'role.manager': 'Yönetici',
    'role.admin': 'Admin',
    'role.writer': 'Yazar',
    
    // Learner Content Types
    'learner.quiz': 'Quiz',
    'learner.exam': 'Sınav',
    'learner.content': 'İçerik',
    'learner.dashboard': 'Kontrol Paneli',
    
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.dashboard': 'Kontrol Paneli',
    'nav.profile': 'Profil',
    'nav.settings': 'Ayarlar',
    'nav.courses': 'Kurslar',
    'nav.about': 'Hakkımızda',
    'nav.events': 'Etkinlikler',
    'nav.blog': 'Blog',
    'nav.contact': 'İletişim',
    
    // Menu Sections
    'menu.welcome': 'Hoş Geldiniz',
    'menu.instructor': 'Eğitmen',
    'menu.user': 'Kullanıcı',
    
    // Sidebar Menu Items
    'menu.dashboard': 'Kontrol Paneli',
    'menu.myProfile': 'Profilim',
    'menu.enrolledCourses': 'Kayıtlı Kurslar',
    'menu.wishlist': 'İstek Listesi',
    'menu.reviews': 'Değerlendirmeler',
    'menu.myQuizAttempts': 'Quiz Denemelerim',
    'menu.orderHistory': 'Sipariş Geçmişi',
    'menu.content': 'İçerik',
    'menu.myCourses': 'Kurslarım',
    'menu.announcements': 'Duyurular',
    'menu.quizAttempts': 'Quiz Denemeleri',
    'menu.assignments': 'Ödevler',
    
    // Header Menu Items
    'menu.myDashboard': 'Kontrol Panelim',
    
    // User Menu Items
    'menu.bookmark': 'Yer İşareti',
    'menu.viewProfile': 'Profili Görüntüle',
    
    // Top Menu Items
    'menu.myAccount': 'Hesabım',
    'menu.faq': 'SSS',
    'menu.contactUs': 'Bize Ulaşın',
    'menu.privacyPolicy': 'Gizlilik Politikası',
    'menu.termsCondition': 'Şartlar ve Koşullar',
    'menu.registerNow': 'Şimdi Kayıt Ol',
    
    // Errors
    'error.network': 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
    'error.unauthorized': 'Yetkisiz. Lütfen tekrar giriş yapın.',
    'error.forbidden': 'Bu sayfaya erişim izniniz yok.',
    'error.notFound': 'Sayfa bulunamadı.',
    'error.server': 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    'error.unknown': 'Beklenmeyen bir hata oluştu.',
  },
};

class I18nService {
  private currentLanguage: Language = DEFAULT_LANGUAGE;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && translations[savedLanguage]) {
        this.currentLanguage = savedLanguage;
      }
    }
  }

  setLanguage(language: Language) {
    this.currentLanguage = language;
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string, params?: Record<string, string | number>): string {
    const translation = translations[this.currentLanguage]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
    
    if (params) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return translation;
  }

  getTranslations(): Translations {
    return translations[this.currentLanguage] || translations[DEFAULT_LANGUAGE];
  }
}

export const i18n = new I18nService();

// Hook for React components
export function useTranslation() {
  return {
    t: (key: string, params?: Record<string, string | number>) => i18n.t(key, params),
    language: i18n.getLanguage(),
    setLanguage: (lang: Language) => i18n.setLanguage(lang),
  };
}

