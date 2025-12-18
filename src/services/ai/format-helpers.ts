// services/ai/format-helpers.ts

/**
 * LLM yanıtlarını markdown formatına dönüştürür
 * @param text İşlenecek ham metin
 * @returns Markdown formatında düzenlenmiş metin
 */
export function formatMarkdown(text: string): string {
  if (!text) return '';

  let formatted = text;

  // Kod bloklarını temizle (```plaintext, ```javascript vb.)
  formatted = formatted.replace(/```[\w]*\n?/g, '');

  // Gereksiz escape karakterlerini temizle
  formatted = formatted.replace(/\\n/g, '\n');

  // Çift satır sonlarını düzelt
  formatted = formatted.replace(/\n\n+/g, '\n\n');

  // Markdown başlıklarını temizle ve düzgün formata çevir
  formatted = formatted.replace(/^#{1,6}\s*(.+)$/gm, '**$1**');

  // Başlıkları belirginleştir
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '**$1**');

  // Listeleri düzgün hale getir
  formatted = formatted.replace(/^\d+\.\s/gm, '\n$&');
  formatted = formatted.replace(/^-\s/gm, '\n$&');

  // Soruları vurgula (? işaretleri arasındaki metni)
  formatted = formatted.replace(/\?([^?]+)\?/g, '**$1**');

  // Ayraçları düzgün göster
  formatted = formatted.replace(/^---$/gm, '\n---\n');

  // Başlangıç ve sondaki gereksiz boşlukları temizle
  formatted = formatted.trim();

  return formatted;
}

/**
 * Metni HTML formatına dönüştürür
 * @param text Markdown olarak işlenecek metin
 * @returns HTML string olarak formatlı içerik
 */
export function convertToHtml(text: string): string {
  if (!text) return '';

  let html = text;

  // Kod bloklarını temizle
  html = html.replace(/```[\w]*\n?/g, '');
  html = html.replace(/```/g, '');

  // ÖNCE Markdown formatlarını HTML'e dönüştür (satır sonlarını değiştirmeden önce)
  // Markdown başlıklarını işle (###, ##, #)
  html = html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Horizontal rule
    .replace(/^--- *$/gm, '<hr />')
    // Bold ve italic (satır içi formatlar)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Kod blokları (inline)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Numaralı listeler
    .replace(/^(\d+\.\s+.+)$/gm, '<div class="numbered-item">$1</div>')
    // Bullet listeler
    .replace(/^(-\s+.+)$/gm, '<div class="bullet-item">$1</div>');

  // SONRA satır sonlarını işle
  // Önce HTML tag'lerinden sonraki satır sonlarını geçici olarak işaretle
  html = html.replace(/(<\/h[1-6]>|<\/div>|<\/hr>|<\/p>)\n/g, '$1__TEMP_NEWLINE__');
  
  // Paragraf ayrımlarını koru (çift satır sonları paragraf olur)
  html = html.replace(/\n\n+/g, '</p><p>');
  
  // Tek satır sonlarını br tag'ine çevir
  html = html.replace(/\n/g, '<br />');
  
  // Geçici işaretleri geri çevir (HTML tag'lerinden sonra br olmasın)
  html = html.replace(/__TEMP_NEWLINE__/g, '');

  // Paragraf wrapper'ları ekle
  if (
    html &&
    !html.startsWith('<h') &&
    !html.startsWith('<div') &&
    !html.startsWith('<hr') &&
    !html.startsWith('<p>')
  ) {
    html = '<p>' + html + '</p>';
  }

  // Boş paragrafları temizle
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');
  // HTML tag'lerinden hemen sonraki <br /> tag'lerini temizle
  html = html.replace(/(<\/h[1-6]>|<\/div>|<\/hr>|<\/p>)<br \/>/g, '$1');
  // Birden fazla ardışık <br /> tag'lerini tek bir <br /> yap
  html = html.replace(/(<br \/>){2,}/g, '<br />');

  return html;
}

/**
 * LLM yanıtından gereksiz format işaretlerini temizler
 * @param text Temizlenecek metin
 * @returns Temizlenmiş metin
 */
export function cleanLLMResponse(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Kod bloğu işaretlerini tamamen kaldır
  cleaned = cleaned.replace(/```[\w]*\n?/g, '');
  cleaned = cleaned.replace(/```/g, '');

  // Markdown başlıklarını temizle (###, ##, # ile başlayanları)
  cleaned = cleaned.replace(/^#{1,6}\s*(.+)$/gm, '$1');

  // "Transition:" gibi etiketleri temizle
  cleaned = cleaned.replace(/^(Transition|Feedback|Note|Example):\s*/gim, '');

  // Gereksiz boşlukları temizle
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
}
