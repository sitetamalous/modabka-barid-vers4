
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
      "fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-emerald-100/50 safe-area-pb z-50 md:hidden",
      "shadow-lg shadow-black/5",
      className
    )}>
      <div className="grid grid-cols-5 h-20 px-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative rounded-2xl mx-1 my-2",
                "active:scale-95 tap-highlight-transparent",
                item.active 
                  ? "bg-gradient-to-t from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/30" 
                  : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "transition-all duration-200",
                  item.active ? "w-6 h-6" : "w-5 h-5"
                )} />
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium truncate max-w-full px-1 transition-all duration-200",
                item.active ? "text-white font-semibold" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
