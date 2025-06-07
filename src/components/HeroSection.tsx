
import { AnimatedButton } from "@/components/ui/animated-button";
import { GradientCard } from "@/components/ui/gradient-card";
import { ArrowLeft, PlayCircle } from "lucide-react";

interface HeroSectionProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const HeroSection = ({ onLogin, onRegister }: HeroSectionProps) => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              استعد لامتحان
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 animate-gradient">
                مكلف بالزبائن
              </span>
              <br />
              في بريد الجزائر
            </h1>
          </div>

          {/* Description */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              منصة تفاعلية متطورة للتحضير للامتحان الرسمي لمنصب مكلف بالزبائن في مؤسسة بريد الجزائر.
              <br className="hidden md:block" />
              <span className="block mt-2 text-lg md:text-xl">
                امتحانات تجريبية شاملة مع أسئلة محدثة وتصحيح فوري.
              </span>
            </p>
          </div>

          {/* Action Buttons */}
<div className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center w-full max-w-md mx-auto mb-12">
  <div className="w-full">
    <AnimatedButton 
      size="lg" 
      onClick={onRegister}
      icon={PlayCircle}
      iconPosition="right"
      className="w-full text-sm sm:text-lg px-4 py-3 sm:px-8 sm:py-5 rounded-xl shadow-2xl"
    >
      ابدأ التحضير الآن
    </AnimatedButton>
  </div>

  <div className="w-full">
    <AnimatedButton 
      variant="outline" 
      size="lg"
      onClick={onLogin}
      icon={ArrowLeft}
      iconPosition="right"
      className="w-full text-sm sm:text-lg px-4 py-3 sm:px-8 sm:py-5 rounded-xl border-2 text-center leading-snug break-words"
    >
      لديك حساب؟ سجل دخولك
    </AnimatedButton>
  </div>
</div>



          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <GradientCard variant="primary" className="p-6 text-center">
              <div className="text-4xl font-bold mb-2">10</div>
              <div className="text-lg opacity-90">امتحانات تجريبية</div>
            </GradientCard>
            
            <GradientCard variant="secondary" className="p-6 text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">سؤال متنوع</div>
            </GradientCard>
            
            <GradientCard variant="accent" className="p-6 text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">معدل النجاح</div>
            </GradientCard>
          </div>
        </div>
      </div>
    </section>
  );
};
