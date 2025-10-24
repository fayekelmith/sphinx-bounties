import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatCard({ icon: Icon, label, value, trend, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <div className="rounded-full bg-primary-100 p-2">
            <Icon className="h-4 w-4 text-primary-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-2xl font-bold">{value}</p>
          {description && <CardDescription>{description}</CardDescription>}
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <ArrowUp className="h-4 w-4 text-secondary-600" />
              ) : (
                <ArrowDown className="h-4 w-4 text-accent-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-secondary-600" : "text-accent-600"
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
