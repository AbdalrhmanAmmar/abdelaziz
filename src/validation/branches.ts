import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().min(1, "اسم الفرع مطلوب").max(100, "الاسم طويل جداً"),

  address: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل").optional().or(z.literal("")),

  phone: z
    .string()
    .regex(/^01[0-2,5]\d{8}$/, "رقم الهاتف غير صحيح (مثال: 01012345678)")
    .optional()
    .or(z.literal("")),
});

// استخراج النوع (Type) من الـ Schema لاستخدامه في الـ Interfaces
export type BranchFormData = z.infer<typeof branchSchema>;
