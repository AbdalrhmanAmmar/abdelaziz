import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface UseExportProps {
  exportFn: (params: any) => Promise<void>;
  fileName?: string;
}

export function useExport({ exportFn, fileName = "data-export" }: UseExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (filters: any) => {
    try {
      setIsExporting(true);

      // نداء دالة التصدير الموجودة في الـ Service
      await exportFn(filters);

      toast({
        title: "نجاح التصدير",
        description: "تم تحميل الملف بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في التصدير",
        description: error.message || "فشل تحميل ملف الإكسيل",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting };
}
