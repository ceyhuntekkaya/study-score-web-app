'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Volume2, Users, Eye, CheckCircle, XCircle, AlertTriangle, RefreshCw, Lightbulb, Shield } from 'lucide-react';

interface EnvironmentIssue {
    type: 'error' | 'warning' | 'info';
    category: 'lighting' | 'noise' | 'objects' | 'people' | 'space';
    message: string;
    suggestion: string;
}

interface EnvironmentAnalysis {
    overall: 'excellent' | 'good' | 'acceptable' | 'poor';
    lighting: {
        score: number;
        status: 'good' | 'dim' | 'bright' | 'uneven';
        recommendation?: string;
    };
    noise: {
        score: number;
        level: 'silent' | 'quiet' | 'moderate' | 'loud';
        recommendation?: string;
    };
    space: {
        score: number;
        status: 'clear' | 'cluttered' | 'inappropriate';
        recommendation?: string;
    };
    people: {
        count: number;
        status: 'alone' | 'others_present';
        recommendation?: string;
    };
    objects: {
        unauthorizedCount: number;
        detectedItems: string[];
        recommendation?: string;
    };
}

interface EnvironmentCheckProps {
    onResult: (passed: boolean, analysis: EnvironmentAnalysis) => void;
}

export function EnvironmentCheck({ onResult }: EnvironmentCheckProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [checkCompleted, setCheckCompleted] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [currentStep, setCurrentStep] = useState<'permissions' | 'analysis' | 'results'>('permissions');
    const [analysis, setAnalysis] = useState<EnvironmentAnalysis | null>(null);
    const [issues, setIssues] = useState<EnvironmentIssue[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [noiseLevel, setNoiseLevel] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    console.log("ceyhun", isChecking, checkCompleted)

    // Kamera izni al
    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: true
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            streamRef.current = stream;
            setCameraEnabled(true);
            setAudioEnabled(true);
            setupAudioAnalysis(stream);

        } catch (error) {
            console.error('Kamera izni alınamadı:', error);
            setCameraEnabled(false);
        }
    };

    // Ses analizi kurulumu
    const setupAudioAnalysis = (stream: MediaStream) => {
        try {

            const AudioContextClass = window.AudioContext ||
                (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

            if (!AudioContextClass) {
                throw new Error("Tarayıcınız Web Audio API'yi desteklemiyor.");
            }

            const audioContext = new AudioContextClass();


            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            startNoiseMonitoring();
        } catch (error) {
            console.error('Ses analizi kurulamadı:', error);
        }
    };

    // Gürültü seviyesi takibi
    const startNoiseMonitoring = () => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const updateNoiseLevel = () => {
            if (analyserRef.current && isRecording) {
                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((sum, value) => sum + value) / dataArray.length;
                setNoiseLevel(Math.round((average / 255) * 100));
                requestAnimationFrame(updateNoiseLevel);
            }
        };

        updateNoiseLevel();
    };

    // Çevre analizi başlat
    const startEnvironmentAnalysis = async () => {
        if (currentStep !== 'permissions') return;

        setCurrentStep('analysis');
        setIsChecking(true);
        setIsRecording(true);

        // Simulated AI analysis - gerçek uygulamada AI servisine gönderilecek
        await performMockAnalysis();
    };

    // Mock AI analizi (gerçek uygulamada API çağrısı)
    const performMockAnalysis = async () => {
        // Simulation: 5 saniye analiz süresi
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Mock analiz sonuçları
        const mockAnalysis: EnvironmentAnalysis = {
            overall: 'good',
            lighting: {
                score: 85,
                status: 'good',
                recommendation: 'Işık seviyesi uygun'
            },
            noise: {
                score: 78,
                level: 'quiet',
                recommendation: 'Ses seviyesi kabul edilebilir düzeyde'
            },
            space: {
                score: 90,
                status: 'clear',
                recommendation: 'Çalışma alanı temiz ve düzenli'
            },
            people: {
                count: 1,
                status: 'alone',
                recommendation: 'Tek kişi tespit edildi - uygun'
            },
            objects: {
                unauthorizedCount: 0,
                detectedItems: ['laptop', 'desk', 'chair'],
                recommendation: 'Yasak obje tespit edilmedi'
            }
        };

        // Mock sorunlar
        const mockIssues: EnvironmentIssue[] = [
            {
                type: 'warning',
                category: 'lighting',
                message: 'Işık seviyesi biraz düşük',
                suggestion: 'Daha iyi aydınlatma için perde açın veya ışık yakın'
            }
        ];

        setAnalysis(mockAnalysis);
        setIssues(mockIssues);
        setIsChecking(false);
        setIsRecording(false);
        setCurrentStep('results');
        setCheckCompleted(true);

        // Sonucu parent component'e gönder
        const passed = mockAnalysis.overall !== 'poor';
        onResult(passed, mockAnalysis);
    };

    // Analizi tekrar çalıştır
    const retryAnalysis = () => {
        setCheckCompleted(false);
        setCurrentStep('analysis');
        setAnalysis(null);
        setIssues([]);
        startEnvironmentAnalysis();
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // İzin adımı
    if (currentStep === 'permissions') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Çevre Kontrolü
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Sınav ortamınızın uygunluğunu kontrol etmek için kamera ve mikrofon izinlerine ihtiyacımız var.
                    </p>
                </div>

                {/* Permissions Status */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className={`border rounded-lg p-4 ${cameraEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <Camera className={`w-5 h-5 ${cameraEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                            <div>
                                <h4 className="font-medium text-gray-900">Kamera Erişimi</h4>
                                <p className="text-sm text-gray-600">Sınav ortamını analiz etmek için</p>
                            </div>
                            {cameraEnabled && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                        </div>
                    </div>

                    <div className={`border rounded-lg p-4 ${audioEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <Volume2 className={`w-5 h-5 ${audioEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                            <div>
                                <h4 className="font-medium text-gray-900">Mikrofon Erişimi</h4>
                                <p className="text-sm text-gray-600">Çevre sesini analiz etmek için</p>
                            </div>
                            {audioEnabled && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                        </div>
                    </div>
                </div>

                {/* Camera Preview */}
                {cameraEnabled && (
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b">
                            <h4 className="font-medium text-gray-900">Kamera Önizlemesi</h4>
                        </div>
                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                className="w-full h-64 object-cover bg-black"
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Noise Level Indicator */}
                            {audioEnabled && (
                                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Volume2 className="w-4 h-4" />
                                        <div className="w-20 bg-gray-600 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all duration-150"
                                                style={{ width: `${noiseLevel}%` }}
                                            />
                                        </div>
                                        <span className="text-xs">{noiseLevel}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-center">
                    {!cameraEnabled ? (
                        <button
                            onClick={requestCameraPermission}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Kamera ve Mikrofon İzni Ver
                        </button>
                    ) : (
                        <button
                            onClick={startEnvironmentAnalysis}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                        >
                            <Shield className="w-5 h-5" />
                            Çevre Analizini Başlat
                        </button>
                    )}
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Neleri Kontrol Ediyoruz?</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            <span>Işık seviyesi ve kalitesi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4" />
                            <span>Çevre gürültü seviyesi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Odada başka kişilerin varlığı</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>Yasak obje ve materyaller</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Analiz adımı
    if (currentStep === 'analysis') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Çevre Analizi Yapılıyor
                    </h3>
                    <p className="text-gray-600">
                        AI sistemi sınav ortamınızı analiz ediyor, lütfen bekleyin...
                    </p>
                </div>

                {/* Live Analysis */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                        <h4 className="font-medium text-gray-900">Canlı Analiz</h4>
                    </div>
                    <div className="relative">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            className="w-full h-64 object-cover bg-black"
                        />

                        {/* Analysis Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
                            <div className="bg-white rounded-lg p-4 text-center">
                                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                                <p className="text-sm text-gray-700">Analiz ediliyor...</p>
                            </div>
                        </div>

                        {/* Live Indicators */}
                        <div className="absolute bottom-4 left-4 space-y-2">
                            <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs">Kayıt: {isRecording ? 'Aktif' : 'Pasif'}</span>
                            </div>

                            {audioEnabled && (
                                <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Volume2 className="w-3 h-3" />
                                        <div className="w-16 bg-gray-600 rounded-full h-1">
                                            <div
                                                className="bg-green-500 h-1 rounded-full transition-all duration-150"
                                                style={{ width: `${noiseLevel}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Analysis Steps */}
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { name: 'Işık Analizi', icon: Lightbulb, status: 'checking' },
                        { name: 'Ses Analizi', icon: Volume2, status: 'checking' },
                        { name: 'Obje Tespiti', icon: Eye, status: 'pending' },
                        { name: 'Kişi Sayımı', icon: Users, status: 'pending' }
                    ].map((step) => (
                        <div key={step.name} className="flex items-center gap-3 p-3 border rounded-lg">
                            <step.icon className={`w-5 h-5 ${
                                step.status === 'checking' ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                            <span className="text-sm text-gray-700">{step.name}</span>
                            {step.status === 'checking' && (
                                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin ml-auto" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Sonuçlar adımı
    if (currentStep === 'results' && analysis) {
        const getScoreColor = (score: number) => {
            if (score >= 80) return 'text-green-600';
            if (score >= 60) return 'text-yellow-600';
            return 'text-red-600';
        };

        const getScoreBackground = (score: number) => {
            if (score >= 80) return 'bg-green-50 border-green-200';
            if (score >= 60) return 'bg-yellow-50 border-yellow-200';
            return 'bg-red-50 border-red-200';
        };

        return (
            <div className="space-y-6">
                {/* Overall Result */}
                <div className={`text-center p-6 rounded-lg border-2 ${
                    analysis.overall === 'excellent' || analysis.overall === 'good' ? 'border-green-500 bg-green-50' :
                        analysis.overall === 'acceptable' ? 'border-yellow-500 bg-yellow-50' :
                            'border-red-500 bg-red-50'
                }`}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-white">
                        {analysis.overall === 'excellent' || analysis.overall === 'good' ? (
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : analysis.overall === 'acceptable' ? (
                            <AlertTriangle className="w-8 h-8 text-yellow-600" />
                        ) : (
                            <XCircle className="w-8 h-8 text-red-600" />
                        )}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                        analysis.overall === 'excellent' || analysis.overall === 'good' ? 'text-green-800' :
                            analysis.overall === 'acceptable' ? 'text-yellow-800' :
                                'text-red-800'
                    }`}>
                        {analysis.overall === 'excellent' ? 'Mükemmel Ortam' :
                            analysis.overall === 'good' ? 'Uygun Ortam' :
                                analysis.overall === 'acceptable' ? 'Kabul Edilebilir' :
                                    'Uygun Değil'}
                    </h3>
                    <p className={`${
                        analysis.overall === 'excellent' || analysis.overall === 'good' ? 'text-green-700' :
                            analysis.overall === 'acceptable' ? 'text-yellow-700' :
                                'text-red-700'
                    }`}>
                        {analysis.overall === 'excellent' || analysis.overall === 'good' ?
                            'Sınav ortamınız tüm kriterlere uygun' :
                            analysis.overall === 'acceptable' ?
                                'Sınav ortamınız kabul edilebilir seviyede' :
                                'Sınav ortamınızda iyileştirme gerekiyor'}
                    </p>
                </div>

                {/* Detailed Analysis */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className={`border rounded-lg p-4 ${getScoreBackground(analysis.lighting.score)}`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-600" />
                                <span className="font-medium">Işık Seviyesi</span>
                            </div>
                            <span className={`font-bold ${getScoreColor(analysis.lighting.score)}`}>
                {analysis.lighting.score}/100
              </span>
                        </div>
                        <p className="text-sm text-gray-600">{analysis.lighting.recommendation}</p>
                    </div>

                    <div className={`border rounded-lg p-4 ${getScoreBackground(analysis.noise.score)}`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Volume2 className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">Ses Seviyesi</span>
                            </div>
                            <span className={`font-bold ${getScoreColor(analysis.noise.score)}`}>
                {analysis.noise.score}/100
              </span>
                        </div>
                        <p className="text-sm text-gray-600">{analysis.noise.recommendation}</p>
                    </div>

                    <div className={`border rounded-lg p-4 ${getScoreBackground(analysis.space.score)}`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-purple-600" />
                                <span className="font-medium">Çalışma Alanı</span>
                            </div>
                            <span className={`font-bold ${getScoreColor(analysis.space.score)}`}>
                {analysis.space.score}/100
              </span>
                        </div>
                        <p className="text-sm text-gray-600">{analysis.space.recommendation}</p>
                    </div>

                    <div className={`border rounded-lg p-4 ${
                        analysis.people.status === 'alone' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-600" />
                                <span className="font-medium">Kişi Tespiti</span>
                            </div>
                            <span className={`font-bold ${
                                analysis.people.status === 'alone' ? 'text-green-600' : 'text-red-600'
                            }`}>
                {analysis.people.count} kişi
              </span>
                        </div>
                        <p className="text-sm text-gray-600">{analysis.people.recommendation}</p>
                    </div>
                </div>

                {/* Issues */}
                {issues.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Tespit Edilen Sorunlar</h4>
                        {issues.map((issue, index) => (
                            <div key={index} className={`border rounded-lg p-3 ${
                                issue.type === 'error' ? 'border-red-200 bg-red-50' :
                                    issue.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                                        'border-blue-200 bg-blue-50'
                            }`}>
                                <div className="flex items-start gap-3">
                                    {issue.type === 'error' ? (
                                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    ) : issue.type === 'warning' ? (
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p className={`font-medium ${
                                            issue.type === 'error' ? 'text-red-800' :
                                                issue.type === 'warning' ? 'text-yellow-800' :
                                                    'text-blue-800'
                                        }`}>
                                            {issue.message}
                                        </p>
                                        <p className={`text-sm mt-1 ${
                                            issue.type === 'error' ? 'text-red-700' :
                                                issue.type === 'warning' ? 'text-yellow-700' :
                                                    'text-blue-700'
                                        }`}>
                                            {issue.suggestion}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-3">
                    <button
                        onClick={retryAnalysis}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Tekrar Analiz Et
                    </button>

                    {analysis.overall !== 'poor' && (
                        <button
                            onClick={() => onResult(true, analysis)}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Kontrolü Tamamla
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return null;
}