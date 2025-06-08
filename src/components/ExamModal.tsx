import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Loader2, Trophy, Target } from "lucide-react";
import { useExamQuestions } from "@/hooks/useExams";
import { useStartExamAttempt } from "@/hooks/useUserAttempts";
import { useSubmitExamAttempt } from "@/hooks/useSubmitExamAttempt";
import { DetailedAnswerReview } from "@/components/DetailedAnswerReview";

interface ExamModalProps {
  examId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ExamModal = ({ examId, isOpen, onClose }: ExamModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{ score: number; correctAnswers: number; totalQuestions: number } | null>(null);

  const { data: questions, isLoading: questionsLoading } = useExamQuestions(examId);
  const startExamMutation = useStartExamAttempt();
  const submitExamMutation = useSubmitExamAttempt();

  // Reset all states when modal opens (for retake functionality)
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Resetting exam modal state for new attempt');
      setCurrentQuestion(0);
      setAnswers({});
      setTimeLeft(3600);
      setIsSubmitted(false);
      setShowResults(false);
      setAttemptId(null);
      setStartTime(null);
      setSubmissionResult(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isSubmitted && !attemptId && questions) {
      console.log('🚀 Starting new exam attempt with', questions.length, 'questions');
      // Start new exam attempt
      startExamMutation.mutate(
        { examId, totalQuestions: questions.length },
        {
          onSuccess: (data) => {
            console.log('✅ Exam attempt started successfully:', data.id);
            setAttemptId(data.id);
            setStartTime(new Date());
          },
          onError: (error) => {
            console.error('❌ Failed to start exam attempt:', error);
          }
        }
      );
    }
  }, [isOpen, questions, isSubmitted, attemptId]);

  useEffect(() => {
    if (isOpen && !isSubmitted && startTime) {
      console.log('⏰ Starting timer for exam');
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            console.log('⏰ Time is up! Auto-submitting exam');
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, isSubmitted, startTime]);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    console.log('📝 Answer selected:', { questionId, optionId });
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = () => {
    if (!attemptId || !questions || !startTime) {
      console.error('❌ Cannot submit: missing required data', { attemptId, questionsLength: questions?.length, startTime });
      return;
    }

    console.log('📤 Submitting exam with', Object.keys(answers).length, 'answers out of', questions.length, 'questions');

    const timeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    // Prepare answers data with correct answers validation
    const answersData = questions.map(question => {
      const selectedOptionId = answers[question.id];
      
      // تحقق من وجود إجابة صالحة
      if (!selectedOptionId || selectedOptionId.trim() === '' || selectedOptionId === 'undefined' || selectedOptionId === 'null') {
        console.log('Question without answer:', question.question_text.substring(0, 50), '...');
        return {
          questionId: question.id,
          selectedOptionId: '', // سيتم تصفيته لاحقاً
          isCorrect: false
        };
      }
      
      const selectedOption = question.answer_options.find(opt => opt.id === selectedOptionId);
      const isCorrect = selectedOption?.is_correct || false;
      
      console.log('Question:', question.question_text.substring(0, 50), '...', 
                  'Selected:', selectedOption?.option_text || 'No answer',
                  'Correct:', isCorrect);
      
      return {
        questionId: question.id,
        selectedOptionId: selectedOptionId,
        isCorrect
      };
    });

    const correctCount = answersData.filter(a => a.isCorrect).length;
    console.log('📊 Submission summary:', {
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(answers).length,
      correctAnswers: correctCount,
      timeTaken: `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`
    });

    submitExamMutation.mutate(
      { attemptId, answers: answersData, timeTaken },
      {
        onSuccess: (result) => {
          console.log('🎉 Exam submitted successfully:', result);
          setIsSubmitted(true);
          setShowResults(true);
          setSubmissionResult(result);
        },
        onError: (error) => {
          console.error('💥 Exam submission failed:', error);
        }
      }
    );
  };

  const calculateScore = () => {
    if (!questions) return 0;
    let correct = 0;
    questions.forEach(question => {
      const selectedOptionId = answers[question.id];
      if (selectedOptionId && selectedOptionId.trim() !== '') {
        const selectedOption = question.answer_options.find(opt => opt.id === selectedOptionId);
        if (selectedOption?.is_correct) {
          correct++;
        }
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { message: "أداء ممتاز! تهانينا", color: "text-emerald-600", icon: Trophy };
    if (score >= 80) return { message: "أداء جيد جداً", color: "text-blue-600", icon: Trophy };
    if (score >= 70) return { message: "أداء جيد، يمكن التحسين", color: "text-green-600", icon: Target };
    if (score >= 60) return { message: "أداء مقبول، يحتاج تطوير", color: "text-yellow-600", icon: Target };
    return { message: "يحتاج مراجعة وتدريب إضافي", color: "text-red-600", icon: AlertCircle };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startNewAttempt = () => {
    // Reset all states for a new attempt
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(3600);
    setIsSubmitted(false);
    setShowResults(false);
    setAttemptId(null);
    setStartTime(null);
    setSubmissionResult(null);
  };

  const answeredCount = Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length;
  const totalQuestions = questions?.length || 0;
  const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  if (questionsLoading || startExamMutation.isPending) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md" dir="rtl">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
            <p className="text-lg text-gray-700">جاري تحضير الامتحان الجديد...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md" dir="rtl">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <p className="text-lg text-gray-700">لا توجد أسئلة متاحة لهذا الامتحان</p>
            <Button onClick={onClose} className="mt-4">العودة</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showResults) {
    const score = submissionResult?.score || calculateScore();
    const correctAnswers = submissionResult?.correctAnswers || 0;
    const performance = getPerformanceMessage(score);
    const Icon = performance.icon;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">نتائج الامتحان</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Enhanced Score Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Icon className={`w-12 h-12 ${performance.color}`} />
                  <div className="text-6xl font-bold text-emerald-600">{score}%</div>
                </div>
                
                <div className={`text-xl font-semibold ${performance.color} mb-2`}>
                  {performance.message}
                </div>
                
                <div className="text-lg text-gray-700 mb-4">
                  أجبت بشكل صحيح على {correctAnswers} من {questions.length} سؤال
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{correctAnswers}</div>
                    <div className="text-sm text-gray-600">إجابات صحيحة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{questions.length - correctAnswers}</div>
                    <div className="text-sm text-gray-600">إجابات خاطئة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.floor((3600 - timeLeft) / 60)}
                    </div>
                    <div className="text-sm text-gray-600">دقيقة مستغرقة</div>
                  </div>
                </div>

                {/* Performance Badge */}
                <div className="mt-6">
                  <Badge 
                    variant={score >= 70 ? "default" : "destructive"}
                    className="text-lg px-4 py-2"
                  >
                    {score >= 70 ? "نجح" : "لم ينجح"} - النسبة المطلوبة 70%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Answer Review */}
            {attemptId && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">مراجعة مفصلة للإجابات</h3>
                  <DetailedAnswerReview attemptId={attemptId} />
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button 
                onClick={startNewAttempt} 
                className="bg-gradient-to-r from-emerald-500 to-blue-600 px-8 py-3 text-lg"
              >
                إعادة المحاولة
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-8 py-3 text-lg"
              >
                العودة للوحة التحكم
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl">الامتحان التجريبي</DialogTitle>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="font-mono text-red-600">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm text-gray-600">
              السؤال {currentQuestion + 1} من {questions.length}
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-2" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>التقدم في الأسئلة</span>
              <span>{currentQuestion + 1}/{questions.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>الأسئلة المجاب عليها</span>
              <span>{answeredCount}/{totalQuestions}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Question */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                السؤال {currentQuestion + 1}: {questions[currentQuestion].question_text}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestion].answer_options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(questions[currentQuestion].id, option.id)}
                    className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                      answers[questions[currentQuestion].id] === option.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}) {option.option_text}
                    </span>
                  </button>
                ))}
              </div>

              {/* Show if question is answered */}
              {answers[questions[currentQuestion].id] && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">تم الإجابة على هذا السؤال</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {currentQuestion > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  السؤال السابق
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center gap-2"
                >
                  السؤال التالي
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600"
                  disabled={submitExamMutation.isPending}
                >
                  {submitExamMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      جاري التسليم...
                    </>
                  ) : (
                    'تسليم الامتحان'
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
          <Card className="border-0 shadow-lg bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">الانتقال السريع للأسئلة:</h4>
              <div className="grid grid-cols-10 gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg border-2 font-medium transition-all ${
                      index === currentQuestion
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : answers[question.id] && answers[question.id].trim() !== ''
                        ? 'border-blue-300 bg-blue-100 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-emerald-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                  <span>السؤال الحالي</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>تم الإجابة ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span>لم تتم الإجابة ({totalQuestions - answeredCount})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamModal;
