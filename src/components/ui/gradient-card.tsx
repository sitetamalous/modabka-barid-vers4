
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
}

export const GradientCard = ({ children, className, variant = "primary" }: GradientCardProps) => {
  const variants = {
    primary: "bg-gradient-to-br from-emerald-500 to-blue-600",
    secondary: "bg-gradient-to-br from-purple-500 to-pink-600",
    accent: "bg-gradient-to-br from-orange-500 to-red-600"
  };

  return (
    <div className={cn(
      "rounded-2xl shadow-xl border-0 text-white overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};
