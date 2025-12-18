'use client';

import { useState, useRef, useEffect } from 'react';
import {
  streamChatWithLlama,
  checkLlamaHealth,
  clearChatHistory,
  setLessonContext,
  setStudentName,
} from '@/services/ai/llama';
import { convertToHtml } from '@/services/ai/format-helpers';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';
import LoadingDots from '@/components/ui/loading/LoadingDots';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  isComplete?: boolean;
  id: string;
};

interface AIChatProps {
  activeText?: string;
  lessonPartName?: string;
}

export default function AIChat({ activeText, lessonPartName }: AIChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const activeMessageId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Kullanıcı adını set et
  useEffect(() => {
    if (user?.name) {
      setStudentName(user.name);
    }
  }, [user?.name]);

  useEffect(() => {
    if (activeText && activeText.trim() !== '') {
      // Lesson context'i set et
      setLessonContext(activeText);
      clearChatHistory();
      setMessages([]);
      // Input alanını otomatik doldurma - kullanıcı kendi metnini yazacak
    } else {
      // Eğer activeText boşsa, context'i de temizle
      setLessonContext('');
    }
  }, [activeText]);

  // Sayfa yüklendiğinde Llama servisinin durumunu kontrol et
  useEffect(() => {
    async function checkServiceHealth() {
      try {
        const health = await checkLlamaHealth();
        setServiceStatus(health.status as 'online' | 'offline');
      } catch (error) {
        console.error('Servis sağlık kontrolü başarısız:', error);
        setServiceStatus('offline');
      }
    }

    checkServiceHealth();
  }, []);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const smoothScrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Mesajlar güncellendiğinde otomatik kaydırma
  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      scrollToBottom();
    }, 5);

    return () => clearTimeout(scrollTimeout);
  }, [messages]);

  // Benzersiz ID oluşturucu
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim() === '' || isLoading || serviceStatus !== 'online') return;

    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      isComplete: true,
      id: generateId(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    const currentInput = input;
    setInput('');

    // Asistan için mesaj ID'si oluştur ve saklayalım
    const assistantMessageId = generateId();
    activeMessageId.current = assistantMessageId;

    // Asistan için başlangıç mesajı ekliyoruz
    const assistantPlaceholder: Message = {
      role: 'assistant',
      content: '',
      isComplete: false,
      id: assistantMessageId,
    };

    setMessages((prev) => [...prev, assistantPlaceholder]);

    // Yeni mesaj eklendikten hemen sonra scroll yap
    setTimeout(() => {
      scrollToBottom();
    }, 10);

    try {
      // Context'i prompt'a ekle
      let prompt = currentInput;
      if (activeText && activeText.trim() !== '') {
        prompt = `Context from the lesson: "${activeText.substring(0, 500)}"\n\nUser question: ${currentInput}`;
      }

      // Her yeni parça geldiğinde mesajı güncelle
      await streamChatWithLlama(
        prompt,
        (chunk) => {
          setMessages((prev) => {
            return prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            );
          });
          // Her chunk geldiğinde scroll yap
          setTimeout(() => {
            scrollToBottom();
          }, 10);
        },
        () => {
          // Stream tamamlandığında
          setMessages((prev) => {
            return prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, isComplete: true } : msg
            );
          });
          setIsLoading(false);
          activeMessageId.current = null;

          // Input alanına focus yap ve en alta kaydır
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              // Reset textarea height
              inputRef.current.style.height = 'auto';
              inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
            }
            smoothScrollToBottom();
          }, 200);
        }
      );
    } catch (error) {
      console.error('Hata:', error);

      // Hata durumunda son mesajı güncelle
      setMessages((prev) => {
        return prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: 'Sorry, an error occurred. Please try again.',
                isComplete: true,
              }
            : msg
        );
      });

      setIsLoading(false);
      activeMessageId.current = null;

      // Hata durumunda da input alanına focus yap ve scroll
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Reset textarea height
          inputRef.current.style.height = 'auto';
          inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
        }
        smoothScrollToBottom();
      }, 200);
    }
  };

  // Servis durumuna göre UI göster
  if (serviceStatus === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <LoadingSpinner size="lg" color="primary" className="mb-4" />
        <p className="text-gray-600">AI service is being checked...</p>
      </div>
    );
  }

  if (serviceStatus === 'offline') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <i className="feather-alert-triangle w-12 h-12 text-red-500 mb-4"></i>
        <h1 className="text-2xl font-bold mb-2">Service Not Working</h1>
        <p className="text-gray-600 text-center max-w-md mb-4">
          Cannot connect to AI service.
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Service online ise
  return (
    <div 
      className="flex flex-col"
      style={{
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Mesajlar alanı - scrollable */}
      <div
        ref={messagesContainerRef}
        style={{ 
          flex: '1 1 auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px',
          backgroundColor: '#f9fafb',
          scrollBehavior: 'smooth',
          minHeight: 0, // Flexbox scroll için kritik
          maxHeight: '100%',
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <i className="feather-send text-2xl text-blue-600"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI Assistant Ready
            </h3>
            <p className="text-gray-600 max-w-md">
              {activeText
                ? 'Ask me anything about the selected content or IELTS-related questions.'
                : 'Ask me anything about IELTS-related questions.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-chat-message ${message.role}`}
              >
                {message.role === 'assistant' ? (
                  <>
                    <div
                      className="whitespace-pre-wrap markdown-content"
                      dangerouslySetInnerHTML={{
                        __html: convertToHtml(message.content),
                      }}
                    />
                    {/* Yükleniyor animasyonu - isComplete false ise göster */}
                    {message.isComplete === false && (
                      <div className="flex mt-3">
                        <LoadingDots
                          size="md"
                          color="primary"
                          enhanced={true}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="whitespace-pre-wrap user-message-content">
                    {message.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input alanı - sabit */}
      <div 
        className="ai-chat-form-container"
        style={{
          flexShrink: 0
        }}
      >
        <form onSubmit={handleSubmit} className="ai-chat-form" ref={formRef}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize textarea
              if (e.target instanceof HTMLTextAreaElement) {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading && serviceStatus === 'online') {
                  handleSubmit(e);
                }
              }
            }}
            placeholder="Ask about the content or IELTS questions..."
            className="ai-chat-input"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={
              isLoading || input.trim() === '' || serviceStatus !== 'online'
            }
            className={`send-btn ${
              isLoading || input.trim() === '' || serviceStatus !== 'online'
                ? 'disabled'
                : ''
            }`}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <i className="feather-arrow-right"></i>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
