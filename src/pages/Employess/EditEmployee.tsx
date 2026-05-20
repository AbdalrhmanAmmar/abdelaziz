import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, AtSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { editUserSchema, type EditUserInput } from "@/validation/user";
import { userServices } from "@/api/user";
import { useFetchData } from "@/hooks/useFetchData";
import { Loading } from "@/components/shared/Loading";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: response, isLoading } = useFetchData(
    () => userServices.getById(id!),
    [id],
    !!id
  );
  const user = response?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({ username: user.username });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditUserInput) => {
    try {
      const response = await userServices.update(id!, data);
      if (response.success) {
        toast({ title: "تم التحديث", description: "تم حفظ التعديلات بنجاح" });
        navigate("/employees");
      }
    } catch (error: any) {
      toast({
        title: "خطأ في التحديث",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  if (isLoading)
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
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
          <h1 className="text-2xl font-bold">تعديل المستخدم</h1>
          <p className="text-sm text-muted-foreground">@{user?.username}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
            <h2 className="text-lg font-semibold mb-6 pb-4 border-b">بيانات الحساب</h2>

            <div className="space-y-2">
              <Label>اسم المستخدم</Label>
              <div className="relative">
                <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input {...register("username")} className="pr-10 h-11" placeholder="اسم المستخدم" />
              </div>
              {errors.username && (
                <p className="text-destructive text-xs">{errors.username.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/employees")}
              className="flex-1 h-12 rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl gradient-coral shadow-lg"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditUser;
