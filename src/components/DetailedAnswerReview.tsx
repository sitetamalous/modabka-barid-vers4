import { useState } from 'react';
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
  BookOpen,
  Clock
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
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
        <span className="text-gray-600 text-lg">جاري تحميل تفاصيل الإجابات...</span>
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد بيانات متاحة</h3>
        <p className="text-gray-600">لا توجد تفاصيل متاحة لهذا الاختبار</p>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
  const totalQuestions = userAnswers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Enhanced Summary with Performance Analysis */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border-2 border-emerald-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {scorePercentage >= 70 ? (
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                النتيجة النهائية: {scorePercentage}%
              </h4>
              <p className="text-gray-600 text-lg">
                {correctAnswers} إجابة صحيحة من أصل {totalQuestions} سؤال
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={expandAll} className="text-sm">
              <ChevronDown className="w-4 h-4 ml-1" />
              توسيع الكل
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll} className="text-sm">
              <ChevronUp className="w-4 h-4 ml-1" />
              طي الكل
            </Button>
          </div>
        </div>

        {/* Performance indicators */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-emerald-100 rounded-xl border border-emerald-200">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-700">{correctAnswers}</div>
            <div className="text-sm text-emerald-600 font-medium">إجابات صحيحة</div>
          </div>
          <div className="text-center p-4 bg-red-100 rounded-xl border border-red-200">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">{totalQuestions - correctAnswers}</div>
            <div className="text-sm text-red-600 font-medium">إجابات خاطئة</div>
          </div>
          <div className="text-center p-4 bg-blue-100 rounded-xl border border-blue-200">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{scorePercentage}%</div>
            <div className="text-sm text-blue-600 font-medium">النسبة المئوية</div>
          </div>
        </div>

        {/* Performance message */}
        <div className={`p-4 rounded-xl border-2 ${scorePercentage >= 70 ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-yellow-100 border-yellow-300 text-yellow-800'}`}>
          <div className="font-bold text-center text-lg">
            {scorePercentage >= 90 && "🏆 أداء ممتاز! تهانينا على هذا الإنجاز الرائع"}
            {scorePercentage >= 80 && scorePercentage < 90 && "🌟 أداء جيد جداً! استمر في التميز"}
            {scorePercentage >= 70 && scorePercentage < 80 && "✅ أداء جيد، يمكن التحسين أكثر"}
            {scorePercentage >= 60 && scorePercentage < 70 && "⚠️ أداء مقبول، يحتاج مراجعة"}
            {scorePercentage < 60 && "📚 يحتاج إلى مراجعة وتدريب إضافي"}
          </div>
        </div>
      </div>

      {/* Questions List with detailed answers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">مراجعة تفصيلية للأسئلة</h3>
          <Badge variant="outline" className="text-sm">
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
              className={`border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                userAnswer.is_correct 
                  ? 'border-emerald-300 bg-emerald-50/70' 
                  : 'border-red-300 bg-red-50/70'
              }`}
            >
              <CardContent className="p-6">
                {/* Question Header with enhanced visual indicators */}
                <div 
                  className="flex items-start gap-4 cursor-pointer group"
                  onClick={() => toggleQuestion(userAnswer.question_id)}
                >
                  <div className="relative flex-shrink-0">
                    {userAnswer.is_correct ? (
                      <div className="relative">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <XCircle className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h5 className="font-bold text-xl text-gray-900">
                          السؤال {index + 1}
                        </h5>
                        <Badge 
                          variant={userAnswer.is_correct ? "secondary" : "destructive"}
                          className="text-sm font-medium px-3 py-1"
                        >
                          {userAnswer.is_correct ? '✓ صحيحة' : '✗ خاطئة'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-800 text-lg font-medium leading-relaxed mb-4">
                      {question?.question_text}
                    </p>

                    {/* Enhanced Quick summary - always visible */}
                    <div className="p-5 bg-white/90 rounded-xl border border-gray-200 shadow-sm">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="text-gray-600 font-medium text-base">إجابتك: </span>
                            <div className={`inline-flex items-center gap-2 mt-2 p-3 rounded-lg ${userAnswer.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {userAnswer.is_correct ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              <span className="font-semibold text-base">
                                {selectedOption ? 
                                  `${String.fromCharCode(65 + selectedOption.option_index)}) ${selectedOption.option_text}` : 
                                  'لم تجب على هذا السؤال'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {!userAnswer.is_correct && correctOption && (
                          <div className="pt-4 border-t border-gray-200">
                            <span className="text-gray-600 font-medium text-base">الإجابة الصحيحة: </span>
                            <div className="inline-flex items-center gap-2 mt-2 p-3 bg-emerald-100 text-emerald-800 rounded-lg">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold text-base">
                                {String.fromCharCode(65 + correctOption.option_index)}) {correctOption.option_text}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Shows all options with clear indicators */}
                {isExpanded && (
                  <div className="mt-8 pr-16 space-y-6 border-t border-gray-200 pt-6">
                    {/* All Answer Options with enhanced visual indicators */}
                    <div className="space-y-4">
                      <h6 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        جميع الخيارات المتاحة:
                      </h6>
                      {question?.answer_options
                        ?.sort((a, b) => a.option_index - b.option_index)
                        .map((option) => {
                          const isUserAnswer = option.id === userAnswer.selected_option_id;
                          const isCorrectAnswer = option.is_correct;
                          
                          let borderColor = 'border-gray-300 bg-gray-50';
                          let textColor = 'text-gray-700';
                          let badgeContent = null;
                          let iconElement = null;

                          if (isCorrectAnswer) {
                            borderColor = 'border-emerald-400 bg-emerald-100';
                            textColor = 'text-emerald-900';
                            iconElement = <CheckCircle className="w-6 h-6 text-emerald-600" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-sm bg-emerald-600 text-white">
                                ✓ الإجابة الصحيحة
                              </Badge>
                            );
                          }

                          if (isUserAnswer && !isCorrectAnswer) {
                            borderColor = 'border-red-400 bg-red-100';
                            textColor = 'text-red-900';
                            iconElement = <XCircle className="w-6 h-6 text-red-600" />;
                            badgeContent = (
                              <Badge variant="destructive" className="text-sm">
                                ✗ إجابتك الخاطئة
                              </Badge>
                            );
                          }

                          if (isUserAnswer && isCorrectAnswer) {
                            iconElement = <CheckCircle className="w-6 h-6 text-emerald-600" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-sm bg-emerald-600 text-white">
                                ✓ إجابتك الصحيحة
                              </Badge>
                            );
                          }

                          return (
                            <div
                              key={option.id}
                              className={`p-5 rounded-xl border-2 ${borderColor} shadow-sm transition-all duration-200`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  {iconElement}
                                  <span className={`${textColor} font-semibold text-lg`}>
                                    {String.fromCharCode(65 + option.option_index)}) {option.option_text}
                                  </span>
                                </div>
                                {badgeContent}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Enhanced Explanation if available */}
                    {question?.explanation && (
                      <div className="bg-blue-50 border-r-4 border-blue-400 p-5 rounded-lg shadow-sm">
                        <div className="flex items-start gap-4">
                          <Lightbulb className="w-7 h-7 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h6 className="font-bold text-blue-900 mb-3 text-lg">💡 شرح تفصيلي:</h6>
                            <p className="text-blue-800 leading-relaxed text-lg">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Performance Tip for wrong answers */}
                    {!userAnswer.is_correct && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-r-4 border-yellow-400 p-5 rounded-lg shadow-sm">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-7 h-7 text-yellow-600 flex-shrink-0 mt-1" />
                          <div>
                            <h6 className="font-bold text-yellow-900 mb-3 text-lg">🎯 نصيحة للتحسين:</h6>
                            <p className="text-yellow-800 text-lg leading-relaxed">
                              راجع هذا الموضوع مرة أخرى وتأكد من فهم المفاهيم الأساسية لتحسين أداءك في الاختبارات القادمة.
                            </p>
                            {correctOption && (
                              <div className="mt-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                                <span className="font-bold text-yellow-900 text-lg">
                                  💡 تذكر: الإجابة الصحيحة هي "{correctOption.option_text}"
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success message for correct answers */}
                    {userAnswer.is_correct && (
                      <div className="bg-emerald-50 border-r-4 border-emerald-400 p-5 rounded-lg shadow-sm">
                        <div className="flex items-start gap-4">
                          <Award className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-1" />
                          <div>
                            <h6 className="font-bold text-emerald-900 mb-2 text-lg">🎉 أحسنت!</h6>
                            <p className="text-emerald-800 text-lg">
                              إجابة ممتازة! لقد أظهرت فهماً جيداً للموضوع.
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