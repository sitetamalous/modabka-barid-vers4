
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu } from "lucide-react";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  onBack?: () => void;
  onMenu?: () => void;
  className?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
}

export const MobileHeader = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  onBack,
  onMenu,
  className,
  showBackButton = false,
  showMenuButton = false
}: MobileHeaderProps) => {
  return (
    <header className={cn(
      "sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-emerald-100/50 safe-area-pt",
      "shadow-sm shadow-emerald-50/50",
      className
    )}>
      <div className="flex items-center justify-between px-4 py-4 min-h-[64px]">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="w-10 h-10 rounded-xl hover:bg-emerald-50 transition-all duration-200"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
          
          {showMenuButton && onMenu && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenu}
              className="w-10 h-10 rounded-xl hover:bg-emerald-50 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          {leftAction}
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {rightAction}
        </div>
      </div>
    </header>
  );
};
