'use client';

import { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, AlertTriangle, Wifi, Monitor, Volume2, Camera, HelpCircle, ExternalLink, Copy, CheckCircle, User, Calendar, MapPin } from 'lucide-react';

interface ContactMethod {
    type: 'phone' | 'email' | 'chat' | 'whatsapp';
    label: string;
    value: string;
    available: boolean;
    responseTime: string;
    icon: React.ReactNode;
    primary?: boolean;
}

interface EmergencyScenario {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    priority: 'high' | 'medium' | 'low';
    immediateActions: string[];
    contactMethods: string[];
    additionalInfo?: string;
}

interface EmergencyInfoProps {
    onCompleted: () => void;
    examInfo?: {
        examId: string;
        examName: string;
        startTime: string;
        duration: number;
    };
    userInfo?: {
        name: string;
        email: string;
        studentId: string;
    };
}

export function EmergencyInfo({ onCompleted, examInfo, userInfo }: EmergencyInfoProps) {
    const [activeTab, setActiveTab] = useState<'contacts' | 'scenarios' | 'system' | 'faq'>('contacts');
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [isAcknowledged, setIsAcknowledged] = useState(false);

    // İletişim yöntemleri
    const contactMethods: ContactMethod[] = [
        {
            type: 'phone',
            label: 'Acil Destek Hattı',
            value: '+90 (212) 555-0100',
            available: true,
            responseTime: 'Anında',
            icon: <Phone className="w-5 h-5" />,
            primary: true
        },
        {
            type: 'whatsapp',
            label: 'WhatsApp Destek',
            value: '+90 (535) 555-0101',
            available: true,
            responseTime: '1-2 dakika',
            icon: <MessageCircle className="w-5 h-5" />
        },
        {
            type: 'chat',
            label: 'Canlı Sohbet',
            value: 'https://destek.sinav.com/chat',
            available: true,
            responseTime: '2-3 dakika',
            icon: <MessageCircle className="w-5 h-5" />
        },
        {
            type: 'email',
            label: 'E-posta Desteği',
            value: 'acil@sinav.com',
            available: true,
            responseTime: '5-10 dakika',
            icon: <Mail className="w-5 h-5" />
        }
    ];

    // Acil durum senaryoları
    const emergencyScenarios: EmergencyScenario[] = [
        {
            id: 'internet-connection',
            title: 'İnternet Bağlantısı Kesildi',
            description: 'Sınav sırasında internet bağlantınız koptu',
            icon: <Wifi className="w-6 h-6" />,
            priority: 'high',
            immediateActions: [
                'Sakin kalın ve panik yapmayın',
                'Modem/router\'ı yeniden başlatın',
                'Farklı bir internet bağlantısı deneyin (mobil hotspot)',
                'Sınav sayfasını yenilemeyin',
                'Hemen teknik destek ile iletişime geçin'
            ],
            contactMethods: ['phone', 'whatsapp'],
            additionalInfo: 'Sınavınız otomatik olarak kaydedilir ve kesinti süresi sınav sürenizden düşülür.'
        },
        {
            id: 'browser-crash',
            title: 'Tarayıcı Kapandı/Dondu',
            description: 'Tarayıcınız beklenmedik şekilde kapandı veya dondu',
            icon: <Monitor className="w-6 h-6" />,
            priority: 'high',
            immediateActions: [
                'Tarayıcıyı yeniden açın',
                'Sınav linkini tekrar kullanın',
                'Kimlik doğrulaması yapın',
                'Kaldığınız yerden devam edin',
                'Sorun devam ederse destek arayın'
            ],
            contactMethods: ['phone', 'chat'],
            additionalInfo: 'Cevaplarınız otomatik kaydedildiği için kayıp yaşamazsınız.'
        },
        {
            id: 'camera-microphone',
            title: 'Kamera/Mikrofon Sorunu',
            description: 'Kamera veya mikrofon çalışmıyor',
            icon: <Camera className="w-6 h-6" />,
            priority: 'medium',
            immediateActions: [
                'Tarayıcı izinlerini kontrol edin',
                'Başka bir tarayıcı deneyin',
                'Bilgisayarınızı yeniden başlatın',
                'Kamera/mikrofon bağlantılarını kontrol edin',
                'Teknik destek ile iletişime geçin'
            ],
            contactMethods: ['phone', 'chat', 'whatsapp']
        },
        {
            id: 'power-outage',
            title: 'Elektrik Kesintisi',
            description: 'Elektrik kesildi veya bilgisayar kapandı',
            icon: <AlertTriangle className="w-6 h-6" />,
            priority: 'high',
            immediateActions: [
                'Mobil cihazınızla sınava devam edin',
                'Mobil internet kullanın',
                'Hemen destek hattını arayın',
                'Kesinti süresini not alın',
                'Yedek güç kaynağınız varsa kullanın'
            ],
            contactMethods: ['phone'],
            additionalInfo: 'Elektrik kesintisi durumunda ek süre verilir.'
        },
        {
            id: 'sound-issues',
            title: 'Ses Sorunu',
            description: 'Ses gelmiyor veya ses kalitesi kötü',
            icon: <Volume2 className="w-6 h-6" />,
            priority: 'medium',
            immediateActions: [
                'Hoparlör/kulaklık bağlantısını kontrol edin',
                'Ses seviyesini ayarlayın',
                'Başka bir ses çıkış cihazı deneyin',
                'Tarayıcı ses ayarlarını kontrol edin',
                'Gerekirse destek isteyin'
            ],
            contactMethods: ['chat', 'whatsapp']
        },
        {
            id: 'other-issues',
            title: 'Diğer Teknik Sorunlar',
            description: 'Yukarıdakiler dışındaki teknik problemler',
            icon: <HelpCircle className="w-6 h-6" />,
            priority: 'medium',
            immediateActions: [
                'Sorunun ekran görüntüsünü alın',
                'Hata mesajını not edin',
                'Mümkünse sorunu kaydedin',
                'Destek ekibiyle paylaşın',
                'Alternatif çözümleri deneyin'
            ],
            contactMethods: ['phone', 'chat', 'email']
        }
    ];

    // Sistem bilgileri
    const systemInfo = {
        browser: 'Chrome 120.0.6099.109',
        os: 'Windows 11',
        screen: '1920x1080',
        connection: '15.2 Mbps',
        sessionId: 'SES-2024-001234'
    };

    // Sık sorulan sorular
    const faqItems = [
        {
            question: 'Sınav sırasında bağlantım koptu, ne yapmalıyım?',
            answer: 'Bağlantınız koptuğunda sınavınız otomatik olarak kaydedilir. Bağlantınızı yeniden kurup sınava kaldığınız yerden devam edebilirsiniz. Kesinti süresi sınav sürenizden düşülür.'
        },
        {
            question: 'Cevaplarım kaydediliyor mu?',
            answer: 'Evet, her cevabınız otomatik olarak kaydedilir. Sayfa yenilense veya bağlantı kopsa bile cevaplarınız güvende kalır.'
        },
        {
            question: 'Sınav sürem kesinti nedeniyle azalır mı?',
            answer: 'Hayır, teknik sorunlar nedeniyle yaşanan kesintiler sınav sürenizden düşülür. Ek süre otomatik olarak hesaplanır.'
        },
        {
            question: 'Destek ekibiyle nasıl iletişim kurabilirim?',
            answer: 'Acil durumlar için telefon hattımızı arayabilir, hızlı destek için WhatsApp veya canlı sohbet kullanabilirsiniz.'
        }
    ];

    // Metni kopyala
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            setTimeout(() => setCopiedText(null), 2000);
        } catch (error) {
            console.error('Kopyalanamadı:', error);
        }
    };

    // Acil durum öncelik rengi
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-red-200 bg-red-50';
            case 'medium':
                return 'border-yellow-200 bg-yellow-50';
            default:
                return 'border-blue-200 bg-blue-50';
        }
    };

    // İletişim yöntemi rengi
    const getContactColor = (type: string) => {
        switch (type) {
            case 'phone':
                return 'bg-red-500 hover:bg-red-600';
            case 'whatsapp':
                return 'bg-green-500 hover:bg-green-600';
            case 'chat':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'email':
                return 'bg-gray-500 hover:bg-gray-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Acil Durum Bilgileri
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    Sınav sırasında yaşayabileceğiniz teknik sorunlar için hazırlık bilgileri
                </p>
            </div>

            {/* Current Session Info */}
            {examInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">Mevcut Sınav Bilgileri</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800">
                <strong>Sınav:</strong> {examInfo.examName}
              </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800">
                <strong>Süre:</strong> {examInfo.duration} dakika
              </span>
                        </div>
                        {userInfo && (
                            <>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span className="text-blue-800">
                    <strong>Öğrenci:</strong> {userInfo.name}
                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="text-blue-800">
                    <strong>ID:</strong> {userInfo.studentId}
                  </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b">
                <nav className="flex space-x-8">
                    {[
                        { id: 'contacts', label: 'İletişim', icon: Phone },
                        { id: 'scenarios', label: 'Acil Durumlar', icon: AlertTriangle },
                        { id: 'system', label: 'Sistem Bilgisi', icon: Monitor },
                        { id: 'faq', label: 'S.S.S.', icon: HelpCircle }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {/* İletişim */}
                {activeTab === 'contacts' && (
                    <div className="space-y-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-medium text-red-900 mb-2">🚨 ACİL DURUM</h4>
                            <p className="text-red-800 text-sm">
                                Sınav sırasında teknik sorun yaşarsanız hemen aşağıdaki iletişim kanallarından birini kullanın.
                                Sorun çözülene kadar sınavınız durdurulur ve ek süre verilir.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {contactMethods.map((contact) => (
                                <div
                                    key={contact.type}
                                    className={`border rounded-lg p-4 ${
                                        contact.primary ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2 rounded-lg text-white ${getContactColor(contact.type)}`}>
                                            {contact.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{contact.label}</h4>
                                            {contact.primary && (
                                                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded font-medium">
                          ÖNCELİKLİ
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {contact.value}
                      </span>
                                            <button
                                                onClick={() => copyToClipboard(contact.value)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                {copiedText === contact.value ? (
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                      <span className={`flex items-center gap-1 ${
                          contact.available ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                            contact.available ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                          {contact.available ? 'Aktif' : 'Pasif'}
                      </span>
                                            <span className="text-gray-600">~{contact.responseTime}</span>
                                        </div>

                                        {contact.type === 'chat' && (
                                            <a
                                                href={contact.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                Sohbeti Aç
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Acil Durumlar */}
                {activeTab === 'scenarios' && (
                    <div className="space-y-4">
                        {emergencyScenarios.map((scenario) => (
                            <div
                                key={scenario.id}
                                className={`border rounded-lg ${getPriorityColor(scenario.priority)}`}
                            >
                                <div className="p-4 border-b">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 text-gray-600">
                                            {scenario.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">{scenario.title}</h4>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    scenario.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                        scenario.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                }`}>
                          {scenario.priority === 'high' ? 'Yüksek' :
                              scenario.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                        </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1">{scenario.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h5 className="font-medium text-gray-900 mb-3">Yapılacaklar:</h5>
                                    <ol className="space-y-2">
                                        {scenario.immediateActions.map((action, index) => (
                                            <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                                                <span>{action}</span>
                                            </li>
                                        ))}
                                    </ol>

                                    {scenario.additionalInfo && (
                                        <div className="mt-4 p-3 bg-white rounded-lg border">
                                            <p className="text-sm text-gray-700">
                                                <strong>Önemli:</strong> {scenario.additionalInfo}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-900 mb-2">Önerilen İletişim:</p>
                                        <div className="flex gap-2">
                                            {scenario.contactMethods.map((method) => {
                                                const contact = contactMethods.find(c => c.type === method);
                                                return contact ? (
                                                    <span
                                                        key={method}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                                    >
                            {contact.label}
                          </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sistem Bilgisi */}
                {activeTab === 'system' && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 border rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Mevcut Sistem Bilgileri</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tarayıcı:</span>
                                        <span className="font-medium">{systemInfo.browser}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">İşletim Sistemi:</span>
                                        <span className="font-medium">{systemInfo.os}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ekran Çözünürlüğü:</span>
                                        <span className="font-medium">{systemInfo.screen}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">İnternet Hızı:</span>
                                        <span className="font-medium text-green-600">{systemInfo.connection}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Oturum ID:</span>
                                        <span className="font-mono text-xs">{systemInfo.sessionId}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <button
                                    onClick={() => copyToClipboard(JSON.stringify(systemInfo, null, 2))}
                                    className="flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-gray-50"
                                >
                                    <Copy className="w-4 h-4" />
                                    Sistem Bilgilerini Kopyala
                                </button>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-medium text-yellow-900 mb-2">💡 Destek İçin İpuçları</h4>
                            <ul className="space-y-2 text-sm text-yellow-800">
                                <li>• Sistem bilgilerini destek ekibiyle paylaşın</li>
                                <li>• Hata mesajlarının ekran görüntüsünü alın</li>
                                <li>• Sorunun ne zaman başladığını belirtin</li>
                                <li>• Denediğiniz çözümleri açıklayın</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* S.S.S. */}
                {activeTab === 'faq' && (
                    <div className="space-y-4">
                        {faqItems.map((item, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2 flex items-start gap-2">
                                    <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    {item.question}
                                </h4>
                                <p className="text-gray-700 text-sm ml-7">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Acknowledgment */}
            <div className="border-t pt-6">
                <label className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        checked={isAcknowledged}
                        onChange={(e) => setIsAcknowledged(e.target.checked)}
                        className="mt-1 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
            Acil durum bilgilerini okudum ve anladım. Sınav sırasında sorun yaşarsam
            yukarıdaki iletişim kanallarını kullanacağımı taahhüt ederim.
          </span>
                </label>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={onCompleted}
                        disabled={!isAcknowledged}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                            isAcknowledged
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <CheckCircle className="w-5 h-5" />
                        Bilgileri Onaylıyorum
                    </button>
                </div>
            </div>
        </div>
    );
}