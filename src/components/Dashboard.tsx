
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { StatsOverview } from "@/components/StatsOverview";
import { ExamCard } from "@/components/ExamCard";
import { StudyTips } from "@/components/StudyTips";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { MobileHeader } from "@/components/ui/mobile-header";
import { MobileCard } from "@/components/ui/mobile-card";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { 
  GraduationCap, 
  LogOut, 
  BookOpen,
  Loader2,
  Home,
  BarChart3,
  BookMarked,
  User,
  Plus
} from "lucide-react";
import ExamModal from "@/components/ExamModal";
import { useExams } from "@/hooks/useExams";
import { useUserAttempts } from "@/hooks/useUserAttempts";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'exams' | 'profile'>('home');
  
  const { data: exams, isLoading: examsLoading } = useExams();
  const { data: userAttempts, isLoading: attemptsLoading } = useUserAttempts();

  // Calculate statistics
  const completedAttempts = userAttempts?.filter(attempt => attempt.is_completed) || [];
  const averageScore = completedAttempts.length > 0 
    ? completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length 
    : 0;

  const totalQuestions = exams?.reduce((sum, exam) => sum + exam.total_questions, 0) || 0;

  const getExamStatus = (examId: string) => {
    return userAttempts?.find(attempt => 
      attempt.exam_id === examId && attempt.is_completed
    );
  };

  const bottomNavItems = [
    {
      icon: Home,
      label: 'الرئيسية',
      active: activeTab === 'home',
      onClick: () => setActiveTab('home')
    },
    {
      icon: BarChart3,
      label: 'الإحصائيات',
      active: activeTab === 'stats',
      onClick: () => setActiveTab('stats')
    },
    {
      icon: BookMarked,
      label: 'الامتحانات',
      active: activeTab === 'exams',
      onClick: () => setActiveTab('exams')
    },
    {
      icon: User,
      label: 'الملف الشخصي',
      active: activeTab === 'profile',
      onClick: () => setActiveTab('profile')
    },
    {
      icon: LogOut,
      label: 'خروج',
      onClick: onLogout
    }
  ];

  if (examsLoading || attemptsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center animate-pulse-scale">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-lg text-gray-700 font-medium">جاري تحميل البيانات...</span>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Section - Mobile Optimized */}
            <MobileCard className="mx-4 md:mx-0">
              <GradientCard className="p-6 text-center">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    استعد لامتحان مكلف بالزبائن
                  </h2>
                  <p className="text-base md:text-lg opacity-90 leading-relaxed">
                    منصة شاملة للتحضير للامتحان الرسمي مع امتحانات تجريبية وأسئلة محدثة
                  </p>
                </div>
              </GradientCard>
            </MobileCard>

            {/* Quick Stats - Mobile Grid */}
            <div className="px-4 md:px-0">
              <StatsOverview
                totalExams={exams?.length || 0}
                completedExams={completedAttempts.length}
                averageScore={averageScore}
                totalQuestions={totalQuestions}
              />
            </div>

            {/* Recent Exams - Mobile Optimized */}
            <div className="px-4 md:px-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">الامتحانات الأخيرة</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('exams')}
                  className="text-emerald-600"
                >
                  عرض الكل
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exams?.slice(0, 4).map((exam) => {
                  const examStatus = getExamStatus(exam.id);
                  return (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      examStatus={examStatus}
                      onStartExam={setSelectedExam}
                    />
                  );
                })}
              </div>
            </div>

            {/* Study Tips - Mobile Optimized */}
            <div className="px-4 md:px-0">
              <StudyTips />
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6 px-4 md:px-0">
            <StatsOverview
              totalExams={exams?.length || 0}
              completedExams={completedAttempts.length}
              averageScore={averageScore}
              totalQuestions={totalQuestions}
            />
            {/* Add more detailed statistics here */}
          </div>
        );

      case 'exams':
        return (
          <div className="px-4 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {exams?.map((exam) => {
                const examStatus = getExamStatus(exam.id);
                return (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    examStatus={examStatus}
                    onStartExam={setSelectedExam}
                  />
                );
              })}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 px-4 md:px-0">
            <MobileCard>
              <div className="text-center p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ملفك الشخصي</h3>
                <p className="text-gray-600">مرحباً بك في منصة التحضير لامتحان بريد الجزائر</p>
              </div>
            </MobileCard>
            
            <MobileCard>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الامتحانات المكتملة</span>
                  <span className="font-semibold text-emerald-600">{completedAttempts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">المعدل العام</span>
                  <span className="font-semibold text-blue-600">{averageScore.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">إجمالي الأسئلة المتاحة</span>
                  <span className="font-semibold text-purple-600">{totalQuestions}</span>
                </div>
              </div>
            </MobileCard>

            <MobileCard>
              <div className="p-6">
                <AnimatedButton
                  variant="outline"
                  onClick={onLogout}
                  icon={LogOut}
                  iconPosition="right"
                  className="w-full justify-center"
                >
                  تسجيل الخروج
                </AnimatedButton>
              </div>
            </MobileCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir="rtl">
      {/* Mobile Header */}
      <MobileHeader
        title="لوحة التحكم"
        subtitle="منصة التحضير لامتحان بريد الجزائر"
        rightAction={
          <div className="hidden md:flex">
            <AnimatedButton 
              variant="outline" 
              onClick={onLogout}
              icon={LogOut}
              iconPosition="right"
              size="sm"
            >
              تسجيل الخروج
            </AnimatedButton>
          </div>
        }
      />

      {/* Desktop Header */}
      <header className="hidden md:block bg-white/90 backdrop-blur-lg border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-gray-600">مرحباً بك في منصة التحضير لامتحان بريد الجزائر</p>
              </div>
            </div>
            <AnimatedButton 
              variant="outline" 
              onClick={onLogout}
              icon={LogOut}
              iconPosition="right"
            >
              تسجيل الخروج
            </AnimatedButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        <div className="container mx-auto py-6">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation items={bottomNavItems} />

      {/* Floating Action Button - Mobile Only */}
      {activeTab === 'exams' && (
        <FloatingActionButton
          icon={Plus}
          onClick={() => {
            // Could open a quick exam selector or start the first available exam
            if (exams && exams.length > 0) {
              setSelectedExam(exams[0].id);
            }
          }}
          label="بدء امتحان سريع"
          position="bottom-right"
        />
      )}

      {/* Exam Modal */}
      {selectedExam && (
        <ExamModal
          examId={selectedExam}
          isOpen={true}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
