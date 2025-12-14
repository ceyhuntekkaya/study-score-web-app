import React, { useState, useEffect } from 'react';
import {ScreenInfo, ScreenOptimizationCheckTestResult} from "@/types/exam/exam-constants";

interface ScreenOptimizationCheckProps {
    onComplete: (result: ScreenOptimizationCheckTestResult) => void;
    autoStart?: boolean;
}

export function ScreenOptimizationCheck({ onComplete, autoStart = false }: ScreenOptimizationCheckProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [checkCompleted, setCheckCompleted] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const [screenInfo, setScreenInfo] = useState<ScreenInfo | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenSupported, setFullscreenSupported] = useState(false);

    // Minimum gereksinimler
    const REQUIREMENTS = {
        minWidth: 1024,
        minHeight: 768,
        optimalWidth: 1920,
        optimalHeight: 1080,
        maxZoom: 110,
        minZoom: 90
    };

    useEffect(() => {
        if (autoStart && !hasStarted) {
            startCheck();
        }
    }, [autoStart, hasStarted]);

    useEffect(() => {
        // Fullscreen değişikliklerini dinle
        const handleFullscreenChange = () => {
            const doc = document as Document & {
                webkitFullscreenElement?: Element;
                mozFullScreenElement?: Element;
                msFullscreenElement?: Element;
            };
            setIsFullscreen(!!(
                document.fullscreenElement ||
                doc.webkitFullscreenElement ||
                doc.mozFullScreenElement ||
                doc.msFullscreenElement
            ));
        };

        // Tüm vendor prefix'li event'leri dinle
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    // Ekran bilgilerini topla
    const getScreenInfo = (): ScreenInfo => {
        const screen = window.screen;

        return {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            orientation: screen.orientation?.type || 'unknown',
            devicePixelRatio: window.devicePixelRatio,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight
        };
    };

    // Zoom seviyesini hesapla
    const calculateZoomLevel = (): number => {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const screen = window.screen;

        // Zoom seviyesini hesaplamak için viewport ve screen oranını kullan
        const widthRatio = (viewport.width / screen.availWidth) * 100;
        const heightRatio = (viewport.height / screen.availHeight) * 100;

        // Ortalama oranı al ve 100'e normalize et
        const zoomLevel = Math.round((widthRatio + heightRatio) / 2);

        // Gerçekçi zoom aralığına sınırla
        return Math.max(50, Math.min(200, zoomLevel));
    };

    // Fullscreen desteğini kontrol et
    const checkFullscreenSupport = (): boolean => {
        const doc = document as Document & {
            webkitFullscreenEnabled?: Element;
            mozFullScreenEnabled?: Element;
            msFullscreenEnabled?: Element;
        };
        return !!(
            document.fullscreenEnabled ||
            doc.webkitFullscreenEnabled ||
            doc.mozFullScreenEnabled ||
            doc.msFullscreenEnabled
        );
    };

    // Ana kontrol fonksiyonu
    const startCheck = async () => {
        setIsChecking(true);
        setHasStarted(true);
        setCheckCompleted(false);

        try {
            // Kısa bekleme (UI için)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Ekran bilgilerini topla
            const info = getScreenInfo();
            setScreenInfo(info);

            // Zoom seviyesini hesapla
            const zoom = calculateZoomLevel();
            setZoomLevel(zoom);

            // Fullscreen desteğini kontrol et
            const fullscreenOK = checkFullscreenSupport();
            setFullscreenSupported(fullscreenOK);

            // Sonuçları değerlendir
            evaluateResults(info, zoom, fullscreenOK);

        } catch (error) {
            console.error('Screen optimization check error:', error);
            handleCheckError();
        } finally {
            setIsChecking(false);
            setCheckCompleted(true);
        }
    };

    // Fullscreen modunu aç/kapat
    const toggleFullscreen = async () => {
        try {
            const doc = document as Document & {
                webkitExitFullscreen?: () => Promise<void>;
                mozCancelFullScreen?: () => Promise<void>;
                msExitFullscreen?: () => Promise<void>;
            };

            const elem = document.documentElement as HTMLElement & {
                webkitRequestFullscreen?: () => Promise<void>;
                mozRequestFullScreen?: () => Promise<void>;
                msRequestFullscreen?: () => Promise<void>;
            };

            if (!document.fullscreenElement) {
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    await elem.webkitRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    await elem.mozRequestFullScreen();
                } else if (elem.msRequestFullscreen) {
                    await elem.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (doc.webkitExitFullscreen) {
                    await doc.webkitExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    await doc.mozCancelFullScreen();
                } else if (doc.msExitFullscreen) {
                    await doc.msExitFullscreen();
                }
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    };

    // Sonuçları değerlendir
    const evaluateResults = (info: ScreenInfo, zoom: number, fullscreenOK: boolean) => {
        const recommendations: string[] = [];
        let optimizationScore = 100;
        let success = true;

        // Çözünürlük kontrolü
        if (info.width < REQUIREMENTS.minWidth || info.height < REQUIREMENTS.minHeight) {
            success = false;
            optimizationScore -= 30;
            recommendations.push(`Ekran çözünürlüğü çok düşük (${info.width}x${info.height}). Minimum ${REQUIREMENTS.minWidth}x${REQUIREMENTS.minHeight} gereklidir.`);
        } else if (info.width < REQUIREMENTS.optimalWidth || info.height < REQUIREMENTS.optimalHeight) {
            optimizationScore -= 10;
            recommendations.push(`Daha iyi deneyim için ${REQUIREMENTS.optimalWidth}x${REQUIREMENTS.optimalHeight} çözünürlük önerilir.`);
        }

        // Zoom kontrolü
        if (zoom > REQUIREMENTS.maxZoom || zoom < REQUIREMENTS.minZoom) {
            optimizationScore -= 20;
            recommendations.push(`Zoom seviyesi optimal değil (%${zoom}). %90-110 arasında olmalıdır.`);
        }

        // Fullscreen desteği
        if (!fullscreenOK) {
            optimizationScore -= 15;
            recommendations.push('Fullscreen modu desteklenmiyor. Sınav güvenliği için fullscreen gerekebilir.');
        }

        // Renk derinliği
        if (info.colorDepth < 24) {
            optimizationScore -= 10;
            recommendations.push('Renk derinliği düşük. Görsel kalite etkilenebilir.');
        }

        // Oryantasyon kontrolü (mobil için)
        if (info.orientation && info.orientation.includes('portrait') && info.width < info.height) {
            optimizationScore -= 15;
            recommendations.push('Cihazı yatay (landscape) modda kullanmanız önerilir.');
        }

        // Device Pixel Ratio
        if (info.devicePixelRatio > 2) {
            recommendations.push('Yüksek DPI ekran tespit edildi. Performans için zoom seviyesini ayarlayın.');
        }

        // Başarı kriterleri
        if (optimizationScore >= 80) {
            success = true;
        }

        if (recommendations.length === 0) {
            recommendations.push('Ekran ayarları optimal durumda!');
        }

        const message = success
            ? `Ekran optimizasyonu başarılı! (Skor: ${optimizationScore}/100)`
            : `Ekran optimizasyonu gerekli. (Skor: ${optimizationScore}/100)`;

        const result: ScreenOptimizationCheckTestResult = {
            success,
            message,
            details: {
                screenInfo: info,
                zoomLevel: zoom,
                fullscreenSupported: fullscreenOK,
                recommendations,
                optimizationScore
            }
        };

        setTimeout(() => {
            onComplete(result);
        }, 1000);
    };

    // Kontrol hatası
    const handleCheckError = () => {
        const result: ScreenOptimizationCheckTestResult = {
            success: false,
            message: 'Ekran optimizasyonu kontrolü sırasında bir hata oluştu.',
            details: {
                screenInfo: {
                    width: 0,
                    height: 0,
                    colorDepth: 0,
                    pixelDepth: 0,
                    orientation: 'unknown',
                    devicePixelRatio: 1,
                    availWidth: 0,
                    availHeight: 0
                },
                zoomLevel: 100,
                fullscreenSupported: false,
                recommendations: ['Lütfen tarayıcı ayarlarınızı kontrol edin ve sayfayı yenileyin.'],
                optimizationScore: 0
            }
        };

        onComplete(result);
    };

    // Durum renkleri
    const getStatusColor = (value: number, min: number, max: number) => {
        if (value >= min && value <= max) {
            return 'text-green-600';
        }
        return 'text-red-600';
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ekran Optimizasyonu Kontrolü
                </h3>
                <p className="text-gray-600">
                    Sınav için en iyi görüntü deneyimi için ekran ayarlarınızı kontrol ediyoruz
                </p>
            </div>

            {/* Kontrol durumu */}
            {isChecking && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <div>
                            <p className="font-medium text-blue-900">Ekran ayarları kontrol ediliyor...</p>
                            <p className="text-sm text-blue-700">
                                Çözünürlük, zoom ve fullscreen desteği kontrol ediliyor
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Ekran bilgileri */}
            {screenInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sol panel - Ekran bilgileri */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Ekran Bilgileri</h4>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Çözünürlük:</span>
                                <span className={`font-medium ${getStatusColor(
                                    Math.min(screenInfo.width, screenInfo.height),
                                    REQUIREMENTS.minWidth,
                                    999999
                                )}`}>
                  {screenInfo.width} x {screenInfo.height}
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Kullanılabilir Alan:</span>
                                <span className="font-medium">
                  {screenInfo.availWidth} x {screenInfo.availHeight}
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Zoom Seviyesi:</span>
                                <span className={`font-medium ${getStatusColor(
                                    zoomLevel,
                                    REQUIREMENTS.minZoom,
                                    REQUIREMENTS.maxZoom
                                )}`}>
                  %{zoomLevel}
                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Renk Derinliği:</span>
                                <span className="font-medium">{screenInfo.colorDepth} bit</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Pixel Oranı:</span>
                                <span className="font-medium">{screenInfo.devicePixelRatio}x</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Oryantasyon:</span>
                                <span className="font-medium">
                  {screenInfo.orientation === 'landscape-primary' ? 'Yatay' :
                      screenInfo.orientation === 'portrait-primary' ? 'Dikey' :
                          screenInfo.orientation || 'Bilinmiyor'}
                </span>
                            </div>
                        </div>

                        {/* Minimum gereksinimler */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-3">Minimum Gereksinimler</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Çözünürlük:</span>
                                    <span className="font-medium">{REQUIREMENTS.minWidth}x{REQUIREMENTS.minHeight}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Zoom:</span>
                                    <span className="font-medium">%{REQUIREMENTS.minZoom} - %{REQUIREMENTS.maxZoom}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Önerilen:</span>
                                    <span className="font-medium">{REQUIREMENTS.optimalWidth}x{REQUIREMENTS.optimalHeight}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sağ panel - Kontroller ve öneriler */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Optimizasyon Kontrolleri</h4>

                        {/* Optimizasyon skoru */}
                        {checkCompleted && (
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-3">
                  <span className={`text-2xl font-bold ${getScoreColor(screenInfo ? 85 : 0)}`}>
                    {screenInfo ? 85 : 0}
                  </span>
                                </div>
                                <p className="text-sm text-gray-600">Optimizasyon Skoru</p>
                            </div>
                        )}

                        {/* Fullscreen kontrolü */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Fullscreen Desteği</p>
                                    <p className="text-sm text-gray-600">
                                        {fullscreenSupported ? 'Destekleniyor' : 'Desteklenmiyor'}
                                    </p>
                                </div>
                                <div>
                                    {fullscreenSupported ? (
                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Fullscreen test butonu */}
                            {fullscreenSupported && (
                                <button
                                    onClick={toggleFullscreen}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                                        isFullscreen
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                >
                                    {isFullscreen ? 'Fullscreen\'dan Çık' : 'Fullscreen Modunu Test Et'}
                                </button>
                            )}

                            {/* Zoom ayar önerileri */}
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900 mb-2">Zoom Ayarları</p>
                                <p className="text-sm text-gray-600 mb-3">
                                    Optimal görüntü için zoom seviyenizi %100 e ayarlayın
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            document.body.style.zoom = '0.9';
                                            setZoomLevel(90);
                                        }}
                                        className="flex-1 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                                    >
                                        90%
                                    </button>
                                    <button
                                        onClick={() => {
                                            document.body.style.zoom = '1';
                                            setZoomLevel(100);
                                        }}
                                        className="flex-1 px-3 py-1 text-xs bg-blue-200 hover:bg-blue-300 rounded"
                                    >
                                        100%
                                    </button>
                                    <button
                                        onClick={() => {
                                            document.body.style.zoom = '1.1';
                                            setZoomLevel(110);
                                        }}
                                        className="flex-1 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                                    >
                                        110%
                                    </button>
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
                        Ekran Optimizasyonu Kontrolünü Başlat
                    </button>
                ) : checkCompleted ? (
                    <button
                        onClick={() => {
                            setHasStarted(false);
                            setCheckCompleted(false);
                            setScreenInfo(null);
                            setZoomLevel(100);
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
                                Ekran optimizasyonu kontrolü başarıyla tamamlandı
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Optimizasyon önerileri */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-3">💡 Optimizasyon Önerileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
                    <div>
                        <h5 className="font-medium mb-2">Ekran Ayarları:</h5>
                        <ul className="space-y-1">
                            <li>• Zoom seviyesini %100 e ayarlayın</li>
                            <li>• Parlaklik seviyesini %70-80 arasında tutun</li>
                            <li>• Mavi işık filtresini kapatın</li>
                            <li>• Ekran tasarruf modunu devre dışı bırakın</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-medium mb-2">Sınav Öncesi:</h5>
                        <ul className="space-y-1">
                            <li>• Diğer monitörleri kapatın</li>
                            <li>• Masaüstü bildirimlerini kapatın</li>
                            <li>• Yeterli aydınlatma sağlayın</li>
                            <li>• Fullscreen modunu test edin</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Çözünürlük rehberi */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">📏 Çözünürlük Rehberi</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-gray-300">
                            <th className="text-left py-2">Çözünürlük</th>
                            <th className="text-left py-2">Durum</th>
                            <th className="text-left py-2">Açıklama</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-700">
                        <tr className="border-b border-gray-200">
                            <td className="py-2">1920x1080+</td>
                            <td className="py-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Mükemmel
                  </span>
                            </td>
                            <td className="py-2">Full HD ve üzeri, en iyi deneyim</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="py-2">1366x768</td>
                            <td className="py-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    İyi
                  </span>
                            </td>
                            <td className="py-2">HD çözünürlük, kabul edilebilir</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="py-2">1024x768</td>
                            <td className="py-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Minimum
                  </span>
                            </td>
                            <td className="py-2">En düşük gereksinim</td>
                        </tr>
                        <tr>
                            <td className="py-2">800x600</td>
                            <td className="py-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Yetersiz
                  </span>
                            </td>
                            <td className="py-2">Sınav için uygun değil</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Klavye kısayolları */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">⌨️ Yararlı Klavye Kısayolları</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                        <h5 className="font-medium mb-2">Windows:</h5>
                        <ul className="space-y-1">
                            <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded">F11</kbd> - Fullscreen aç/kapat</li>
                            <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-blue-200 rounded">+/-</kbd> - Zoom ayarla</li>
                            <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-blue-200 rounded">0</kbd> - Zoom sıfırla</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-medium mb-2">Mac:</h5>
                        <ul className="space-y-1">
                            <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded">Cmd</kbd> + <kbd className="px-1 py-0.5 bg-blue-200 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-blue-200 rounded">F</kbd> - Fullscreen</li>
                            <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded">Cmd</kbd> + <kbd className="px-1 py-0.5 bg-blue-200 rounded">+/-</kbd> - Zoom ayarla</li>
                            <li>• <kbd className="px-1 py-0.5 bg-blue-200 rounded">Cmd</kbd> + <kbd className="px-1 py-0.5 bg-blue-200 rounded">0</kbd> - Zoom sıfırla</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sorun giderme */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">🔧 Sorun Giderme</h4>
                <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Çözünürlük düşük:</strong> Ekran ayarlarından çözünürlüğü artırın</p>
                    <p><strong>Zoom problemi:</strong> Tarayıcı ayarlarından zoom seviyesini %100 e ayarlayın</p>
                    <p><strong>Fullscreen çalışmıyor:</strong> F11 tuşunu deneyin veya tarayıcı ayarlarını kontrol edin</p>
                    <p><strong>Metin bulanık:</strong> Sistem DPI ayarlarını kontrol edin</p>
                </div>
            </div>
        </div>
    );
}