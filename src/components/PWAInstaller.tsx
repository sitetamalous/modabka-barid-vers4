import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download, Smartphone, Wifi, WifiOff, Share } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstaller = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isVisible, setIsVisible] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
      setIsInstalled(isInstalled);
      if (isInstalled) {
        setIsVisible(false);
      }
    };

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(installEvent);
      setIsInstallable(true);
      
      // Show prompt after a delay to avoid being intrusive
      setTimeout(() => {
        if (!isInstalled) {
          setIsVisible(true);
        }
      }, 3000);
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
      setIsVisible(false);
      setInstallPrompt(null);
      
      toast.success('تم تثبيت التطبيق بنجاح!', {
        description: 'يمكنك الآن الوصول إلى المنصة من الشاشة الرئيسية',
        duration: 5000,
      });
    };

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial checks
    checkInstalled();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!installPrompt) return;

    setIsInstalling(true);
    
    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsVisible(false);
      } else {
        console.log('User dismissed the install prompt');
        toast.info('يمكنك تثبيت التطبيق لاحقاً من قائمة المتصفح');
      }
      
      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
      toast.error('حدث خطأ أثناء التثبيت');
    } finally {
      setIsInstalling(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'منصة امتحانات بريد الجزائر',
          text: 'منصة شاملة للتحضير لامتحان مكلف بالزبائن في بريد الجزائر',
          url: window.location.origin,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success('تم نسخ الرابط إلى الحافظة');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  // Don't show if not installable or already installed
  if (!isInstallable || !isVisible || isInstalled) {
    return (
      <>
        {/* Offline Indicator */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm safe-area-pt">
            <div className="flex items-center justify-center gap-2">
              <WifiOff className="w-4 h-4" />
              <span>لا يوجد اتصال بالإنترنت - تعمل في وضع عدم الاتصال</span>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm safe-area-pt">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>لا يوجد اتصال بالإنترنت - تعمل في وضع عدم الاتصال</span>
          </div>
        </div>
      )}

      {/* Install Prompt */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:max-w-sm safe-area-pb">
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1">تثبيت التطبيق</h3>
                <p className="text-sm opacity-90 mb-3 leading-relaxed">
                  أضف المنصة إلى شاشتك الرئيسية للوصول السريع والاستخدام دون اتصال
                </p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="bg-white text-emerald-600 hover:bg-gray-100 text-sm px-4 py-2 h-auto font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isInstalling ? 'جاري التثبيت...' : 'تثبيت'}
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    variant="ghost"
                    className="text-white hover:bg-white/20 text-sm px-3 py-2 h-auto"
                  >
                    <Share className="w-4 h-4" />
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