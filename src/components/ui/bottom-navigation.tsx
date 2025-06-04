
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BottomNavItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

interface BottomNavigationProps {
  items: BottomNavItem[];
  className?: string;
}

export const BottomNavigation = ({ items, className }: BottomNavigationProps) => {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 safe-area-pb z-50 md:hidden",
      "shadow-lg shadow-black/5",
      className
    )}>
      <div className="grid grid-cols-5 h-16">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200 relative",
                "active:scale-95 tap-highlight-transparent",
                item.active 
                  ? "text-emerald-600" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium truncate max-w-full px-1",
                item.active ? "text-emerald-600" : "text-gray-500"
              )}>
                {item.label}
              </span>
              {item.active && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
