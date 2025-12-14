import { useState } from 'react';

interface Rule {
    id: string;
    title: string;
    description: string;
    items: string[];
    important: boolean;
    icon: string;
}

interface RuleCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    rules: Rule[];
}

interface InteractiveRulesListProps {
    examId: string;
    onSectionComplete: (completedRuleIds: string[]) => void;
    completedSections: Set<string>;
}

export function InteractiveRulesList({
                                         examId,
                                         onSectionComplete,
                                         completedSections
                                     }: InteractiveRulesListProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [readRules, setReadRules] = useState<Set<string>>(new Set());
    const [acknowledgedRules, setAcknowledgedRules] = useState<Set<string>>(new Set());

    console.log(examId)

    // Define rule categories and content
    const ruleCategories: RuleCategory[] = [
        {
            id: 'teknik',
            name: 'Teknik Kurallar',
            icon: '💻',
            color: 'blue',
            rules: [
                {
                    id: 'teknik-1',
                    title: 'Sistem Gereksinimleri',
                    description: 'Sınav için gerekli teknik altyapı gereksinimleri',
                    items: [
                        'Güncel bir web tarayıcısı kullanılmalıdır (Chrome, Firefox, Safari, Edge)',
                        'Minimum 5 Mbps internet bağlantısı gereklidir',
                        'JavaScript ve çerezler etkinleştirilmelidir',
                        'Pop-up engelleyiciler devre dışı bırakılmalıdır',
                        'Ekran çözünürlüğü en az 1024x768 olmalıdır'
                    ],
                    important: true,
                    icon: '⚙️'
                },
                {
                    id: 'teknik-2',
                    title: 'Kamera ve Mikrofon',
                    description: 'Gözetim ve kimlik doğrulama için gerekli donanım',
                    items: [
                        'Çalışır durumda bir kamera bulunmalıdır',
                        'Kamera sınav boyunca açık kalmalıdır',
                        'Mikrofon erişimi gerekli olabilir',
                        'Kamera ve mikrofon izinleri verilmelidir',
                        'Kamera görüş alanı temiz ve iyi aydınlatılmış olmalıdır'
                    ],
                    important: true,
                    icon: '📹'
                },
                {
                    id: 'teknik-3',
                    title: 'Bağlantı Sorunları',
                    description: 'İnternet kesintisi ve teknik sorun durumları',
                    items: [
                        'Bağlantı kesilirse kaldığınız yerden devam edebilirsiniz',
                        'Otomatik kaydetme sistemi sürekli çalışır',
                        'Sayfa yenileme işlemi güvenlidir',
                        'Teknik sorun durumunda destek ekibi ile iletişime geçin',
                        'Sınav süresi teknik sorunlar için otomatik uzatılmaz'
                    ],
                    important: false,
                    icon: '🔌'
                }
            ]
        },
        {
            id: 'davranış',
            name: 'Davranış Kuralları',
            icon: '👤',
            color: 'green',
            rules: [
                {
                    id: 'davranış-1',
                    title: 'Sınav Sırasında Yapılabilecekler',
                    description: 'İzin verilen davranışlar ve eylemler',
                    items: [
                        'Not kağıdı ve kalem kullanabilirsiniz',
                        'Su içebilir ve kısa molalar verebilirsiniz',
                        'Soruları işaretleyebilir ve gözden geçirebilirsiniz',
                        'Hesap makinesi kullanabilirsiniz (sınav türüne göre)',
                        'Kimlik belgenizi masada bulundurabilirsiniz'
                    ],
                    important: false,
                    icon: '✅'
                },
                {
                    id: 'davranış-2',
                    title: 'Yasak Davranışlar',
                    description: 'Kesinlikle yapılmaması gereken eylemler',
                    items: [
                        'Başka kişilerden yardım almak yasaktır',
                        'İnternet araması yapmak yasaktır',
                        'Başka uygulamalar açmak yasaktır',
                        'Telefon, tablet gibi cihazlar kullanılamaz',
                        'Kitap, dergi, notlar kullanılamaz',
                        'Başka kişilerle konuşmak yasaktır'
                    ],
                    important: true,
                    icon: '❌'
                },
                {
                    id: 'davranış-3',
                    title: 'Kimlik Kontrolü',
                    description: 'Sınav öncesi ve sırası kimlik doğrulama',
                    items: [
                        'Geçerli fotoğraflı kimlik belgesi gösterilmelidir',
                        'Sınav kaydında kullanılan isim ile kimlik uyumlu olmalıdır',
                        'Sınav sırasında kimlik kontrolleri yapılabilir',
                        'Yüz tanıma sistemi sürekli çalışır',
                        'Şüpheli durumlarda ek kimlik kontrolü istenebilir'
                    ],
                    important: true,
                    icon: '🆔'
                }
            ]
        },
        {
            id: 'iletişim',
            name: 'İletişim Kuralları',
            icon: '📞',
            color: 'purple',
            rules: [
                {
                    id: 'iletişim-1',
                    title: 'Teknik Destek',
                    description: 'Sorun yaşandığında nasıl yardım alınır',
                    items: [
                        'Teknik sorunlar için canlı destek mevcuttur',
                        'Sohbet özelliği ile anlık yardım alabilirsiniz',
                        'Telefon desteği acil durumlarda kullanılabilir',
                        'E-posta desteği 24 saat içinde yanıtlanır',
                        'Ekran paylaşımı ile uzaktan yardım sağlanabilir'
                    ],
                    important: false,
                    icon: '🛠️'
                },
                {
                    id: 'iletişim-2',
                    title: 'İletişim Kanalları',
                    description: 'Mevcut destek ve iletişim seçenekleri',
                    items: [
                        'Canlı sohbet: 7/24 aktif',
                        'Telefon: +90 (212) 123 45 67',
                        'E-posta: destek@example.com',
                        'WhatsApp: +90 (555) 123 45 67',
                        'Telegram: @examdestek'
                    ],
                    important: false,
                    icon: '📱'
                }
            ]
        },
        {
            id: 'değerlendirme',
            name: 'Değerlendirme Kriterleri',
            icon: '📊',
            color: 'yellow',
            rules: [
                {
                    id: 'değerlendirme-1',
                    title: 'Puanlama Sistemi',
                    description: 'Cevapların nasıl değerlendirileceği',
                    items: [
                        'Her soru türünün kendine özgü puanı vardır',
                        'Yanlış cevaplar için puan düşülmez',
                        'Boş sorular 0 puan olarak değerlendirilir',
                        'Kısmi puanlama belirli soru türlerinde uygulanır',
                        'Son verilen cevap geçerli kabul edilir'
                    ],
                    important: false,
                    icon: '💯'
                },
                {
                    id: 'değerlendirme-2',
                    title: 'Sonuç Bildirimi',
                    description: 'Sonuçların nasıl ve ne zaman açıklanacağı',
                    items: [
                        'Sonuçlar sınav bitiminde anında görüntülenebilir',
                        'Detaylı analiz raporu 24 saat içinde hazırlanır',
                        'E-posta ile sonuç bildirimi gönderilir',
                        'Sertifika 48 saat içinde dijital olarak verilir',
                        'İtiraz süreci 7 gün içinde başlatılabilir'
                    ],
                    important: false,
                    icon: '📋'
                }
            ]
        },
        {
            id: 'güvenlik',
            name: 'Güvenlik Önlemleri',
            icon: '🔒',
            color: 'red',
            rules: [
                {
                    id: 'güvenlik-1',
                    title: 'Gözetim Sistemi',
                    description: 'Sınav güvenliği için uygulanan gözetim',
                    items: [
                        'Yapay zeka destekli gözetim sistemi çalışır',
                        'Anormal hareketler otomatik tespit edilir',
                        'Şüpheli davranışlar kayıt altına alınır',
                        'Uzaktan gözetim 7/24 aktiftir',
                        'Sınav kayıtları belirli süre saklanır'
                    ],
                    important: true,
                    icon: '👁️'
                },
                {
                    id: 'güvenlik-2',
                    title: 'Veri Güvenliği',
                    description: 'Kişisel bilgilerin korunması',
                    items: [
                        'Tüm veriler şifrelenerek saklanır',
                        'KVKK ve GDPR uyumlu işlem yapılır',
                        'Kamera kayıtları güvenli sunucularda tutulur',
                        'Üçüncü taraflarla veri paylaşımı yapılmaz',
                        'Veri silme talebi kabul edilir'
                    ],
                    important: true,
                    icon: '🛡️'
                }
            ]
        }
    ];

    // Handle rule expansion
    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    // Handle rule reading
    const markRuleAsRead = (ruleId: string) => {
        const newReadRules = new Set([...readRules, ruleId]);
        setReadRules(newReadRules);
    };

    // Handle rule acknowledgment
    const acknowledgeRule = (ruleId: string) => {
        const newAcknowledgedRules = new Set([...acknowledgedRules, ruleId]);
        setAcknowledgedRules(newAcknowledgedRules);

        // Check if the category is completed
        const category = ruleCategories.find(cat =>
            cat.rules.some(rule => rule.id === ruleId)
        );

        if (category) {
            const categoryRules = category.rules.map(r => r.id);
            const categoryCompleted = categoryRules.every(id =>
                newAcknowledgedRules.has(id) || acknowledgedRules.has(id)
            );

            if (categoryCompleted && !completedSections.has(category.id)) {
                onSectionComplete([category.id]);
            }
        }
    };

    // Get color classes for categories
    const getCategoryColors = (color: 'blue' | 'green' | 'purple' | 'yellow' | 'red') => {
        const colors = {
            blue: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-800',
                icon: 'text-blue-600'
            },
            green: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                text: 'text-green-800',
                icon: 'text-green-600'
            },
            purple: {
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                text: 'text-purple-800',
                icon: 'text-purple-600'
            },
            yellow: {
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                text: 'text-yellow-800',
                icon: 'text-yellow-600'
            },
            red: {
                bg: 'bg-red-50',
                border: 'border-red-200',
                text: 'text-red-800',
                icon: 'text-red-600'
            }
        };
        return colors[color] || colors.blue;
    };

    const totalRules = ruleCategories.reduce((sum, cat) => sum + cat.rules.length, 0);
    const acknowledgedCount = acknowledgedRules.size;
    const progressPercentage = Math.round((acknowledgedCount / totalRules) * 100);

    return (
        <div className="space-y-6">
            {/* Progress Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Kural Okuma İlerlemesi
                    </h3>
                    <span className="text-sm text-gray-600">
            {acknowledgedCount}/{totalRules} kural okundu
          </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                <div className="text-sm text-gray-600">
                    {progressPercentage}% tamamlandı
                </div>
            </div>

            {/* Rule Categories */}
            <div className="space-y-4">
                {ruleCategories.map((category) => {
                    const colors = getCategoryColors(category.color as 'blue' | 'green' | 'purple' | 'yellow' | 'red');
                    const categoryCompleted = completedSections.has(category.id);
                    const categoryAcknowledgedCount = category.rules.filter(rule =>
                        acknowledgedRules.has(rule.id)
                    ).length;

                    return (
                        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                                    categoryCompleted
                                        ? `${colors.bg} ${colors.border}`
                                        : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{category.icon}</span>
                                    <div className="text-left">
                                        <h3 className={`font-semibold ${categoryCompleted ? colors.text : 'text-gray-900'}`}>
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {categoryAcknowledgedCount}/{category.rules.length} kural okundu
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {categoryCompleted && (
                                        <svg className={`w-5 h-5 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform ${
                                            expandedCategory === category.id ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {/* Category Content */}
                            {expandedCategory === category.id && (
                                <div className="border-t border-gray-200">
                                    {category.rules.map((rule) => {
                                        const isRead = readRules.has(rule.id);
                                        const isAcknowledged = acknowledgedRules.has(rule.id);

                                        return (
                                            <div key={rule.id} className="p-6 border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-start space-x-3">
                                                        <span className="text-xl">{rule.icon}</span>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                                {rule.title}
                                                                {rule.important && (
                                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                    Önemli
                                  </span>
                                                                )}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {rule.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Rule Items */}
                                                <ul className="space-y-2 mb-4 ml-8">
                                                    {rule.items.map((item, index) => (
                                                        <li key={index} className="flex items-start text-sm text-gray-700">
                                                            <span className="text-blue-500 mr-2 mt-1">•</span>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>

                                                {/* Action Buttons */}
                                                <div className="flex items-center space-x-3 ml-8">
                                                    {!isRead && (
                                                        <button
                                                            onClick={() => markRuleAsRead(rule.id)}
                                                            className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                        >
                                                            Okudum
                                                        </button>
                                                    )}

                                                    {isRead && !isAcknowledged && (
                                                        <button
                                                            onClick={() => acknowledgeRule(rule.id)}
                                                            className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                        >
                                                            Anladım ve Kabul Ediyorum
                                                        </button>
                                                    )}

                                                    {isAcknowledged && (
                                                        <div className="flex items-center text-sm text-green-700">
                                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            Kabul edildi
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Important Rules Summary */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Kritik Kurallar Özeti
                </h3>
                <div className="text-sm text-red-800 space-y-2">
                    <p><strong>1. Teknik Gereksinimler:</strong> Güncel tarayıcı, stabil internet, çalışır kamera gereklidir.</p>
                    <p><strong>2. Yasak Davranışlar:</strong> Dış yardım, internet araması, başka uygulama kullanımı kesinlikle yasaktır.</p>
                    <p><strong>3. Kimlik Kontrolü:</strong> Geçerli kimlik belgesi gösterilmeli, yüz tanıma sistemi aktiftir.</p>
                    <p><strong>4. Gözetim:</strong> Yapay zeka destekli gözetim sistemi sürekli çalışır, anormal davranışlar tespit edilir.</p>
                    <p><strong>5. Veri Güvenliği:</strong> Tüm kayıtlar güvenli ortamda saklanır, kişisel veriler korunur.</p>
                </div>
            </div>

            {/* Completion Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                    Tamamlanma Şartları
                </h3>
                <div className="text-sm text-blue-800 space-y-2">
                    <div className="flex items-center">
                        <svg className={`w-4 h-4 mr-2 ${acknowledgedCount >= totalRules ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Tüm kuralları okuyun ve kabul edin ({acknowledgedCount}/{totalRules})
                    </div>
                    <div className="flex items-center">
                        <svg className={`w-4 h-4 mr-2 ${completedSections.has('video') ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Video kurallarını izleyin
                    </div>
                    <div className="flex items-center">
                        <svg className={`w-4 h-4 mr-2 ${ruleCategories.filter(cat => completedSections.has(cat.id)).length >= 5 ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        En az 5 kural kategorisini tamamlayın ({ruleCategories.filter(cat => completedSections.has(cat.id)).length}/5)
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                    Yardım ve İpuçları
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                    <p>• Her kategoriyi sırayla açarak kuralları okuyun</p>
                    <p>• Önemli işaretli kuralları daha dikkatli inceleyin</p>
                    <p>• &quot;Okudum&quot; butonuna tıklayarak okuma durumunuzu kaydedin</p>
                    <p>• &quot;Anladım ve Kabul Ediyorum&quot; ile kuralları onaylayın</p>
                    <p>• Tüm kategorileri tamamlamak için progress çubuğunu takip edin</p>
                    <p>• Kritik kurallar özetini mutlaka gözden geçirin</p>
                </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">
                    📝 Sözleşme ve Onay Beyanı
                </h3>
                <div className="text-sm text-yellow-800 space-y-3">
                    <p>
                        Yukarıdaki tüm kuralları okuduğumu, anladığımı ve sınav süresince bu kurallara
                        uyacağımı beyan ederim. Bu kurallara aykırı davranışım durumunda sınav sonucumun
                        geçersiz sayılabileceğini kabul ediyorum.
                    </p>

                    <p>
                        Kişisel verilerimin işlenmesine, kamera kayıtlarının alınmasına ve güvenlik
                        amaçlı gözetim yapılmasına onay veriyorum.
                    </p>

                    {acknowledgedCount === totalRules && (
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-3">
                            <div className="flex items-center text-yellow-900">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">
                  Tebrikler! Tüm kuralları başarıyla tamamladınız.
                  Şimdi &quot;Kuralları Kabul Et&quot; butonuna tıklayabilirsiniz.
                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Current Status */}
            <div className="text-center text-sm text-gray-600">
                <p>
                    İlerleme: {acknowledgedCount}/{totalRules} kural kabul edildi •
                    {ruleCategories.filter(cat => completedSections.has(cat.id)).length}/{ruleCategories.length} kategori tamamlandı
                </p>
                {acknowledgedCount < totalRules && (
                    <p className="text-yellow-600 mt-1">
                        Devam edebilmek için kalan {totalRules - acknowledgedCount} kuralı da okumanız gerekiyor.
                    </p>
                )}
            </div>
        </div>
    );
}