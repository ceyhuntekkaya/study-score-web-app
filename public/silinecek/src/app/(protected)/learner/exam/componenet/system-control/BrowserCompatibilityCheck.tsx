import React, { useState, useEffect } from 'react';
import {BrowserCompatibilityCheckTestResult, BrowserInfo} from "@/types/exam/exam-constants";





interface BrowserCompatibilityCheckProps {
    onComplete: (result: BrowserCompatibilityCheckTestResult) => void;
    autoStart?: boolean;
}

export function BrowserCompatibilityCheck({ onComplete, autoStart = false }: BrowserCompatibilityCheckProps) {
    const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [checkCompleted, setCheckCompleted] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    // Desteklenen tarayıcılar ve minimum versiyonlar
    const SUPPORTED_BROWSERS = {
        Chrome: 90,
        Firefox: 88,
        Safari: 14,
        Edge: 90,
        Opera: 76
    };

    useEffect(() => {
        if (autoStart && !hasStarted) {
            startCheck();
        }
    }, [autoStart, hasStarted]);

    // Tarayıcı bilgilerini tespit et
    const detectBrowser = (): BrowserInfo => {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;

        let browserName = 'Unknown';
        let browserVersion = '0';
        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

        // Chrome
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1) {
            browserName = 'Chrome';
            const match = userAgent.match(/Chrome\/(\d+)/);
            browserVersion = match ? match[1] : '0';
        }
        // Firefox
        else if (userAgent.indexOf('Firefox') > -1) {
            browserName = 'Firefox';
            const match = userAgent.match(/Firefox\/(\d+)/);
            browserVersion = match ? match[1] : '0';
        }
        // Safari
        else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            browserName = 'Safari';
            const match = userAgent.match(/Version\/(\d+)/);
            browserVersion = match ? match[1] : '0';
        }
        // Edge
        else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg') > -1) {
            browserName = 'Edge';
            const match = userAgent.match(/Edg?\/(\d+)/);
            browserVersion = match ? match[1] : '0';
        }
        // Opera
        else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
            browserName = 'Opera';
            const match = userAgent.match(/(?:Opera|OPR)\/(\d+)/);
            browserVersion = match ? match[1] : '0';
        }

        const version = parseInt(browserVersion);
        const minVersion = SUPPORTED_BROWSERS[browserName as keyof typeof SUPPORTED_BROWSERS];
        const supported = minVersion ? version >= minVersion : false;

        return {
            name: browserName,
            version: browserVersion,
            platform,
            mobile,
            supported,
            features: {
                webgl: false,
                localStorage: false,
                sessionStorage: false,
                webRTC: false,
                mediaDevices: false,
                fullscreen: false,
                canvas: false,
                websockets: false
            }
        };
    };

    // Tarayıcı özelliklerini test et
    const testBrowserFeatures = async (browser: BrowserInfo): Promise<BrowserInfo> => {
        const features = { ...browser.features };

        // LocalStorage testi
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            features.localStorage = true;
        } catch (e) {
            console.log(e);
            features.localStorage = false;
        }

        // SessionStorage testi
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
            features.sessionStorage = true;
        } catch (e) {
            console.log(e);
            features.sessionStorage = false;
        }

        // Canvas testi
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            features.canvas = !!ctx;
        } catch (e) {
            console.log(e);
            features.canvas = false;
        }

        // WebGL testi
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            features.webgl = !!gl;
        } catch (e) {
            console.log(e);
            features.webgl = false;
        }

        // WebRTC testi
        const win = window as Window & {
            RTCPeerConnection?: typeof RTCPeerConnection;
            webkitRTCPeerConnection?: typeof RTCPeerConnection;
            mozRTCPeerConnection?: typeof RTCPeerConnection;
        };

        features.webRTC = !!(
            win.RTCPeerConnection ||
            win.webkitRTCPeerConnection ||
            win.mozRTCPeerConnection
        );

// MediaDevices testi
        features.mediaDevices = !!(
            navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function'
        );

