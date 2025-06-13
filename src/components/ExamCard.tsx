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
  Target,
  Trophy,
  RotateCcw,
  Trash2,
  Calendar,
  MoreVertical,
  Eye,
  X,
  CheckCircle
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
    exam_id?: string;
    attempt_id?: string;
    score?: number;
    correct_answers?: number;
    completed_at?: string;
    is_completed?: boolean;
    total_questions?: number;
  } | null;
  onStartExam: (examId: string) => void;
}

export const ExamCard = ({ exam, examStatus, onStartExam }: ExamCardProps) => {
  const [resetDialog, setResetDialog] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  
  const isCompleted = examStatus?.is_completed === true;
  const score = examStatus?.score || 0;
  const attemptId = examStatus?.attempt_id;

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
    onStartExam(exam.id);
  };

  const handleRetakeExam = () => {
    onStartExam(exam.id);
  };

  const handleCompleteReset = () => {
    setResetDialog(true);
  };

  const handleResetComplete = () => {
    onStartExam(exam.id);
  };

  const handleReviewExam = () => {
    if (!attemptId) return;
    setShowAnswers(true);
  };

  return (
    <>
      <Card className="h-full bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                {exam.title}
              </h3>
              {exam.description && (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {exam.description}
                </p>
              )}
            </div>
            
            {isCompleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-sm">
                  <DropdownMenuItem onClick={handleRetakeExam} className="py-2">
                    <RotateCcw className="w-4 h-4 ml-2" />
                    إعادة الاختبار
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleCompleteReset}
                    className="text-red-600 focus:text-red-600 py-2"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    مسح البيانات
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isCompleted && (
            <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-800 text-sm">مكتمل</span>
                </div>
                <Badge variant={getScoreBadgeVariant(score)} className="text-xs font-bold">
                  {score}%
                </Badge>
              </div>
              
              <Progress value={score} className="mb-3 h-2" />
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span className="text-gray-700">
                    {examStatus?.correct_answers}/{examStatus?.total_questions || exam.total_questions}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  <span className="text-gray-700">
                    {examStatus?.completed_at && format(new Date(examStatus.completed_at), 'dd/MM', { locale: ar })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
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
            <div className="grid grid-cols-1 gap-2 w-full">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleReviewExam}
                  disabled={!attemptId}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 ml-1" />
                  {attemptId ? 'مراجعة' : 'غير متاح'}
                </Button>
                <Button
                  onClick={handleRetakeExam}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-xs"
                >
                  <RotateCcw className="w-3 h-3 ml-1" />
                  إعادة
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleStartExam}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 text-sm py-2"
            >
              <Play className="w-4 h-4 ml-2" />
              بدء الامتحان
            </Button>
          )}
        </CardFooter>
      </Card>

      {showAnswers && attemptId && (
        <Dialog open={showAnswers} onOpenChange={setShowAnswers}>
          <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto p-0 sm:max-w-4xl" dir="rtl">
            <DialogHeader className="relative p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-emerald-200">
              <DialogTitle className="text-lg sm:text-xl text-center pr-8">
                مراجعة إجابات - {exam.title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-4 h-8 w-8"
                onClick={() => setShowAnswers(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            
            <div className="p-0">
              <DetailedAnswerReview attemptId={attemptId} />
            </div>
            
            <div className="flex justify-center p-4 border-t">
              <Button 
                onClick={() => setShowAnswers(false)} 
                variant="outline"
                className="px-6 py-2 text-sm"
              >
                إغلاق
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
