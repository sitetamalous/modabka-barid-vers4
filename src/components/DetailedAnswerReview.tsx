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
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
      <div className="flex flex-col items-center justify-center py-12 px-2">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 animate-pulse">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mb-2" />
        <span className="text-gray-600 text-sm sm:text-base text-center">جاري تحميل تفاصيل الإجابات...</span>
        <div className="w-40 max-w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-12 px-2">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">لا توجد بيانات متاحة</h3>
        <p className="text-gray-600 text-sm">لا توجد تفاصيل متاحة لهذا الاختبار</p>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
  const totalQuestions = userAnswers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="space-y-4 px-2 max-w-full overflow-x-hidden" dir="rtl">
      {/* Summary Section - Fully Responsive */}
      <div className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border-2 border-emerald-200 shadow-sm">
        <div className="flex flex-col items-center gap-3 mb-3">
          <div className="flex items-center gap-3">
            {scorePercentage >= 70 ? (
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="text-center min-w-0">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                النتيجة: {scorePercentage}%
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                {correctAnswers} صحيح من {totalQuestions}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={expandAll} 
              className="text-xs px-2 py-1"
            >
              <ChevronDown className="w-3 h-3 ml-1" />
              توسيع الكل
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={collapseAll} 
              className="text-xs px-2 py-1"
            >
              <ChevronUp className="w-3 h-3 ml-1" />
              طي الكل
            </Button>
          </div>
        </div>

        {/* Performance indicators - Horizontal layout for all screens */}
        <div className="flex justify-between gap-1 mb-3">
          <div className="flex-1 text-center p-1 sm:p-2 bg-emerald-100 rounded-lg border border-emerald-200">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 mx-auto mb-0.5 sm:mb-1" />
            <div className="text-xs sm:text-sm font-bold text-emerald-700">{correctAnswers}</div>
            <div className="text-[10px] sm:text-xs text-emerald-600">صحيحة</div>
          </div>
          <div className="flex-1 text-center p-1 sm:p-2 bg-red-100 rounded-lg border border-red-200">
            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 mx-auto mb-0.5 sm:mb-1" />
            <div className="text-xs sm:text-sm font-bold text-red-700">{totalQuestions - correctAnswers}</div>
            <div className="text-[10px] sm:text-xs text-red-600">خاطئة</div>
          </div>
          <div className="flex-1 text-center p-1 sm:p-2 bg-blue-100 rounded-lg border border-blue-200">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mx-auto mb-0.5 sm:mb-1" />
            <div className="text-xs sm:text-sm font-bold text-blue-700">{scorePercentage}%</div>
            <div className="text-[10px] sm:text-xs text-blue-600">النسبة</div>
          </div>
        </div>

        {/* Performance message */}
        <div className={`p-2 rounded-lg border-2 text-xs sm:text-sm text-center ${
          scorePercentage >= 70 
            ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
            : 'bg-yellow-100 border-yellow-300 text-yellow-800'
        }`}>
          {scorePercentage >= 90 && "🏆 ممتاز!"}
          {scorePercentage >= 80 && scorePercentage < 90 && "🌟 جيد جداً!"}
          {scorePercentage >= 70 && scorePercentage < 80 && "✅ جيد"}
          {scorePercentage >= 60 && scorePercentage < 70 && "⚠️ يحتاج مراجعة"}
          {scorePercentage < 60 && "📚 يحتاج تدريب إضافي"}
        </div>
      </div>

      {/* Questions List - Fully Responsive */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">مراجعة الأسئلة</h3>
          <Badge variant="outline" className="text-xs">
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
              className={`border max-w-full overflow-hidden ${
                userAnswer.is_correct 
                  ? 'border-emerald-300 bg-emerald-50/50' 
                  : 'border-red-300 bg-red-50/50'
              }`}
            >
              <CardContent className="p-3">
                <div 
                  className="flex items-start gap-2 cursor-pointer"
                  onClick={() => toggleQuestion(userAnswer.question_id)}
                >
                  {/* Status icon - small and compact */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    {userAnswer.is_correct ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <h5 className="font-bold text-xs sm:text-sm text-gray-900">
                            السؤال {index + 1}
                          </h5>
                          <Badge 
                            variant={userAnswer.is_correct ? "secondary" : "destructive"}
                            className="text-[10px] px-1 py-0 leading-none"
                          >
                            {userAnswer.is_correct ? '✓ صحيح' : '✗ خطأ'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-800 text-xs sm:text-sm font-medium mt-1 break-words">
                          {question?.question_text}
                        </p>
                      </div>
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Quick summary */}
                    <div className="mt-2 space-y-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-gray-600 text-[10px] sm:text-xs">إجابتك:</span>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          userAnswer.is_correct 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userAnswer.is_correct ? 
                            <CheckCircle className="w-3 h-3" /> : 
                            <XCircle className="w-3 h-3" />
                          }
                          <span className="font-semibold truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs">
                            {selectedOption ? 
                              `${String.fromCharCode(65 + selectedOption.option_index)}) ${selectedOption.option_text}` : 
                              'لم تُجب'
                            }
                          </span>
                        </div>
                      </div>
                      
                      {!userAnswer.is_correct && correctOption && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-gray-600 text-[10px] sm:text-xs">الصحيحة:</span>
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span className="font-semibold truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs">
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
                  <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                    <h6 className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-1 mb-1">
                      <Target className="w-3 h-3 text-blue-600" />
                      الخيارات:
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
                          iconElement = <CheckCircle className="w-3 h-3 text-emerald-600" />;
                          badgeContent = (
                            <Badge variant="secondary" className="text-[10px] bg-emerald-600 text-white px-1 py-0">
                              ✓ صحيح
                            </Badge>
                          );
                        }

                        if (isUserAnswer && !isCorrectAnswer) {
                          borderColor = 'border-red-400 bg-red-100';
                          textColor = 'text-red-900';
                          iconElement = <XCircle className="w-3 h-3 text-red-600" />;
                          badgeContent = (
                            <Badge variant="destructive" className="text-[10px] px-1 py-0">
                              ✗ خطأ
                            </Badge>
                          );
                        }

                        if (isUserAnswer && isCorrectAnswer) {
                          iconElement = <CheckCircle className="w-3 h-3 text-emerald-600" />;
                          badgeContent = (
                            <Badge variant="secondary" className="text-[10px] bg-emerald-600 text-white px-1 py-0">
                              ✓ صحيح
                            </Badge>
                          );
                        }

                        return (
                          <div
                            key={option.id}
                            className={`p-2 rounded border ${borderColor} mb-1`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex items-start gap-1 flex-1 min-w-0">
                                {iconElement || <span className="w-3 h-3"></span>}
                                <span className={`${textColor} text-xs sm:text-sm break-words flex-1`}>
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

                    {question?.explanation && (
                      <div className="bg-blue-50 border-r-2 border-blue-400 p-2 rounded mt-2">
                        <div className="flex items-start gap-1">
                          <Lightbulb className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-blue-800 text-xs sm:text-sm break-words">
                            <span className="font-bold">شرح: </span>
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {!userAnswer.is_correct && (
                      <div className="bg-yellow-50 border-r-2 border-yellow-400 p-2 rounded mt-2">
                        <div className="flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-yellow-800 text-xs sm:text-sm break-words">
                            <span className="font-bold">نصيحة: </span>
                            راجع الموضوع لتحسين أدائك
                          </p>
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
