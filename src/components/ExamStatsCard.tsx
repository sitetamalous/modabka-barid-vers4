
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useExamStats } from "@/hooks/useExamStats";
import { Loader2, Target, Trophy, TrendingUp, BookOpen } from "lucide-react";

export const ExamStatsCard = () => {
  const { data: stats, isLoading, error } = useExamStats();

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
            <span className="text-gray-600">جاري تحميل الإحصائيات...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="shadow-lg border-0 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600 text-center">خطأ في تحميل الإحصائيات</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-emerald-600" />
          إحصائياتك
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">الامتحانات المكتملة</span>
            </div>
            <span className="text-2xl font-bold text-emerald-600">
              {stats.completedExams}/{stats.totalExams}
            </span>
          </div>
          <Progress value={stats.completionRate} className="h-3 mb-2" />
          <p className="text-sm text-gray-600 text-center">
            {stats.completionRate}% من الامتحانات المتاحة
          </p>
        </div>

        {/* Average Score */}
        {stats.completedExams > 0 && (
          <div className="bg-white rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-gray-700">متوسط النتائج</span>
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                {stats.averageScore}%
              </span>
            </div>
            <Progress value={stats.averageScore} className="h-2" />
          </div>
        )}

        {/* Performance Message */}
        <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">
              {stats.completedExams === 0 && "ابدأ رحلتك التعليمية!"}
              {stats.completedExams > 0 && stats.averageScore >= 85 && "أداء ممتاز! 🏆"}
              {stats.completedExams > 0 && stats.averageScore >= 70 && stats.averageScore < 85 && "أداء جيد جداً! 🌟"}
              {stats.completedExams > 0 && stats.averageScore >= 60 && stats.averageScore < 70 && "أداء جيد، استمر! 📈"}
              {stats.completedExams > 0 && stats.averageScore < 60 && "يمكنك التحسن أكثر! 💪"}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {stats.completedExams === 0 
              ? "لم تكمل أي امتحان بعد. ابدأ الآن!" 
              : `أكملت ${stats.completedExams} امتحان${stats.completedExams > 1 ? 'ات' : ''} من أصل ${stats.totalExams}`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
