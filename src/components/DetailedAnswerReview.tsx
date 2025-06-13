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
      <div className="flex flex-col items-center justify-center py-16 px-6 lg:py-24">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
          <BookOpen className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
        </div>
        <Loader2 className="w-10 h-10 lg:w-12 lg:h-12 animate-spin text-emerald-600 mb-4" />
        <span className="text-gray-600 text-xl lg:text-2xl text-center font-medium">
          جاري تحميل تفاصيل الإجابات...
        </span>
        <div className="w-64 lg:w-80 h-3 lg:h-4 bg-gray-200 rounded-full overflow-hidden mt-8">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-16 px-6 lg:py-24">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          لا توجد بيانات متاحة
        </h3>
        <p className="text-gray-600 text-xl lg:text-2xl">
          لا توجد تفاصيل متاحة لهذا الاختبار
        </p>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
  const totalQuestions = userAnswers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8 lg:space-y-12" dir="rtl">
        {/* Enhanced Summary Section */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8">
                {scorePercentage >= 70 ? (
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
                    <Award className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                ) : (
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg">
                    <Target className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                )}
                <div className="text-center sm:text-right">
                  <h4 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2">
                    النتيجة: {scorePercentage}%
                  </h4>
                  <p className="text-gray-600 text-xl lg:text-2xl">
                    {correctAnswers} صحيح من {totalQuestions}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={expandAll} 
                  className="text-lg px-6 py-4 h-auto font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  <ChevronDown className="w-6 h-6 ml-2" />
                  توسيع الكل
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={collapseAll} 
                  className="text-lg px-6 py-4 h-auto font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  <ChevronUp className="w-6 h-6 ml-2" />
                  طي الكل
                </Button>
              </div>
            </div>

            {/* Enhanced Performance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 lg:p-8 bg-emerald-100 rounded-2xl border-2 border-emerald-200 shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle className="w-7 h-7 lg:w-8 lg:h-8 text-emerald-600" />
                  <span className="text-emerald-700 text-lg lg:text-xl font-semibold">صحيحة:</span>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-emerald-800">{correctAnswers}</div>
              </div>
              
              <div className="text-center p-6 lg:p-8 bg-red-100 rounded-2xl border-2 border-red-200 shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <XCircle className="w-7 h-7 lg:w-8 lg:h-8 text-red-600" />
                  <span className="text-red-700 text-lg lg:text-xl font-semibold">خاطئة:</span>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-red-800">{totalQuestions - correctAnswers}</div>
              </div>
              
              <div className="text-center p-6 lg:p-8 bg-blue-100 rounded-2xl border-2 border-blue-200 shadow-sm sm:col-span-1">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Target className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600" />
                  <span className="text-blue-700 text-lg lg:text-xl font-semibold">النسبة المئوية:</span>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-blue-800">{scorePercentage}%</div>
              </div>
            </div>

            {/* Enhanced Performance Message */}
            <div className={`p-6 lg:p-8 rounded-2xl border-2 text-center shadow-sm ${
              scorePercentage >= 70 
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                : 'bg-yellow-100 border-yellow-300 text-yellow-800'
            }`}>
              <div className="font-bold text-xl lg:text-2xl">
                {scorePercentage >= 90 && "🏆 أداء ممتاز!"}
                {scorePercentage >= 80 && scorePercentage < 90 && "🌟 أداء جيد جداً!"}
                {scorePercentage >= 70 && scorePercentage < 80 && "✅ أداء جيد"}
                {scorePercentage >= 60 && scorePercentage < 70 && "⚠️ يحتاج مراجعة"}
                {scorePercentage < 60 && "📚 يحتاج تدريب إضافي"}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Questions Section */}
        <div className="space-y-6 lg:space-y-8">
          <div className="flex items-center justify-between px-2 mb-6">
            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">مراجعة الأسئلة</h3>
            <Badge variant="outline" className="text-lg lg:text-xl px-4 py-2 font-semibold">
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
                className={`border-2 rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-200 shadow-lg hover:shadow-xl ${
                  userAnswer.is_correct 
                    ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50/70' 
                    : 'border-red-300 bg-red-50/50 hover:bg-red-50/70'
                }`}
              >
                <CardContent className="p-0">
                  <div 
                    className="flex items-start gap-6 p-6 lg:p-8 cursor-pointer active:bg-gray-100/50 transition-colors"
                    onClick={() => toggleQuestion(userAnswer.question_id)}
                  >
                    {/* Enhanced Status Icon */}
                    <div className="relative flex-shrink-0 mt-2">
                      {userAnswer.is_correct ? (
                        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <XCircle className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-4">
                            <h5 className="font-bold text-xl lg:text-2xl text-gray-900">
                              السؤال {index + 1}
                            </h5>
                            <Badge 
                              variant={userAnswer.is_correct ? "secondary" : "destructive"}
                              className="text-base lg:text-lg px-3 py-1.5 font-semibold"
                            >
                              {userAnswer.is_correct ? '✓ صحيح' : '✗ خطأ'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-800 text-lg lg:text-xl xl:text-2xl font-medium leading-relaxed break-words">
                            {question?.question_text}
                          </p>
                        </div>
                        <div className="mt-2">
                          {isExpanded ? (
                            <ChevronUp className="w-8 h-8 lg:w-9 lg:h-9 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-8 h-8 lg:w-9 lg:h-9 text-gray-500" />
                          )}
                        </div>
                      </div>

                      {/* Enhanced Quick Summary */}
                      <div className="mt-6 space-y-5">
                        <div className="flex flex-col gap-3">
                          <span className="text-gray-600 text-lg lg:text-xl font-medium">إجابتك:</span>
                          <div className={`flex items-center gap-4 p-4 lg:p-5 rounded-xl text-lg lg:text-xl shadow-sm ${
                            userAnswer.is_correct 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {userAnswer.is_correct ? 
                              <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7 flex-shrink-0" /> : 
                              <XCircle className="w-6 h-6 lg:w-7 lg:h-7 flex-shrink-0" />
                            }
                            <span className="font-semibold break-words flex-1 leading-relaxed">
                              {selectedOption ? 
                                `${String.fromCharCode(65 + selectedOption.option_index)}) ${selectedOption.option_text}` : 
                                'لم تُجب على السؤال'
                              }
                            </span>
                          </div>
                        </div>
                        
                        {!userAnswer.is_correct && correctOption && (
                          <div className="flex flex-col gap-3">
                            <span className="text-gray-600 text-lg lg:text-xl font-medium">الإجابة الصحيحة:</span>
                            <div className="flex items-center gap-4 p-4 lg:p-5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-lg lg:text-xl shadow-sm">
                              <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7 flex-shrink-0" />
                              <span className="font-semibold break-words flex-1 leading-relaxed">
                                {String.fromCharCode(65 + correctOption.option_index)}) {correctOption.option_text}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 lg:p-8 space-y-6 lg:space-y-8 bg-white/50">
                      <h6 className="font-bold text-gray-900 text-xl lg:text-2xl flex items-center gap-3 mb-6">
                        <Target className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600" />
                        الخيارات المتاحة:
                      </h6>
                      
                      <div className="space-y-4 lg:space-y-5">
                        {question?.answer_options
                          ?.sort((a, b) => a.option_index - b.option_index)
                          .map((option) => {
                            const isUserAnswer = option.id === userAnswer.selected_option_id;
                            const isCorrectAnswer = option.is_correct;
                            
                            let bgColor = 'bg-gray-50';
                            let textColor = 'text-gray-700';
                            let borderColor = 'border-gray-200';
                            let badgeContent = null;
                            let iconElement = null;

                            if (isCorrectAnswer) {
                              bgColor = 'bg-emerald-50';
                              textColor = 'text-emerald-900';
                              borderColor = 'border-emerald-200';
                              iconElement = <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7 text-emerald-600 flex-shrink-0" />;
                              badgeContent = (
                                <Badge variant="secondary" className="text-base lg:text-lg bg-emerald-600 text-white px-4 py-2 font-semibold">
                                  ✓ الإجابة الصحيحة
                                </Badge>
                              );
                            }

                            if (isUserAnswer && !isCorrectAnswer) {
                              bgColor = 'bg-red-50';
                              textColor = 'text-red-900';
                              borderColor = 'border-red-200';
                              iconElement = <XCircle className="w-6 h-6 lg:w-7 lg:h-7 text-red-600 flex-shrink-0" />;
                              badgeContent = (
                                <Badge variant="destructive" className="text-base lg:text-lg px-4 py-2 font-semibold">
                                  ✗ إجابتك
                                </Badge>
                              );
                            }

                            if (isUserAnswer && isCorrectAnswer) {
                              iconElement = <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7 text-emerald-600 flex-shrink-0" />;
                              badgeContent = (
                                <Badge variant="secondary" className="text-base lg:text-lg bg-emerald-600 text-white px-4 py-2 font-semibold">
                                  ✓ إجابتك الصحيحة
                                </Badge>
                              );
                            }

                            return (
                              <div
                                key={option.id}
                                className={`p-5 lg:p-6 rounded-xl border-2 ${bgColor} ${borderColor} shadow-sm`}
                              >
                                <div className="flex flex-col gap-4">
                                  <div className="flex items-center gap-4">
                                    {iconElement || <div className="w-6 h-6 lg:w-7 lg:h-7"></div>}
                                    <span className={`${textColor} text-lg lg:text-xl xl:text-2xl font-medium break-words flex-1 leading-relaxed`}>
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
                        <div className="bg-blue-50 border-r-4 border-blue-400 p-6 lg:p-8 rounded-xl shadow-sm">
                          <div className="flex items-start gap-4">
                            <Lightbulb className="w-8 h-8 lg:w-9 lg:h-9 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                              <h6 className="font-bold text-blue-900 text-xl lg:text-2xl mb-4">💡 شرح تفصيلي:</h6>
                              <p className="text-blue-800 text-lg lg:text-xl xl:text-2xl break-words leading-relaxed">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!userAnswer.is_correct && (
                        <div className="bg-yellow-50 border-r-4 border-yellow-400 p-6 lg:p-8 rounded-xl shadow-sm">
                          <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 lg:w-9 lg:h-9 text-yellow-600 flex-shrink-0 mt-1" />
                            <div>
                              <h6 className="font-bold text-yellow-900 text-xl lg:text-2xl mb-4">🎯 نصيحة للتحسين:</h6>
                              <p className="text-yellow-800 text-lg lg:text-xl xl:text-2xl break-words leading-relaxed">
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
    </div>
  );
};

export default DetailedAnswerReview;
