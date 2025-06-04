
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Star, TrendingUp, BookOpen } from "lucide-react";

interface StatsOverviewProps {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  totalQuestions: number;
}

export const StatsOverview = ({ 
  totalExams, 
  completedExams, 
  averageScore, 
  totalQuestions 
}: StatsOverviewProps) => {
  const completionRate = totalExams > 0 ? (completedExams / totalExams) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="الامتحانات المكتملة"
        value={`${completedExams}/${totalExams}`}
        description={`${completionRate.toFixed(0)}% من إجمالي الامتحانات`}
        icon={CheckCircle}
        variant="success"
      />
      
      <StatCard
        title="المعدل العام"
        value={`${averageScore.toFixed(1)}%`}
        description="متوسط النتائج المحققة"
        icon={Star}
        variant="warning"
      />
      
      <StatCard
        title="التقدم العام"
        value={`${completionRate.toFixed(0)}%`}
        description="مستوى الإنجاز الكلي"
        icon={TrendingUp}
        variant="info"
      />
      
      <StatCard
        title="إجمالي الأسئلة"
        value={totalQuestions}
        description="عدد الأسئلة المتاحة"
        icon={BookOpen}
        variant="default"
      />
    </div>
  );
};
