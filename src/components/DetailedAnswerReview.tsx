import { useState, useEffect } from 'react';
import { useUserAnswers } from '@/hooks/useUserAnswers';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Loader2,
  Award,
  Target,
  BookOpen
} from 'lucide-react';

interface DetailedAnswerReviewProps {
  attemptId: string;
}

export const DetailedAnswerReview = ({ attemptId }: DetailedAnswerReviewProps) => {
  const { data: userAnswers, isLoading } = useUserAnswers(attemptId);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    if (userAnswers) {
      setExpandedQuestions(new Set(userAnswers.map(answer => answer.question_id)));
    }
  };

  const collapseAll = () => {
    setExpandedQuestions(new Set());
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 md:py-16">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
          <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-white" />
        </div>
        <Loader2 className="w-12 h-12 md:w-14 md:h-14 animate-spin text-emerald-600 mb-4" />
        <span className="text-gray-600 text-xl md:text-2xl text-center">
          جاري تحميل تفاصيل الإجابات...
        </span>
        <div className="w-72 max-w-full h-3 md:w-80 md:h-3.5 bg-gray-200 rounded-full overflow-hidden mt-8">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-12 px-4 md:py-20">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          لا توجد بيانات متاحة
        </h3>
        <p className="text-gray-600 text-xl md:text-2xl max-w-md mx-auto">
          لا توجد تفاصيل متاحة لهذا الاختبار
        </p>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
  const totalQuestions = userAnswers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto w-full px-3 md:px-6 py-6 space-y-8 md:space-y-10" dir="rtl">
      {/* Summary Section - Enhanced Responsive Design */}
      <div className="p-5 md:p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border-3 border-emerald-200 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
            {scorePercentage >= 70 ? (
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Award className="w-9 h-9 md:w-10 md:h-10 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Target className="w-9 h-9 md:w-10 md:h-10 text-white" />
              </div>
            )}
            <div className="text-center md:text-left">
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900">
                النتيجة: {scorePercentage}%
              </h4>
              <p className="text-gray-700 text-xl md:text-2xl mt-2">
                {correctAnswers} صحيح من {totalQuestions}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg"
              onClick={expandAll} 
              className="text-lg px-5 py-3 w-full sm:w-auto"
            >
              <ChevronDown className="w-6 h-6 ml-2" />
              توسيع الكل
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={collapseAll} 
              className="text-lg px-5 py-3 w-full sm:w-auto"
            >
              <ChevronUp className="w-6 h-6 ml-2" />
              طي الكل
            </Button>
          </div>
        </div>

        {/* Performance indicators - Enhanced Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="text-center p-5 bg-emerald-100 rounded-2xl border-2 border-emerald-200">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" />
              <span className="text-emerald-600 text-lg md:text-xl">صحيحة:</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-700">{correctAnswers}</div>
          </div>
          
          <div className="text-center p-5 bg-red-100 rounded-2xl border-2 border-red-200">
            <div className="flex items-center justify-center gap-3 mb-3">
              <XCircle className="w-6 h-6 md:w-7 md:h-7 text-red-600" />
              <span className="text-red-600 text-lg md:text-xl">خاطئة:</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-red-700">{totalQuestions - correctAnswers}</div>
          </div>
          
          <div className="text-center p-5 bg-blue-100 rounded-2xl border-2 border-blue-200">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Target className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
              <span className="text-blue-600 text-lg md:text-xl">النسبة المئوية:</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-blue-700">{scorePercentage}%</div>
          </div>
        </div>

        {/* Performance message - Enhanced */}
        <div className={`p-5 md:p-6 rounded-2xl border-3 text-center ${
          scorePercentage >= 70 
            ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
            : 'bg-yellow-100 border-yellow-300 text-yellow-800'
        }`}>
          <div className="font-bold text-xl md:text-2xl flex items-center justify-center gap-3">
            {scorePercentage >= 90 && <><span>🏆</span> أداء ممتاز!</>}
            {scorePercentage >= 80 && scorePercentage < 90 && <><span>🌟</span> أداء جيد جداً!</>}
            {scorePercentage >= 70 && scorePercentage < 80 && <><span>✅</span> أداء جيد</>}
            {scorePercentage >= 60 && scorePercentage < 70 && <><span>⚠️</span> يحتاج مراجعة</>}
            {scorePercentage < 60 && <><span>📚</span> يحتاج تدريب إضافي</>}
          </div>
        </div>
      </div>

      {/* Questions List - Enhanced Responsive Design */}
      <div className="space-y-5 md:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 mb-5 gap-4">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">مراجعة الأسئلة</h3>
          <Badge variant="outline" className="text-lg md:text-xl px-4 py-2">
            {totalQuestions} سؤال
          </Badge>
        </div>
        
        {userAnswers.map((userAnswer, index) => {
          const question = userAnswer.questions;
          const isExpanded = expandedQuestions.has(userAnswer.question_id);
          const selectedOption = question?.answer_options?.find(
            option => option.id === userAnswer.selected_option_id
          );
          const correctOption = question?.answer_options?.find(
            option => option.is_correct
          );

          return (
            <Card 
              key={userAnswer.id} 
              className={`border-3 rounded-2xl max-w-full overflow-hidden transition-all ${
                userAnswer.is_correct 
                  ? 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/50' 
                  : 'border-red-300 bg-red-50/30 hover:bg-red-50/50'
              }`}
            >
              <CardContent className="p-0">
                <div 
                  className="flex items-start gap-5 p-5 md:p-6 active:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => toggleQuestion(userAnswer.question_id)}
                >
                  {/* Status icon - Enhanced sizing */}
                  <div className="relative flex-shrink-0 mt-1">
                    {userAnswer.is_correct ? (
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-red-500 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h5 className="font-bold text-xl md:text-2xl text-gray-900">
                            السؤال {index + 1}
                          </h5>
                          <Badge 
                            variant={userAnswer.is_correct ? "secondary" : "destructive"}
                            className="text-base md:text-lg px-3 py-1.5"
                          >
                            {userAnswer.is_correct ? '✓ صحيح' : '✗ خطأ'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-800 text-lg md:text-xl font-medium break-words">
                          {question?.question_text}
                        </p>
                      </div>
                      <div className="mt-1.5">
                        {isExpanded ? (
                          <ChevronUp className="w-7 h-7 md:w-8 md:h-8 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-7 h-7 md:w-8 md:h-8 text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Quick summary - Enhanced layout */}
                    <div className="mt-5 space-y-4 md:space-y-5">
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-700 text-lg md:text-xl">إجابتك:</span>
                        <div className={`flex items-center gap-4 p-4 md:p-5 rounded-xl text-lg md:text-xl ${
                          userAnswer.is_correct 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userAnswer.is_correct ? 
                            <CheckCircle className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" /> : 
                            <XCircle className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
                          }
                          <span className="font-semibold break-words text-left flex-1">
                            {selectedOption ? 
                              `${String.fromCharCode(65 + selectedOption.option_index)}) ${selectedOption.option_text}` : 
                              'لم تُجب على السؤال'
                            }
                          </span>
                        </div>
                      </div>
                      
                      {!userAnswer.is_correct && correctOption && (
                        <div className="flex flex-col gap-2">
                          <span className="text-gray-700 text-lg md:text-xl">الإجابة الصحيحة:</span>
                          <div className="flex items-center gap-4 p-4 md:p-5 bg-emerald-100 text-emerald-800 rounded-xl text-lg md:text-xl">
                            <CheckCircle className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
                            <span className="font-semibold break-words text-left flex-1">
                              {String.fromCharCode(65 + correctOption.option_index)}) {correctOption.option_text}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Enhanced Design */}
                {isExpanded && (
                  <div className="mt-0 space-y-5 md:space-y-6 border-t-2 border-gray-200 p-5 md:p-6">
                    <h6 className="font-bold text-gray-900 text-xl md:text-2xl flex items-center gap-3 mb-4">
                      <Target className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                      الخيارات المتاحة:
                    </h6>
                    
                    <div className="space-y-4 md:space-y-5">
                      {question?.answer_options
                        ?.sort((a, b) => a.option_index - b.option_index)
                        .map((option) => {
                          const isUserAnswer = option.id === userAnswer.selected_option_id;
                          const isCorrectAnswer = option.is_correct;
                          
                          let bgColor = 'bg-gray-50';
                          let textColor = 'text-gray-800';
                          let badgeContent = null;
                          let iconElement = null;

                          if (isCorrectAnswer) {
                            bgColor = 'bg-emerald-50';
                            textColor = 'text-emerald-900';
                            iconElement = <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-base md:text-lg bg-emerald-600 text-white px-3 py-1.5">
                                ✓ الإجابة الصحيحة
                              </Badge>
                            );
                          }

                          if (isUserAnswer && !isCorrectAnswer) {
                            bgColor = 'bg-red-50';
                            textColor = 'text-red-900';
                            iconElement = <XCircle className="w-6 h-6 md:w-7 md:h-7 text-red-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="destructive" className="text-base md:text-lg px-3 py-1.5">
                                ✗ إجابتك
                              </Badge>
                            );
                          }

                          if (isUserAnswer && isCorrectAnswer) {
                            iconElement = <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-base md:text-lg bg-emerald-600 text-white px-3 py-1.5">
                                ✓ إجابتك الصحيحة
                              </Badge>
                            );
                          }

                          return (
                            <div
                              key={option.id}
                              className={`p-5 rounded-2xl border-2 ${bgColor} border-gray-200`}
                            >
                              <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                  {iconElement || <div className="w-6 h-6 md:w-7 md:h-7"></div>}
                                  <span className={`${textColor} text-lg md:text-xl font-medium break-words flex-1`}>
                                    {String.fromCharCode(65 + option.option_index)}) {option.option_text}
                                  </span>
                                </div>
                                <div className="flex justify-end">
                                  {badgeContent}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {question?.explanation && (
                      <div className="bg-blue-50 border-r-4 border-blue-500 p-5 md:p-6 rounded-2xl mt-6">
                        <div className="flex items-start gap-4">
                          <Lightbulb className="w-7 h-7 md:w-8 md:h-8 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h6 className="font-bold text-blue-900 text-xl md:text-2xl mb-3 flex items-center gap-2">
                              <span>💡</span> شرح تفصيلي:
                            </h6>
                            <p className="text-blue-800 text-lg md:text-xl break-words leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!userAnswer.is_correct && (
                      <div className="bg-yellow-50 border-r-4 border-yellow-500 p-5 md:p-6 rounded-2xl mt-6">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-7 h-7 md:w-8 md:h-8 text-yellow-600 flex-shrink-0 mt-1" />
                          <div>
                            <h6 className="font-bold text-yellow-900 text-xl md:text-2xl mb-3 flex items-center gap-2">
                              <span>🎯</span> نصيحة للتحسين:
                            </h6>
                            <p className="text-yellow-800 text-lg md:text-xl break-words leading-relaxed">
                              راجع هذا الموضوع مرة أخرى وتأكد من فهم المفاهيم الأساسية لتحسين أداءك في الاختبارات القادمة.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedAnswerReview;
