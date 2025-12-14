// services/ai/llama.ts

import { getApiAiUrl } from '@/config';
import { IELTS_SYSTEM_CONTEXT } from './prompts';

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

  constructor(modelName: string = DEFAULT_MODEL) {
    this.modelName = modelName;
    this.apiUrl = OLLAMA_API_URL;
    this.conversationHistory = [
      {
        role: 'system',
        content: IELTS_SYSTEM_CONTEXT,
      },
    ];
  }

  async chat(prompt: string): Promise<ChatResponse | { message: { content: string } }> {
    try {
      // Kullanıcı mesajını geçmişe ekle
      this.conversationHistory.push({
        role: 'user',
        content: prompt,
      });

      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: this.conversationHistory,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ollama API hatası: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();

      // Asistan yanıtını geçmişe ekle
      if (data.message && data.message.content) {
        this.conversationHistory.push({
          role: 'assistant',
          content: data.message.content,
        });
      } else if (data.response) {
        this.conversationHistory.push({
          role: 'assistant',
          content: data.response,
        });
      }

      // Ollama'nın döndürdüğü yanıt formatını kontrol et ve uyarla
      if (data && !data.message && data.response) {
        // Eski Ollama API formatı olabilir
        return {
          message: {
            content: data.response,
          },
        };
      }

      return data;
    } catch (error) {
      console.error('Llama servis hatası:', error);
      throw error;
    }
  }

  /**
   * Stream API ile gerçek zamanlı yanıt almak için
   * @param prompt Kullanıcı tarafından gönderilen soru
   * @param onChunk Her parça geldiğinde çalışacak callback
   */
  async chatStream(
    prompt: string,
    onChunk: (text: string) => void,
    onEnd: () => void
  ): Promise<void> {
    try {
      // Kullanıcı mesajını geçmişe ekle
      this.conversationHistory.push({
        role: 'user',
        content: prompt,
      });

      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: this.conversationHistory,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`AI API stream error: ${errorData.error || response.statusText}`);
      }

      if (!response.body) {
        throw new Error(
          'ReadableStream not supported. Your browser may not support streaming responses.'
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Chunk'ı decode et
        const chunk = decoder.decode(value, { stream: true });

        try {
          // Stream parçalarını işle
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');

          for (const line of lines) {
            try {
              const json = JSON.parse(line);

              if (json.message?.content) {
                // Her yeni parçayı callback ile gönder
                onChunk(json.message.content);
                accumulatedContent += json.message.content;
              } else if (json.response) {
                // Eski API formatı
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

      // Tamamlandığında asistan mesajını geçmişe ekle
      if (accumulatedContent) {
        this.conversationHistory.push({
          role: 'assistant',
          content: accumulatedContent,
        });
      }

      // Stream bitti
      onEnd();
    } catch (error) {
      console.error('Stream error:', error);
      onChunk('Üzgünüm, bir hata oluştu.');
      onEnd();
    }
  }

  /**
   * Konuşma geçmişini temizler
   */
  clearHistory(): void {
    this.conversationHistory = [
      {
        role: 'system',
        content: IELTS_SYSTEM_CONTEXT,
      },
    ];
  }

  /**
   * Llama modelinin sağlık durumunu kontrol eder
   *
   * @returns Sağlık durumu nesnesi
   */
  async healthCheck(): Promise<{ status: string; model: string }> {
    try {
      // 3 saniye timeout ekle
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${this.apiUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Ollama servisi yanıt vermiyor');
      }

      return {
        status: 'online',
        model: this.modelName,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Health check timeout:', error);
      } else {
        console.error('Sağlık kontrolü hatası:', error);
      }
      return {
        status: 'offline',
        model: this.modelName,
      };
    }
  }
}

// Servisin singleton instance'ını dışa aktarıyoruz
export const llamaService = new LlamaService();

// Kolay erişim için yardımcı fonksiyonlar
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

export async function checkLlamaHealth(): Promise<{
  status: string;
  model: string;
}> {
  return llamaService.healthCheck();
}

export function clearChatHistory(): void {
  return llamaService.clearHistory();
}
