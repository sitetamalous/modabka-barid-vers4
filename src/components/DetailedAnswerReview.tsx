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
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
        <span className="text-gray-600 text-lg text-center">
          جاري تحميل تفاصيل الإجابات...
        </span>
        <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden mt-6">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          لا توجد بيانات متاحة
        </h3>
        <p className="text-gray-600 text-lg">
          لا توجد تفاصيل متاحة لهذا الاختبار
        </p>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
  const totalQuestions = userAnswers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-6 space-y-6" dir="rtl">
      {/* Summary Section - Mobile Optimized */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {scorePercentage >= 70 ? (
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="text-center sm:text-right">
              <h4 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                النتيجة: {scorePercentage}%
              </h4>
              <p className="text-gray-700 text-lg mt-1">
                {correctAnswers} صحيح من {totalQuestions}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
            <Button 
              variant="outline" 
              size="sm"
              onClick={expandAll} 
              className="text-sm px-4 py-2"
            >
              <ChevronDown className="w-4 h-4 ml-2" />
              توسيع الكل
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={collapseAll} 
              className="text-sm px-4 py-2"
            >
              <ChevronUp className="w-4 h-4 ml-2" />
              طي الكل
            </Button>
          </div>
        </div>

        {/* Performance indicators - Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-emerald-100 rounded-xl border-2 border-emerald-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-600 text-sm font-semibold">صحيحة:</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">{correctAnswers}</div>
          </div>
          
          <div className="text-center p-3 bg-red-100 rounded-xl border-2 border-red-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-600 text-sm font-semibold">خاطئة:</span>
            </div>
            <div className="text-2xl font-extrabold text-red-700">{totalQuestions - correctAnswers}</div>
          </div>
          
          <div className="text-center p-3 bg-blue-100 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 text-sm font-semibold">النسبة:</span>
            </div>
            <div className="text-2xl font-extrabold text-blue-700">{scorePercentage}%</div>
          </div>
        </div>

        {/* Performance message */}
        <div className={`p-4 rounded-2xl border-2 text-center ${
          scorePercentage >= 70 
            ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
            : 'bg-yellow-100 border-yellow-300 text-yellow-800'
        }`}>
          <div className="font-bold text-lg flex items-center justify-center gap-2">
            {scorePercentage >= 90 && <><span className="text-2xl">🏆</span> أداء ممتاز!</>}
            {scorePercentage >= 80 && scorePercentage < 90 && <><span className="text-2xl">🌟</span> أداء جيد جداً!</>}
            {scorePercentage >= 70 && scorePercentage < 80 && <><span className="text-2xl">✅</span> أداء جيد</>}
            {scorePercentage >= 60 && scorePercentage < 70 && <><span className="text-2xl">⚠️</span> يحتاج مراجعة</>}
            {scorePercentage < 60 && <><span className="text-2xl">📚</span> يحتاج تدريب إضافي</>}
          </div>
        </div>
      </div>

      {/* Questions List - Mobile-First Design */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 mb-4 gap-3">
          <h3 className="text-xl font-extrabold text-gray-900">مراجعة الأسئلة</h3>
          <Badge variant="outline" className="text-sm px-3 py-1">
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
              className={`border-2 rounded-2xl overflow-hidden transition-all ${
                userAnswer.is_correct 
                  ? 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/50' 
                  : 'border-red-300 bg-red-50/30 hover:bg-red-50/50'
              }`}
            >
              <CardContent className="p-0">
                <div 
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleQuestion(userAnswer.question_id)}
                >
                  {/* Status icon - Mobile Optimized */}
                  <div className="relative flex-shrink-0">
                    {userAnswer.is_correct ? (
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="font-bold text-lg text-gray-900">
                            السؤال {index + 1}
                          </h5>
                          <Badge 
                            variant={userAnswer.is_correct ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {userAnswer.is_correct ? '✓ صحيح' : '✗ خطأ'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-800 text-sm font-medium break-words leading-relaxed">
                          {question?.question_text}
                        </p>
                      </div>
                      <div className="mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Quick summary - Mobile Optimized */}
                    <div className="mt-3 space-y-3">
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-700 text-sm font-medium">إجابتك:</span>
                        <div className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                          userAnswer.is_correct 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userAnswer.is_correct ? 
                            <CheckCircle className="w-4 h-4 flex-shrink-0" /> : 
                            <XCircle className="w-4 h-4 flex-shrink-0" />
                          }
                          <span className="font-medium break-words flex-1">
                            {selectedOption ? 
                              `${String.fromCharCode(65 + selectedOption.option_index)}) ${selectedOption.option_text}` : 
                              'لم تُجب على السؤال'
                            }
                          </span>
                        </div>
                      </div>
                      
                      {!userAnswer.is_correct && correctOption && (
                        <div className="flex flex-col gap-2">
                          <span className="text-gray-700 text-sm font-medium">الإجابة الصحيحة:</span>
                          <div className="flex items-center gap-2 p-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium break-words flex-1">
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
                  <div className="border-t-2 border-gray-200 p-4 space-y-4">
                    <h6 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      الخيارات المتاحة:
                    </h6>
                    
                    <div className="space-y-3">
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
                            iconElement = <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-xs bg-emerald-600 text-white">
                                ✓ الإجابة الصحيحة
                              </Badge>
                            );
                          }

                          if (isUserAnswer && !isCorrectAnswer) {
                            bgColor = 'bg-red-50';
                            textColor = 'text-red-900';
                            iconElement = <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="destructive" className="text-xs">
                                ✗ إجابتك
                              </Badge>
                            );
                          }

                          if (isUserAnswer && isCorrectAnswer) {
                            iconElement = <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-xs bg-emerald-600 text-white">
                                ✓ إجابتك الصحيحة
                              </Badge>
                            );
                          }

                          return (
                            <div
                              key={option.id}
                              className={`p-3 rounded-2xl border-2 ${bgColor} border-gray-200`}
                            >
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                  {iconElement || <div className="w-5 h-5"></div>}
                                  <span className={`${textColor} text-sm font-medium break-words flex-1 leading-relaxed`}>
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
                      <div className="bg-blue-50 border-r-4 border-blue-600 p-4 rounded-2xl mt-4">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h6 className="font-bold text-blue-900 text-lg mb-2 flex items-center gap-2">
                              <span>💡</span> شرح تفصيلي:
                            </h6>
                            <p className="text-blue-800 text-sm break-words leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!userAnswer.is_correct && (
                      <div className="bg-yellow-50 border-r-4 border-yellow-600 p-4 rounded-2xl mt-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                          <div>
                            <h6 className="font-bold text-yellow-900 text-lg mb-2 flex items-center gap-2">
                              <span>🎯</span> نصيحة للتحسين:
                            </h6>
                            <p className="text-yellow-800 text-sm break-words leading-relaxed">
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
