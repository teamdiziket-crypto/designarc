import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const variantStyles = {
  default: 'from-muted/50 to-muted/30',
  primary: 'from-primary/20 to-primary/5',
  success: 'from-success/20 to-success/5',
  warning: 'from-warning/20 to-warning/5',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  return (
    <div className="stat-card group">
      <div className={`absolute inset-0 bg-gradient-to-br ${variantStyles[variant]} opacity-50 rounded-2xl`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconStyles[variant]} transition-transform group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                trend.isPositive
                  ? 'bg-success/15 text-success'
                  : 'bg-destructive/15 text-destructive'
              }`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>

        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </h3>
        <p className="text-3xl font-bold text-foreground tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
