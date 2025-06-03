
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, Award, ArrowLeft, LogIn, UserPlus } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              استعد لامتحان
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                مكلف بالزبائن
              </span>
              في بريد الجزائر
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              منصة تفاعلية متطورة للتحضير للامتحان الرسمي لمنصب مكلف بالزبائن في مؤسسة بريد الجزائر.
              <br />
              امتحانات تجريبية شاملة مع أسئلة محدثة وتصحيح فوري.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => handleAuth('register')}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ابدأ التحضير الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => handleAuth('login')}
                className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-gray-50"
              >
                لديك حساب؟ سجل دخولك
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختار منصتنا؟</h2>
            <p className="text-xl text-gray-600">مميزات فريدة تضمن نجاحك في الامتحان</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">10 امتحانات تجريبية</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-lg leading-relaxed">
                  امتحانات شاملة تغطي جميع المواضيع المطلوبة مع 50 سؤال لكل امتحان
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">تصحيح فوري ومفصل</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-lg leading-relaxed">
                  احصل على النتائج فوراً مع شرح مفصل للإجابات الصحيحة والخاطئة
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">محتوى محدث</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-lg leading-relaxed">
                  أسئلة محدثة باستمرار تعكس آخر التطورات في خدمات بريد الجزائر
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">+500</div>
              <div className="text-xl opacity-90">سؤال متنوع</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">+1000</div>
              <div className="text-xl opacity-90">مرشح ناجح</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">95%</div>
              <div className="text-xl opacity-90">معدل النجاح</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              هل أنت مستعد لبدء رحلة النجاح؟
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              انضم إلى آلاف المرشحين الذين حققوا النجاح معنا
            </p>
            <Button 
              size="lg"
              onClick={() => handleAuth('register')}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-xl px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              ابدأ الآن مجاناً
              <ArrowLeft className="w-6 h-6 mr-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">منصة امتحانات بريد الجزائر</span>
          </div>
          <p className="text-gray-400 text-lg">
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
