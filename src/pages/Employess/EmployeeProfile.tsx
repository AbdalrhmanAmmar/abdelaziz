import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Key, User, Calendar, Activity, CheckCircle2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { updatePasswordSchema, type UpdatePasswordInput } from "@/validation/user";
import { userServices } from "@/api/user";
import { IUpdatePasswordInput } from "@/shared";

const UserProfile = () => {
  const { user } = useAuthStore();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: UpdatePasswordInput) => {
    try {
      const res = await userServices.updatePassword(data as IUpdatePasswordInput);
      if (res?.success) {
        toast({ title: "Password updated", description: "Your password has been updated successfully." });
        setIsPasswordDialogOpen(false);
        reset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        {/* Profile Card */}
        <Card className="overflow-hidden border-0 shadow-lg animate-fade-in">
          <div className="h-24 gradient-coral relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <CardContent className="relative pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-foreground">@{user?.username}</h2>
                <p className="text-muted-foreground">System User</p>
              </div>

              <Dialog
                open={isPasswordDialogOpen}
                onOpenChange={(open) => {
                  setIsPasswordDialogOpen(open);
                  if (!open) reset();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary hover:opacity-90">
                    <Key className="w-4 h-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register("currentPassword")}
                        className={errors.currentPassword ? "border-destructive" : ""}
                      />
                      {errors.currentPassword && (
                        <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register("newPassword")}
                        className={errors.newPassword ? "border-destructive" : ""}
                      />
                      {errors.newPassword && (
                        <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register("confirmPassword")}
                        className={errors.confirmPassword ? "border-destructive" : ""}
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPasswordDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="w-5 h-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem label="Username" icon={User} value={`@${user?.username}`} />
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Member since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Activity className="w-5 h-5" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem action="Signed in successfully" time="Just now" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

const InfoItem = ({ label, icon: Icon, value }: any) => (
  <div className="space-y-2">
    <Label className="text-muted-foreground text-xs">{label}</Label>
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
      <Icon className="w-4 h-4 text-primary" />
      <span className="font-medium text-sm">{value}</span>
    </div>
  </div>
);

const ActivityItem = ({ action, time }: any) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-transparent hover:border-primary/10 transition-colors">
    <div className="p-2 rounded-full bg-success/10 text-success">
      <CheckCircle2 className="w-3 h-3" />
    </div>
    <div>
      <p className="font-medium text-xs">{action}</p>
      <p className="text-[10px] text-muted-foreground">{time}</p>
    </div>
  </div>
);

export default UserProfile;
