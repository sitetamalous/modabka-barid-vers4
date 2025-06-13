import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

interface SplashScreenEnhancedProps {
  onComplete: () => void;
  duration?: number;
}

const LOADING_STEPS = [
  { text: 'تحميل التطبيق...', progress: 20 },
  { text: 'إعداد البيانات...', progress: 40 },
  { text: 'تحضير الواجهة...', progress: 60 },
  { text: 'التحقق من الاتصال...', progress: 80 },
  { text: 'اكتمل التحميل!', progress: 100 }
];

export const SplashScreenEnhanced = ({ 
  onComplete, 
  duration = 3000 
}: SplashScreenEnhancedProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const stepDuration = duration / LOADING_STEPS.length;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next < LOADING_STEPS.length) {
          setProgress(LOADING_STEPS[next].progress);
          return next;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
          }, 500);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col items-center justify-center"
          dir="rtl"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-8 max-w-md mx-auto">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1
              }}
              className="relative mb-8"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(16, 185, 129, 0.4)",
                    "0 0 0 20px rgba(16, 185, 129, 0)",
                    "0 0 0 0 rgba(16, 185, 129, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <GraduationCap className="w-16 h-16 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* App Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                منصة امتحانات
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                  بريد الجزائر
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                التحضير الشامل لامتحان مكلف بالزبائن
              </p>
            </motion.div>

            {/* Loading Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="space-y-6"
            >
              {/* Loading Text */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-lg font-medium text-gray-700"
              >
                {LOADING_STEPS[currentStep]?.text}
              </motion.div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full shadow-lg"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0%</span>
                  <motion.span
                    key={progress}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="font-medium"
                  >
                    {progress}%
                  </motion.span>
                  <span>100%</span>
                </div>
              </div>

              {/* Features Preview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="grid grid-cols-3 gap-4 mt-8"
              >
                {[
                  { emoji: '📚', label: 'امتحانات شاملة' },
                  { emoji: '📊', label: 'تتبع التقدم' },
                  { emoji: '🏆', label: 'نتائج فورية' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + index * 0.2, duration: 0.6 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <span className="text-2xl">{feature.emoji}</span>
                    </div>
                    <span className="text-xs text-gray-600">{feature.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          >
            <p className="text-sm text-gray-500">
              © 2024 منصة التحضير لامتحان بريد الجزائر
            </p>
            <p className="text-xs text-gray-400 mt-1">
              الإصدار 2.0.0
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};