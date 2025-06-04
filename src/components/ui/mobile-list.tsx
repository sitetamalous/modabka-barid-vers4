
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface MobileListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  rightContent?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "navigation" | "action";
}

export const MobileListItem = ({
  title,
  subtitle,
  description,
  icon,
  rightIcon,
  rightContent,
  onClick,
  className,
  disabled = false,
  variant = "default"
}: MobileListItemProps) => {
  const showChevron = variant === "navigation" && !rightIcon && !rightContent;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 bg-white transition-all duration-200",
        "border-b border-gray-100 last:border-b-0",
        onClick && !disabled && "cursor-pointer tap-highlight-transparent active:bg-gray-50",
        disabled && "opacity-60",
        className
      )}
      onClick={onClick && !disabled ? onClick : undefined}
    >
      {/* Icon */}
      {icon && (
        <div className="flex-shrink-0">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "font-medium text-gray-900 truncate",
            variant === "action" && "text-emerald-600"
          )}>
            {title}
          </h3>
          {rightContent && (
            <div className="flex-shrink-0 ml-3">
              {rightContent}
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="text-sm text-gray-600 truncate mt-0.5">
            {subtitle}
          </p>
        )}
        
        {description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Right Icon */}
      {(rightIcon || showChevron) && (
        <div className="flex-shrink-0 ml-3">
          {rightIcon || (showChevron && <ChevronLeft className="w-5 h-5 text-gray-400" />)}
        </div>
      )}
    </div>
  );
};

interface MobileListProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const MobileList = ({
  children,
  className,
  title,
  description
}: MobileListProps) => {
  return (
    <div className={cn("bg-white rounded-lg overflow-hidden shadow-sm", className)}>
      {(title || description) && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          {title && (
            <h3 className="font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};
