// app/ielts-chat/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Book, AlertTriangle } from "lucide-react";
import { streamChatWithLlama, checkLlamaHealth } from "@/api/llama/llama";
import { convertToHtml } from "@/api/llama/format-helpers";
import { LoadingSpinner, LoadingDots } from "@/components/ui/loading";

type Message = {
  role: "user" | "assistant";
  content: string;
  isComplete?: boolean;
  id: string;
};

export default function IELTSChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<
    "checking" | "online" | "offline"
  >("online"); // Başlangıçta online kabul et
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const activeMessageId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Önceden tanımlanmış IELTS soru şablonları
  const ieltsTemplates = [
    {
      title: "Writing",
      prompt:
        "Some people believe that universities should focus on providing academic skills rather than preparing students for employment. To what extent do you agree or disagree?",
    },
    {
      title: "Speaking",
      prompt:
        "Describe a time when you helped someone. You should say: who you helped, how you helped them, why you helped them, and how you felt about helping them.",
    },
    {
      title: "Reading",
      prompt:
        "The graph below shows the consumption of 3 spreads from 1981 to 2007. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    },
    {
      title: "Listening",
      prompt:
        "The graph below shows the consumption of 3 spreads from 1981 to 2007. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    },
  ];

  // Sayfa yüklendiğinde Llama servisinin durumunu kontrol et
  useEffect(() => {
    let mounted = true;

    async function checkServiceHealth() {
      try {
        // İlk olarak UI'ı render et, sonra health check yap
        if (mounted) {
          setServiceStatus("online"); // Önce online kabul et, hızlı render için
        }

        const health = await checkLlamaHealth();
        if (mounted) {
          setServiceStatus(health.status as "online" | "offline");
        }
      } catch (error) {
        console.error("Servis sağlık kontrolü başarısız:", error);
        if (mounted) {
          setServiceStatus("offline");
        }
      }
    }

    checkServiceHealth();

    return () => {
      mounted = false;
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Anlık scroll için scrollTop kullan
      container.scrollTop = container.scrollHeight;
    }
  };

  const smoothScrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Mesajlar güncellendiğinde otomatik kaydırma
  useEffect(() => {
    // Hızlı scroll için kısa delay
    const scrollTimeout = setTimeout(() => {
      scrollToBottom();
    }, 5);

    return () => clearTimeout(scrollTimeout);
  }, [messages]);

  // Benzersiz ID oluşturucu
  const generateId = () =>
    `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim() === "" || isLoading || serviceStatus !== "online") return;

    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      role: "user",
      content: input,
      isComplete: true,
      id: generateId(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    setInput("");

    // Asistan için mesaj ID'si oluştur ve saklayalım
    const assistantMessageId = generateId();
    activeMessageId.current = assistantMessageId;

    // Asistan için başlangıç mesajı ekliyoruz
    const assistantPlaceholder: Message = {
      role: "assistant",
      content: "",
      isComplete: false,
      id: assistantMessageId,
    };

    setMessages((prev) => [...prev, assistantPlaceholder]);

    // Yeni mesaj eklendikten hemen sonra scroll yap
    setTimeout(() => {
      scrollToBottom();
    }, 10);

    try {
      // Her yeni parça geldiğinde mesajı güncelle
      await streamChatWithLlama(
        input,
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
      console.error("Hata:", error);

      // Hata durumunda son mesajı güncelle
      setMessages((prev) => {
        return prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "Sorry, an error occurred. Please try again.",
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

  const handleTemplateClick = (title: string) => {
    if (title === "Writing") {
      setInput("Can you write me a writing question?");
    } else if (title === "Speaking") {
      setInput("Can you write me a speaking question?");
    } else if (title === "Reading") {
      setInput("Can you write me a reading question?");
    } else if (title === "Listening") {
      setInput("Can you write me a listening question?");
    }
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  // Servis durumuna göre UI göster - artık checking durumu yok
  if (serviceStatus === "offline") {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
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
    <div className="flex flex-col min-h-[75vh] h-full mx-auto p-2 ">
      {/* Mesajlar alanı - scrollable */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50 scroll-smooth rounded-t-lg"
        ref={messagesContainerRef}
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 ? (
          <div className="ai-welcome-section">
            <Book size={48} className="ai-welcome-icon" />
            <h2 className="ai-welcome-title">
              Welcome to IELTS Test Assistant
            </h2>
            <p className="ai-welcome-description">
              Want to practice for your IELTS exam? Choose one of the templates
              below or write your own IELTS question.
            </p>

            <div className="flex flex-col items-center gap-4">
              <p className="ielts-templates-label">IELTS Question Templates:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {ieltsTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateClick(template.title)}
                    className="ielts-template-btn"
                    disabled={isLoading}
                  >
                    {template.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-chat-message ${message.role}`}
              >
                {message.role === "assistant" ? (
                  <>
                    <div
                      className="whitespace-pre-wrap markdown-content"
                      dangerouslySetInnerHTML={{
                        __html: convertToHtml(message.content),
                      }}
                    />
                    {/* Yükleniyor animasyonu - isComplete false ise göster */}
                    {message.isComplete === false && (
                      <div className="flex mt-3 p-2">
                        <LoadingDots
                          size="lg"
                          color="primary"
                          enhanced={true}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            ))}
            <div
              ref={messagesEndRef}
              // style={{ height: "20px", marginBottom: "20px" }}
            />
          </div>
        )}
      </div>

      {/* Input alanı - sabit */}
      <div className="ai-chat-form-container">
        <form onSubmit={handleSubmit} className="ai-chat-form" ref={formRef}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your IELTS related question..."
            className="ai-chat-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={
              isLoading || input.trim() === "" || serviceStatus !== "online"
            }
            className={`send-btn ${
              isLoading || input.trim() === "" || serviceStatus !== "online"
                ? "disabled"
                : ""
            }`}
          >
            {isLoading ? <LoadingSpinner size="sm" color="white" /> : <Send />}
          </button>
        </form>
      </div>
    </div>
  );
}
