
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "info";
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  variant = "default",
  className 
}: StatCardProps) => {
  const variants = {
    default: "border-gray-200 bg-white",
    success: "border-emerald-200 bg-emerald-50",
    warning: "border-orange-200 bg-orange-50",
    info: "border-blue-200 bg-blue-50"
  };

  const iconVariants = {
    default: "text-gray-600",
    success: "text-emerald-600",
    warning: "text-orange-600",
    info: "text-blue-600"
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
      variants[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
        <Icon className={cn("h-6 w-6", iconVariants[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
