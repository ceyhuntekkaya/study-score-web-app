'use client';

import { useState, useRef, useEffect } from 'react';
import {
  streamChatWithLlama,
  checkLlamaHealth,
  clearChatHistory,
} from '@/services/ai/llama';
import { convertToHtml } from '@/services/ai/format-helpers';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const activeMessageId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (activeText && activeText.trim() !== '') {
      clearChatHistory();
      setMessages([]);
      setInput(activeText);
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
    console.log('📋 Messages array:', messages);
    console.log('📊 Messages count:', messages.length);
    console.log('👤 User messages:', messages.filter(m => m.role === 'user'));
    
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
    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      console.log('📤 User message added:', userMessage);
      console.log('💬 All messages after user:', newMessages);
      return newMessages;
    });

    setIsLoading(true);
    const currentInput = input;
    setInput('');
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

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
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      {lessonPartName && (
        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">
            AI Assistant - {lessonPartName}
          </h3>
        </div>
      )}

      {/* Mesajlar alanı - scrollable */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 bg-gray-100"
        ref={messagesContainerRef}
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <i className="feather-send text-2xl text-blue-600"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI Assistant Ready
            </h3>
            <p className="text-gray-600 max-w-md text-sm">
              {activeText
                ? 'Ask me anything about the selected content or IELTS-related questions.'
                : 'Ask me anything about IELTS-related questions.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              console.log('🎨 Rendering message:', { 
                id: message.id, 
                role: message.role, 
                isUser,
                content: message.content?.substring(0, 50),
                contentLength: message.content?.length
              });
              return (
                <div
                  key={message.id}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                  style={{ marginBottom: '8px' }}
                >
                  <div
                    className={`ai-chat-message max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 ${
                      isUser
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}
                    style={{
                      wordBreak: 'break-word',
                      display: 'block',
                      visibility: 'visible',
                      opacity: 1,
                      backgroundColor: isUser ? '#3b82f6' : '#ffffff',
                      color: isUser ? '#ffffff' : '#1f2937',
                    }}
                  >
                    {isUser ? (
                      <div 
                        className="whitespace-pre-wrap text-sm leading-relaxed user-message-text" 
                        style={{ 
                          color: '#ffffff',
                          display: 'block',
                          visibility: 'visible',
                          opacity: 1,
                        }}
                      >
                        {message.content || '(empty message)'}
                      </div>
                    ) : (
                      <>
                        {message.content && (
                          <div
                            className="whitespace-pre-wrap markdown-content text-sm leading-relaxed"
                            style={{ color: '#1f2937' }}
                            dangerouslySetInnerHTML={{
                              __html: convertToHtml(message.content),
                            }}
                          />
                        )}
                        {/* Yükleniyor animasyonu - isComplete false ise göster */}
                        {message.isComplete === false && (
                          <div className="flex mt-2">
                            <LoadingDots size="sm" color="primary" enhanced={true} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input alanı - sabit altta */}
      <div className="bg-white border-t border-gray-200 p-3">
        <form onSubmit={handleSubmit} className="relative flex items-end" ref={formRef}>
          <div className="flex-1 relative pr-14">
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
              placeholder="Type a message..."
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                lineHeight: '1.5',
              }}
              rows={2}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || input.trim() === '' || serviceStatus !== 'online'}
              className={`absolute right-2 bottom-2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center transition-colors ${
                isLoading || input.trim() === '' || serviceStatus !== 'online'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-600 active:bg-blue-700'
              }`}
              style={{ 
                minWidth: '40px',
                minHeight: '40px'
              }}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <i className="feather-arrow-right"></i>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
