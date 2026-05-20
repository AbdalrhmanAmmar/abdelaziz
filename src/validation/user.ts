import z from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن لا يقل عن 3 أحرف"),
  password: z.string().min(6, "كلمة السر يجب أن لا تقل عن 6 أحرف"),
});

export const editUserSchema = z.object({
  username: z.string().min(3, "اسم المستخدم قصير جداً").optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور الجديدة غير متطابقة",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "كلمة المرور الجديدة يجب أن تختلف عن الحالية",
    path: ["newPassword"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type EditUserInput = z.infer<typeof editUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
