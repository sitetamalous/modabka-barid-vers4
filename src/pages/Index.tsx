
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { AnimatedButton } from "@/components/ui/animated-button";
import { 
  BookOpen, 
  BarChart3, 
  Trophy, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  GraduationCap
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is authenticated, redirect to dashboard (will be handled by AuthLayout)
        return;
      }
    };
    
    checkAuth();
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "امتحانات شاملة",
      description: "مجموعة واسعة من الامتحانات التجريبية التي تغطي جميع المواضيع المطلوبة"
    },
    {
      icon: BarChart3,
      title: "تتبع التقدم",
      description: "راقب أداءك وتطورك من خلال إحصائيات مفصلة ونتائج دقيقة"
    },
    {
      icon: Trophy,
      title: "تقييم فوري",
      description: "احصل على نتائجك فور انتهائك من الامتحان مع شرح مفصل للإجابات"
    },
    {
      icon: Clock,
      title: "محاكاة الامتحان الحقيقي",
      description: "اختبر نفسك في بيئة مماثلة للامتحان الرسمي مع توقيت دقيق"
    },
    {
      icon: CheckCircle,
      title: "أسئلة محدثة",
      description: "بنك أسئلة محدث باستمرار ومطابق لأحدث معايير الامتحان"
    },
    {
      icon: Users,
      title: "دعم متخصص",
      description: "فريق من المختصين جاهز لمساعدتك في رحلة التحضير للامتحان"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir="rtl">
      {/* Hero Section */}
      <HeroSection 
        onLogin={() => navigate('/auth')}
        onRegister={() => navigate('/auth')}
      />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نوفر لك جميع الأدوات والموارد اللازمة للنجاح في امتحان مكلف بالزبائن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              أرقام تتحدث عن نجاحنا
            </h2>
            <p className="text-lg text-gray-600">
              انضم إلى آلاف المتدربين الذين حققوا النجاح معنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">متدرب نشط</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">سؤال متنوع</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
              <div className="text-gray-600">معدل النجاح</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">دعم متواصل</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl p-12 text-white">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ابدأ رحلتك نحو النجاح اليوم
            </h2>
            <p className="text-xl mb-8 opacity-90">
              انضم إلينا واحصل على أفضل تحضير لامتحان مكلف بالزبائن
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                onClick={() => navigate('/auth')}
                variant="secondary"
                size="lg"
                icon={ArrowLeft}
                iconPosition="left"
                className="bg-white text-emerald-600 hover:bg-gray-50"
              >
                ابدأ الآن مجاناً
              </AnimatedButton>
              <AnimatedButton
                onClick={() => navigate('/auth')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                تعرف على المزيد
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">منصة التحضير لامتحان بريد الجزائر</h3>
          <p className="text-gray-400 mb-6">
            طريقك الأمثل للنجاح في امتحان مكلف بالزبائن
          </p>
          <div className="text-sm text-gray-500">
            © 2024 جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
