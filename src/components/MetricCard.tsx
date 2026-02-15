import { ReactNode } from "react";
import AnimatedCounter from "./AnimatedCounter";

interface MetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  suffix?: string;
  prefix?: string;
  trend?: { value: number; positive: boolean };
  delay?: number;
  accentColor?: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  suffix = "",
  prefix = "",
  trend,
  delay = 0,
  accentColor = "hsl(42, 100%, 50%)",
}: MetricCardProps) => {
  return (
    <div
      className="metric-card group hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ background: accentColor }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            {title}
          </span>
          <div className="p-2 rounded-lg bg-muted text-[hsl(210,100%,20%)] group-hover:bg-[hsl(210,100%,20%)] group-hover:text-white transition-colors">
            {icon}
          </div>
        </div>

        <div className="mb-2">
          <span className="text-3xl font-bold text-foreground">
            <AnimatedCounter
              end={value}
              prefix={prefix}
              suffix={suffix}
              duration={2000 + delay}
            />
          </span>
        </div>

        {trend && (
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-medium ${trend.positive ? "text-green-600" : "text-red-500"}`}>
              {trend.positive ? "+" : ""}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
