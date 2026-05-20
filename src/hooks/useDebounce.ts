// apps/frontend/src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

/**
 * هوك لتأخير تحديث القيمة (Debounce)
 * @param value القيمة المراد مراقبتها (مثل نص البحث)
 * @param delay مدة التأخير بالملي ثانية (مثلاً 500)
 */
export function useDebounce<T>(value: T, delay: number): T {
  // القيمة التي سيتم إرجاعها بعد التأخير
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // إعداد مؤقت لتحديث القيمة بعد مرور الوقت المحدد
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // تنظيف المؤقت (Cleanup) إذا تغيرت القيمة قبل انتهاء الوقت
    // هذا هو السر الذي يمنع إرسال الطلبات مع كل حرف
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
