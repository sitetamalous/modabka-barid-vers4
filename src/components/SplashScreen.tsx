import { useEffect, useState } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('جاري تحميل المنصة...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'تحميل البيانات الأساسية...' },
      { progress: 40, text: 'إعداد واجهة المستخدم...' },
      { progress: 60, text: 'تحميل الامتحانات...' },
      { progress: 80, text: 'التحقق من الاتصال...' },
      { progress: 100, text: 'اكتمل التحميل!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col items-center justify-center" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-md mx-auto">
        {/* Logo Container */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-bounce-in">
            <GraduationCap className="w-16 h-16 text-white" />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-ping" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* App Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 animate-fade-in">
            منصة امتحانات
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
              بريد الجزائر
            </span>
          </h1>
          <p className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            التحضير الشامل لامتحان مكلف بالزبائن
          </p>
        </div>

        {/* Loading Section */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {/* Loading Text */}
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-lg font-medium text-gray-700">{loadingText}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>0%</span>
              <span className="font-medium">{progress}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-3 gap-4 mt-8 opacity-60">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-xs text-gray-600">امتحانات شاملة</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-xs text-gray-600">تتبع التقدم</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🏆</span>
              </div>
              <span className="text-xs text-gray-600">نتائج فورية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center opacity-60">
        <p className="text-sm text-gray-500">
          © 2024 منصة التحضير لامتحان بريد الجزائر
        </p>
        <p className="text-xs text-gray-400 mt-1">
          الإصدار 1.0.0
        </p>
      </div>
    </div>
  );
};