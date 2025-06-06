
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  GraduationCap, 
  Home,
  BookOpen,
  BarChart3,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DesktopNavigationProps {
  activeTab: 'home' | 'stats' | 'exams' | 'profile';
  onTabChange: (tab: 'home' | 'stats' | 'exams' | 'profile') => void;
  onLogout: () => void;
}

export const DesktopNavigation = ({ activeTab, onTabChange, onLogout }: DesktopNavigationProps) => {
  const navigationItems = [
    {
      id: 'home' as const,
      title: 'الرئيسية',
      icon: Home,
      description: 'العودة إلى الصفحة الرئيسية'
    },
    {
      id: 'exams' as const,
      title: 'الامتحانات',
      icon: BookOpen,
      description: 'جميع الامتحانات المتاحة'
    },
    {
      id: 'stats' as const,
      title: 'الإحصائيات',
      icon: BarChart3,
      description: 'تتبع أداءك ونتائجك'
    },
    {
      id: 'profile' as const,
      title: 'الملف الشخصي',
      icon: User,
      description: 'إعدادات الحساب والمعلومات'
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">منصة التحضير</h1>
              <p className="text-sm text-gray-600">امتحان مكلف بالزبائن</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-12 px-6 bg-transparent border-0 font-medium transition-all duration-200",
                        isActive 
                          ? "text-emerald-600 bg-emerald-50" 
                          : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
                      )}
                      onClick={() => onTabChange(item.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-64">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            isActive ? "bg-emerald-100" : "bg-gray-100"
                          )}>
                            <Icon className={cn(
                              "w-5 h-5",
                              isActive ? "text-emerald-600" : "text-gray-600"
                            )} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <AnimatedButton 
              variant="outline" 
              onClick={onLogout}
              icon={LogOut}
              iconPosition="right"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              تسجيل الخروج
            </AnimatedButton>
          </div>
        </div>
      </div>
    </nav>
  );
};
