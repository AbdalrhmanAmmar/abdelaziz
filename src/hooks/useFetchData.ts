import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { BaseResponse } from "@crm/shared";

// تم تعديل النوع T ليمثل الرد الكامل (Response) وليس فقط البيانات الداخلية
export function useFetchData<T extends BaseResponse>(
  fetchFn: () => Promise<T>,
  deps: any[] = [],
  enabled: boolean = true
) {
  // هنا نخزن الرد بالكامل لكي نتمكن من الوصول لـ data و meta لاحقاً
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      const response = await fetchFn();

      // نتحقق من نجاح العملية (سواء كانت success أو status حسب تعريفك)
      if (response.success) {
        setData(response); // نرفع الرد بالكامل للـ State
      }
    } catch (error: any) {
      toast({
        title: "خطأ في جلب البيانات",
        description: error.message || "تأكد من اتصالك بالسيرفر",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, toast, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data, // سيعود بالكامل (مثلاً { data: [], meta: {} })
    isLoading,
    refetch: fetchData,
    setData,
  };
}
