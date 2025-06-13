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

// Mock UI components for demonstration
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 bg-white text-gray-700"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  onClick 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "outline";
  size?: "default" | "lg";
  className?: string;
  onClick?: () => void;
}) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
  };
  
  const sizes = {
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Mock hook for demonstration
const useUserAnswers = (attemptId: string) => {
  return {
    data: [
      {
        id: '1',
        question_id: 'q1',
        selected_option_id: 'opt1',
        is_correct: true,
        questions: {
          question_text: 'ما هي عاصمة فرنسا؟',
          explanation: 'باريس هي عاصمة فرنسا وأكبر مدنها، وتقع في شمال وسط فرنسا على نهر السين.',
          answer_options: [
            { id: 'opt1', option_index: 0, option_text: 'باريس', is_correct: true },
            { id: 'opt2', option_index: 1, option_text: 'لندن', is_correct: false },
            { id: 'opt3', option_index: 2, option_text: 'برلين', is_correct: false },
            { id: 'opt4', option_index: 3, option_text: 'مدريد', is_correct: false }
          ]
        }
      },
      {
        id: '2',
        question_id: 'q2',
        selected_option_id: 'opt6',
        is_correct: false,
        questions: {
          question_text: 'كم عدد القارات في العالم؟',
          explanation: 'يوجد سبع قارات في العالم: آسيا، أفريقيا، أمريكا الشمالية، أمريكا الجنوبية، أوروبا، أوقيانوسيا، والقارة القطبية الجنوبية.',
          answer_options: [
            { id: 'opt5', option_index: 0, option_text: '7', is_correct: true },
            { id: 'opt6', option_index: 1, option_text: '5', is_correct: false },
            { id: 'opt7', option_index: 2, option_text: '6', is_correct: false },
            { id: 'opt8', option_index: 3, option_text: '8', is_correct: false }
          ]
        }
      }
    ],
    isLoading: false
  };
};

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
      <div className="flex flex-col items-center justify-center py-20 px-6 lg:py-32">
        <div className="w-28 h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
          <BookOpen className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
        </div>
        <Loader2 className="w-16 h-16 lg:w-20 lg:h-20 animate-spin text-emerald-600 mb-6" />
        <span className="text-gray-600 text-3xl lg:text-4xl text-center font-medium">
          جاري تحميل تفاصيل الإجابات...
        </span>
        <div className="w-80 lg:w-96 h-4 lg:h-6 bg-gray-200 rounded-full overflow-hidden mt-10">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-20 px-6 lg:py-32">
        <div className="w-28 h-28 lg:w-36 lg:h-36 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-16 h-16 lg:w-20 lg:h-20 text-gray-400" />
        </div>
        <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          لا توجد بيانات متاحة
        </h3>
        <p className="text-gray-600 text-3xl lg:text-4xl">
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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-20 space-y-12 lg:space-y-20" dir="rtl">
        {/* Enhanced Summary Section */}
        <div className="bg-white rounded-3xl lg:rounded-4xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 p-10 lg:p-16">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-12">
              <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-12">
                {scorePercentage >= 70 ? (
                  <div className="w-28 h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Award className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
                  </div>
                ) : (
                  <div className="w-28 h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Target className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
                  </div>
                )}
                <div className="text-center sm:text-right">
                  <h4 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4">
                    النتيجة: {scorePercentage}%
                  </h4>
                  <p className="text-gray-600 text-3xl lg:text-4xl">
                    {correctAnswers} صحيح من {totalQuestions}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={expandAll} 
                  className="text-2xl px-10 py-6 h-auto font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  <ChevronDown className="w-8 h-8 ml-3" />
                  توسيع الكل
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={collapseAll} 
                  className="text-2xl px-10 py-6 h-auto font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  <ChevronUp className="w-8 h-8 ml-3" />
                  طي الكل
                </Button>
              </div>
            </div>

            {/* Enhanced Performance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-10 lg:p-12 bg-emerald-100 rounded-3xl border-2 border-emerald-200 shadow-lg">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <CheckCircle className="w-10 h-10 lg:w-12 lg:h-12 text-emerald-600" />
                  <span className="text-emerald-700 text-2xl lg:text-3xl font-semibold">صحيحة:</span>
                </div>
                <div className="text-5xl lg:text-6xl font-bold text-emerald-800">{correctAnswers}</div>
              </div>
              
              <div className="text-center p-10 lg:p-12 bg-red-100 rounded-3xl border-2 border-red-200 shadow-lg">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <XCircle className="w-10 h-10 lg:w-12 lg:h-12 text-red-600" />
                  <span className="text-red-700 text-2xl lg:text-3xl font-semibold">خاطئة:</span>
                </div>
                <div className="text-5xl lg:text-6xl font-bold text-red-800">{totalQuestions - correctAnswers}</div>
              </div>
              
              <div className="text-center p-10 lg:p-12 bg-blue-100 rounded-3xl border-2 border-blue-200 shadow-lg sm:col-span-1">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Target className="w-10 h-10 lg:w-12 lg:h-12 text-blue-600" />
                  <span className="text-blue-700 text-2xl lg:text-3xl font-semibold">النسبة المئوية:</span>
                </div>
                <div className="text-5xl lg:text-6xl font-bold text-blue-800">{scorePercentage}%</div>
              </div>
            </div>

            {/* Enhanced Performance Message */}
            <div className={`p-10 lg:p-12 rounded-3xl border-2 text-center shadow-lg ${
              scorePercentage >= 70 
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                : 'bg-yellow-100 border-yellow-300 text-yellow-800'
            }`}>
              <div className="font-bold text-3xl lg:text-4xl">
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
        <div className="space-y-10 lg:space-y-12">
          <div className="flex items-center justify-between px-4 mb-8">
            <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900">مراجعة الأسئلة</h3>
            <Badge variant="outline" className="text-2xl lg:text-3xl px-6 py-3 font-semibold">
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
                className={`border-2 rounded-3xl lg:rounded-4xl overflow-hidden transition-all duration-200 shadow-xl hover:shadow-2xl ${
                  userAnswer.is_correct 
                    ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50/70' 
                    : 'border-red-300 bg-red-50/50 hover:bg-red-50/70'
                }`}
              >
                <CardContent className="p-0">
                  <div 
                    className="flex items-start gap-8 p-10 lg:p-12 cursor-pointer active:bg-gray-100/50 transition-colors"
                    onClick={() => toggleQuestion(userAnswer.question_id)}
                  >
                    {/* Enhanced Status Icon */}
                    <div className="relative flex-shrink-0 mt-3">
                      {userAnswer.is_correct ? (
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-xl">
                          <CheckCircle className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-red-500 rounded-3xl flex items-center justify-center shadow-xl">
                          <XCircle className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4 flex-wrap mb-6">
                            <h5 className="font-bold text-3xl lg:text-4xl text-gray-900">
                              السؤال {index + 1}
                            </h5>
                            <Badge 
                              variant={userAnswer.is_correct ? "secondary" : "destructive"}
                              className="text-xl lg:text-2xl px-5 py-2 font-semibold"
                            >
                              {userAnswer.is_correct ? '✓ صحيح' : '✗ خطأ'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-800 text-2xl lg:text-3xl xl:text-4xl font-medium leading-relaxed break-words">
                            {question?.question_text}
                          </p>
                        </div>
                        <div className="mt-3">
                          {isExpanded ? (
                            <ChevronUp className="w-12 h-12 lg:w-14 lg:h-14 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-12 h-12 lg:w-14 lg:h-14 text-gray-500" />
                          )}
                        </div>
                      </div>

                      {/* Enhanced Quick Summary */}
                      <div className="mt-8 space-y-8">
                        <div className="flex flex-col gap-4">
                          <span className="text-gray-600 text-2xl lg:text-3xl font-medium">إجابتك:</span>
                          <div className={`flex items-center gap-6 p-6 lg:p-8 rounded-2xl text-2xl lg:text-3xl shadow-lg ${
                            userAnswer.is_correct 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {userAnswer.is_correct ? 
                              <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0" /> : 
                              <XCircle className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0" />
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
                          <div className="flex flex-col gap-4">
                            <span className="text-gray-600 text-2xl lg:text-3xl font-medium">الإجابة الصحيحة:</span>
                            <div className="flex items-center gap-6 p-6 lg:p-8 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-2xl lg:text-3xl shadow-lg">
                              <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0" />
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
                    <div className="border-t border-gray-200 p-10 lg:p-12 space-y-10 lg:space-y-12 bg-white/50">
                      <h6 className="font-bold text-gray-900 text-3xl lg:text-4xl flex items-center gap-4 mb-8">
                        <Target className="w-10 h-10 lg:w-12 lg:h-12 text-blue-600" />
                        الخيارات المتاحة:
                      </h6>
                      
                      <div className="space-y-6 lg:space-y-8">
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
                              iconElement = <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-600 flex-shrink-0" />;
                              badgeContent = (
                                <Badge variant="secondary" className="text-xl lg:text-2xl bg-emerald-600 text-white px-6 py-3 font-semibold">
                                  ✓ الإجابة الصحيحة
                                </Badge>
                              );
                            }

                            if (isUserAnswer && !isCorrectAnswer) {
                              bgColor = 'bg-red-50';
                              textColor = 'text-red-900';
                              borderColor = 'border-red-200';
                              iconElement = <XCircle className="w-8 h-8 lg:w-10 lg:h-10 text-red-600 flex-shrink-0" />;
                              badgeContent = (
                                <Badge variant="destructive" className="text-xl lg:text-2xl px-6 py-3 font-semibold">
                                  ✗ إجابتك
                                </Badge>
                              );
                            }

                            if (isUserAnswer && isCorrectAnswer) {
                              iconElement = <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-600 flex-shrink-0" />;
                              badgeContent = (
                                <Badge variant="secondary" className="text-xl lg:text-2xl bg-emerald-600 text-white px-6 py-3 font-semibold">
                                  ✓ إجابتك الصحيحة
                                </Badge>
                              );
                            }

                            return (
                              <div
                                key={option.id}
                                className={`p-8 lg:p-10 rounded-2xl border-2 ${bgColor} ${borderColor} shadow-lg`}
                              >
                                <div className="flex flex-col gap-6">
                                  <div className="flex items-center gap-6">
                                    {iconElement || <div className="w-8 h-8 lg:w-10 lg:h-10"></div>}
                                    <span className={`${textColor} text-2xl lg:text-3xl xl:text-4xl font-medium break-words flex-1 leading-relaxed`}>
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
                        <div className="bg-blue-50 border-r-4 border-blue-400 p-8 lg:p-10 rounded-2xl shadow-lg">
                          <div className="flex items-start gap-6">
                            <Lightbulb className="w-12 h-12 lg:w-14 lg:h-14 text-blue-600 flex-shrink-0 mt-2" />
                            <div>
                              <h6 className="font-bold text-blue-900 text-3xl lg:text-4xl mb-6">💡 شرح تفصيلي:</h6>
                              <p className="text-blue-800 text-2xl lg:text-3xl xl:text-4xl break-words leading-relaxed">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!userAnswer.is_correct && (
                        <div className="bg-yellow-50 border-r-4 border-yellow-400 p-8 lg:p-10 rounded-2xl shadow-lg">
                          <div className="flex items-start gap-6">
                            <AlertCircle className="w-12 h-12 lg:w-14 lg:h-14 text-yellow-600 flex-shrink-0 mt-2" />
                            <div>
                              <h6 className="font-bold text-yellow-900 text-3xl lg:text-4xl mb-6">🎯 نصيحة للتحسين:</h6>
                              <p className="text-yellow-800 text-2xl lg:text-3xl xl:text-4xl break-words leading-relaxed">
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
