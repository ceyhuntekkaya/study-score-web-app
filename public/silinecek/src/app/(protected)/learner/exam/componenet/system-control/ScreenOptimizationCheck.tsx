import React, {useState, useEffect} from 'react';
import {InternetSpeedTest} from "@/app/(protected)/learner/exam/componenet/system-control/InternetSpeedTest";
import {
    BrowserCompatibilityCheck
} from "@/app/(protected)/learner/exam/componenet/system-control/BrowserCompatibilityCheck";
import {CameraMicrophoneTest} from "@/app/(protected)/learner/exam/componenet/system-control/CameraMicrophoneTest";
import {
    ScreenOptimizationCheck
} from "@/app/(protected)/learner/exam/componenet/system-control/SystemCompatibilityPage";
import {AlertNotification} from "@/app/(protected)/learner/exam/componenet/AlertNotification";
import {BrowserInfo, DeviceInfo, ScreenInfo} from "@/types/exam/exam-constants";


type SystemTestDetails =
    {
        browserInfo: BrowserInfo;
        recommendations: string[];
    }
    | {
    downloadSpeed: number,
    uploadSpeed: number,
    latency: number,
    jitter: number,
    recommendation: string
}
    | {
    cameraAccess: boolean;
    microphoneAccess: boolean;
    videoDevices: DeviceInfo[];
    audioDevices: DeviceInfo[];
    cameraResolution: string;
    audioLevel: number;
    recommendations: string[];
}
    | {
    screenInfo: ScreenInfo;
    zoomLevel: number;
    fullscreenSupported: boolean;
    recommendations: string[];
    optimizationScore: number;
}


interface SystemTestResult {
    id: string;
    name: string;
    status: 'pending' | 'testing' | 'success' | 'warning' | 'failed';
    message: string;
    required: boolean;
    details?: SystemTestDetails;
}

interface SystemCompatibilityPageProps {
    examId: string;
    onComplete: () => void;
    onBack: () => void;
}

