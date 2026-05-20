import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { loginSchema, type LoginInput } from "@/validation/user";
import { useAuthStore } from "@/store/useAuthStore";

const Login = () => {
  const { login: loginFromStore, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginFromStore(data);
      toast({ title: "Signed in successfully", description: "Redirecting to dashboard..." });
      navigate("/", { replace: true });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Invalid username or password";
      toast({ title: "Sign in failed", description: errorMessage, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-coral relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <img src="./favicon.ico" alt="logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Al Abdulghani Motors
            </h1>
            <p className="text-white/80 text-lg max-w-md">
              Integrated business management solutions for streamlined operations and peak efficiency.
            </p>
          </div>

          {/* Decorative circles */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="animate-fade-up">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl gradient-coral flex items-center justify-center">
                <img src="./favicon.ico" alt="logo" className="w-7 h-7 object-contain" />
              </div>
              <span className="font-bold text-lg text-foreground">Al Abdulghani Motors</span>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Sign in to access your dashboard</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    {...register("username")}
                    id="username"
                    placeholder="Enter your username"
                    className={`pl-10 h-12 bg-muted/50 border-border/50 focus:bg-background ${
                      errors.username ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-destructive text-xs mt-1">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 h-12 bg-muted/50 border-border/50 focus:bg-background ${
                      errors.password ? "border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base gradient-coral hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
