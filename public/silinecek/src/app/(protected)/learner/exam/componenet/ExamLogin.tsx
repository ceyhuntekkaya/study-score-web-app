import { useState } from 'react';

interface ExamLoginFormProps {
    examId: string;
    onSuccess: (userData: { userId: string; email: string; name: string }) => void;
    onError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export function ExamLoginForm({
                                  examId,
                                  onSuccess,
                                  onError,
                                  loading,
                                  setLoading
                              }: ExamLoginFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [attempts, setAttempts] = useState(0);

    console.log("ceyhun", examId)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.email.trim()) {
            onError('E-posta adresi gereklidir.');
            return false;
        }

        if (!formData.email.includes('@')) {
            onError('Geçerli bir e-posta adresi giriniz.');
            return false;
        }

        if (!formData.password.trim()) {
            onError('Şifre gereklidir.');
            return false;
        }

        if (formData.password.length < 6) {
            onError('Şifre en az 6 karakter olmalıdır.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (attempts >= 3) {
            onError('Çok fazla başarısız deneme. Lütfen 5 dakika bekleyin.');
            return;
        }

        setLoading(true);
        onError(''); // Clear previous errors

        try {
            // Simulate API call - replace with actual authentication service
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock authentication logic
            const isValidCredentials = formData.email === 'test@example.com' && formData.password === 'test123';

            if (isValidCredentials) {
                // Success
                const userData = {
                    userId: 'user-123',
                    email: formData.email,
                    name: 'Test User'
                };

                // Save to localStorage if remember me is checked
                if (formData.rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                }

                onSuccess(userData);
            } else {
                // Failed authentication
                setAttempts(prev => prev + 1);
                const remainingAttempts = 3 - (attempts + 1);

                if (remainingAttempts > 0) {
                    onError(`Giriş bilgileri hatalı. ${remainingAttempts} deneme hakkınız kaldı.`);
                } else {
                    onError('Giriş yapma hakkınız bitmiştir. Lütfen sistem yöneticisi ile iletişime geçin.');
                }
            }
        } catch (error) {
            onError('Bir hata oluştu. Lütfen tekrar deneyin.' + error);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // Navigate to forgot password or show modal
        alert('Şifre sıfırlama özelliği henüz aktif değil. Sistem yöneticisi ile iletişime geçin.');
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Giriş Yapın
                </h2>
                <p className="text-gray-600">
                    Sınava katılabilmek için hesabınıza giriş yapın
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta Adresi
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="ornek@email.com"
                            disabled={loading}
                            autoComplete="email"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Şifre
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Şifrenizi giriniz"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            disabled={loading}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={loading}
                        />
                        <span className="ml-2 text-sm text-gray-700">Beni hatırla</span>
                    </label>

                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        disabled={loading}
                    >
                        Şifremi unuttum
                    </button>
                </div>

                {/* Attempts Warning */}
                {attempts > 0 && attempts < 3 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
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

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || attempts >= 3}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                        loading || attempts >= 3
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Giriş yapılıyor...</span>
                        </div>
                    ) : attempts >= 3 ? (
                        'Giriş Hakkı Bitmiştir'
                    ) : (
                        'Giriş Yap'
                    )}
                </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    Demo Giriş Bilgileri:
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                    <div>E-posta: <code className="bg-gray-200 px-1 rounded">test@example.com</code></div>
                    <div>Şifre: <code className="bg-gray-200 px-1 rounded">test123</code></div>
                </div>
            </div>

            {/* Additional Help */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Hesabınız yok mu?
                    <button className="ml-1 text-blue-600 hover:text-blue-800 transition-colors">
                        Sistem yöneticisi ile iletişime geçin
                    </button>
                </p>
            </div>
        </div>
    );
}