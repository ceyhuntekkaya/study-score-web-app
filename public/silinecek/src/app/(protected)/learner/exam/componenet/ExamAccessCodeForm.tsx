import { useState, useRef, useEffect } from 'react';

interface ExamAccessCodeFormProps {
    examId: string;
    userId: string;
    onSuccess: (accessCode: string) => void;
    onError: (error: string) => void;
    onRetryLogin: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export function ExamAccessCodeForm({
                                       examId,    // Used for: validating access code is for correct exam
                                       userId,    // Used for: ensuring user is authorized for this exam
                                       onSuccess,
                                       onError,
                                       onRetryLogin,
                                       loading,
                                       setLoading
                                   }: ExamAccessCodeFormProps) {
    const [accessCode, setAccessCode] = useState(['', '', '', '', '', '']);
    const [attempts, setAttempts] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Demo access codes for testing
    // In real app, these would be fetched from backend based on examId
    const validAccessCodes = ['123456', 'EXAM01', 'TEST99'];

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    // Timer for lockout period
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const handleInputChange = (index: number, value: string) => {
        // Allow only alphanumeric characters
        const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        if (sanitizedValue.length <= 1) {
            const newAccessCode = [...accessCode];
            newAccessCode[index] = sanitizedValue;
            setAccessCode(newAccessCode);

            // Auto-focus next input
            if (sanitizedValue && index < 5 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !accessCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle paste
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const cleanText = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
                const newAccessCode = Array(6).fill('');

                for (let i = 0; i < cleanText.length && i < 6; i++) {
                    newAccessCode[i] = cleanText[i];
                }

                setAccessCode(newAccessCode);

                // Focus last filled input or next empty
                const lastIndex = Math.min(cleanText.length, 5);
                if (inputRefs.current[lastIndex]) {
                    inputRefs.current[lastIndex]?.focus();
                }
            });
        }

        // Handle Enter key
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        const codeString = accessCode.join('');

        if (codeString.length !== 6) {
            onError('Lütfen 6 haneli erişim kodunu tamamen giriniz.');
            return;
        }

        if (attempts >= 3) {
            onError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.');
            return;
        }

        if (timeLeft > 0) {
            onError(`${timeLeft} saniye sonra tekrar deneyebilirsiniz.`);
            return;
        }

        setLoading(true);
        onError(''); // Clear previous errors

        try {
            // Simulate API call - replace with actual service
            // Real implementation would be:
            // const isValid = await authService.validateAccessCode(userId, examId, codeString);

            console.log('Validating access code:', {
                examId,
                userId,
                accessCode: codeString
            });

            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock validation logic - in real app, this would check against backend
            // The backend would verify:
            // 1. Is this access code valid for this specific exam (examId)?
            // 2. Is this user (userId) authorized to use this access code?
            // 3. Has this access code already been used?
            // 4. Is the exam still accepting participants?

            const isValidCode = validAccessCodes.includes(codeString);

            if (isValidCode) {
                // Success - in real app, backend would:
                // 1. Mark the access code as used
                // 2. Create/update exam session for this user
                // 3. Log the access attempt
                console.log('Access code validated successfully for:', { examId, userId });
                onSuccess(codeString);
            } else {
                // Failed validation
                setAttempts(prev => prev + 1);
                const newAttempts = attempts + 1;
                const remainingAttempts = 3 - newAttempts;

                if (remainingAttempts > 0) {
                    onError(`Erişim kodu hatalı. ${remainingAttempts} deneme hakkınız kaldı.`);

                    // Clear the code inputs
                    setAccessCode(['', '', '', '', '', '']);
                    if (inputRefs.current[0]) {
                        inputRefs.current[0].focus();
                    }
                } else {
                    onError('Erişim kodu deneme hakkınız bitmiştir. 5 dakika bekleyiniz.');
                    setTimeLeft(300); // 5 minutes lockout
                    setAccessCode(['', '', '', '', '', '']);
                }
            }
        } catch (error) {
            onError(`Bir hata oluştu: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setAccessCode(['', '', '', '', '', '']);
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isCodeComplete = accessCode.every(digit => digit !== '');
    const canSubmit = isCodeComplete && !loading && timeLeft === 0 && attempts < 3;

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Erişim Kodu
                </h2>
                <p className="text-gray-600">
                    Sınava erişim için 6 haneli kodu giriniz
                </p>
            </div>

            {/* Access Code Inputs */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Erişim Kodu
                </label>
                <div className="flex justify-center space-x-3">
                    {accessCode.map((digit, index) => (
                        <input
                            key={index}
                            //ref={el => inputRefs.current[index] = el}
                            ref={el => { inputRefs.current[index] = el; }}
                            type="text"
                            value={digit}
                            onChange={e => handleInputChange(index, e.target.value)}
                            onKeyDown={e => handleKeyDown(index, e)}
                            className={`w-12 h-12 text-center text-lg font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                                digit ? 'border-green-300 bg-green-50' : 'border-gray-300'
                            } ${loading || timeLeft > 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            maxLength={1}
                            disabled={loading || timeLeft > 0}
                            autoComplete="off"
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                    Harfler ve rakamlar kullanabilirsiniz
                </p>
            </div>

            {/* Timer Display */}
            {timeLeft > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-red-800">
              Tekrar deneme: {formatTime(timeLeft)}
            </span>
                    </div>
                </div>
            )}

            {/* Attempts Warning */}
            {attempts > 0 && attempts < 3 && timeLeft === 0 && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-yellow-800">
              {3 - attempts} deneme hakkınız kaldı.
            </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                        canSubmit
                            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Kontrol ediliyor...</span>
                        </div>
                    ) : timeLeft > 0 ? (
                        `Bekleme süresi: ${formatTime(timeLeft)}`
                    ) : attempts >= 3 ? (
                        'Deneme Hakkı Bitmiştir'
                    ) : (
                        'Erişim Kodunu Doğrula'
                    )}
                </button>

                <div className="flex space-x-3">
                    <button
                        onClick={handleClear}
                        disabled={loading || timeLeft > 0}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        Temizle
                    </button>

                    <button
                        onClick={onRetryLogin}
                        disabled={loading}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        Giriş Sayfasına Dön
                    </button>
                </div>
            </div>

            {/* Demo Access Codes */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    Demo Erişim Kodları:
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                    {validAccessCodes.map((code, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <code className="bg-gray-200 px-2 py-1 rounded">{code}</code>
                            <button
                                onClick={() => {
                                    const codeArray = code.split('');
                                    while (codeArray.length < 6) codeArray.push('');
                                    setAccessCode(codeArray.slice(0, 6));
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                disabled={loading || timeLeft > 0}
                            >
                                Kullan
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                    Erişim Kodu Hakkında:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Erişim kodu sınav organize eden kurum tarafından verilir</li>
                    <li>• Kod 6 haneli olup harf ve rakam içerebilir</li>
                    <li>• Büyük/küçük harf duyarlı değildir</li>
                    <li>• Her kod sadece bir kez kullanılabilir</li>
                    <li>• Kod sadece belirli sınav için geçerlidir (ID: {examId.slice(-6)})</li>
                </ul>
            </div>

            {/* Help Text */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Erişim kodunuz yok mu?
                    <button className="ml-1 text-blue-600 hover:text-blue-800 transition-colors">
                        Sınav organize eden kurum ile iletişime geçin
                    </button>
                </p>
            </div>
        </div>
    );
}