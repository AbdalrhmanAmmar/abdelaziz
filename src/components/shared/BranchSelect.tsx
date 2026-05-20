// @/components/shared/BranchSelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useBranches } from "./../../hooks/useBracnhes";
import { cn } from "@/lib/utils";

interface BranchSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  variant?: "default" | "minimal"; // إضافة الـ variant
}

export const BranchSelect = ({
  value,
  onChange,
  label = "الفرع العمل",
  variant = "default",
}: BranchSelectProps) => {
  const { data: branches, isLoading } = useBranches();

  // إذا كان الوضع "minimal" (للتوب بار)
  if (variant === "minimal") {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] h-9 bg-muted/50 border-none rounded-lg focus:ring-1 focus:ring-primary/20 text-xs">
          <Building2 className="w-3.5 h-3.5 ml-2 text-primary" />
          <SelectValue placeholder={isLoading ? "..." : "اختر الفرع"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الفروع</SelectItem>
          {branches?.map((branch) => (
            <SelectItem key={branch.id} value={branch.id.toString()}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // الوضع الافتراضي للفورم (كما هو مع تحسين بسيط)
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Building2 className="w-4 h-4 text-primary" />
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20">
          <SelectValue placeholder={isLoading ? "جاري التحميل..." : "اختر الفرع"} />
        </SelectTrigger>
        <SelectContent>
          {branches?.map((branch) => (
            <SelectItem key={branch.id} value={branch.id.toString()}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
