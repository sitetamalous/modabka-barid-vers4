
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { MobileHeader } from "@/components/ui/mobile-header";
import { MobileCard } from "@/components/ui/mobile-card";
import { GraduationCap, Users, BookOpen, Award, ArrowLeft, LogIn, UserPlus, Menu } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/components/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-scale">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg text-gray-600 animate-pulse">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir="rtl">
      {/* Mobile Header */}
      <MobileHeader
        title="منصة امتحانات بريد الجزائر"
        subtitle="التحضير للامتحان الرسمي"
        rightAction={
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleAuth('login')}
              className="text-emerald-600"
            >
              دخول
            </Button>
            <Button 
              size="sm"
              onClick={() => handleAuth('register')}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
            >
              تسجيل
            </Button>
          </div>
        }
        className="md:hidden"
      />

      {/* Desktop Header */}
      <header className="hidden md:block bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">منصة امتحانات بريد الجزائر</h1>
                <p className="text-sm text-gray-600">التحضير للامتحان الرسمي</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleAuth('login')}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Button>
              <Button 
                onClick={() => handleAuth('register')}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                إنشاء حساب
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              استعد لامتحان
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600 animate-gradient">
                مكلف بالزبائن
              </span>
              في بريد الجزائر
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed px-4">
              منصة تفاعلية متطورة للتحضير للامتحان الرسمي لمنصب مكلف بالزبائن في مؤسسة بريد الجزائر.
              <br className="hidden md:block" />
              امتحانات تجريبية شاملة مع أسئلة محدثة وتصحيح فوري.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <AnimatedButton 
                size="lg" 
                onClick={() => handleAuth('register')}
                icon={ArrowLeft}
                iconPosition="right"
                className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                ابدأ التحضير الآن
              </AnimatedButton>
              <AnimatedButton 
                variant="outline" 
                size="lg"
                onClick={() => handleAuth('login')}
                className="text-lg px-8 py-6 rounded-xl border-2 w-full sm:w-auto"
              >
                لديك حساب؟ سجل دخولك
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Cards */}
      <section className="py-12 md:py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">لماذا تختار منصتنا؟</h2>
            <p className="text-lg md:text-xl text-gray-600">مميزات فريدة تضمن نجاحك في الامتحان</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MobileCard hover className="group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">10 امتحانات تجريبية</h3>
                <p className="text-gray-600 leading-relaxed">
                  امتحانات شاملة تغطي جميع المواضيع المطلوبة مع 50 سؤال لكل امتحان
                </p>
              </div>
            </MobileCard>

            <MobileCard hover className="group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">تصحيح فوري ومفصل</h3>
                <p className="text-gray-600 leading-relaxed">
                  احصل على النتائج فوراً مع شرح مفصل للإجابات الصحيحة والخاطئة
                </p>
              </div>
            </MobileCard>

            <MobileCard hover className="group md:col-span-2 lg:col-span-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">محتوى محدث</h3>
                <p className="text-gray-600 leading-relaxed">
                  أسئلة محدثة باستمرار تعكس آخر التطورات في خدمات بريد الجزائر
                </p>
              </div>
            </MobileCard>
          </div>
        </div>
      </section>

      {/* Statistics - Mobile Grid */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <GradientCard variant="primary" className="p-6 group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">+500</div>
              <div className="text-lg md:text-xl opacity-90">سؤال متنوع</div>
            </GradientCard>
            <GradientCard variant="secondary" className="p-6 group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">+1000</div>
              <div className="text-lg md:text-xl opacity-90">مرشح ناجح</div>
            </GradientCard>
            <GradientCard variant="accent" className="p-6 group sm:col-span-3 lg:col-span-1">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">95%</div>
              <div className="text-lg md:text-xl opacity-90">معدل النجاح</div>
            </GradientCard>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <MobileCard className="max-w-3xl mx-auto">
            <div className="p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                هل أنت مستعد لبدء رحلة النجاح؟
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                انضم إلى آلاف المرشحين الذين حققوا النجاح معنا
              </p>
              <AnimatedButton 
                size="lg"
                onClick={() => handleAuth('register')}
                icon={ArrowLeft}
                iconPosition="right"
                className="text-xl px-12 py-6 rounded-xl shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                ابدأ الآن مجاناً
              </AnimatedButton>
            </div>
          </MobileCard>
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-gray-900 text-white py-8 md:py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold">منصة امتحانات بريد الجزائر</span>
          </div>
          <p className="text-gray-400 text-base md:text-lg">
            © 2024 جميع الحقوق محفوظة - منصة التحضير لامتحانات بريد الجزائر
          </p>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSuccess={handleAuthSuccess}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Index;
