// services/ai/llama.ts

import { getApiAiUrl } from '@/config';
import { getIELTSSystemContext } from './prompts';
import { getSATSystemContext } from './sat-prompts';
import { getGeneralEnglishSystemContext } from './general-english-prompts';
import { getTOEFLSystemContext } from './toefl-prompts';
import { getSATMathSystemContext } from './sat-math-prompts';

const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API_URL || getApiAiUrl();
const DEFAULT_MODEL = 'qwen2.5:7b';

export interface ChatResponse {
  message: {
    content: string;
  };
}

export class LlamaService {
  private modelName: string;
  private apiUrl: string;
  private conversationHistory: Array<{ role: string; content: string }>;
  private lessonContext: string = '';
  private studentName: string = '';
  private currentMode: 'learning' | 'analysis' | 'practice' | 'solve' = 'learning';
  private courseCategory: string = 'IELTS';

  // Anti-repetition: Her assistant yanıtından 120 kar. "parmak izi" saklanır.
  // Sonraki turda system[2]'ye eklenerek modele "bunları tekrarlama" direktifi verilir.
  private usedContentSummaries: string[] = [];
  private readonly MAX_TRACKED_SUMMARIES = 10;

  // History trim: uzun oturumlarda context window taşmasını önler.
  // system[0-2] her zaman korunur; user+assistant mesajları kırpılır.
  private readonly MAX_HISTORY_MESSAGES = 20;

  // Ders takibi: courseCategory değişince lessonId değişir → clearAllContext tetiklenir.
  // Sadece mode değişince lessonId aynı kalır → clearHistory (liste korunur).
  private currentLessonId: string = '';

  constructor(modelName: string = DEFAULT_MODEL, courseCategory: string = 'IELTS') {
    this.modelName = modelName;
    this.apiUrl = OLLAMA_API_URL;
    this.courseCategory = courseCategory;
    this.currentLessonId = courseCategory;
    this.conversationHistory = [
      { role: 'system', content: this.getSystemContext(this.studentName, this.currentMode) },
      { role: 'system', content: '' },
      { role: 'system', content: '' },
    ];
  }

  // ── Sistem context seçici ─────────────────────────────────────────────────

  private getSystemContext(
    studentName?: string,
    mode?: 'learning' | 'analysis' | 'practice' | 'solve'
  ): string {
    if (this.courseCategory === 'SAT_ENGLISH')    return getSATSystemContext(studentName, mode);
    if (this.courseCategory === 'SAT_MATH')       return getSATMathSystemContext(studentName, mode);
    if (this.courseCategory === 'TOEFL')          return getTOEFLSystemContext(studentName, mode);
    if (this.courseCategory === 'GENERAL_ENGLISH') return getGeneralEnglishSystemContext(studentName, mode);
    return getIELTSSystemContext(studentName, mode);
  }

  // ── Anti-repetition ───────────────────────────────────────────────────────

