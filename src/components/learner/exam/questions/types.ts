/**
 * Shared types for all question template components.
 */

/** Uygulama: öğrenci cevap verebilir. Önizleme: cevap girilemez, doğru cevaplar ve ayar özeti görünür. */
export type QuestionDisplayMode = 'APPLICATION' | 'PREVIEW';

/** Tüm soru şablonlarında ortak props. */
export interface BaseQuestionProps {
  /** Uygulama (öğrenci cevaplar) veya Önizleme (cevap yok, doğru cevap + ayar özeti). Varsayılan: APPLICATION */
  mode?: QuestionDisplayMode;
  /** true ise soru altında AI Chat butonu gösterilir. Varsayılan: false */
  aiReady?: boolean;
}