// Fullscreen API testi
        const doc = document as Document & {
            webkitFullscreenEnabled?: boolean;
            mozFullScreenEnabled?: boolean;
            msFullscreenEnabled?: boolean;
        };

        features.fullscreen = !!(
            document.fullscreenEnabled ||
            doc.webkitFullscreenEnabled ||
            doc.mozFullScreenEnabled ||
            doc.msFullscreenEnabled
        );


        // WebSocket testi
        features.websockets = !!window.WebSocket;

        return {
            ...browser,
            features
        };
    };

    // Uyumluluk kontrolünü başlat
    const startCheck = async () => {
        setIsChecking(true);
        setHasStarted(true);

        try {
            // Tarayıcı bilgilerini tespit et
            const browser = detectBrowser();

            // Kısa bekleme (kullanıcı deneyimi için)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Özellik testlerini çalıştır
            const browserWithFeatures = await testBrowserFeatures(browser);
            setBrowserInfo(browserWithFeatures);

            // Sonuçları değerlendir
            evaluateCompatibility(browserWithFeatures);

        } catch (error) {
            console.error('Browser compatibility check error:', error);
            handleCheckError();
        } finally {
            setIsChecking(false);
            setCheckCompleted(true);
        }
    };

    // Uyumluluk sonuçlarını değerlendir
    const evaluateCompatibility = (browser: BrowserInfo) => {
        const recommendations: string[] = [];
        let success = true;
        let warning = false;

        // Tarayıcı desteği kontrolü
        if (!browser.supported) {
            success = false;
            recommendations.push(`${browser.name} tarayıcısının güncel bir versiyonunu kullanın (minimum v${SUPPORTED_BROWSERS[browser.name as keyof typeof SUPPORTED_BROWSERS] || 'unknown'})`);
        }

        // Mobil cihaz uyarısı
        if (browser.mobile) {
            warning = true;
            recommendations.push('Sınav için masaüstü bilgisayar kullanmanız önerilir');
        }

        // Kritik özellik kontrolleri
        const criticalFeatures = ['localStorage', 'sessionStorage', 'canvas'];
        const missingCritical = criticalFeatures.filter(feature => !browser.features[feature as keyof typeof browser.features]);

        if (missingCritical.length > 0) {
            success = false;
            recommendations.push(`Kritik özellikler desteklenmiyor: ${missingCritical.join(', ')}`);
        }

        // Önemli özellik kontrolleri
        if (!browser.features.webRTC || !browser.features.mediaDevices) {
            warning = true;
            recommendations.push('Kamera ve mikrofon özellikleri sınırlı olabilir');
        }

        if (!browser.features.fullscreen) {
            warning = true;
            recommendations.push('Tam ekran modu desteklenmiyor');
        }

        if (!browser.features.websockets) {
            warning = true;
            recommendations.push('Gerçek zamanlı bağlantı özellikleri sınırlı olabilir');
        }

        // Platform önerileri
        if (browser.platform.toLowerCase().includes('linux')) {
            warning = true;
            recommendations.push('Linux sistemlerde bazı özellikler sınırlı olabilir');
        }

        let message = '';
        if (success && !warning) {
            message = 'Tarayıcınız sınav için tamamen uyumlu!';
        } else if (success && warning) {
            message = 'Tarayıcınız uyumlu ancak bazı uyarılar var.';
        } else {
            message = 'Tarayıcınızda uyumluluk sorunları tespit edildi.';
        }

        if (recommendations.length === 0) {
            recommendations.push('Tüm özellikler destekleniyor, herhangi bir işlem gerekmiyor.');
        }

        const result: BrowserCompatibilityCheckTestResult = {
            success,
            warning,
            message,
            details: {
                browserInfo: browser,
                recommendations
            }
        };

        setTimeout(() => {
            onComplete(result);
        }, 1000);
    };

    // Kontrol hatası
    const handleCheckError = () => {
        const result: BrowserCompatibilityCheckTestResult = {
            success: false,
            message: 'Tarayıcı uyumluluk kontrolü sırasında bir hata oluştu.',
            details: {
                browserInfo: {
                    name: 'Unknown',
                    version: '0',
                    platform: 'Unknown',
                    mobile: false,
                    supported: false,
                    features: {
                        webgl: false,
                        localStorage: false,
                        sessionStorage: false,
                        webRTC: false,
                        mediaDevices: false,
                        fullscreen: false,
                        canvas: false,
                        websockets: false
                    }
                },
                recommendations: ['Lütfen farklı bir tarayıcı deneyin veya mevcut tarayıcınızı güncelleyin.']
            }
        };

        onComplete(result);
    };

    // Özellik durumu ikonu
    const getFeatureIcon = (supported: boolean) => {
        return supported ? (
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Tarayıcı Uyumluluğu Kontrolü
                </h3>
                <p className="text-gray-600">
                    Tarayıcınızın sınav sistemi ile uyumluluğunu kontrol ediyoruz
                </p>
            </div>

            {/* Kontrol durumu */}
            {isChecking && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <div>
                            <p className="font-medium text-blue-900">Tarayıcı özellikleri kontrol ediliyor...</p>
                            <p className="text-sm text-blue-700">
                                Lütfen kontrol tamamlanana kadar bekleyin
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tarayıcı bilgileri */}
            {browserInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sol panel - Tarayıcı bilgileri */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Tarayıcı Bilgileri</h4>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Tarayıcı:</span>
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium">{browserInfo.name}</span>
                                    {browserInfo.supported ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Destekleniyor
                    </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Desteklenmiyor
                    </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Versiyon:</span>
                                <span className="font-medium">{browserInfo.version}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Platform:</span>
                                <span className="font-medium">{browserInfo.platform}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Cihaz Türü:</span>
                                <span className="font-medium">
                  {browserInfo.mobile ? 'Mobil' : 'Masaüstü'}
                </span>
                            </div>
                        </div>

                        {/* Minimum gereksinimler */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-3">Minimum Gereksinimler</h5>
                            <div className="space-y-2 text-sm">
                                {Object.entries(SUPPORTED_BROWSERS).map(([browser, version]) => (
                                    <div key={browser} className="flex justify-between">
                                        <span className="text-gray-600">{browser}:</span>
                                        <span className="font-medium">v{version}+</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sağ panel - Özellik kontrolleri */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Özellik Kontrolleri</h4>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Local Storage:</span>
                                <div className="flex items-center space-x-2">
                                    {getFeatureIcon(browserInfo.features.localStorage)}
                                    <span className="text-sm font-medium">
                    {browserInfo.features.localStorage ? 'Destekleniyor' : 'Desteklenmiyor'}
                  </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Session Storage:</span>
                                <div className="flex items-center space-x-2">
                                    {getFeatureIcon(browserInfo.features.sessionStorage)}
                                    <span className="text-sm font-medium">
                    {browserInfo.features.sessionStorage ? 'Destekleniyor' : 'Desteklenmiyor'}
                  </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Canvas:</span>
                                <div className="flex items-center space-x-2">
                                    {getFeatureIcon(browserInfo.features.canvas)}
                                    <span className="text-sm font-medium">
                    {browserInfo.features.canvas ? 'Destekleniyor' : 'Desteklenmiyor'}
                  </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">WebGL:</span>
                                <div className="flex items-center space-x-2">
                                    {getFeatureIcon(browserInfo.features.webgl)}
                                    <span className="text-sm font-medium">
                    {browserInfo.features.webgl ? 'Destekleniyor' : 'Desteklenmiyor'}
                  </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">WebRTC:</span>
                                <div className="flex items-center space-x-2">
                                    {getFeatureIcon(browserInfo.features.webRTC)}
                                    <span className="text-sm font-medium">
                    {browserInfo.features.webRTC ? 'Destekleniyor' : 'Desteklenmiyor'}
                  </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Media Devices:</span>
                                <div className="flex items-center space-x-2">
                                    {getFeatureIcon(browserInfo.features.mediaDevices)}
                                    <span className="text-sm font-medium">
                    {browserInfo.features.mediaDevices ? 'Destekleniyor' : 'Desteklenmiyor'}
                  </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Fullscreen API:</span>
                                <div className="flex items-center space-x-2">
                                    {getFeatureIcon(browserInfo.features.fullscreen)}
                                    <span className="text-sm font-medium">
                    {browserInfo.features.fullscreen ? 'Destekleniyor' : 'Desteklenmiyor'}
                  </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">WebSockets:</span>
                                <div className="flex items-center space-x-2">
                                    {getFeatureIcon(browserInfo.features.websockets)}
                                    <span className="text-sm font-medium">
                    {browserInfo.features.websockets ? 'Destekleniyor' : 'Desteklenmiyor'}
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Özellik açıklamaları */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-3">Özellik Açıklamaları</h5>
                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex">
                                    <span className="w-4 h-4 mr-2 mt-0.5">🔒</span>
                                    <span><strong>Storage:</strong> Sınav verilerinin geçici olarak saklanması için gereklidir</span>
                                </div>
                                <div className="flex">
                                    <span className="w-4 h-4 mr-2 mt-0.5">🎨</span>
                                    <span><strong>Canvas/WebGL:</strong> Grafik ve görsel soru tiplerinin görüntülenmesi için</span>
                                </div>
                                <div className="flex">
                                    <span className="w-4 h-4 mr-2 mt-0.5">📹</span>
                                    <span><strong>WebRTC/Media:</strong> Kamera ve mikrofon erişimi için</span>
                                </div>
                                <div className="flex">
                                    <span className="w-4 h-4 mr-2 mt-0.5">📺</span>
                                    <span><strong>Fullscreen:</strong> Sınav güvenliği için tam ekran modunda çalışmak</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Kontrol butonları */}
            <div className="flex justify-center space-x-4">
                {!hasStarted ? (
                    <button
                        onClick={startCheck}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Uyumluluk Kontrolünü Başlat
                    </button>
                ) : checkCompleted ? (
                    <button
                        onClick={() => {
                            setHasStarted(false);
                            setCheckCompleted(false);
                            setBrowserInfo(null);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Kontrolü Tekrarla
                    </button>
                ) : null}
            </div>

            {/* Kontrol tamamlandı mesajı */}
            {checkCompleted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-green-900">Kontrol Tamamlandı</p>
                            <p className="text-sm text-green-700">
                                Tarayıcı uyumluluk kontrolü başarıyla tamamlandı
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Öneriler */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-3">💡 Tarayıcı Önerileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
                    <div>
                        <h5 className="font-medium mb-2">Önerilen Tarayıcılar:</h5>
                        <ul className="space-y-1">
                            <li>• Google Chrome (v90+)</li>
                            <li>• Mozilla Firefox (v88+)</li>
                            <li>• Microsoft Edge (v90+)</li>
                            <li>• Safari (v14+) - macOS için</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-medium mb-2">Genel Öneriler:</h5>
                        <ul className="space-y-1">
                            <li>• Tarayıcınızı güncel tutun</li>
                            <li>• Gereksiz eklentileri devre dışı bırakın</li>
                            <li>• Pop-up engelleyiciyi kapatın</li>
                            <li>• Masaüstü bilgisayar kullanın</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sorun giderme */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">🔧 Sorun Giderme</h4>
                <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Tarayıcı desteklenmiyor:</strong> Güncel bir tarayıcı indirin ve kurun</p>
                    <p><strong>Özellikler çalışmıyor:</strong> Tarayıcı ayarlarınızı kontrol edin, JavaScriptin etkin olduğundan emin olun</p>
                    <p><strong>Mobil cihaz uyarısı:</strong> Mümkünse masaüstü veya laptop kullanın</p>
                    <p><strong>Güvenlik uyarıları:</strong> Tarayıcınızın güvenlik ayarlarını sınav sitesi için yapılandırın</p>
                </div>
            </div>
        </div>
    );
}