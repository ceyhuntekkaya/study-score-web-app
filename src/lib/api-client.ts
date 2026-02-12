import Axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { tokenStorage } from '@/utils/tokenStorage';
import { getApiInvokeUrl } from '@/config';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: getApiInvokeUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token ekleme + FormData için Content-Type düzeltmesi
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    if (config.headers) {
      // FormData gönderiliyorsa Content-Type'ı set etme; tarayıcı multipart/form-data; boundary=... ekler.
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      } else {
        // Bazı sunucular application/json;charset=UTF-8 kabul etmiyor. Sadece application/json kullan.
        config.headers['Content-Type'] = 'application/json';
      }
    }

    // Auth endpoint'lerine token EKLEME (login, register, refresh-token)
    // Bu endpoint'ler token gerektirmez çünkü henüz authenticate olmamışız
    const url = config.url || '';
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh-token') ||
      url.endsWith('/auth/login') ||
      url.endsWith('/auth/register') ||
      url.endsWith('/auth/refresh-token');

    // Sadece auth endpoint'leri DEĞİLSE token ekle
    if (!isAuthEndpoint) {
      const accessToken = tokenStorage.getAccessToken();

      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    // Auth endpoint'lerine token EKLENMEZ - bu kasıtlı!

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - error handling
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 401 - Unauthorized
    if (error.response?.status === 401) {
      // Token geçersiz, token'ları temizle ve login'e yönlendir
      if (typeof window !== 'undefined') {
        tokenStorage.clearTokens();
        window.location.href = '/login';
      }
    }
    
    // 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied');
    }
    
    // 500 - Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Custom instance for orval
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;