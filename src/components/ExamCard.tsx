
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResetExamDialog } from "@/components/ui/reset-exam-dialog";
import { DetailedAnswerReview } from "@/components/DetailedAnswerReview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Play, 
  Clock, 
  Users, 
  CheckCircle, 
  Target,
  Trophy,
  RotateCcw,
  Trash2,
  Calendar,
  MoreVertical,
  Eye,
  X
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    description?: string;
    total_questions: number;
    duration_minutes: number;
  };
  examStatus?: {
    score?: number;
    completed_at?: string;
    correct_answers?: number;
    attempt_id?: string;
    total_questions?: number;
  } | null;
  onStartExam: (examId: string) => void;
}

export const ExamCard = ({ exam, examStatus, onStartExam }: ExamCardProps) => {
  const [resetDialog, setResetDialog] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  
  // Enhanced checking for completed status
  const isCompleted = !!(examStatus && examStatus.score !== undefined && examStatus.attempt_id);
  const score = examStatus?.score || 0;
  const attemptId = examStatus?.attempt_id;

  console.log('🔍 ExamCard Debug Info:');
  console.log('  - Exam ID:', exam.id);
  console.log('  - Exam Status received:', examStatus);
  console.log('  - Is Completed:', isCompleted);
  console.log('  - Attempt ID:', attemptId);
  console.log('  - Score:', score);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "secondary" | "destructive" | "outline" => {
    if (score >= 70) return "secondary";
    if (score >= 50) return "outline";
    return "destructive";
  };

  const handleStartExam = () => {
    console.log('🚀 Starting new exam for:', exam.id);
    onStartExam(exam.id);
  };

  const handleRetakeExam = () => {
    console.log('🔄 Retaking exam for:', exam.id);
    onStartExam(exam.id);
  };

  const handleCompleteReset = () => {
    console.log('🗑️ Complete reset for exam:', exam.id);
    setResetDialog(true);
  };

  const handleResetComplete = () => {
    // After reset, start the exam
    onStartExam(exam.id);
  };

  const handleViewAnswers = () => {
    console.log('👁️ View answers clicked');
    console.log('  - Attempt ID:', attemptId);
    console.log('  - Is Completed:', isCompleted);
    
    if (!isCompleted || !attemptId) {
      console.error('❌ Cannot view answers - missing data:');
      console.error('  - Is Completed:', isCompleted);
      console.error('  - Attempt ID:', attemptId);
      console.error('  - Full exam status:', examStatus);
      return;
    }

    console.log('✅ Opening detailed answer review for attempt:', attemptId);
    setShowAnswers(true);
  };

  // Enhanced logic for view answers button availability
  const canViewAnswers = isCompleted && !!attemptId;

  console.log('🎯 Button State Check:');
  console.log('  - Can View Answers:', canViewAnswers);
  console.log('  - Button will show:', canViewAnswers ? 'مراجعة الإجابات' : 'غير متاح');

  return (
    <>
      <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {exam.title}
              </h3>
              {exam.description && (
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {exam.description}
                </p>
              )}
            </div>
            
            {isCompleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleRetakeExam}>
                    <RotateCcw className="w-4 h-4 ml-2" />
                    إعادة الاختبار
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleCompleteReset}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    مسح البيانات وإعادة التشغيل
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isCompleted && (
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">مكتمل</span>
                </div>
                <Badge variant={getScoreBadgeVariant(score)} className="text-sm font-bold">
                  {score}%
                </Badge>
              </div>
              
              <Progress value={score} className="mb-3 h-2" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-700">
                    {examStatus.correct_answers}/{examStatus.total_questions || exam.total_questions} صحيح
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    {examStatus.completed_at && format(new Date(examStatus.completed_at), 'dd/MM', { locale: ar })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Target className="w-4 h-4" />
              <span>{exam.total_questions} سؤال</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{exam.duration_minutes} دقيقة</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          {isCompleted ? (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                onClick={handleViewAnswers}
                disabled={!canViewAnswers}
                variant={canViewAnswers ? "default" : "outline"}
                className={`transition-all duration-200 ${
                  canViewAnswers 
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white border-0' 
                    : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                }`}
              >
                <Eye className="w-4 h-4 ml-2" />
                {canViewAnswers ? 'مراجعة الإجابات' : 'غير متاح'}
              </Button>
              <Button
                onClick={handleRetakeExam}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة الاختبار
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleStartExam}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 transition-all duration-200"
            >
              <Play className="w-4 h-4 ml-2" />
              بدء الامتحان
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Dialog for viewing detailed answers */}
      {showAnswers && attemptId && (
        <Dialog open={showAnswers} onOpenChange={setShowAnswers}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader className="relative">
              <DialogTitle className="text-2xl text-center pr-8">
                مراجعة إجابات الاختبار - {exam.title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-0 h-8 w-8"
                onClick={() => setShowAnswers(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            
            <div className="mt-4">
              <DetailedAnswerReview attemptId={attemptId} />
            </div>
            
            <div className="flex justify-center mt-6 pt-4 border-t">
              <Button 
                onClick={() => setShowAnswers(false)} 
                variant="outline"
                className="px-8"
              >
                إغلاق المراجعة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <ResetExamDialog
        examId={exam.id}
        examTitle={exam.title}
        isOpen={resetDialog}
        onClose={() => setResetDialog(false)}
        onResetComplete={handleResetComplete}
      />
    </>
  );
};
