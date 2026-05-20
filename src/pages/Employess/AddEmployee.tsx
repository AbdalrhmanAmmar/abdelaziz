import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, AtSign, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createUserSchema, type CreateUserInput } from "@/validation/user";
import { userServices } from "@/api/user";

const AddUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      const response = await userServices.create(data);
      if (response.success) {
        toast({ title: "تم الإضافة", description: "تم إضافة المستخدم بنجاح" });
        navigate("/employees");
      }
    } catch (error: any) {
      toast({
        title: "فشلت الإضافة",
        description: error.message || "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/employees")}
          className="rounded-xl"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">إضافة مستخدم جديد</h1>
          <p className="text-muted-foreground">أدخل بيانات المستخدم</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">بيانات الحساب</h2>
                <p className="text-muted-foreground text-sm">اسم المستخدم وكلمة السر فقط</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم *</Label>
                <div className="relative">
                  <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    {...register("username")}
                    id="username"
                    className="pr-12 h-12"
                    placeholder="اسم الدخول للنظام"
                  />
                </div>
                {errors.username && (
                  <p className="text-destructive text-xs">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">كلمة السر *</Label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-12 pl-12 h-12"
                    placeholder="كلمة المرور (6 أحرف على الأقل)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/employees")}
              className="flex-1 h-12"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 gradient-coral shadow-lg"
            >
              {isSubmitting ? "جاري الحفظ..." : "إضافة المستخدم"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddUser;
