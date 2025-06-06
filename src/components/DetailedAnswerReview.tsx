
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
  Loader2
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
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
        <span className="text-gray-600">جاري تحميل تفاصيل الإجابات...</span>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">لا توجد تفاصيل متاحة لهذا الاختبار</p>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
  const totalQuestions = userAnswers.length;

  return (
    <div className="space-y-4" dir="rtl">
      {/* Summary */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
        <div>
          <h4 className="font-semibold text-gray-900">ملخص الإجابات التفصيلي</h4>
          <p className="text-sm text-gray-600">
            {correctAnswers} إجابة صحيحة من أصل {totalQuestions} سؤال
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            توسيع الكل
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            طي الكل
          </Button>
        </div>
      </div>

      {/* Questions List with detailed answers */}
      <div className="space-y-3">
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
              className={`border-2 transition-all ${
                userAnswer.is_correct 
                  ? 'border-emerald-200 bg-emerald-50/50' 
                  : 'border-red-200 bg-red-50/50'
              }`}
            >
              <CardContent className="p-4">
                {/* Question Header with answer status */}
                <div 
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => toggleQuestion(userAnswer.question_id)}
                >
                  {userAnswer.is_correct ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-lg">
                        السؤال {index + 1}
                      </h5>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={userAnswer.is_correct ? "default" : "destructive"}
                        >
                          {userAnswer.is_correct ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mt-2 text-base">
                      {question?.question_text}
                    </p>

                    {/* Quick summary - always visible */}
                    <div className="mt-3 p-3 bg-white/80 rounded-lg border">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-gray-600">إجابتك: </span>
                          <span className={userAnswer.is_correct ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                            {selectedOption ? 
                              `${String.fromCharCode(65 + selectedOption.option_index)}) ${selectedOption.option_text}` : 
                              'لم تجب على هذا السؤال'
                            }
                          </span>
                        </div>
                      </div>
                      
                      {!userAnswer.is_correct && correctOption && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <span className="text-gray-600">الإجابة الصحيحة: </span>
                          <span className="text-emerald-600 font-medium">
                            {String.fromCharCode(65 + correctOption.option_index)}) {correctOption.option_text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Shows all options with indicators */}
                {isExpanded && (
                  <div className="mt-4 pr-9 space-y-4">
                    {/* All Answer Options with clear indicators */}
                    <div className="space-y-3">
                      <h6 className="font-medium text-gray-900 text-base">جميع الخيارات المتاحة:</h6>
                      {question?.answer_options
                        ?.sort((a, b) => a.option_index - b.option_index)
                        .map((option) => {
                          const isUserAnswer = option.id === userAnswer.selected_option_id;
                          const isCorrectAnswer = option.is_correct;
                          
                          let borderColor = 'border-gray-200 bg-gray-50';
                          let textColor = 'text-gray-700';
                          let badgeContent = null;

                          if (isCorrectAnswer) {
                            borderColor = 'border-emerald-300 bg-emerald-100';
                            textColor = 'text-emerald-800';
                            badgeContent = (
                              <Badge variant="default" className="text-xs bg-emerald-600">
                                ✓ الإجابة الصحيحة
                              </Badge>
                            );
                          }

                          if (isUserAnswer && !isCorrectAnswer) {
                            borderColor = 'border-red-300 bg-red-100';
                            textColor = 'text-red-800';
                            badgeContent = (
                              <Badge variant="destructive" className="text-xs">
                                ✗ إجابتك الخاطئة
                              </Badge>
                            );
                          }

                          if (isUserAnswer && isCorrectAnswer) {
                            badgeContent = (
                              <Badge variant="default" className="text-xs bg-emerald-600">
                                ✓ إجابتك الصحيحة
                              </Badge>
                            );
                          }

                          return (
                            <div
                              key={option.id}
                              className={`p-4 rounded-lg border-2 ${borderColor}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`${textColor} font-medium`}>
                                  {String.fromCharCode(65 + option.option_index)}) {option.option_text}
                                </span>
                                {badgeContent}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Explanation if available */}
                    {question?.explanation && (
                      <div className="bg-blue-50 border-r-4 border-blue-400 p-4 rounded">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h6 className="font-medium text-blue-900 mb-1">شرح تفصيلي:</h6>
                            <p className="text-blue-800 leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Performance Tip for wrong answers */}
                    {!userAnswer.is_correct && (
                      <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h6 className="font-medium text-yellow-900 mb-1">نصيحة للتحسين:</h6>
                            <p className="text-yellow-800 text-sm">
                              راجع هذا الموضوع مرة أخرى لتحسين أداءك في الاختبارات القادمة.
                              {correctOption && (
                                <span className="block mt-2 font-medium">
                                  💡 تذكر: الإجابة الصحيحة هي "{correctOption.option_text}"
                                </span>
                              )}
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
