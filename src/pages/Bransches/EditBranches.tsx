import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Building2, Loader2, MapPin, Phone, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { BranchFormData, branchSchema } from "@/validation/branches";
import { zodResolver } from "@hookform/resolvers/zod";
import { BranchService } from "@/api/branche";
import { IBranch, ICreateBranchInput } from "@/interface/branches";
import { Loading } from "@/components/shared/Loading";

const EditBranch = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
  });
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const [branch, setBranch] = useState<IBranch>();

  const fetchbranch = async () => {
    try {
      setIsLoading(true);

      const response = await BranchService.getById(id);
      if (response.success) {
        setBranch(response.data);
        reset(response.data);
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
  };

  useEffect(() => {
    fetchbranch();
  }, []);

  const onSubmit = async (data: BranchFormData) => {
    try {
      if (!id) {
        toast({
          title: "خطأ",
          description: "معرف الفرع غير موجود",
          variant: "destructive",
        });
        return;
      }

      console.log("جاري تحديث البيانات...", data);

      // استدعاء دالة التحديث (Update) وليس (Create)
      const response = await BranchService.update(id, data as ICreateBranchInput);

      if (response.success) {
        toast({
          title: "تم التحديث بنجاح",
          description: `تم تعديل بيانات فرع ${data.name} بنجاح.`,
        });

        setTimeout(() => {
          navigate("/branches");
        }, 1500);
      }
    } catch (error: any) {
      toast({
        title: "فشل التحديث",
        description: error.message || "عذراً، حدث خطأ أثناء محاولة حفظ التعديلات",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
          <Loading className="h-64" text="جاري جلب الفروع من السيرفر..." />
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/branches")}
                className="rounded-full hover:bg-primary/10"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {" "}
                  تعديل بيانات فرع {branch?.name || ""}
                </h1>
                <p className="text-muted-foreground text-sm">أدخل بيانات الفرع الجديد</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="max-w-2xl mx-auto border-border/50 shadow-lg overflow-hidden">
            {/* Decorative Header */}
            <div className="h-32 bg-gradient-to-l from-primary via-primary/80 to-primary/60 relative">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-background/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>

            <CardHeader className="text-center pb-2 pt-6">
              <CardTitle className="text-xl">معلومات الفرع</CardTitle>
              <p className="text-muted-foreground text-sm">أدخل البيانات الأساسية للفرع</p>
            </CardHeader>

            <CardContent className="p-6 pt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Branch Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4 text-primary" />
                    اسم الفرع
                  </Label>
                  <Input
                    {...register("name")} // تسجيل الحقل
                    id="name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name?.message}</p>}
                </div>

                {/* Branch Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    عنوان الفرع
                  </Label>
                  <Input
                    {...register("address")}
                    className="h-12 text-base border-border/50 focus:border-primary transition-colors"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.address?.message}</p>}
                </div>

                {/* Branch Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4 text-primary" />
                    رقم الهاتف
                  </Label>
                  <Input
                    {...register("phone")}
                    className="h-12 text-base border-border/50 focus:border-primary transition-colors"
                    dir="ltr"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.phone?.message}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting} // تعطيل الزر أثناء الإرسال
                    className="flex-1 h-12 text-base gap-2 bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <div key="loading-state" className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>جاري الحفظ...</span>
                      </div>
                    ) : (
                      <div key="normal-state" className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        <span>حفظ الفرع</span>
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-6 gap-2 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                    onClick={() => navigate("/branches")}
                  >
                    <X className="h-5 w-5" />
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EditBranch;
