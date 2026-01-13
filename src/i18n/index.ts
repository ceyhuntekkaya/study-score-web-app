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
    'common.search': 'Search...',
    'common.noData': 'No data available',
    'common.showing': 'Showing',
    'common.of': 'of',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.actions': 'Actions',
    
    // Admin - Course Management
    'admin.course.edit': 'Edit Course',
    'admin.course.add': 'Add New Course',
    'admin.course.info': 'Course Information',
    'admin.course.name': 'Course Name',
    'admin.course.code': 'Course Code',
    'admin.course.category': 'Category',
    'admin.course.language': 'Language',
    'admin.course.level': 'Level',
    'admin.course.backToList': 'Back to Courses List',
    
    // Admin - Lesson Management
    'admin.lesson.edit': 'Edit Lesson',
    'admin.lesson.add': 'Add New Lesson',
    'admin.lesson.name': 'Lesson Name',
    'admin.lesson.level': 'Level',
    'admin.lesson.orderNumber': 'Order Number',
    'admin.lesson.selectLevel': 'Select Level',
    'admin.lesson.unit': 'UNIT',
    'admin.lesson.topic': 'TOPIC',
    'admin.lesson.lesson': 'LESSON',
    'admin.lesson.newUnit': 'New UNIT',
    'admin.lesson.newTopic': 'New TOPIC',
    'admin.lesson.newLesson': 'New LESSON',
    'admin.lesson.curriculum': 'Course Curriculum',
    'admin.lesson.noContent': 'No lesson content has been added yet.',
    'admin.lesson.lessonName': 'LESSON NAME',
    'admin.lesson.levelHeader': 'LEVEL',
    'admin.lesson.addPart': 'Add Part',
    'admin.lesson.editPart': 'Edit',
    'admin.lesson.materialList': 'Material List',
    'admin.lesson.addSubLevel': 'Add Sub Level',
    'admin.lesson.addUnit': 'Add New Unit',
    
    // Admin - Part Management
    'admin.part.edit': 'Edit Part',
    'admin.part.add': 'Add New Part',
    'admin.part.name': 'Part Name',
    'admin.part.orderNumber': 'Order Number',
    
    // Admin - Material Management
    'admin.material.title': 'Materials',
    'admin.material.name': 'Material Name',
    'admin.material.mediaType': 'Media Type',
    'admin.material.orderNumber': 'Order',
    'admin.material.duration': 'Duration (sec)',
    'admin.material.content': 'Content',
    'admin.material.uploadedFileId': 'Uploaded File ID',
    'admin.material.selectMediaType': 'Select Media Type',
    'admin.material.preview': 'Preview',
    
    // Admin - Entity Management
    'admin.entity.edit': 'Edit',
    'admin.entity.add': 'Add New',
    'admin.entity.institution': 'Institution',
    'admin.entity.campus': 'Campus',
    'admin.entity.branch': 'Branch',
    'admin.entity.name': 'Name',
    'admin.entity.description': 'Description',
    'admin.entity.status': 'Status',
    'admin.entity.selectStatus': 'Select Status',
    'admin.entity.active': 'Active',
    'admin.entity.passive': 'Passive',
    'admin.entity.backToList': 'Back to List',
    'admin.entity.institutionsList': 'Institutions List',
    'admin.entity.campusesList': 'Campuses List',
    'admin.entity.selectInstitution': 'Select Institution',
    'admin.entity.selectCampus': 'Select Campus',
    'admin.entity.editInstitution': 'Edit Institution',
    'admin.entity.editCampus': 'Edit Campus',
    'admin.entity.editBranch': 'Edit Branch',
    'admin.entity.addInstitution': 'Add New Institution',
    'admin.entity.addCampus': 'Add New Campus',
    'admin.entity.addBranch': 'Add New Branch',
    'admin.entity.addStudent': 'Add New Student',
    'admin.entity.addExam': 'Add New Exam',
    'admin.entity.backToStudentsList': 'Back to Students List',
    'admin.entity.backToExamsList': 'Back to Exams List',
    'admin.entity.campusName': 'Campus Name',
    'admin.entity.institutionName': 'Institution Name',
    'admin.entity.branchName': 'Branch Name',
    'admin.entity.createdAt': 'Created Date',
    'admin.entity.branchList': 'Branch List',
    'admin.entity.institutions': 'Institutions',
    'admin.entity.campuses': 'Campuses',
    'admin.entity.branches': 'Branches',
    
    // Common Form Labels
    'form.label.description': 'Description',
    'form.label.orderNumber': 'Order Number',
    'form.label.duration': 'Duration (seconds)',
    'form.label.select': 'Select',
    'form.label.required': 'Required',
    'form.label.email': 'Email',
    'form.label.phone': 'Phone',
    'form.label.website': 'Website',
    'form.label.contactPerson': 'Contact Person',
    'form.label.address': 'Address',
    'form.label.logoUrl': 'Logo URL',
    'form.label.grade': 'Grade',
    
    // Common Messages
    'message.selectOperation': 'Select an operation from the left side.',
    'message.courseNotFound': 'Course not found.',
    
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
    'menu.exams': 'Exams',
    'menu.wishlist': 'Wishlist',
    'menu.reviews': 'Reviews',
    'menu.myQuizAttempts': 'My Quiz Attempts',
    'menu.orderHistory': 'Order History',
    'menu.content': 'Content',
    'menu.myCourses': 'My Courses',
    'menu.announcements': 'Announcements',
    'menu.quizAttempts': 'Quiz Attempts',
    'menu.assignments': 'Assignments',
    'menu.admin': 'Admin',
    'menu.institutions': 'Institutions',
    'menu.courses': 'Courses',
    'menu.students': 'Students',
    
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
    'common.search': 'Ara...',
    'common.noData': 'Veri bulunamadı',
    'common.showing': 'Gösteriliyor',
    'common.of': '/',
    'common.add': 'Ekle',
    'common.close': 'Kapat',
    'common.actions': 'İşlemler',
    
    // Admin - Course Management
    'admin.course.edit': 'Kurs Düzenle',
    'admin.course.add': 'Yeni Kurs Ekle',
    'admin.course.info': 'Kurs Bilgileri',
    'admin.course.name': 'Kurs Adı',
    'admin.course.code': 'Kurs Kodu',
    'admin.course.category': 'Kategori',
    'admin.course.language': 'Dil',
    'admin.course.level': 'Seviye',
    'admin.course.backToList': 'Kurslar Listesine Dön',
    
    // Admin - Lesson Management
    'admin.lesson.edit': 'Ders Düzenle',
    'admin.lesson.add': 'Yeni Ders Ekle',
    'admin.lesson.name': 'Ders Adı',
    'admin.lesson.level': 'Seviye',
    'admin.lesson.orderNumber': 'Sıra Numarası',
    'admin.lesson.selectLevel': 'Seviye seçiniz',
    'admin.lesson.unit': 'UNIT',
    'admin.lesson.topic': 'TOPIC',
    'admin.lesson.lesson': 'LESSON',
    'admin.lesson.newUnit': 'Yeni UNIT Ekle',
    'admin.lesson.newTopic': 'Yeni TOPIC Ekle',
    'admin.lesson.newLesson': 'Yeni LESSON Ekle',
    'admin.lesson.curriculum': 'Kurs Müfredatı',
    'admin.lesson.noContent': 'Henüz ders içeriği eklenmemiş.',
    'admin.lesson.lessonName': 'DERS ADI',
    'admin.lesson.levelHeader': 'SEVIYE',
    'admin.lesson.addPart': 'Part Ekleme',
    'admin.lesson.editPart': 'Düzenle',
    'admin.lesson.materialList': 'Materyal Listesi',
    'admin.lesson.addSubLevel': 'Alt Seviye Ekle',
    'admin.lesson.addPartButton': 'Part Ekle',
    'admin.lesson.addUnit': 'Yeni Birim Ekle',
    
    // Admin - Part Management
    'admin.part.edit': 'Part Düzenle',
    'admin.part.add': 'Yeni Part Ekle',
    'admin.part.name': 'Part Adı',
    'admin.part.orderNumber': 'Sıra Numarası',
    
    // Admin - Material Management
    'admin.material.title': 'Materyaller',
    'admin.material.name': 'Materyal Adı',
    'admin.material.mediaType': 'Medya Tipi',
    'admin.material.orderNumber': 'Sıra',
    'admin.material.duration': 'Süre (sn)',
    'admin.material.content': 'İçerik',
    'admin.material.uploadedFileId': 'Yüklenen Dosya ID',
    'admin.material.selectMediaType': 'Medya tipi seçiniz',
    'admin.material.preview': 'Ön İzleme',
    
    // Admin - Entity Management
    'admin.entity.edit': 'Düzenle',
    'admin.entity.add': 'Yeni Ekle',
    'admin.entity.institution': 'Kurum',
    'admin.entity.campus': 'Kampüs',
    'admin.entity.branch': 'Branch',
    'admin.entity.name': 'Ad',
    'admin.entity.description': 'Açıklama',
    'admin.entity.status': 'Durum',
    'admin.entity.selectStatus': 'Durum seçiniz',
    'admin.entity.active': 'Aktif',
    'admin.entity.passive': 'Pasif',
    'admin.entity.backToList': 'Listeye Dön',
    'admin.entity.institutionsList': 'Kurumlar Listesine Dön',
    'admin.entity.campusesList': 'Kampüsler Listesine Dön',
    'admin.entity.selectInstitution': 'Kurum Seçin',
    'admin.entity.selectCampus': 'Kampüs Seçin',
    'admin.entity.editInstitution': 'Kurum Düzenle',
    'admin.entity.editCampus': 'Kampüs Düzenle',
    'admin.entity.editBranch': 'Branch Düzenle',
    'admin.entity.addInstitution': 'Yeni Kurum Ekle',
    'admin.entity.addCampus': 'Yeni Kampüs Ekle',
    'admin.entity.addBranch': 'Yeni Branch Ekle',
    'admin.entity.addStudent': 'Yeni Öğrenci Ekle',
    'admin.entity.addExam': 'Yeni Sınav Ekle',
    'admin.entity.backToStudentsList': 'Öğrenciler Listesine Dön',
    'admin.entity.backToExamsList': 'Sınavlar Listesine Dön',
    'admin.entity.campusName': 'Kampüs Adı',
    'admin.entity.institutionName': 'Kurum Adı',
    'admin.entity.branchName': 'Branch Adı',
    'admin.entity.createdAt': 'Oluşturulma Tarihi',
    'admin.entity.branchList': 'Branch Listesi',
    'admin.entity.institutions': 'Kurumlar',
    'admin.entity.campuses': 'Kampüsler',
    'admin.entity.branches': 'Branch\'ler',
    
    // Common Form Labels
    'form.label.description': 'Açıklama',
    'form.label.orderNumber': 'Sıra Numarası',
    'form.label.duration': 'Süre (saniye)',
    'form.label.select': 'Seçiniz',
    'form.label.required': 'Zorunlu',
    'form.label.email': 'E-posta',
    'form.label.phone': 'Telefon',
    'form.label.website': 'Website',
    'form.label.contactPerson': 'İletişim Kişisi',
    'form.label.address': 'Adres',
    'form.label.logoUrl': 'Logo URL',
    'form.label.grade': 'Sınıf',
    
    // Common Messages
    'message.selectOperation': 'Sol taraftan bir işlem seçin.',
    'message.courseNotFound': 'Kurs bulunamadı.',
    
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
    'menu.exams': 'Sınavlar',
    'menu.wishlist': 'İstek Listesi',
    'menu.reviews': 'Değerlendirmeler',
    'menu.myQuizAttempts': 'Quiz Denemelerim',
    'menu.orderHistory': 'Sipariş Geçmişi',
    'menu.content': 'İçerik',
    'menu.myCourses': 'Kurslarım',
    'menu.announcements': 'Duyurular',
    'menu.quizAttempts': 'Quiz Denemeleri',
    'menu.assignments': 'Ödevler',
    'menu.admin': 'Admin',
    'menu.institutions': 'Kurumlar',
    'menu.courses': 'Kurslar',
    'menu.students': 'Öğrenciler',
    
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

