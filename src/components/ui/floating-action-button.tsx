
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "accent";
  label?: string;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
}

export const FloatingActionButton = ({
  icon: Icon,
  onClick,
  className,
  size = "md",
  variant = "primary",
  label,
  position = "bottom-right"
}: FloatingActionButtonProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-14 h-14",
    lg: "w-16 h-16"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7"
  };

  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg",
    accent: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg"
  };

  const positions = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2"
  };

  return (
    <div className={cn(
      "fixed z-50 md:hidden",
      positions[position]
    )}>
      {label && (
        <div className="mb-2 text-center">
          <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-full">
            {label}
          </span>
        </div>
      )}
      <Button
        onClick={onClick}
        className={cn(
          "rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95",
          "hover:shadow-xl border-0",
          sizeClasses[size],
          variants[variant],
          className
        )}
        size="icon"
      >
        <Icon className={iconSizes[size]} />
      </Button>
    </div>
  );
};
