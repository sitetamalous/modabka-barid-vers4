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
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
          <BookOpen className="w-14 h-14 md:w-18 md:h-18 text-white" />
        </div>
        <Loader2 className="w-20 h-20 md:w-24 md:h-24 animate-spin text-emerald-600 mb-6" />
        <span className="text-gray-600 text-3xl md:text-4xl text-center">
          جاري تحميل تفاصيل الإجابات...
        </span>
        <div className="w-full max-w-md h-5 md:h-6 bg-gray-200 rounded-full overflow-hidden mt-10">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-20 px-4 min-h-screen flex flex-col justify-center">
        <div className="w-28 h-28 md:w-36 md:h-36 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-14 h-14 md:w-18 md:h-18 text-gray-400" />
        </div>
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          لا توجد بيانات متاحة
        </h3>
        <p className="text-gray-600 text-3xl md:text-4xl max-w-2xl mx-auto">
          لا توجد تفاصيل متاحة لهذا الاختبار
        </p>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
  const totalQuestions = userAnswers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-8 space-y-10 md:space-y-12" dir="rtl">
      {/* Summary Section - Enhanced for Mobile */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl border-4 border-emerald-200 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {scorePercentage >= 70 ? (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center">
                <Award className="w-14 h-14 md:w-18 md:h-18 text-white" />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center">
                <Target className="w-14 h-14 md:w-18 md:h-18 text-white" />
              </div>
            )}
            <div className="text-center md:text-left mt-4 md:mt-0">
              <h4 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                النتيجة: {scorePercentage}%
              </h4>
              <p className="text-gray-700 text-3xl md:text-4xl mt-3">
                {correctAnswers} صحيح من {totalQuestions}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mt-6 md:mt-0">
            <Button 
              variant="outline" 
              size="xl"
              onClick={expandAll} 
              className="text-2xl px-8 py-6 w-full sm:w-auto"
            >
              <ChevronDown className="w-10 h-10 ml-3" />
              توسيع الكل
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              onClick={collapseAll} 
              className="text-2xl px-8 py-6 w-full sm:w-auto"
            >
              <ChevronUp className="w-10 h-10 ml-3" />
              طي الكل
            </Button>
          </div>
        </div>

        {/* Performance indicators - Enhanced Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-10">
          <div className="text-center p-6 bg-emerald-100 rounded-3xl border-3 border-emerald-200">
            <div className="flex items-center justify-center gap-4 mb-4">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-600" />
              <span className="text-emerald-600 text-3xl md:text-4xl">صحيحة:</span>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-emerald-700">{correctAnswers}</div>
          </div>
          
          <div className="text-center p-6 bg-red-100 rounded-3xl border-3 border-red-200">
            <div className="flex items-center justify-center gap-4 mb-4">
              <XCircle className="w-10 h-10 md:w-12 md:h-12 text-red-600" />
              <span className="text-red-600 text-3xl md:text-4xl">خاطئة:</span>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-red-700">{totalQuestions - correctAnswers}</div>
          </div>
          
          <div className="text-center p-6 bg-blue-100 rounded-3xl border-3 border-blue-200">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Target className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
              <span className="text-blue-600 text-3xl md:text-4xl">النسبة المئوية:</span>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-blue-700">{scorePercentage}%</div>
          </div>
        </div>

        {/* Performance message - Enhanced */}
        <div className={`p-6 md:p-8 rounded-3xl border-4 text-center ${
          scorePercentage >= 70 
            ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
            : 'bg-yellow-100 border-yellow-300 text-yellow-800'
        }`}>
          <div className="font-extrabold text-3xl md:text-4xl flex items-center justify-center gap-4">
            {scorePercentage >= 90 && <><span className="text-5xl">🏆</span> أداء ممتاز!</>}
            {scorePercentage >= 80 && scorePercentage < 90 && <><span className="text-5xl">🌟</span> أداء جيد جداً!</>}
            {scorePercentage >= 70 && scorePercentage < 80 && <><span className="text-5xl">✅</span> أداء جيد</>}
            {scorePercentage >= 60 && scorePercentage < 70 && <><span className="text-5xl">⚠️</span> يحتاج مراجعة</>}
            {scorePercentage < 60 && <><span className="text-5xl">📚</span> يحتاج تدريب إضافي</>}
          </div>
        </div>
      </div>

      {/* Questions List - Mobile-First Design */}
      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 mb-8 gap-6">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">مراجعة الأسئلة</h3>
          <Badge variant="outline" className="text-2xl md:text-3xl px-6 py-3">
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
              className={`border-4 rounded-3xl max-w-full overflow-hidden transition-all ${
                userAnswer.is_correct 
                  ? 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/50' 
                  : 'border-red-300 bg-red-50/30 hover:bg-red-50/50'
              }`}
            >
              <CardContent className="p-0">
                <div 
                  className="flex items-start gap-6 p-6 md:p-8 active:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => toggleQuestion(userAnswer.question_id)}
                >
                  {/* Status icon - Mobile Optimized */}
                  <div className="relative flex-shrink-0 mt-2">
                    {userAnswer.is_correct ? (
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500 rounded-full flex items-center justify-center">
                        <XCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <h5 className="font-extrabold text-3xl md:text-4xl text-gray-900">
                            السؤال {index + 1}
                          </h5>
                          <Badge 
                            variant={userAnswer.is_correct ? "secondary" : "destructive"}
                            className="text-2xl md:text-3xl px-5 py-2.5"
                          >
                            {userAnswer.is_correct ? '✓ صحيح' : '✗ خطأ'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-800 text-2xl md:text-3xl font-bold break-words leading-relaxed">
                          {question?.question_text}
                        </p>
                      </div>
                      <div className="mt-2">
                        {isExpanded ? (
                          <ChevronUp className="w-12 h-12 md:w-14 md:h-14 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-12 h-12 md:w-14 md:h-14 text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Quick summary - Mobile Optimized */}
                    <div className="mt-6 space-y-6 md:space-y-8">
                      <div className="flex flex-col gap-3">
                        <span className="text-gray-700 text-2xl md:text-3xl">إجابتك:</span>
                        <div className={`flex items-center gap-5 p-5 md:p-6 rounded-2xl text-2xl md:text-3xl ${
                          userAnswer.is_correct 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userAnswer.is_correct ? 
                            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" /> : 
                            <XCircle className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
                          }
                          <span className="font-bold break-words text-left flex-1">
                            {selectedOption ? 
                              `${String.fromCharCode(65 + selectedOption.option_index)}) ${selectedOption.option_text}` : 
                              'لم تُجب على السؤال'
                            }
                          </span>
                        </div>
                      </div>
                      
                      {!userAnswer.is_correct && correctOption && (
                        <div className="flex flex-col gap-3">
                          <span className="text-gray-700 text-2xl md:text-3xl">الإجابة الصحيحة:</span>
                          <div className="flex items-center gap-5 p-5 md:p-6 bg-emerald-100 text-emerald-800 rounded-2xl text-2xl md:text-3xl">
                            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
                            <span className="font-bold break-words text-left flex-1">
                              {String.fromCharCode(65 + correctOption.option_index)}) {correctOption.option_text}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Mobile Optimized */}
                {isExpanded && (
                  <div className="mt-0 space-y-8 border-t-2 border-gray-200 p-6 md:p-8">
                    <h6 className="font-extrabold text-gray-900 text-3xl md:text-4xl flex items-center gap-4 mb-6">
                      <Target className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
                      الخيارات المتاحة:
                    </h6>
                    
                    <div className="space-y-6 md:space-y-8">
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
                            iconElement = <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-2xl md:text-3xl bg-emerald-600 text-white px-5 py-2.5">
                                ✓ الإجابة الصحيحة
                              </Badge>
                            );
                          }

                          if (isUserAnswer && !isCorrectAnswer) {
                            bgColor = 'bg-red-50';
                            textColor = 'text-red-900';
                            iconElement = <XCircle className="w-10 h-10 md:w-12 md:h-12 text-red-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="destructive" className="text-2xl md:text-3xl px-5 py-2.5">
                                ✗ إجابتك
                              </Badge>
                            );
                          }

                          if (isUserAnswer && isCorrectAnswer) {
                            iconElement = <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-2xl md:text-3xl bg-emerald-600 text-white px-5 py-2.5">
                                ✓ إجابتك الصحيحة
                              </Badge>
                            );
                          }

                          return (
                            <div
                              key={option.id}
                              className={`p-6 rounded-3xl border-3 ${bgColor} border-gray-200`}
                            >
                              <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-5">
                                  {iconElement || <div className="w-10 h-10 md:w-12 md:h-12"></div>}
                                  <span className={`${textColor} text-2xl md:text-3xl font-bold break-words flex-1 leading-relaxed`}>
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
                      <div className="bg-blue-50 border-r-5 border-blue-600 p-6 md:p-8 rounded-3xl mt-8">
                        <div className="flex items-start gap-5">
                          <Lightbulb className="w-12 h-12 md:w-14 md:h-14 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h6 className="font-extrabold text-blue-900 text-3xl md:text-4xl mb-4 flex items-center gap-3">
                              <span>💡</span> شرح تفصيلي:
                            </h6>
                            <p className="text-blue-800 text-2xl md:text-3xl break-words leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!userAnswer.is_correct && (
                      <div className="bg-yellow-50 border-r-5 border-yellow-600 p-6 md:p-8 rounded-3xl mt-8">
                        <div className="flex items-start gap-5">
                          <AlertCircle className="w-12 h-12 md:w-14 md:h-14 text-yellow-600 flex-shrink-0 mt-1" />
                          <div>
                            <h6 className="font-extrabold text-yellow-900 text-3xl md:text-4xl mb-4 flex items-center gap-3">
                              <span>🎯</span> نصيحة للتحسين:
                            </h6>
                            <p className="text-yellow-800 text-2xl md:text-3xl break-words leading-relaxed">
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
