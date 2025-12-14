import React, { useState, useEffect, useRef } from 'react';
import {CameraMicrophoneTestResult, DeviceInfo} from "@/types/exam/exam-constants";





interface CameraMicrophoneTestProps {
    onComplete: (result: CameraMicrophoneTestResult) => void;
    autoStart?: boolean;
}

export function CameraMicrophoneTest({ onComplete, autoStart = false }: CameraMicrophoneTestProps) {
    const [isTesting, setIsTesting] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);

    // Erişim durumları
    const [cameraAccess, setCameraAccess] = useState<boolean | null>(null);
    const [microphoneAccess, setMicrophoneAccess] = useState<boolean | null>(null);

    // Cihaz listeleri
    const [videoDevices, setVideoDevices] = useState<DeviceInfo[]>([]);
    const [audioDevices, setAudioDevices] = useState<DeviceInfo[]>([]);

    // Seçili cihazlar
    const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
    const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');

    // Test sonuçları
    const [cameraResolution, setCameraResolution] = useState<string>('');
    const [audioLevel, setAudioLevel] = useState<number>(0);
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (autoStart && !hasStarted) {
            startTest();
        }
    }, [autoStart, hasStarted]);

    // Temizlik
    useEffect(() => {
        return () => {
            stopAllStreams();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Tüm stream'leri durdur
    const stopAllStreams = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setIsRecordingAudio(false);
        setAudioLevel(0);
    };

    // Mevcut cihazları listele
    const enumerateDevices = async (): Promise<{ video: DeviceInfo[], audio: DeviceInfo[] }> => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            const videoDevices = devices
                .filter(device => device.kind === 'videoinput')
                .map(device => ({
                    deviceId: device.deviceId,
                    label: device.label || `Kamera ${device.deviceId.slice(0, 8)}`,
                    kind: 'videoinput' as const
                }));

            const audioDevices = devices
                .filter(device => device.kind === 'audioinput')
                .map(device => ({
                    deviceId: device.deviceId,
                    label: device.label || `Mikrofon ${device.deviceId.slice(0, 8)}`,
                    kind: 'audioinput' as const
                }));

            return { video: videoDevices, audio: audioDevices };
        } catch (error) {
            console.error('Error enumerating devices:', error);
            return { video: [], audio: [] };
        }
    };

    // Kamera testi
    const testCamera = async (deviceId?: string): Promise<boolean> => {
        try {
            const constraints: MediaStreamConstraints = {
                video: deviceId ? { deviceId: { exact: deviceId } } : true,
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();

                // Çözünürlük bilgisini al
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack) {
                    const settings = videoTrack.getSettings();
                    setCameraResolution(`${settings.width}x${settings.height}`);
                }
            }

            return true;
        } catch (error) {
            console.error('Camera test error:', error);
            return false;
        }
    };

    // Mikrofon testi
    const testMicrophone = async (deviceId?: string): Promise<boolean> => {
        try {
            const constraints: MediaStreamConstraints = {
                video: false,
                audio: deviceId ? { deviceId: { exact: deviceId } } : true
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Audio context oluştur

            const AudioContextClass = window.AudioContext ||
                (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

            if (!AudioContextClass) {
                throw new Error('Web Audio API is not supported in this browser');
            }

            const audioContext = new AudioContextClass();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            analyser.fftSize = 256;
            source.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            // Ses seviyesi takibi başlat
            setIsRecordingAudio(true);
            monitorAudioLevel(analyser);

            // Test için stream'i durdur
            setTimeout(() => {
                stream.getTracks().forEach(track => track.stop());
            }, 3000);

            return true;
        } catch (error) {
            console.error('Microphone test error:', error);
            return false;
        }
    };

    // Ses seviyesi takibi
    const monitorAudioLevel = (analyser: AnalyserNode) => {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateLevel = () => {
            analyser.getByteFrequencyData(dataArray);

            // Ortalama ses seviyesini hesapla
            const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
            const normalizedLevel = Math.round((average / 255) * 100);

            setAudioLevel(normalizedLevel);

            if (isRecordingAudio) {
                animationRef.current = requestAnimationFrame(updateLevel);
            }
        };

        updateLevel();
    };

    // Ana test fonksiyonu
    const startTest = async () => {
        setIsTesting(true);
        setHasStarted(true);
        setTestCompleted(false);

        try {
            // Önce izinleri kontrol et
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('MediaDevices API desteklenmiyor');
            }

            // Cihazları listele (ilk izin talebi öncesi)
            let devices = await enumerateDevices();

            // Kamera testi
            const cameraResult = await testCamera();
            setCameraAccess(cameraResult);

            // Kısa bekleme
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mikrofon testi
            const microphoneResult = await testMicrophone();
            setMicrophoneAccess(microphoneResult);

            // İzin verildikten sonra cihaz listesini yenile
            devices = await enumerateDevices();
            setVideoDevices(devices.video);
            setAudioDevices(devices.audio);

            // İlk cihazları varsayılan olarak seç
            if (devices.video.length > 0) {
                setSelectedVideoDevice(devices.video[0].deviceId);
            }
            if (devices.audio.length > 0) {
                setSelectedAudioDevice(devices.audio[0].deviceId);
            }

            // 3 saniye ses kaydı
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Test sonuçlarını değerlendir
            evaluateResults(cameraResult, microphoneResult, devices);

        } catch (error) {
            console.error('Media test error:', error);
            handleTestError(error as Error);
        } finally {
            setIsTesting(false);
            setTestCompleted(true);
            setIsRecordingAudio(false);
        }
    };

    // Cihaz değiştirme
    const changeDevice = async (deviceId: string, type: 'video' | 'audio') => {
        stopAllStreams();

        if (type === 'video') {
            setSelectedVideoDevice(deviceId);
            const success = await testCamera(deviceId);
            setCameraAccess(success);
        } else {
            setSelectedAudioDevice(deviceId);
            const success = await testMicrophone(deviceId);
            setMicrophoneAccess(success);
        }
    };

    // Sonuçları değerlendir
    const evaluateResults = (cameraOK: boolean, microphoneOK: boolean, devices: { video: DeviceInfo[], audio: DeviceInfo[] }) => {
        const recommendations: string[] = [];

        if (!cameraOK) {
            recommendations.push('Kamera erişimi verilmedi veya kamera bulunamadı');
        }

        if (!microphoneOK) {
            recommendations.push('Mikrofon erişimi verilmedi veya mikrofon bulunamadı');
        }

        if (devices.video.length === 0) {
            recommendations.push('Hiç kamera cihazı bulunamadı');
        }

        if (devices.audio.length === 0) {
            recommendations.push('Hiç mikrofon cihazı bulunamadı');
        }

        if (cameraOK && devices.video.length > 0 && cameraResolution) {
            const [width, height] = cameraResolution.split('x').map(Number);
            if (width < 640 || height < 480) {
                recommendations.push('Kamera çözünürlüğü düşük, daha iyi bir kamera kullanmayı deneyin');
            }
        }

        if (microphoneOK && audioLevel < 10) {
            recommendations.push('Mikrofon ses seviyesi düşük, mikrofon ayarlarınızı kontrol edin');
        }

        const success = cameraOK && microphoneOK;

        if (recommendations.length === 0) {
            recommendations.push('Tüm medya cihazları düzgün çalışıyor');
        }

        const result: CameraMicrophoneTestResult = {
            success,
            message: success
                ? 'Kamera ve mikrofon başarıyla test edildi!'
                : 'Kamera veya mikrofon testinde sorunlar var.',
            details: {
                cameraAccess: cameraOK,
                microphoneAccess: microphoneOK,
                videoDevices: devices.video,
                audioDevices: devices.audio,
                cameraResolution,
                audioLevel,
                recommendations
            }
        };

        setTimeout(() => {
            onComplete(result);
        }, 1000);
    };

    // Test hatası
    const handleTestError = (error: Error) => {
        const result: CameraMicrophoneTestResult = {
            success: false,
            message: 'Medya cihazları test edilirken bir hata oluştu.',
            details: {
                cameraAccess: false,
                microphoneAccess: false,
                videoDevices: [],
                audioDevices: [],
                cameraResolution: '',
                audioLevel: 0,
                recommendations: [`Hata: ${error.message}`, 'Lütfen tarayıcı izinlerini kontrol edin']
            }
        };

        onComplete(result);
    };

    // Erişim durumu ikonu
    const getAccessIcon = (access: boolean | null) => {
        if (access === null) {
            return <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>;
        }

        return access ? (
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
                    Kamera & Mikrofon Testi
                </h3>
                <p className="text-gray-600">
                    Sınav izleme için kamera ve mikrofon erişimini test ediyoruz
                </p>
            </div>

            {/* Test durumu */}
            {isTesting && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <div>
                            <p className="font-medium text-blue-900">Medya cihazları test ediliyor...</p>
                            <p className="text-sm text-blue-700">
                                Tarayıcınız kamera ve mikrofon izni isteyebilir
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sol panel - Kamera testi */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Kamera Testi</h4>
                        <div className="flex items-center space-x-2">
                            {getAccessIcon(cameraAccess)}
                            <span className="text-sm font-medium">
                {cameraAccess === null ? 'Test ediliyor...' :
                    cameraAccess ? 'Erişim sağlandı' : 'Erişim reddedildi'}
              </span>
                        </div>
                    </div>

                    {/* Video önizleme */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        {!cameraAccess && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                                <div className="text-center text-white">
                                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">Kamera erişimi bekleniyor</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Kamera bilgileri */}
                    {cameraAccess && (
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Çözünürlük:</span>
                                <span className="font-medium">{cameraResolution || 'Bilinmiyor'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cihaz Sayısı:</span>
                                <span className="font-medium">{videoDevices.length}</span>
                            </div>
                        </div>
                    )}

                    {/* Kamera seçimi */}
                    {videoDevices.length > 1 && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kamera Seçin:
                            </label>
                            <select
                                value={selectedVideoDevice}
                                onChange={(e) => changeDevice(e.target.value, 'video')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {videoDevices.map((device) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Sağ panel - Mikrofon testi */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Mikrofon Testi</h4>
                        <div className="flex items-center space-x-2">
                            {getAccessIcon(microphoneAccess)}
                            <span className="text-sm font-medium">
                {microphoneAccess === null ? 'Test ediliyor...' :
                    microphoneAccess ? 'Erişim sağlandı' : 'Erişim reddedildi'}
              </span>
                        </div>
                    </div>

                    {/* Ses seviyesi göstergesi */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Ses Seviyesi:</span>
                            <span className="text-sm font-medium text-gray-900">{audioLevel}%</span>
                        </div>

                        <div className="relative">
                            {/* Ses seviyesi çubuğu */}
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-150 rounded-full ${
                                        audioLevel > 70 ? 'bg-red-500' :
                                            audioLevel > 30 ? 'bg-green-500' :
                                                audioLevel > 10 ? 'bg-yellow-500' :
                                                    'bg-gray-400'
                                    }`}
                                    style={{ width: `${Math.min(audioLevel, 100)}%` }}
                                ></div>
                            </div>

                            {/* Seviye işaretleri */}
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Sessiz</span>
                                <span>Normal</span>
                                <span>Yüksek</span>
                            </div>
                        </div>

                        {/* Ses durumu */}
                        {isRecordingAudio && (
                            <div className="flex items-center justify-center mt-3 space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-600">Ses kaydediliyor...</span>
                            </div>
                        )}
                    </div>

                    {/* Mikrofon bilgileri */}
                    {microphoneAccess && (
                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cihaz Sayısı:</span>
                                <span className="font-medium">{audioDevices.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Son Ses Seviyesi:</span>
                                <span className="font-medium">{audioLevel}%</span>
                            </div>
                        </div>
                    )}

                    {/* Mikrofon seçimi */}
                    {audioDevices.length > 1 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mikrofon Seçin:
                            </label>
                            <select
                                value={selectedAudioDevice}
                                onChange={(e) => changeDevice(e.target.value, 'audio')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {audioDevices.map((device) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Mikrofon test talimatları */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-900 mb-2">Test Talimatları:</h5>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Mikrofona doğru normal sesle konuşun</li>
                            <li>• Ses seviyesi %30-70 arasında olmalı</li>
                            <li>• Çok sessiz veya çok gürültülü ortamlardan kaçının</li>
                            <li>• Test 3 saniye sürecek</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Kontrol butonları */}
            <div className="flex justify-center space-x-4">
                {!hasStarted ? (
                    <button
                        onClick={startTest}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Kamera & Mikrofon Testini Başlat
                    </button>
                ) : isTesting ? (
                    <button
                        onClick={() => {
                            stopAllStreams();
                            setIsTesting(false);
                        }}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                        Testi Durdur
                    </button>
                ) : testCompleted ? (
                    <div className="space-x-4">
                        <button
                            onClick={() => {
                                stopAllStreams();
                                setHasStarted(false);
                                setTestCompleted(false);
                                setCameraAccess(null);
                                setMicrophoneAccess(null);
                                setVideoDevices([]);
                                setAudioDevices([]);
                                setCameraResolution('');
                                setAudioLevel(0);
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Testi Tekrarla
                        </button>

                        {(cameraAccess || microphoneAccess) && (
                            <button
                                onClick={stopAllStreams}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                            >
                                Kamerayı Kapat
                            </button>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Test tamamlandı mesajı */}
            {testCompleted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-green-900">Test Tamamlandı</p>
                            <p className="text-sm text-green-700">
                                Medya cihazları testi başarıyla tamamlandı
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* İzin talimatları */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-3">🔒 İzin Talimatları</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
                    <div>
                        <h5 className="font-medium mb-2">Chrome/Edge:</h5>
                        <ul className="space-y-1">
                            <li>• Adres çubuğundaki kamera ikonuna tıklayın</li>
                            <li>• İzin ver seçeneğini seçin</li>
                            <li>• Sayfayı yenileyin</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-medium mb-2">Firefox/Safari:</h5>
                        <ul className="space-y-1">
                            <li>• Tarayıcı ayarlarından İzinler bölümüne gidin</li>
                            <li>• Kamera ve Mikrofonу etkinleştirin</li>
                            <li>• Bu siteye izin verin</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sorun giderme */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">🔧 Sorun Giderme</h4>
                <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Kamera çalışmıyor:</strong> Diğer uygulamaların kamerayı kullanmadığından emin olun</p>
                    <p><strong>Mikrofon sessiz:</strong> Sistem ses ayarlarınızı ve mikrofon seviyesini kontrol edin</p>
                    <p><strong>İzin reddedildi:</strong> Tarayıcı ayarlarından kamera/mikrofon izinlerini manuel olarak verin</p>
                    <p><strong>Cihaz bulunamadı:</strong> USB bağlantılarını kontrol edin ve cihaz sürücülerini güncelleyin</p>
                </div>
            </div>

            {/* Gizlilik notu */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">🔐 Gizlilik Bilgisi</h4>
                <p className="text-sm text-blue-800">
                    Bu test yalnızca kamera ve mikrofon erişimini doğrulamak için yapılmaktadır.
                    Hiçbir video veya ses kaydı sunucularımızda saklanmaz. Tüm test verileri
                    tarayıcınızda yerel olarak işlenir ve test sonunda silinir.
                </p>
            </div>
        </div>
    );
}