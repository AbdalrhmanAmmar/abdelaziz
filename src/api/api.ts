import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// إنشاء النسخة
const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Interceptors (المراقبين) ---

// 1. مراقب الطلبات: لجلب التوكن من مخزن Zustand
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Zustand persist يخزن البيانات كـ JSON داخل LocalStorage
    const authStorage = localStorage.getItem("auth-storage");

    if (authStorage) {
      try {
        const parsedStorage = JSON.parse(authStorage);
        const token = parsedStorage.state?.token; // الوصول للتوكن من داخل state الخاص بـ Zustand

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error parsing auth-storage", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. مراقب الاستجابة: لمعالجة الأخطاء والـ Unauthorized
client.interceptors.response.use(
  (response) => response, // إرجاع الرد كما هو (السيرفس سيتعامل مع response.data)
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "حدث خطأ في الاتصال بالسيرفر";

    // حالة 401: التوكن غير صالح أو انتهى
    if (status === 401) {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem("auth-storage"); // مسح بيانات الدخول

      // توجيه المستخدم لصفحة Login إذا لم يكن فيها
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?message=expired";
      }
    }

    // إرجاع الخطأ ليتم التقاطه في الـ catch داخل السيرفس أو المكون
    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

export default client;
