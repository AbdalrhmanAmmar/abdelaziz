import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface Props {
  data: { month: string; orders: number }[];
  isLoading?: boolean;
}

const SalesChart = ({ data, isLoading }: Props) => {
  return (
    <div
      className="bg-card rounded-xl p-6 shadow-sm border opacity-0 animate-fade-up"
      style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Orders This Year</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {new Date().getFullYear()}
        </span>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(5, 100%, 69%)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(5, 100%, 69%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "10px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600, marginBottom: 4 }}
                formatter={(value: number) => [value, "Orders"]}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="hsl(5, 100%, 69%)"
                strokeWidth={2.5}
                fill="url(#colorOrders)"
                dot={false}
                activeDot={{ r: 5, fill: "hsl(5, 100%, 69%)", stroke: "white", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
