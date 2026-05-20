import { AlertTriangle, Package } from "lucide-react";
import type { IProduct } from "@/shared";

interface Props {
  products: IProduct[];
  isLoading?: boolean;
}

const TopProducts = ({ products, isLoading }: Props) => {
  return (
    <div
      className="bg-card rounded-xl p-5 shadow-sm border opacity-0 animate-fade-up"
      style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Low Stock Alert</h3>
      </div>

      {isLoading ? (
        <div className="h-24 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground gap-2">
          <Package className="w-8 h-8 opacity-20" />
          <p className="text-xs">All stock levels are healthy</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {products.map((product) => {
            const pct = Math.min(100, (product.quantity / 10) * 100);
            const isCritical = product.quantity <= 3;
            return (
              <div key={product.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium truncate flex-1 mr-2">
                    {product.name}
                  </span>
                  <span className={`font-bold flex-shrink-0 ${isCritical ? "text-destructive" : "text-amber-600"}`}>
                    {product.quantity} left
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isCritical ? "bg-destructive" : "bg-amber-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopProducts;
