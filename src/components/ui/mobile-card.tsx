
import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  pressed?: boolean;
  onClick?: () => void;
}

export const MobileCard = ({
  children,
  className,
  padding = "md",
  hover = true,
  pressed = false,
  onClick
}: MobileCardProps) => {
  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 border-0 shadow-sm bg-white",
        hover && "hover:shadow-md hover:-translate-y-0.5",
        pressed && "scale-95",
        onClick && "cursor-pointer tap-highlight-transparent active:scale-95",
        className
      )}
      onClick={onClick}
    >
      <CardContent className={paddingClasses[padding]}>
        {children}
      </CardContent>
    </Card>
  );
};

interface MobileCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const MobileCardHeader = ({
  title,
  subtitle,
  icon,
  action,
  className
}: MobileCardHeaderProps) => {
  return (
    <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-3", className)}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </CardHeader>
  );
};
