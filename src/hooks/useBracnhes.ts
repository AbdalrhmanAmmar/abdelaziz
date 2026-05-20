// src/hooks/useBranches.ts
import { useQuery } from "@tanstack/react-query";
import { BranchService } from "@/api/branche";

export const useBranches = () => {
  return useQuery({
    queryKey: ["branches-lookup"], // مفتاح الكاش
    queryFn: async () => {
      const response = await BranchService.getAll();
      if (!response.success) throw new Error("فشل جلب الفروع");
      // هنا نأخذ فقط الـ id و name ليكون الكومبوننت خفيفاً
      return response.data.map((b: any) => ({ id: b.id, name: b.name }));
    },
    staleTime: 1000 * 60 * 60, // الكاش صالح لمدة ساعة
  });
};
