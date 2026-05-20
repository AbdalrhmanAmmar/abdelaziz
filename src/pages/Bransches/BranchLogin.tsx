import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowRight, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { branchServices } from "@/api/branch";

export const BRANCH_SESSION_KEY = "branch-session";

const BranchLogin = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branchDisplayName = slug
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") ?? "Branch";

  useEffect(() => {
    const stored = localStorage.getItem(BRANCH_SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.slug === slug) {
          navigate(`/branch/${slug}/dashboard`, { replace: true });
        }
      } catch {
        localStorage.removeItem(BRANCH_SESSION_KEY);
      }
    }
  }, [slug, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !slug) return;

    try {
      setIsSubmitting(true);
      const session = await branchServices.verifyLogin(slug, password.trim());

      if (!session) {
        toast({
          title: "Incorrect password",
          description: "Please check the password and try again.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem(BRANCH_SESSION_KEY, JSON.stringify(session));
      toast({ title: "Access granted", description: `Welcome to ${session.name}` });
      navigate(`/branch/${slug}/dashboard`, { replace: true });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-coral relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 leading-tight">Al Abdulghani Motors</h1>
            <p className="text-2xl font-semibold text-white/90 mb-4">{branchDisplayName}</p>
            <p className="text-white/70 text-base max-w-md">
              Enter the branch password to access the branch portal.
            </p>
          </div>
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
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">Al Abdulghani Motors</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">{branchDisplayName}</h2>
            </div>
            <p className="text-muted-foreground mb-8">Enter the branch password to continue</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Branch Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-muted/50 border-border/50 focus:bg-background"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base gradient-coral hover:opacity-90 transition-opacity"
                disabled={isSubmitting || !password.trim()}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Enter Branch
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

export default BranchLogin;
