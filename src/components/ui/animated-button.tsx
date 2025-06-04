
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const AnimatedButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className,
  disabled,
  type = "button"
}: AnimatedButtonProps) => {
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600",
    ghost: "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        "transform transition-all duration-200 hover:scale-105 active:scale-95 rounded-xl font-semibold",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
        {children}
        {Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
      </div>
    </Button>
  );
};
