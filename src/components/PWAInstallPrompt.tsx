import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { Download, X, Smartphone, Wifi, WifiOff } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const { isInstallable, isOnline, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isInstallable || !isVisible) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await installApp();
    if (success) {
      setIsVisible(false);
    }
    setIsInstalling(false);
  };

  return (
    <>
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>لا يوجد اتصال بالإنترنت - تعمل في وضع عدم الاتصال</span>
          </div>
        </div>
      )}

      {/* Install Prompt */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:max-w-sm">
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1">تثبيت التطبيق</h3>
                <p className="text-sm opacity-90 mb-3">
                  أضف المنصة إلى شاشتك الرئيسية للوصول السريع والاستخدام دون اتصال
                </p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="bg-white text-emerald-600 hover:bg-gray-100 text-sm px-4 py-2 h-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isInstalling ? 'جاري التثبيت...' : 'تثبيت'}
                  </Button>
                  
                  <Button
                    onClick={() => setIsVisible(false)}
                    variant="ghost"
                    className="text-white hover:bg-white/20 text-sm px-3 py-2 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};