export function SystemCompatibilityPage({examId, onComplete, onBack}: SystemCompatibilityPageProps) {
    // const router = useRouter();
    const [currentTest, setCurrentTest] = useState<string>('internet');
    const [allTestsCompleted, setAllTestsCompleted] = useState(false);
    const [canProceed, setCanProceed] = useState(false);
    const [autoMode, setAutoMode] = useState(true);
    const [showRetryAll, setShowRetryAll] = useState(false);
    console.log(examId)

    const [testResults, setTestResults] = useState<SystemTestResult[]>([
        {
            id: 'internet',
            name: 'İnternet Hızı',
            status: 'pending',
            message: 'İnternet bağlantı hızınız test edilecek',
            required: true
        },
        {
            id: 'browser',
            name: 'Tarayıcı Uyumluluğu',
            status: 'pending',
            message: 'Tarayıcınızın uyumluluğu kontrol edilecek',
            required: true
        },
        {
            id: 'camera',
            name: 'Kamera & Mikrofon',
            status: 'pending',
            message: 'Kamera ve mikrofon erişimi test edilecek',
            required: true
        },
        {
            id: 'screen',
            name: 'Ekran Optimizasyonu',
            status: 'pending',
            message: 'Ekran ayarlarınız kontrol edilecek',
            required: false
        }
    ]);

    // Test sonucunu güncelle
    const updateTestResult = (testId: string, updates: Partial<SystemTestResult>) => {
        setTestResults(prev => prev.map(test =>
            test.id === testId ? {...test, ...updates} : test
        ));
    };

    // Bir sonraki teste geç
    const moveToNextTest = () => {
        const currentIndex = testResults.findIndex(test => test.id === currentTest);
        const nextIndex = currentIndex + 1;

        if (nextIndex < testResults.length) {
            setCurrentTest(testResults[nextIndex].id);
        } else {
            setAllTestsCompleted(true);
            checkCanProceed();
        }
    };

    // İlerleme kontrolü
    const checkCanProceed = () => {
        const requiredTests = testResults.filter(test => test.required);
        const passedRequiredTests = requiredTests.filter(test =>
            test.status === 'success' || test.status === 'warning'
        );

        const canProceedNow = passedRequiredTests.length === requiredTests.length;
        setCanProceed(canProceedNow);

        // Başarısız testler varsa retry seçeneği göster
        const failedTests = testResults.filter(test => test.status === 'failed');
        setShowRetryAll(failedTests.length > 0);
    };

    // Tüm testleri yeniden başlat
    const retryAllTests = () => {
        setTestResults(prev => prev.map(test => ({
            ...test,
            status: 'pending' as const,
            message: `${test.name} test edilecek`
        })));
        setCurrentTest('internet');
        setAllTestsCompleted(false);
        setCanProceed(false);
        setShowRetryAll(false);
    };

    // Test sonuçlarını kontrol et
    useEffect(() => {
        if (allTestsCompleted) {
            checkCanProceed();
        }
    }, [testResults, allTestsCompleted]);

    // Test durumu ikonları
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'testing':
                return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>;
            case 'success':
                return <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"/>
                    </svg>
                </div>;
            case 'warning':
                return <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"/>
                    </svg>
                </div>;
            case 'failed':
                return <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"/>
                    </svg>
                </div>;
            default:
                return <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>;
        }
    };

    // Test durumu renkleri
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'testing':
                return 'border-blue-200 bg-blue-50';
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'failed':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-gray-200 bg-white';
        }
    };

    // İlerleme hesaplama
    const getProgress = () => {
        const completedTests = testResults.filter(test =>
            test.status === 'success' || test.status === 'warning' || test.status === 'failed'
        ).length;
        return Math.round((completedTests / testResults.length) * 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Sistem Uyumluluğu Kontrolü
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Sınavınıza başlamadan önce sisteminizin uygunluğunu kontrol edeceğiz
                    </p>

                    {/* İlerleme çubuğu */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{width: `${getProgress()}%`}}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                        {getProgress()}% tamamlandı
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sol panel - Test listesi */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Test Adımları
                            </h3>

                            <div className="space-y-4">
                                {testResults.map((test, index) => (
                                    <div
                                        key={test.id}
                                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                            getStatusColor(test.status)
                                        } ${currentTest === test.id ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getStatusIcon(test.status)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {index + 1}. {test.name}
                                                    </h4>
                                                    {test.required && (
                                                        <span
                                                            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              Zorunlu
                            </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {test.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Test modu değiştirme */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={autoMode}
                                        onChange={(e) => setAutoMode(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                    Otomatik test sırası
                  </span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    Testler sırasıyla otomatik olarak çalışır
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sağ panel - Aktif test */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            {!allTestsCompleted ? (
                                <>
                                    {currentTest === 'internet' && (
                                        <InternetSpeedTest
                                            onComplete={(result) => {
                                                updateTestResult('internet', {
                                                    status: result.success ? 'success' : 'failed',
                                                    message: result.message,
                                                    details: result.details
                                                });
                                                if (autoMode) {
                                                    setTimeout(moveToNextTest, 1500);
                                                }
                                            }}
                                            autoStart={autoMode}
                                        />
                                    )}

                                    {currentTest === 'browser' && (
                                        <BrowserCompatibilityCheck
                                            onComplete={(result) => {
                                                updateTestResult('browser', {
                                                    status: result.success ? 'success' : result.warning ? 'warning' : 'failed',
                                                    message: result.message,
                                                    details: result.details
                                                });
                                                if (autoMode) {
                                                    setTimeout(moveToNextTest, 1500);
                                                }
                                            }}
                                            autoStart={autoMode}
                                        />
                                    )}

                                    {currentTest === 'camera' && (
                                        <CameraMicrophoneTest
                                            onComplete={(result) => {
                                                updateTestResult('camera', {
                                                    status: result.success ? 'success' : 'failed',
                                                    message: result.message,
                                                    details: result.details
                                                });
                                                if (autoMode) {
                                                    setTimeout(moveToNextTest, 1500);
                                                }
                                            }}
                                            autoStart={autoMode}
                                        />
                                    )}

                                    {currentTest === 'screen' && (
                                        <ScreenOptimizationCheck
                                            onComplete={(result) => {
                                                updateTestResult('screen', {
                                                    status: result.success ? 'success' : 'warning',
                                                    message: result.message,
                                                    details: result.details
                                                });
                                                if (autoMode) {
                                                    setTimeout(moveToNextTest, 1500);
                                                }
                                            }}
                                            autoStart={autoMode}
                                        />
                                    )}

                                    {/* Manuel ilerleme butonları */}
                                    {!autoMode && (
                                        <div className="mt-6 flex justify-between">
                                            <button
                                                onClick={() => {
                                                    const currentIndex = testResults.findIndex(test => test.id === currentTest);
                                                    if (currentIndex > 0) {
                                                        setCurrentTest(testResults[currentIndex - 1].id);
                                                    }
                                                }}
                                                disabled={testResults.findIndex(test => test.id === currentTest) === 0}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Önceki Test
                                            </button>

                                            <button
                                                onClick={moveToNextTest}
                                                disabled={testResults.find(test => test.id === currentTest)?.status === 'pending'}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Sonraki Test
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Test sonuçları özeti */
                                <div className="text-center">
                                    <div className="mb-6">
                                        {canProceed ? (
                                            <div
                                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-green-600" fill="currentColor"
                                                     viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                        ) : (
                                            <div
                                                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-red-600" fill="currentColor"
                                                     viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                        )}

                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {canProceed ? 'Sistem Kontrolü Tamamlandı!' : 'Sistem Kontrolü Başarısız'}
                                        </h3>

                                        <p className="text-gray-600 mb-6">
                                            {canProceed
                                                ? 'Sisteminiz sınav için uygun. Devam edebilirsiniz.'
                                                : 'Bazı zorunlu testler başarısız oldu. Lütfen sorunları çözün.'
                                            }
                                        </p>
                                    </div>

                                    {/* Test sonuçları detayı */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">Test Sonuçları</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {testResults.map((test) => (
                                                <div key={test.id} className="flex items-center justify-between">
                                                    <span className="text-gray-600">{test.name}:</span>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(test.status)}
                                                        <span className={`font-medium ${
                                                            test.status === 'success' ? 'text-green-600' :
                                                                test.status === 'warning' ? 'text-yellow-600' :
                                                                    test.status === 'failed' ? 'text-red-600' :
                                                                        'text-gray-500'
                                                        }`}>
                              {test.status === 'success' ? 'Başarılı' :
                                  test.status === 'warning' ? 'Uyarı' :
                                      test.status === 'failed' ? 'Başarısız' : 'Bekliyor'}
                            </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Başarısız testler için öneriler */}
                                    {!canProceed && (
                                        <AlertNotification
                                            type="error"
                                            title="Sistem Gereksinimleri"
                                            message="Sınava devam etmek için zorunlu testlerin başarılı olması gerekiyor. Lütfen sistem ayarlarınızı kontrol edin ve testleri tekrar çalıştırın."
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alt butonlar */}
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Geri Dön
                    </button>

                    <div className="space-x-4">
                        {showRetryAll && (
                            <button
                                onClick={retryAllTests}
                                className="px-6 py-3 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
                            >
                                Testleri Tekrarla
                            </button>
                        )}

                        <button
                            onClick={onComplete}
                            disabled={!canProceed}
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {canProceed ? 'Devam Et' : 'Testler Tamamlanmalı'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}