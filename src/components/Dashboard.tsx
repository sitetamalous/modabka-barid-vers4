
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { StatsOverview } from "@/components/StatsOverview";
import { ExamCard } from "@/components/ExamCard";
import { StudyTips } from "@/components/StudyTips";
import { 
  GraduationCap, 
  LogOut, 
  BookOpen,
  Loader2
} from "lucide-react";
import ExamModal from "@/components/ExamModal";
import { useExams } from "@/hooks/useExams";
import { useUserAttempts } from "@/hooks/useUserAttempts";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  
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

  if (examsLoading || attemptsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
          <span className="text-xl text-gray-700 font-medium">جاري تحميل البيانات...</span>
          <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
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
              className="hidden sm:flex"
            >
              تسجيل الخروج
            </AnimatedButton>
            <Button 
              variant="outline" 
              onClick={onLogout}
              size="icon"
              className="sm:hidden"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Welcome Section */}
        <GradientCard className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              استعد لامتحان مكلف بالزبائن
            </h2>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed">
              منصة شاملة للتحضير للامتحان الرسمي مع امتحانات تجريبية وأسئلة محدثة
            </p>
          </div>
        </GradientCard>

        {/* Statistics Overview */}
        <StatsOverview
          totalExams={exams?.length || 0}
          completedExams={completedAttempts.length}
          averageScore={averageScore}
          totalQuestions={totalQuestions}
        />

        {/* Exams Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">الامتحانات التجريبية</h2>
              <p className="text-gray-600">اختبر معرفتك واستعد للامتحان الرسمي</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
        </section>

        {/* Study Tips */}
        <StudyTips />
      </div>

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
