'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertTriangle, Shield, Camera, Clock, ArrowRight, RefreshCw, Eye, Volume2, Wifi} from 'lucide-react';

interface FinalCheck {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    status: 'pending' | 'checking' | 'passed' | 'failed' | 'warning';
    critical: boolean;
    component: React.ReactNode;
    autoCheck?: boolean;
    recheckable?: boolean;
}

interface FinalChecksPageProps {
    examId: string;
}

export function FinalChecksPage({ examId }: FinalChecksPageProps) {
    const router = useRouter();
    const [currentCheck, setCurrentCheck] = useState(0);
    const [checkResults, setCheckResults] = useState<Record<string, 'pending' | 'checking' | 'passed' | 'failed' | 'warning'>>({});
    const [overallStatus, setOverallStatus] = useState<'checking' | 'ready' | 'issues'>('checking');
    const [showAllChecks, setShowAllChecks] = useState(false);
    const [autoCheckCompleted, setAutoCheckCompleted] = useState(false);

    // Final kontrol listesi
    const finalChecks: FinalCheck[] = [
        {
            id: 'system-stability',
            title: 'Sistem Kararlılığı',
            description: 'İnternet bağlantısı ve sistem performansı kontrolü',
            icon: <Wifi className="w-5 h-5" />,
            status: checkResults['system-stability'] || 'pending',
            critical: true,
            autoCheck: true,
            recheckable: true,
            component: (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">İnternet Hızı</div>
                            <div className="text-lg font-semibold text-green-600">15.2 Mbps ✓</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Ping</div>
                            <div className="text-lg font-semibold text-green-600">24ms ✓</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Tarayıcı</div>
                            <div className="text-lg font-semibold text-green-600">Chrome 120 ✓</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Ekran</div>
                            <div className="text-lg font-semibold text-green-600">1920x1080 ✓</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'environment-check',
            title: 'Çevre Kontrolü',
            description: 'Sınav ortamının uygunluğu ve çevresel faktörler',
            icon: <Camera className="w-5 h-5" />,
            status: checkResults['environment-check'] || 'pending',
            critical: true,
            component: <div>Environment Check Component</div> // EnvironmentCheck component gelecek
        },
        {
            id: 'identity-verification',
            title: 'Kimlik Doğrulama',
            description: 'Kimliğinizin tekrar doğrulanması',
            icon: <Shield className="w-5 h-5" />,
            status: checkResults['identity-verification'] || 'pending',
            critical: true,
            component: <div>Identity Re-verification Component</div> // IdentityReVerification component gelecek
        },
        {
            id: 'audio-video-test',
            title: 'Ses ve Görüntü Testi',
            description: 'Kamera ve mikrofon son kontrol',
            icon: <Volume2 className="w-5 h-5" />,
            status: checkResults['audio-video-test'] || 'pending',
            critical: false,
            autoCheck: true,
            recheckable: true,
            component: (
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                Kamera Testi
                            </h4>
                            <div className="bg-black rounded-lg h-32 flex items-center justify-center">
                                <div className="text-white text-sm">Kamera önizlemesi aktif</div>
                            </div>
                            <div className="mt-2 text-sm text-green-600">✓ Kamera çalışıyor</div>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Volume2 className="w-4 h-4" />
                                Mikrofon Testi
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                                    </div>
                                    <span className="text-sm">75%</span>
                                </div>
                                <div className="text-sm text-green-600">✓ Mikrofon çalışıyor</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'emergency-info',
            title: 'Acil Durum Bilgileri',
            description: 'Sınav sırasında yaşanabilecek sorunlar için bilgilendirme',
            icon: <AlertTriangle className="w-5 h-5" />,
            status: checkResults['emergency-info'] || 'pending',
            critical: false,
            component: <div>Emergency Info Component</div> // EmergencyInfo component gelecek
        },
        {
            id: 'final-consent',
            title: 'Son Onay',
            description: 'Sınava başlamak için son onayınız',
            icon: <CheckCircle className="w-5 h-5" />,
            status: checkResults['final-consent'] || 'pending',
            critical: true,
            component: (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Sınava Başlamadan Önce</h4>
                        <div className="space-y-2 text-sm text-blue-800">
                            <p>• Tüm sistem kontrollerinin başarılı olduğundan emin olun</p>
                            <p>• Sınav sırasında sayfayı yenilemeyin veya tarayıcıyı kapatmayın</p>
                            <p>• Teknik sorun yaşarsanız hemen destek ekibiyle iletişime geçin</p>
                            <p>• Sınav başladıktan sonra sadece belirtilen araçları kullanın</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                onChange={(e) => handleConsentChange('rules', e.target.checked)}
                                className="mt-1 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                Sınav kurallarını ve yönergelerini okuduğumu ve kabul ettiğimi onaylıyorum
              </span>
                        </label>
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                onChange={(e) => handleConsentChange('technical', e.target.checked)}
                                className="mt-1 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                Teknik gereksinimlerin sağlandığını ve sistem kontrollerinin başarılı olduğunu onaylıyorum
              </span>
                        </label>
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                onChange={(e) => handleConsentChange('ready', e.target.checked)}
                                className="mt-1 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                Sınava başlamaya hazır olduğumu ve yukarıdaki tüm kontrolleri tamamladığımı beyan ederim
              </span>
                        </label>
                    </div>
                </div>
            )
        }
    ];

    const [consentStatus, setConsentStatus] = useState({
        rules: false,
        technical: false,
        ready: false
    });

    // Consent değişikliği
    const handleConsentChange = (type: keyof typeof consentStatus, checked: boolean) => {
        setConsentStatus(prev => ({
            ...prev,
            [type]: checked
        }));

        // Tüm consent'ler verilirse final-consent'i geçmiş say
        const newStatus = { ...consentStatus, [type]: checked };
        if (Object.values(newStatus).every(v => v)) {
            setCheckResults(prev => ({
                ...prev,
                'final-consent': 'passed'
            }));
        } else {
            setCheckResults(prev => ({
                ...prev,
                'final-consent': 'pending'
            }));
        }
    };

    // Otomatik kontrolleri başlat
    useEffect(() => {
        if (!autoCheckCompleted) {
            performAutoChecks();
        }
    }, [autoCheckCompleted]);

    // Otomatik kontrolleri gerçekleştir
    const performAutoChecks = async () => {
        const autoChecks = finalChecks.filter(check => check.autoCheck);

        for (const check of autoChecks) {
            setCheckResults(prev => ({
                ...prev,
                [check.id]: 'checking'
            }));

            // Simulated check delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulated results - gerçek uygulamada API çağrıları olacak
            setCheckResults(prev => ({
                ...prev,
                [check.id]: 'passed'
            }));
        }

        setAutoCheckCompleted(true);
    };

    // Manuel kontrol gerçekleştir
    const performManualCheck = async (checkId: string) => {
        setCheckResults(prev => ({
            ...prev,
            [checkId]: 'checking'
        }));

        // Simulated check
        await new Promise(resolve => setTimeout(resolve, 2000));

        setCheckResults(prev => ({
            ...prev,
            [checkId]: 'passed'
        }));
    };

    // Kontrolü tekrar çalıştır
    const recheckItem = async (checkId: string) => {
        setCheckResults(prev => ({
            ...prev,
            [checkId]: 'checking'
        }));

        await new Promise(resolve => setTimeout(resolve, 1000));

        setCheckResults(prev => ({
            ...prev,
            [checkId]: 'passed'
        }));
    };

    // Genel durum hesaplama
    useEffect(() => {
        const criticalChecks = finalChecks.filter(check => check.critical);
        const criticalResults = criticalChecks.map(check => checkResults[check.id] || 'pending');

        if (criticalResults.every(status => status === 'passed')) {
            setOverallStatus('ready');
        } else if (criticalResults.some(status => status === 'failed')) {
            setOverallStatus('issues');
        } else {
            setOverallStatus('checking');
        }
    }, [checkResults]);

    // Status icon'u
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'passed':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'checking':
                return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    // Status rengi
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'passed':
                return 'border-green-200 bg-green-50';
            case 'failed':
                return 'border-red-200 bg-red-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'checking':
                return 'border-blue-200 bg-blue-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    // Sınava başla
    const startExam = () => {
        if (overallStatus === 'ready') {
            router.push(`/exam/${examId}/begin`);
        }
    };

    // İstatistikler
    const totalChecks = finalChecks.length;
    const passedChecks = Object.values(checkResults).filter(status => status === 'passed').length;
    const failedChecks = Object.values(checkResults).filter(status => status === 'failed').length;
    const criticalChecks = finalChecks.filter(check => check.critical).length;
    const passedCriticalChecks = finalChecks
        .filter(check => check.critical)
        .filter(check => checkResults[check.id] === 'passed').length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Final Kontroller
                        </h1>
                        <p className="text-gray-600">
                            Sınava başlamadan önce son kontrolleri gerçekleştiriyoruz
                        </p>
                    </div>

                    {/* Overall Status */}
                    <div className="mt-6">
                        <div className={`rounded-lg border-2 p-4 text-center ${
                            overallStatus === 'ready' ? 'border-green-500 bg-green-50' :
                                overallStatus === 'issues' ? 'border-red-500 bg-red-50' :
                                    'border-blue-500 bg-blue-50'
                        }`}>
                            <div className="flex items-center justify-center gap-3 mb-2">
                                {overallStatus === 'ready' ? (
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                ) : overallStatus === 'issues' ? (
                                    <XCircle className="w-8 h-8 text-red-600" />
                                ) : (
                                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                                )}
                                <div>
                                    <h3 className={`text-lg font-semibold ${
                                        overallStatus === 'ready' ? 'text-green-800' :
                                            overallStatus === 'issues' ? 'text-red-800' :
                                                'text-blue-800'
                                    }`}>
                                        {overallStatus === 'ready' ? 'Sınava Hazırsınız!' :
                                            overallStatus === 'issues' ? 'Sorunlar Tespit Edildi' :
                                                'Kontroller Devam Ediyor...'}
                                    </h3>
                                    <p className={`text-sm ${
                                        overallStatus === 'ready' ? 'text-green-700' :
                                            overallStatus === 'issues' ? 'text-red-700' :
                                                'text-blue-700'
                                    }`}>
                                        {overallStatus === 'ready' ? 'Tüm kritik kontroller başarılı' :
                                            overallStatus === 'issues' ? 'Lütfen başarısız kontrolleri gözden geçirin' :
                                                'Lütfen bekleyin...'}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="font-medium">Toplam</div>
                                    <div>{passedChecks}/{totalChecks} Tamamlandı</div>
                                </div>
                                <div>
                                    <div className="font-medium">Kritik</div>
                                    <div>{passedCriticalChecks}/{criticalChecks} Başarılı</div>
                                </div>
                                <div>
                                    <div className="font-medium">Durum</div>
                                    <div>{failedChecks > 0 ? `${failedChecks} Başarısız` : 'Sorun Yok'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Checks List */}
                <div className="space-y-4">
                    {finalChecks.map((check, index) => (
                        <div
                            key={check.id}
                            className={`border rounded-lg transition-all ${getStatusColor(check.status)} ${
                                showAllChecks || index === currentCheck || check.status !== 'pending' ? 'block' : 'hidden'
                            }`}
                        >
                            {/* Check Header */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => !showAllChecks && setCurrentCheck(index)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0">
                                            {getStatusIcon(check.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">{check.title}</h3>
                                                {check.critical && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">
                            Kritik
                          </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1">{check.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {check.recheckable && check.status === 'passed' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    recheckItem(check.id);
                                                }}
                                                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                                            >
                                                Tekrar Kontrol Et
                                            </button>
                                        )}

                                        {check.status === 'pending' && !check.autoCheck && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    performManualCheck(check.id);
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                            >
                                                Kontrolü Başlat
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Check Content */}
                            {(showAllChecks || index === currentCheck || check.status !== 'pending') && (
                                <div className="border-t p-4 bg-white">
                                    {check.component}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={() => setShowAllChecks(!showAllChecks)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        <Eye className="w-4 h-4" />
                        {showAllChecks ? 'Sadece Aktif Olanı Göster' : 'Tüm Kontrolleri Göster'}
                    </button>

                    <div className="flex items-center gap-4">
                        {overallStatus === 'issues' && (
                            <button
                                onClick={performAutoChecks}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Kontrolleri Yenile
                            </button>
                        )}

                        <button
                            onClick={startExam}
                            disabled={overallStatus !== 'ready'}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                                overallStatus === 'ready'
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {overallStatus === 'ready' ? (
                                <>
                                    Sınava Başla
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    Kontroller Tamamlanmalı
                                    <Clock className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Warning for failed checks */}
                {overallStatus === 'issues' && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-red-800">Dikkat!</h4>
                                <p className="text-red-700 text-sm mt-1">
                                    Bazı kritik kontroller başarısız oldu. Sınava başlamadan önce bu sorunları çözmeniz gerekmektedir.
                                    Teknik destek için yardım butonunu kullanabilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}