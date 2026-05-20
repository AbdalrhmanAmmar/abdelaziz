import { PieChart } from "lucide-react";

interface StatusItem {
  label: string;
  count: number;
  color: string;
}

interface Props {
  data: StatusItem[];
  isLoading?: boolean;
}

const BranchComparison = ({ data, isLoading }: Props) => {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div
      className="bg-card rounded-xl p-6 shadow-sm border h-full opacity-0 animate-fade-up"
      style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
    >
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">Order Status</h3>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Total ring visual */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444"];
                  return data.map((item, i) => {
                    const pct = total > 0 ? (item.count / total) * 100 : 0;
                    const strokeDash = `${pct} ${100 - pct}`;
                    const el = (
                      <circle
                        key={item.label}
                        cx="50" cy="50" r="15.9"
                        fill="none"
                        stroke={colors[i]}
                        strokeWidth="8"
                        strokeDasharray={strokeDash}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                      />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{total}</span>
                <span className="text-[10px] text-muted-foreground">Total</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {data.map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
                      <span className="text-foreground font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{item.count}</span>
                      <span className="text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default BranchComparison;
