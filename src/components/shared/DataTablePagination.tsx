import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const DataTablePagination = ({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-muted/10 border-t">
      <p className="text-sm text-muted-foreground">
        إجمالي النتائج: <span className="font-medium text-foreground">{totalItems}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronRight className="w-4 h-4 ml-1" /> السابق
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .map((p, i, arr) => (
              <div key={p} className="flex items-center">
                {i > 0 && arr[i - 1] !== p - 1 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
                <Button
                  variant={page === p ? "default" : "ghost"}
                  size="sm"
                  className={`w-9 h-9 p-0 ${page === p ? "gradient-coral text-white" : ""}`}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              </div>
            ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          التالي <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};
