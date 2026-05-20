import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label: string;
}

export function DatePicker({ date, setDate, label }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[150px] justify-start text-right font-medium border-none ring-1 ring-border bg-background/50 h-10 shadow-sm hover:bg-background",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4 text-primary" />
          {date ? format(date, "yyyy/MM/dd", { locale: ar }) : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-2xl" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={ar}
          className="bg-background rounded-md border shadow-md"
        />
      </PopoverContent>
    </Popover>
  );
}
