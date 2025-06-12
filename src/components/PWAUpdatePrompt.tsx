import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const PWAUpdatePrompt = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // Listen for update available
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
          setIsVisible(true);
        }
      });

      // Check for waiting service worker
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          setUpdateAvailable(true);
          setIsVisible(true);
        }
      });
    }
  }, []);

  const handleUpdate = async () => {
    if (!updateAvailable) return;

    setIsUpdating(true);
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        toast.success('تم تحديث التطبيق بنجاح!', {
          description: 'سيتم إعادة تحميل الصفحة الآن',
        });
      }
    } catch (error) {
      console.error('Error updating app:', error);
      toast.error('فشل في تحديث التطبيق');
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setUpdateAvailable(false);
  };

  return (
    <AnimatePresence>
      {isVisible && updateAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm safe-area-pb"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1">تحديث متاح</h3>
                  <p className="text-sm opacity-90 mb-3 leading-relaxed">
                    إصدار جديد من التطبيق متاح. قم بالتحديث للحصول على أحدث الميزات والتحسينات
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="bg-white text-blue-600 hover:bg-gray-100 text-sm px-4 py-2 h-auto font-semibold"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                      {isUpdating ? 'جاري التحديث...' : 'تحديث الآن'}
                    </Button>
                    
                    <Button
                      onClick={handleDismiss}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};