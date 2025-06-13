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
      <Card className="h-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                {exam.title}
              </h3>
              {exam.description && (
                <p className="text-gray-600 text-xl leading-relaxed line-clamp-2">
                  {exam.description}
                </p>
              )}
            </div>
            
            {isCompleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-12 w-12 p-0">
                    <MoreVertical className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xl">
                  <DropdownMenuItem onClick={handleRetakeExam} className="py-3">
                    <RotateCcw className="w-6 h-6 ml-3" />
                    إعادة الاختبار
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleCompleteReset}
                    className="text-red-600 focus:text-red-600 py-3"
                  >
                    <Trash2 className="w-6 h-6 ml-3" />
                    مسح البيانات وإعادة التشغيل
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isCompleted && (
            <div className="mt-5 p-5 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border-2 border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-emerald-600" />
                  <span className="font-semibold text-emerald-800 text-xl">مكتمل</span>
                </div>
                <Badge variant={getScoreBadgeVariant(score)} className="text-xl font-bold px-4 py-2">
                  {score}%
                </Badge>
              </div>
              
              <Progress value={score} className="mb-4 h-3" />
              
              <div className="grid grid-cols-2 gap-5 text-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">
                    {examStatus?.correct_answers}/{examStatus?.total_questions || exam.total_questions} صحيح
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">
                    {examStatus?.completed_at && format(new Date(examStatus.completed_at), 'dd/MM', { locale: ar })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-4">
          <div className="grid grid-cols-2 gap-5 text-xl">
            <div className="flex items-center gap-3 text-gray-600">
              <Target className="w-5 h-5" />
              <span>{exam.total_questions} سؤال</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{exam.duration_minutes} دقيقة</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          {isCompleted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Button
                onClick={handleReviewExam}
                disabled={!attemptId}
                className={`${
                  attemptId 
                    ? "bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } border-0 transition-all duration-200 text-xl py-6`}
              >
                <Eye className="w-6 h-6 ml-3" />
                {attemptId ? 'مراجعة الإجابات' : 'غير متاح'}
              </Button>
              <Button
                onClick={handleRetakeExam}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 text-xl py-6"
              >
                <RotateCcw className="w-6 h-6 ml-3" />
                إعادة الاختبار
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleStartExam}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 text-xl py-6"
            >
              <Play className="w-6 h-6 ml-3" />
              بدء الامتحان
            </Button>
          )}
        </CardFooter>
      </Card>

      {showAnswers && attemptId && (
        <Dialog open={showAnswers} onOpenChange={setShowAnswers}>
          <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-0" dir="rtl">
            <DialogHeader className="relative p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-b-2 border-emerald-200">
              <DialogTitle className="text-3xl text-center pr-12">
                مراجعة إجابات الاختبار - {exam.title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-6 top-6 h-12 w-12"
                onClick={() => setShowAnswers(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </DialogHeader>
            
            <div className="mt-0">
              <DetailedAnswerReview attemptId={attemptId} />
            </div>
            
            <div className="flex justify-center mt-6 pt-5 border-t p-6">
              <Button 
                onClick={() => setShowAnswers(false)} 
                variant="outline"
                className="px-10 py-6 text-xl"
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
