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
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
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
      <div className="flex flex-col items-center justify-center py-10 px-3">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
        <span className="text-gray-600 text-base text-center">جاري تحميل تفاصيل الإجابات...</span>
        <div className="w-48 max-w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-4">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-10 px-3">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد بيانات متاحة</h3>
        <p className="text-lg text-gray-600">لا توجد تفاصيل متاحة لهذا الاختبار</p>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
  const totalQuestions = userAnswers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="space-y-4 px-2 max-w-full overflow-x-hidden" dir="rtl">
      {/* Summary Section - Optimized for readability */}
      <div className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border-2 border-emerald-200 shadow-sm">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            {scorePercentage >= 70 ? (
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="text-center min-w-0">
              <h4 className="text-xl font-bold text-gray-900">
                النتيجة: {scorePercentage}%
              </h4>
              <p className="text-lg text-gray-600">
                {correctAnswers} صحيح من {totalQuestions}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={expandAll} 
              className="text-base px-3 py-1"
            >
              <ChevronDown className="w-4 h-4 ml-1" />
              توسيع الكل
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={collapseAll} 
              className="text-base px-3 py-1"
            >
              <ChevronUp className="w-4 h-4 ml-1" />
              طي الكل
            </Button>
          </div>
        </div>

        {/* Performance indicators */}
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          <div className="flex-1 min-w-[100px] text-center p-2 bg-emerald-100 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 text-base">صحيحة:</span>
            </div>
            <div className="text-xl font-bold text-emerald-700">{correctAnswers}</div>
          </div>
          
          <div className="flex-1 min-w-[100px] text-center p-2 bg-red-100 rounded-lg border border-red-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-600 text-base">خاطئة:</span>
            </div>
            <div className="text-xl font-bold text-red-700">{totalQuestions - correctAnswers}</div>
          </div>
          
          <div className="flex-1 min-w-[100px] text-center p-2 bg-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 text-base">النسبة:</span>
            </div>
            <div className="text-xl font-bold text-blue-700">{scorePercentage}%</div>
          </div>
        </div>

        {/* Performance message */}
        <div className={`p-3 rounded-lg border-2 text-center ${
          scorePercentage >= 70 
            ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
            : 'bg-yellow-100 border-yellow-300 text-yellow-800'
        }`}>
          <div className="font-bold text-base">
            {scorePercentage >= 90 && "🏆 أداء ممتاز!"}
            {scorePercentage >= 80 && scorePercentage < 90 && "🌟 أداء جيد جداً!"}
            {scorePercentage >= 70 && scorePercentage < 80 && "✅ أداء جيد"}
            {scorePercentage >= 60 && scorePercentage < 70 && "⚠️ يحتاج مراجعة"}
            {scorePercentage < 60 && "📚 يحتاج تدريب إضافي"}
          </div>
        </div>
      </div>

      {/* Questions List - Optimized for readability */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-lg font-bold text-gray-900">مراجعة الأسئلة</h3>
          <Badge variant="outline" className="text-base">
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
              className={`border border-gray-200 max-w-full overflow-hidden ${
                userAnswer.is_correct 
                  ? 'border-emerald-300 bg-emerald-50/30' 
                  : 'border-red-300 bg-red-50/30'
              }`}
            >
              <CardContent className="p-3">
                <div 
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => toggleQuestion(userAnswer.question_id)}
                >
                  {/* Status icon */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    {userAnswer.is_correct ? (
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <XCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h5 className="font-bold text-lg text-gray-900">
                            السؤال {index + 1}
                          </h5>
                          <Badge 
                            variant={userAnswer.is_correct ? "secondary" : "destructive"}
                            className="text-sm px-2 py-0.5"
                          >
                            {userAnswer.is_correct ? '✓ صحيح' : '✗ خطأ'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-800 text-base font-medium break-words">
                          {question?.question_text}
                        </p>
                      </div>
                      <div className="mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Quick summary */}
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap items-start gap-1">
                        <span className="text-gray-600 text-base min-w-[60px]">إجابتك:</span>
                        <div className={`flex-1 flex items-center gap-2 p-2 rounded text-base ${
                          userAnswer.is_correct 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userAnswer.is_correct ? 
                            <CheckCircle className="w-4 h-4" /> : 
                            <XCircle className="w-4 h-4" />
                          }
                          <span className="font-semibold truncate">
                            {selectedOption ? 
                              `${String.fromCharCode(65 + selectedOption.option_index)}) ${selectedOption.option_text}` : 
                              'لم تُجب على السؤال'
                            }
                          </span>
                        </div>
                      </div>
                      
                      {!userAnswer.is_correct && correctOption && (
                        <div className="flex flex-wrap items-start gap-1">
                          <span className="text-gray-600 text-base min-w-[60px]">الصحيحة:</span>
                          <div className="flex-1 flex items-center gap-2 p-2 bg-emerald-100 text-emerald-800 rounded text-base">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-semibold truncate">
                              {String.fromCharCode(65 + correctOption.option_index)}) {correctOption.option_text}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 space-y-3 border-t border-gray-200 pt-3">
                    <h6 className="font-bold text-gray-900 text-base flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      الخيارات المتاحة:
                    </h6>
                    
                    <div className="space-y-2">
                      {question?.answer_options
                        ?.sort((a, b) => a.option_index - b.option_index)
                        .map((option) => {
                          const isUserAnswer = option.id === userAnswer.selected_option_id;
                          const isCorrectAnswer = option.is_correct;
                          
                          let bgColor = 'bg-gray-50';
                          let textColor = 'text-gray-700';
                          let badgeContent = null;
                          let iconElement = null;

                          if (isCorrectAnswer) {
                            bgColor = 'bg-emerald-50';
                            textColor = 'text-emerald-900';
                            iconElement = <CheckCircle className="w-4 h-4 text-emerald-600" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-sm bg-emerald-600 text-white">
                                ✓ الإجابة الصحيحة
                              </Badge>
                            );
                          }

                          if (isUserAnswer && !isCorrectAnswer) {
                            bgColor = 'bg-red-50';
                            textColor = 'text-red-900';
                            iconElement = <XCircle className="w-4 h-4 text-red-600" />;
                            badgeContent = (
                              <Badge variant="destructive" className="text-sm">
                                ✗ إجابتك
                              </Badge>
                            );
                          }

                          if (isUserAnswer && isCorrectAnswer) {
                            iconElement = <CheckCircle className="w-4 h-4 text-emerald-600" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-sm bg-emerald-600 text-white">
                                ✓ إجابتك الصحيحة
                              </Badge>
                            );
                          }

                          return (
                            <div
                              key={option.id}
                              className={`p-3 rounded border ${bgColor} border-gray-200`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {iconElement || <div className="w-4 h-4"></div>}
                                  <span className={`${textColor} text-base break-words`}>
                                    {String.fromCharCode(65 + option.option_index)}) {option.option_text}
                                  </span>
                                </div>
                                <div>
                                  {badgeContent}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {question?.explanation && (
                      <div className="bg-blue-50 border-r-2 border-blue-400 p-3 rounded mt-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div>
                            <h6 className="font-bold text-blue-900 text-base mb-1">💡 شرح تفصيلي:</h6>
                            <p className="text-blue-800 text-base break-words">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!userAnswer.is_correct && (
                      <div className="bg-yellow-50 border-r-2 border-yellow-400 p-3 rounded mt-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          <div>
                            <h6 className="font-bold text-yellow-900 text-base mb-1">🎯 نصيحة للتحسين:</h6>
                            <p className="text-yellow-800 text-base break-words">
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