  private extractContentSummary(assistantResponse: string): string {
    return assistantResponse
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 120);
  }

  private buildAntiRepetitionBlock(): string {
    if (this.usedContentSummaries.length === 0) return '';

    const list = this.usedContentSummaries
      .map((s, i) => `  ${i + 1}. "${s}..."`)
      .join('\n');

    return `## ANTI-REPETITION DIRECTIVE (MANDATORY)

You have already produced the following content in this session.
DO NOT repeat, reuse, or closely paraphrase any of it.
Each new response MUST differ in: topic angle, vocabulary, sentence structure, and examples.

Previously used content (DO NOT reuse):
${list}

If you are about to generate something similar to the above, STOP and choose a completely different angle, example, or question.`;
  }

  private trackAssistantResponse(content: string): void {
    const summary = this.extractContentSummary(content);
    this.usedContentSummaries.push(summary);
    if (this.usedContentSummaries.length > this.MAX_TRACKED_SUMMARIES) {
      this.usedContentSummaries.shift();
    }
    this.updateAntiRepetitionSlot();
  }

  private updateAntiRepetitionSlot(): void {
    const block = this.buildAntiRepetitionBlock();
    if (this.conversationHistory.length > 2) {
      this.conversationHistory[2] = { role: 'system', content: block };
    } else {
      this.conversationHistory.push({ role: 'system', content: block });
    }
  }

  // ── History trim ──────────────────────────────────────────────────────────

  private trimHistoryIfNeeded(): void {
    const systemMessages = this.conversationHistory.slice(0, 3);
    const chatMessages   = this.conversationHistory.slice(3);

    if (chatMessages.length > this.MAX_HISTORY_MESSAGES) {
      const trimmed = chatMessages.slice(-this.MAX_HISTORY_MESSAGES);
      this.conversationHistory = [...systemMessages, ...trimmed];
    }
  }

  // ── Chat (non-stream) ─────────────────────────────────────────────────────

  async chat(prompt: string): Promise<ChatResponse | { message: { content: string } }> {
    try {
      this.conversationHistory.push({ role: 'user', content: prompt });
      this.trimHistoryIfNeeded();

      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          messages: this.conversationHistory,
          stream: false,
          options: {
            temperature: 0.85,
            top_p: 0.92,
            top_k: 60,
            repeat_penalty: 1.3,
            repeat_last_n: 256,
            frequency_penalty: 0.2,
            presence_penalty: 0.2,
            num_predict: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ollama API hatası: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();

      if (data.message?.content) {
        this.conversationHistory.push({ role: 'assistant', content: data.message.content });
        this.trackAssistantResponse(data.message.content);
      } else if (data.response) {
        this.conversationHistory.push({ role: 'assistant', content: data.response });
        this.trackAssistantResponse(data.response);
      }

      if (data && !data.message && data.response) {
        return { message: { content: data.response } };
      }

      return data;
    } catch (error) {
      console.error('Llama servis hatası:', error);
      throw error;
    }
  }

  // ── Chat (stream) ─────────────────────────────────────────────────────────

  async chatStream(
    prompt: string,
    onChunk: (text: string) => void,
    onEnd: () => void
  ): Promise<void> {
    try {
      this.conversationHistory.push({ role: 'user', content: prompt });
      this.trimHistoryIfNeeded();

      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          messages: this.conversationHistory,
          stream: true,
          options: {
            temperature: 0.85,
            top_p: 0.92,
            top_k: 60,
            repeat_penalty: 1.3,
            repeat_last_n: 256,
            frequency_penalty: 0.2,
            presence_penalty: 0.2,
            num_predict: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`AI API stream error: ${errorData.error || response.statusText}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported.');
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        try {
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');
          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.message?.content) {
                onChunk(json.message.content);
                accumulatedContent += json.message.content;
              } else if (json.response) {
                onChunk(json.response);
                accumulatedContent += json.response;
              }
            } catch (e) {
              console.warn('Stream parçası JSON olarak işlenemedi:', e, line);
            }
          }
        } catch (e) {
          console.error('Stream parçası işlenirken hata:', e);
        }
      }

      if (accumulatedContent) {
        this.conversationHistory.push({ role: 'assistant', content: accumulatedContent });
        this.trackAssistantResponse(accumulatedContent);
      }

      onEnd();
    } catch (error) {
      console.error('Stream error:', error);
      onChunk('Üzgünüm, bir hata oluştu.');
      onEnd();
    }
  }

  // ── Setter'lar ────────────────────────────────────────────────────────────

  setStudentName(name: string): void {
    this.studentName = name || '';
    this.conversationHistory[0] = {
      role: 'system',
      content: this.getSystemContext(this.studentName, this.currentMode),
    };
  }

  setLessonContext(description: string): void {
    this.lessonContext = description || '';
    if (this.conversationHistory.length > 1) {
      this.conversationHistory[1] = { role: 'system', content: this.lessonContext };
    }
  }

  /**
   * Mod değişimi: system prompt güncellenir, history ve anti-repetition listesi KORUNUR.
   * Aynı ders içinde Learning → Practice gibi geçişlerde kullanılır.
   */
  setMode(mode: 'learning' | 'analysis' | 'practice' | 'solve'): void {
    this.currentMode = mode;
    this.conversationHistory[0] = {
      role: 'system',
      content: this.getSystemContext(this.studentName, this.currentMode),
    };
  }

  /**
   * Kurs kategorisi değişimi.
   * Yeni kategori ise lessonId güncellenir ve clearAllContext otomatik tetiklenir.
   * Aynı kategori ise sadece system prompt güncellenir.
   */
  setCourseCategory(category: string): void {
    const newCategory = category || 'IELTS';
    const newLessonId = newCategory;

    if (newLessonId !== this.currentLessonId) {
      this.courseCategory  = newCategory;
      this.currentLessonId = newLessonId;
      this.clearAllContext(); // Yeni ders → her şeyi sıfırla
    } else {
      this.courseCategory = newCategory;
      this.conversationHistory[0] = {
        role: 'system',
        content: this.getSystemContext(this.studentName, this.currentMode),
      };
    }
  }

  // ── History yönetimi ──────────────────────────────────────────────────────

  /**
   * Sadece konuşma geçmişini temizler.
   * usedContentSummaries KORUNUR.
   * Kullanım: mode veya activeText değişimlerinde (aynı ders içi geçiş).
   */
  clearHistory(): void {
    this.resetHistory();
  }

  /**
   * Hem konuşma geçmişini hem anti-repetition listesini tamamen sıfırlar.
   * Kullanım: courseCategory değişiminde (yeni ders başlangıcı).
   *
   * AIChat.tsx'te önerilen kullanım:
   *   courseCategory değiştiğinde → clearAllContext()   ← YENİ DERS
   *   mode değiştiğinde           → clearChatHistory()  ← AYNI DERS, MOD GEÇİŞİ
   *   activeText değiştiğinde     → clearChatHistory()  ← AYNI DERS, BÖLÜM GEÇİŞİ
   */
  clearAllContext(): void {
    this.usedContentSummaries = [];
    this.resetHistory();
  }

  private resetHistory(): void {
    this.conversationHistory = [
      { role: 'system', content: this.getSystemContext(this.studentName, this.currentMode) },
      { role: 'system', content: this.lessonContext },
      { role: 'system', content: this.buildAntiRepetitionBlock() },
    ];
  }

  // ── Health check ──────────────────────────────────────────────────────────

  async healthCheck(): Promise<{ status: string; model: string }> {
    try {
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${this.apiUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Ollama servisi yanıt vermiyor');
      return { status: 'online', model: this.modelName };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Health check timeout:', error);
      } else {
        console.error('Sağlık kontrolü hatası:', error);
      }
      return { status: 'offline', model: this.modelName };
    }
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────

export const llamaService = new LlamaService();

// ── Yardımcı fonksiyonlar ─────────────────────────────────────────────────

export async function chatWithLlama(prompt: string): Promise<ChatResponse> {
  return llamaService.chat(prompt) as Promise<ChatResponse>;
}

export async function streamChatWithLlama(
  prompt: string,
  onChunk: (text: string) => void,
  onEnd: () => void
): Promise<void> {
  return llamaService.chatStream(prompt, onChunk, onEnd);
}

export async function checkLlamaHealth(): Promise<{ status: string; model: string }> {
  return llamaService.healthCheck();
}

/**
 * Mevcut wrapper — AIChat'te mode/activeText değişimlerinde kullanılmaya devam edebilir.
 * Anti-repetition listesi KORUNUR.
 */
export function clearChatHistory(): void {
  return llamaService.clearHistory();
}

/**
 * Yeni ders başlangıcında çağrılmalı (courseCategory değişimi).
 * Anti-repetition listesi DAHİL her şeyi sıfırlar.
 */
export function clearAllContext(): void {
  return llamaService.clearAllContext();
}

export function setLessonContext(description: string): void {
  return llamaService.setLessonContext(description);
}

export function setStudentName(name: string): void {
  return llamaService.setStudentName(name);
}

export function setAIMode(mode: 'learning' | 'analysis' | 'practice' | 'solve'): void {
  return llamaService.setMode(mode);
}

/**
 * setCourseCategory artık lessonId değişimini otomatik algılar.
 * Yeni kategori ise clearAllContext, aynı kategori ise sadece günceller.
 */
export function setCourseCategory(category: string): void {
  return llamaService.setCourseCategory(category);
}