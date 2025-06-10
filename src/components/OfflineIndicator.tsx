import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
      toast.success('تم استعادة الاتصال بالإنترنت', {
        description: 'يمكنك الآن مزامنة بياناتك',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      toast.error('انقطع الاتصال بالإنترنت', {
        description: 'ستعمل المنصة في وضع عدم الاتصال',
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show offline message if already offline
    if (!navigator.onLine) {
      setShowOfflineMessage(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      setShowOfflineMessage(false);
      window.location.reload();
    } else {
      toast.error('لا يزال الاتصال منقطعاً');
    }
  };

  if (isOnline && !showOfflineMessage) {
    return null;
  }

  return (
    <>
      {/* Top Banner for Offline Status */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm safe-area-pt">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>لا يوجد اتصال بالإنترنت - وضع عدم الاتصال</span>
          </div>
        </div>
      )}

      {/* Offline Message Card */}
      {showOfflineMessage && !isOnline && (
        <div className="fixed bottom-20 left-4 right-4 z-40 md:left-auto md:right-4 md:max-w-sm safe-area-pb">
          <Card className="border-0 shadow-xl bg-orange-500 text-white animate-slide-up">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <WifiOff className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-1">وضع عدم الاتصال</h3>
                  <p className="text-sm opacity-90 mb-3">
                    يمكنك متابعة استخدام التطبيق. سيتم مزامنة بياناتك عند استعادة الاتصال.
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRetry}
                      className="bg-white text-orange-600 hover:bg-gray-100 text-sm px-3 py-1 h-auto"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      إعادة المحاولة
                    </Button>
                    
                    <Button
                      onClick={() => setShowOfflineMessage(false)}
                      variant="ghost"
                      className="text-white hover:bg-white/20 text-sm px-3 py-1 h-auto"
                    >
                      إخفاء
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};