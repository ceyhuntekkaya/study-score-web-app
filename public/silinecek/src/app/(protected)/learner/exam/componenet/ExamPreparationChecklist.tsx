import { useState } from 'react';

interface ChecklistItem {
    id: string;
    text: string;
    description?: string;
    checked: boolean;
    required: boolean;
}

export function ExamPreparationChecklist() {
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
        {
            id: 'internet',
            text: 'Stabil internet bağlantısı var',
            description: 'En az 5 Mbps hızında stabil bir internet bağlantınız olmalı',
            checked: false,
            required: true
        },
        {
            id: 'device',
            text: 'Bilgisayar/tablet hazır',
            description: 'Güncel tarayıcı ve yeterli batarya/şarj ile',
            checked: false,
            required: true
        },
        {
            id: 'camera',
            text: 'Kamera çalışıyor',
            description: 'Kimlik doğrulama ve gözetim için kameranız açık olmalı',
            checked: false,
            required: true
        },
        {
            id: 'microphone',
            text: 'Mikrofon çalışıyor',
            description: 'Sesli sorular için mikrofon erişimi gerekli olabilir',
            checked: false,
            required: false
        },
        {
            id: 'environment',
            text: 'Sessiz ortam hazır',
            description: 'Dikkat dağıtıcı unsurları ortadan kaldırın',
            checked: false,
            required: true
        },
        {
            id: 'documents',
            text: 'Kimlik belgesi hazır',
            description: 'Geçerli kimlik belgenizi yanınızda bulundurun',
            checked: false,
            required: true
        },
        {
            id: 'time',
            text: 'Yeterli zamanım var',
            description: 'Sınav süresinden en az 15 dakika fazla zamanınız olsun',
            checked: false,
            required: true
        },
        {
            id: 'backup',
            text: 'Yedek plan hazır',
            description: 'Teknik sorun durumunda alternatif iletişim yöntemi',
            checked: false,
            required: false
        }
    ]);

    const handleItemCheck = (itemId: string) => {
        setChecklistItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, checked: !item.checked }
                    : item
            )
        );
    };

    const requiredItems = checklistItems.filter(item => item.required);
    const optionalItems = checklistItems.filter(item => !item.required);
    const completedRequired = requiredItems.filter(item => item.checked).length;
    const completedOptional = optionalItems.filter(item => item.checked).length;
    const totalCompleted = checklistItems.filter(item => item.checked).length;

    const progressPercentage = Math.round((totalCompleted / checklistItems.length) * 100);
    const allRequiredCompleted = completedRequired === requiredItems.length;

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Sınava Hazırlık Kontrol Listesi
                    </h3>
                    <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-600">
                            {totalCompleted}/{checklistItems.length}
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    allRequiredCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Progress Summary */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Genel İlerleme: {progressPercentage}%
            </span>
                        {allRequiredCompleted && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Zorunlu öğeler tamamlandı
              </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-500">
                        Zorunlu: {completedRequired}/{requiredItems.length} •
                        Opsiyonel: {completedOptional}/{optionalItems.length}
                    </div>
                </div>

                {/* Required Items */}
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full text-xs font-bold mr-2">
              !
            </span>
                        Zorunlu Gereksinimler
                    </h4>
                    <div className="space-y-3">
                        {requiredItems.map((item) => (
                            <div key={item.id} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    <input
                                        type="checkbox"
                                        id={item.id}
                                        checked={item.checked}
                                        onChange={() => handleItemCheck(item.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor={item.id}
                                        className={`text-sm font-medium cursor-pointer ${
                                            item.checked ? 'text-green-700 line-through' : 'text-gray-900'
                                        }`}
                                    >
                                        {item.text}
                                    </label>
                                    {item.description && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                {item.checked && (
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optional Items */}
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-2">
              +
            </span>
                        Önerilen Hazırlıklar
                    </h4>
                    <div className="space-y-3">
                        {optionalItems.map((item) => (
                            <div key={item.id} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    <input
                                        type="checkbox"
                                        id={item.id}
                                        checked={item.checked}
                                        onChange={() => handleItemCheck(item.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor={item.id}
                                        className={`text-sm font-medium cursor-pointer ${
                                            item.checked ? 'text-green-700 line-through' : 'text-gray-900'
                                        }`}
                                    >
                                        {item.text}
                                    </label>
                                    {item.description && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                {item.checked && (
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips & Recommendations */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Önemli Hatırlatmalar
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Sınav başladıktan sonra tarayıcı sekmesini değiştirmeyin</li>
                        <li>• Başka uygulamalar kullanmayın veya açmayın</li>
                        <li>• Cevaplarınız otomatik olarak kaydedilir</li>
                        <li>• Teknik sorun yaşarsanız kaldığınız yerden devam edebilirsiniz</li>
                        <li>• Süre dolmadan önce sınavınızı tamamlamayı hedefleyin</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                    <button className="flex-1 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                        Sistem Kontrolü Yap
                    </button>
                    <button className="flex-1 bg-green-50 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-100 transition-colors">
                        Demo Sorulara Bak
                    </button>
                </div>

                {/* Status Message */}
                {allRequiredCompleted ? (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-green-800">
                Harika! Tüm zorunlu gereksinimler tamamlandı. Sınava başlamaya hazırsınız.
              </span>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-yellow-800">
                Sınava başlayabilmek için tüm zorunlu gereksinimleri tamamlamanız gerekiyor.
              </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}