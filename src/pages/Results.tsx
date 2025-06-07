
import { useState } from "react";
import { useUserAttempts } from "@/hooks/useUserAttempts";
import { useExamQuestions } from "@/hooks/useExams";
import { MobileHeader } from "@/components/ui/mobile-header";
import { MobileCard } from "@/components/ui/mobile-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp,
  ArrowLeft,
  CheckCircle,
  XCircle,
  BarChart3,
  Eye,
  RotateCcw,
  Award,
  TrendingDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import ExamModal from "@/components/ExamModal";
import { DetailedAnswerReview } from "@/components/DetailedAnswerReview";

const Results = () => {
  const navigate = useNavigate();
  const { data: userAttempts, isLoading } = useUserAttempts();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'high-score'>('all');
  const [selectedExamForRetake, setSelectedExamForRetake] = useState<string | null>(null);
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  const completedAttempts = userAttempts?.filter(attempt => attempt.is_completed) || [];
  
  const filteredAttempts = completedAttempts.filter(attempt => {
    if (selectedFilter === 'completed') return attempt.is_completed;
    if (selectedFilter === 'high-score') return (attempt.score || 0) >= 70;
    return true;
  });

  const averageScore = completedAttempts.length > 0 
    ? completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length 
    : 0;

  const highestScore = completedAttempts.length > 0 
    ? Math.max(...completedAttempts.map(attempt => attempt.score || 0))
    : 0;

  const lowestScore = completedAttempts.length > 0 
    ? Math.min(...completedAttempts.map(attempt => attempt.score || 0))
    : 0;

  const totalTimeTaken = completedAttempts.reduce((sum, attempt) => sum + (attempt.time_taken || 0), 0);
  const averageTime = completedAttempts.length > 0 ? Math.floor(totalTimeTaken / completedAttempts.length / 60) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "secondary" | "destructive" | "outline" => {
    if (score >= 85) return "secondary";
    if (score >= 70) return "secondary";
    if (score >= 50) return "outline";
    return "destructive";
  };

  const getPerformanceCategory = (score: number) => {
    if (score >= 90) return { label: "ممتاز", color: "text-emerald-600", icon: Award };
    if (score >= 80) return { label: "جيد جداً", color: "text-blue-600", icon: Trophy };
    if (score >= 70) return { label: "جيد", color: "text-green-600", icon: TrendingUp };
    if (score >= 60) return { label: "مقبول", color: "text-yellow-600", icon: Target };
    return { label: "ضعيف", color: "text-red-600", icon: TrendingDown };
  };

  // Handle review exam - show detailed answers (no new attempt)
  const handleReviewExam = (attemptId: string) => {
    console.log('🔍 Review exam clicked for attempt:', attemptId);
    console.log('🔍 Current expandedAttempt:', expandedAttempt);
    
    // Close any exam modal that might be open
    setSelectedExamForRetake(null);
    
    // Toggle the expanded state for this specific attempt
    if (expandedAttempt === attemptId) {
      console.log('🔍 Closing expanded attempt details');
      setExpandedAttempt(null);
    } else {
      console.log('🔍 Opening expanded attempt details for:', attemptId);
      setExpandedAttempt(attemptId);
    }
  };

  // Handle retake exam - start new attempt
  const handleRetakeExam = (examId: string) => {
    console.log('🔄 Retake exam clicked for exam:', examId);
    console.log('🔄 Closing any expanded attempt details');
    
    // Close any expanded attempt details first
    setExpandedAttempt(null);
    // Open the exam modal for a new attempt
    setSelectedExamForRetake(examId);
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir="rtl">
        <MobileHeader 
          title="النتائج"
          subtitle="مراجعة أداءك في الامتحانات"
          showBackButton
          onBack={() => navigate('/')}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">جاري تحميل النتائج...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir="rtl">
      <MobileHeader 
        title="النتائج التفصيلية"
        subtitle="تحليل شامل لأدائك في الامتحانات"
        showBackButton
        onBack={() => navigate('/')}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Enhanced Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MobileCard>
            <div className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{highestScore}%</div>
              <div className="text-sm text-gray-600">أعلى نتيجة</div>
            </div>
          </MobileCard>

          <MobileCard>
            <div className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">المعدل العام</div>
            </div>
          </MobileCard>

          <MobileCard>
            <div className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{completedAttempts.length}</div>
              <div className="text-sm text-gray-600">امتحان مكتمل</div>
            </div>
          </MobileCard>

          <MobileCard>
            <div className="p-4 text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{averageTime}</div>
              <div className="text-sm text-gray-600">متوسط الوقت (دقيقة)</div>
            </div>
          </MobileCard>
        </div>

        {/* Performance Analysis */}
        <MobileCard>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              تحليل الأداء العام
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">التقدم العام</span>
                  <span className="font-semibold">{averageScore.toFixed(1)}%</span>
                </div>
                <Progress value={averageScore} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{lowestScore}%</div>
                  <div className="text-sm text-gray-600">أقل نتيجة</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {completedAttempts.filter(a => (a.score || 0) >= 70).length}
                  </div>
                  <div className="text-sm text-gray-600">نجاح (70%+)</div>
                </div>
              </div>

              {completedAttempts.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                  {(() => {
                    const performance = getPerformanceCategory(averageScore);
                    const Icon = performance.icon;
                    return (
                      <div className="flex items-center gap-3">
                        <Icon className={`w-8 h-8 ${performance.color}`} />
                        <div>
                          <div className={`font-bold text-lg ${performance.color}`}>
                            مستوى الأداء: {performance.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {averageScore >= 70 
                              ? "أداء ممتاز! استمر في التميز"
                              : "يمكنك تحسين أداءك مع المزيد من التدريب"
                            }
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </MobileCard>

        {/* Filters */}
        <MobileCard>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3">تصفية النتائج</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                جميع النتائج ({completedAttempts.length})
              </Button>
              <Button
                variant={selectedFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('completed')}
              >
                مكتملة ({completedAttempts.length})
              </Button>
              <Button
                variant={selectedFilter === 'high-score' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('high-score')}
              >
                نتائج عالية ({completedAttempts.filter(a => (a.score || 0) >= 70).length})
              </Button>
            </div>
          </div>
        </MobileCard>

        {/* Results List */}
        {filteredAttempts.length === 0 ? (
          <MobileCard>
            <div className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600 mb-4">لم تكمل أي امتحانات بعد</p>
              <Button onClick={() => navigate('/')} variant="outline">
                ابدأ امتحاناً جديداً
              </Button>
            </div>
          </MobileCard>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 px-1">
              تفاصيل الامتحانات ({filteredAttempts.length})
            </h3>
            
            {filteredAttempts.map((attempt) => (
              <MobileCard key={attempt.id}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {attempt.exams?.title || 'امتحان'}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(attempt.completed_at!), 'dd MMMM yyyy - HH:mm', { locale: ar })}
                        </span>
                      </div>
                    </div>
                    <Badge variant={getScoreBadgeVariant(attempt.score || 0)}>
                      {attempt.score}%
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>النتيجة</span>
                        <span className={`font-semibold ${getScoreColor(attempt.score || 0)}`}>
                          {attempt.correct_answers}/{attempt.total_questions}
                        </span>
                      </div>
                      <Progress 
                        value={(attempt.score || 0)} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {Math.floor((attempt.time_taken || 0) / 60)} دقيقة
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{attempt.correct_answers}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span>{attempt.total_questions - (attempt.correct_answers || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReviewExam(attempt.id)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 ml-2" />
                        {expandedAttempt === attempt.id ? 'إخفاء التفاصيل' : 'مراجعة الإجابات'}
                      </Button>
                      
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleRetakeExam(attempt.exam_id)}
                        className="flex-1"
                      >
                        <RotateCcw className="w-4 h-4 ml-2" />
                        إعادة الاختبار
                      </Button>
                    </div>

                    {/* Expanded Details - Shows detailed review when "مراجعة الإجابات" is clicked */}
                    {expandedAttempt === attempt.id && (
                      <div className="mt-4 border-t pt-4">
                        <h5 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Eye className="w-5 h-5 text-blue-600" />
                          مراجعة تفصيلية للإجابات
                        </h5>
                        <DetailedAnswerReview attemptId={attempt.id} />
                      </div>
                    )}
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={() => navigate('/')}
            className="flex-1"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للوحة التحكم
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="flex-1"
          >
            ابدأ امتحاناً جديداً
          </Button>
        </div>
      </div>

      {/* Exam Retake Modal - This opens ONLY when "إعادة الاختبار" is clicked */}
      {selectedExamForRetake && (
        <ExamModal
          examId={selectedExamForRetake}
          isOpen={true}
          onClose={() => setSelectedExamForRetake(null)}
        />
      )}
    </div>
  );
};

export default Results;
