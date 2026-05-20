import { Button } from "@/components/ui/button";
import { AlertCircle, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyDataStateProps {
  title: string;
  description: string;
  buttonText: string;
  linkTo: string;
}

export const EmptyDataState = ({ title, description, buttonText, linkTo }: EmptyDataStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 animate-in fade-in zoom-in-95">
      <div className="flex flex-col items-center text-center gap-3">
        {/* أيقونة جذابة */}
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-primary" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-[250px]">{description}</p>
        </div>

        <Button
          onClick={() => navigate(linkTo)}
          className="mt-2 h-11 px-6 rounded-xl gradient-coral gap-2 shadow-md hover:opacity-90 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
