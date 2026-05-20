import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UseUpdateActionProps {
  updateFn: (id: string, data: any) => Promise<any>;
  successMessage?: string;
  redirectTo?: string; // اختياري: لو عايز يحول لصفحة تانية بعد النجاح
  onSuccess?: (data: any) => void; // اختياري: لو عايز تعمل أكشن إضافي
}

export function useUpdateAction({
  updateFn,
  successMessage = "تم التحديث بنجاح",
  redirectTo,
  onSuccess,
}: UseUpdateActionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (id: string, data: any) => {
    try {
      setIsSubmitting(true);
      const res = await updateFn(id, data);

      if (res.success) {
        toast({ title: "نجاح", description: successMessage });

        if (onSuccess) onSuccess(res.data);
        if (redirectTo) navigate(redirectTo);

        return res;
      }
    } catch (error: any) {
      toast({
        title: "خطأ في التحديث",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleUpdate, isSubmitting };
}
