
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
    primary: "bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl border-0",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl border-0",
    outline: "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl",
    ghost: "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg"
  };

  const sizes = {
    sm: "px-4 py-3 text-sm min-h-[44px]",
    md: "px-6 py-4 text-sm md:text-base min-h-[50px]",
    lg: "px-6 py-4 text-sm md:text-lg min-h-[56px]"
  };

return (
  <Button
    onClick={onClick}
    disabled={disabled}
    type={type}
    className={cn(
      "transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-2xl font-bold",
      "flex items-center justify-center gap-2 leading-tight text-center",
      "focus:ring-4 focus:ring-emerald-200 focus:outline-none",
      "text-center break-words whitespace-normal", // التفاف الكلمات
      "w-full sm:w-auto", // جعل الزر يأخذ العرض كاملاً في الهاتف، ويفتح على حسب المحتوى في الشاشات الأكبر
      variants[variant],
      sizes[size],
      className
    )}
  >
    {/* لا حاجة لdiv داخلي */}
    {Icon && iconPosition === "left" && (
      <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
    )}

    <span className="font-bold leading-tight text-center break-words whitespace-normal block">
      {children}
    </span>

    {Icon && iconPosition === "right" && (
      <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
    )}
  </Button>
);

};
