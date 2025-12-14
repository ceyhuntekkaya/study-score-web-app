'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, User, CreditCard, CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye, Upload, Scan, Shield, Clock, ArrowRight } from 'lucide-react';

export interface IdentityDocument {
    type: 'id_card' | 'passport' | 'driver_license';
    number: string;
    name: string;
    surname: string;
    birthDate: string;
    issueDate: string;
    expiryDate: string;
}

interface VerificationResult {
    faceMatch: {
        score: number;
        status: 'verified' | 'failed' | 'uncertain';
        confidence: number;
    };
    documentVerification: {
        status: 'verified' | 'failed' | 'uncertain';
        authenticity: number;
        readability: number;
    };
    overall: 'passed' | 'failed' | 'review_required';
    timestamp: string;
}

interface IdentityReVerificationProps {
    onResult: (passed: boolean, result: VerificationResult) => void;
    userInfo?: {
        name: string;
        surname: string;
        email: string;
    };
}

export function IdentityReVerification({ onResult, userInfo }: IdentityReVerificationProps) {
    const [currentStep, setCurrentStep] = useState<'info' | 'document' | 'face_capture' | 'verification' | 'results'>('info');
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [documentCaptured, setDocumentCaptured] = useState(false);
    const [faceCaptured, setFaceCaptured] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [capturedDocument, setCapturedDocument] = useState<string | null>(null);
    const [capturedFace, setCapturedFace] = useState<string | null>(null);
    const [documentType, setDocumentType] = useState<'id_card' | 'passport' | 'driver_license'>('id_card');
    const [showInstructions, setShowInstructions] = useState(true);

    console.log("ceyhun:", documentCaptured,faceCaptured)

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Kamera başlat
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            streamRef.current = stream;
            setCameraEnabled(true);
        } catch (error) {
            console.error('Kamera başlatılamadı:', error);
            setCameraEnabled(false);
        }
    };

    // Fotoğraf çek
    const capturePhoto = (type: 'document' | 'face') => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            const imageData = canvas.toDataURL('image/jpeg', 0.8);

            if (type === 'document') {
                setCapturedDocument(imageData);
                setDocumentCaptured(true);
            } else {
                setCapturedFace(imageData);
                setFaceCaptured(true);
            }
        }
    };

    // Dosya yükleme
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCapturedDocument(e.target?.result as string);
                setDocumentCaptured(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Doğrulama işlemi
    const startVerification = async () => {
        if (!capturedDocument || !capturedFace) return;

        setCurrentStep('verification');
        setIsVerifying(true);

        // Simulated verification process
        await performMockVerification();
    };

    // Mock doğrulama (gerçek uygulamada API çağrısı)
    const performMockVerification = async () => {
        // Verification simulation - 5 seconds
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Mock verification result
        const mockResult: VerificationResult = {
            faceMatch: {
                score: 87,
                status: 'verified',
                confidence: 92
            },
            documentVerification: {
                status: 'verified',
                authenticity: 94,
                readability: 96
            },
            overall: 'passed',
            timestamp: new Date().toISOString()
        };

        setVerificationResult(mockResult);
        setIsVerifying(false);
        setCurrentStep('results');

        onResult(mockResult.overall === 'passed', mockResult);
    };

    // Tekrar doğrula
    const retryVerification = () => {
        setVerificationResult(null);
        setDocumentCaptured(false);
        setFaceCaptured(false);
        setCapturedDocument(null);
        setCapturedFace(null);
        setCurrentStep('document');
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Bilgilendirme adımı
    if (currentStep === 'info') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Kimlik Tekrar Doğrulama
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Sınav güvenliği için kimliğinizin tekrar doğrulanması gerekmektedir.
                    </p>
                </div>

                {/* User Info */}
                {userInfo && (
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Kayıtlı Bilgileriniz</h4>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Ad Soyad:</span>
                                <span className="ml-2 font-medium">{userInfo.name} {userInfo.surname}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">E-posta:</span>
                                <span className="ml-2 font-medium">{userInfo.email}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Process Steps */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                        <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900 mb-1">1. Kimlik Belgesi</h4>
                        <p className="text-sm text-gray-600">TC kimlik kartı, pasaport veya ehliyet</p>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                        <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900 mb-1">2. Yüz Fotoğrafı</h4>
                        <p className="text-sm text-gray-600">Güncel yüz fotoğrafınız</p>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                        <Scan className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900 mb-1">3. Otomatik Doğrulama</h4>
                        <p className="text-sm text-gray-600">AI ile kimlik eşleştirmesi</p>
                    </div>
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">🔒 Güvenlik ve Gizlilik</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                        <p>• Fotoğraflarınız sadece kimlik doğrulama için kullanılır</p>
                        <p>• Verileriniz şifrelenerek güvenli sunucularda işlenir</p>
                        <p>• Doğrulama sonrası fotoğraflar otomatik silinir</p>
                        <p>• KVKK ve GDPR uyumlu veri işleme</p>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => setCurrentStep('document')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                    >
                        Doğrulamaya Başla
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    // Kimlik belgesi çekme adımı
    if (currentStep === 'document') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Kimlik Belgesi
                    </h3>
                    <p className="text-gray-600">
                        Kimlik belgenizin net bir fotoğrafını çekin veya yükleyin
                    </p>
                </div>

                {/* Document Type Selection */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { type: 'id_card', label: 'TC Kimlik', icon: CreditCard },
                        { type: 'passport', label: 'Pasaport', icon: CreditCard },
                        { type: 'driver_license', label: 'Ehliyet', icon: CreditCard }
                    ].map((doc) => (
                        <button
                            key={doc.type}
                            onClick={() => setDocumentType(doc.type as typeof documentType)}
                            className={`p-3 border rounded-lg text-center transition-colors ${
                                documentType === doc.type
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <doc.icon className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-sm font-medium">{doc.label}</span>
                        </button>
                    ))}
                </div>

                {/* Instructions */}
                {showInstructions && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-yellow-800 mb-2">Fotoğraf Çekerken Dikkat Edin</h4>
                                <ul className="space-y-1 text-sm text-yellow-700">
                                    <li>• Belge tamamen görünür olmalı</li>
                                    <li>• İyi aydınlatılmış bir ortamda çekin</li>
                                    <li>• Parlaklık ve gölge olmamasına dikkat edin</li>
                                    <li>• Metin net ve okunabilir olmalı</li>
                                </ul>
                                <button
                                    onClick={() => setShowInstructions(false)}
                                    className="mt-2 text-xs text-yellow-600 hover:text-yellow-800"
                                >
                                    Anladım, gizle
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Camera/Upload Options */}
                <div className="space-y-4">
                    {/* Camera Section */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b">
                            <h4 className="font-medium text-gray-900">Kamera ile Çek</h4>
                        </div>

                        {!cameraEnabled ? (
                            <div className="p-6 text-center">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">Kimlik belgenizi çekmek için kameranızı açın</p>
                                <button
                                    onClick={startCamera}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Kamerayı Aç
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    className="w-full h-64 object-cover bg-black"
                                />
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Capture Overlay */}
                                <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg flex items-center justify-center pointer-events-none">
                                    <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                                        Kimlik belgenizi bu çerçeveye yerleştirin
                                    </div>
                                </div>

                                {/* Capture Button */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                    <button
                                        onClick={() => capturePhoto('document')}
                                        className="w-16 h-16 bg-white rounded-full border-4 border-blue-600 hover:bg-gray-50 flex items-center justify-center"
                                    >
                                        <Camera className="w-6 h-6 text-blue-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upload Section */}
                    <div className="border rounded-lg p-4">
                        <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 mb-3">Veya bilgisayarınızdan yükleyin</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Dosya Seç
                            </button>
                        </div>
                    </div>
                </div>

                {/* Captured Document */}
                {capturedDocument && (
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-green-50 px-4 py-2 border-b">
                            <h4 className="font-medium text-green-800">Çekilen Fotoğraf</h4>
                        </div>
                        <div className="p-4">
                            <img
                                src={capturedDocument}
                                alt="Kimlik belgesi"
                                className="w-full max-w-md mx-auto rounded-lg border"
                            />
                            <div className="flex justify-center gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setCapturedDocument(null);
                                        setDocumentCaptured(false);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Tekrar Çek
                                </button>
                                <button
                                    onClick={() => setCurrentStep('face_capture')}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Devam Et
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Yüz fotoğrafı çekme adımı
    if (currentStep === 'face_capture') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Yüz Fotoğrafı
                    </h3>
                    <p className="text-gray-600">
                        Net bir yüz fotoğrafı çekin
                    </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Fotoğraf İçin İpuçları</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>Gözlük varsa çıkarın</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Yüzünüz tamamen görünür olsun</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            <span>Kameraya doğrudan bakın</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>İyi aydınlatma kullanın</span>
                        </div>
                    </div>
                </div>

                {/* Camera */}
                {!cameraEnabled && (
                    <div className="text-center p-6 border rounded-lg">
                        <button
                            onClick={startCamera}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Kamerayı Aç
                        </button>
                    </div>
                )}

                {cameraEnabled && (
                    <div className="border rounded-lg overflow-hidden">
                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                className="w-full h-80 object-cover bg-black"
                            />

                            {/* Face Detection Guide */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-48 h-64 border-2 border-white border-dashed rounded-full opacity-50"></div>
                            </div>

                            {/* Capture Button */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                <button
                                    onClick={() => capturePhoto('face')}
                                    className="w-16 h-16 bg-white rounded-full border-4 border-purple-600 hover:bg-gray-50 flex items-center justify-center"
                                >
                                    <Camera className="w-6 h-6 text-purple-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Captured Face */}
                {capturedFace && (
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-purple-50 px-4 py-2 border-b">
                            <h4 className="font-medium text-purple-800">Çekilen Fotoğraf</h4>
                        </div>
                        <div className="p-4 text-center">
                            <img
                                src={capturedFace}
                                alt="Yüz fotoğrafı"
                                className="w-48 h-60 object-cover mx-auto rounded-lg border"
                            />
                            <div className="flex justify-center gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setCapturedFace(null);
                                        setFaceCaptured(false);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Tekrar Çek
                                </button>
                                <button
                                    onClick={startVerification}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Doğrulamayı Başlat
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => setCurrentStep('document')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        ← Önceki Adıma Dön
                    </button>
                </div>
            </div>
        );
    }

    // Doğrulama işlemi adımı
    if (currentStep === 'verification') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Kimlik Doğrulanıyor
                    </h3>
                    <p className="text-gray-600">
                        AI sistemi kimliğinizi doğruluyor, lütfen bekleyin...
                    </p>
                </div>

                {/* Verification Steps */}
                <div className="space-y-4">
                    {[
                        { name: 'Belge Analizi', icon: Scan, status: isVerifying ? 'checking' : 'pending' },
                        { name: 'Yüz Eşleştirmesi', icon: User, status: 'pending' },
                        { name: 'Güvenlik Kontrolü', icon: Shield, status: 'pending' }
                    ].map((step) => (
                        <div key={step.name} className="flex items-center gap-4 p-4 border rounded-lg">
                            <step.icon className={`w-6 h-6 ${
                                step.status === 'checking' ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                            <span className="flex-1 font-medium text-gray-900">{step.name}</span>
                            {step.status === 'checking' && (
                                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Progress */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="font-medium text-blue-900">Doğrulama İşlemi</p>
                            <p className="text-sm text-blue-700">Bu işlem 10-30 saniye sürebilir</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Sonuçlar adımı
    if (currentStep === 'results' && verificationResult) {
        const isSuccess = verificationResult.overall === 'passed';

        return (
            <div className="space-y-6">
                {/* Overall Result */}
                <div className={`text-center p-6 rounded-lg border-2 ${
                    isSuccess ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-white">
                        {isSuccess ? (
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : (
                            <XCircle className="w-8 h-8 text-red-600" />
                        )}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                        isSuccess ? 'text-green-800' : 'text-red-800'
                    }`}>
                        {isSuccess ? 'Kimlik Doğrulandı' : 'Doğrulama Başarısız'}
                    </h3>
                    <p className={`${
                        isSuccess ? 'text-green-700' : 'text-red-700'
                    }`}>
                        {isSuccess ?
                            'Kimliğiniz başarıyla doğrulandı ve sınava devam edebilirsiniz' :
                            'Kimlik doğrulama işlemi başarısız oldu, lütfen tekrar deneyin'}
                    </p>
                </div>

                {/* Detailed Results */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className={`border rounded-lg p-4 ${
                        verificationResult.faceMatch.status === 'verified' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">Yüz Eşleştirmesi</span>
                            </div>
                            <span className={`font-bold ${
                                verificationResult.faceMatch.status === 'verified' ? 'text-green-600' : 'text-red-600'
                            }`}>
                %{verificationResult.faceMatch.score}
              </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Güven seviyesi: %{verificationResult.faceMatch.confidence}
                        </p>
                    </div>

                    <div className={`border rounded-lg p-4 ${
                        verificationResult.documentVerification.status === 'verified' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-purple-600" />
                                <span className="font-medium">Belge Doğrulama</span>
                            </div>
                            <span className={`font-bold ${
                                verificationResult.documentVerification.status === 'verified' ? 'text-green-600' : 'text-red-600'
                            }`}>
                %{verificationResult.documentVerification.authenticity}
              </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Okunabilirlik: %{verificationResult.documentVerification.readability}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3">
                    {!isSuccess && (
                        <button
                            onClick={retryVerification}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Tekrar Dene
                        </button>
                    )}

                    <button
                        onClick={() => onResult(isSuccess, verificationResult)}
                        className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                            isSuccess
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                        {isSuccess ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Doğrulamayı Tamamla
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4" />
                                Sonucu Kaydet
                            </>
                        )}
                    </button>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-900">Güvenlik Bildirimi</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                {isSuccess ?
                                    'Kimlik doğrulama işlemi başarıyla tamamlandı. Fotoğraflarınız güvenli olarak silinecektir.' :
                                    'Doğrulama başarısız oldu. Teknik destek ekibiyle iletişime geçebilirsiniz.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}