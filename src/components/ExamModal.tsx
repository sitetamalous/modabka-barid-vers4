
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface ExamModalProps {
  examId: number;
  isOpen: boolean;
  onClose: () => void;
}

// Mock exam data
const mockQuestions = [
  {
    id: 1,
    question: "ما هو الهدف الرئيسي لمؤسسة بريد الجزائر؟",
    options: [
      "تقديم الخدمات البريدية فقط",
      "تقديم الخدمات البريدية والمالية والرقمية",
      "تقديم الخدمات المصرفية فقط",
      "تقديم خدمات الاتصالات"
    ],
    correctAnswer: 1,
    explanation: "مؤسسة بريد الجزائر تقدم مجموعة شاملة من الخدمات تشمل الخدمات البريدية والمالية والرقمية."
  },
  {
    id: 2,
    question: "ما هي خدمة E-CCP؟",
    options: [
      "خدمة البريد الإلكتروني",
      "الحساب الجاري البريدي الإلكتروني",
      "خدمة التوصيل السريع",
      "تطبيق للهواتف الذكية"
    ],
    correctAnswer: 1,
    explanation: "E-CCP هو الحساب الجاري البريدي الإلكتروني الذي يتيح للعملاء إدارة حساباتهم إلكترونياً."
  },
  {
    id: 3,
    question: "ما هو تطبيق Baridi Mob؟",
    options: [
      "تطبيق للتسوق الإلكتروني",
      "تطبيق الدفع المحمول لبريد الجزائر",
      "تطبيق لتتبع الطرود",
      "تطبيق للتواصل الاجتماعي"
    ],
    correctAnswer: 1,
    explanation: "Baridi Mob هو تطبيق الدفع المحمول الخاص ببريد الجزائر للمعاملات المالية."
  }
];

const ExamModal = ({ examId, isOpen, onClose }: ExamModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isOpen && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsSubmitted(true);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, isSubmitted]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    mockQuestions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / mockQuestions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const resetExam = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(3600);
    setIsSubmitted(false);
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">نتائج الامتحان</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Score Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardContent className="p-6 text-center">
                <div className="text-6xl font-bold text-emerald-600 mb-2">{score}%</div>
                <div className="text-xl text-gray-700">
                  أجبت على {Object.keys(answers).length} من {mockQuestions.length} سؤال
                </div>
                <div className="text-lg text-gray-600 mt-2">
                  إجابات صحيحة: {mockQuestions.filter(q => answers[q.id] === q.correctAnswer).length}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">مراجعة الأسئلة والإجابات:</h3>
              {mockQuestions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <Card key={question.id} className={`border-2 ${isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">
                            السؤال {index + 1}: {question.question}
                          </h4>
                          
                          <div className="space-y-2 mb-3">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded-lg border ${
                                  optionIndex === question.correctAnswer
                                    ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                                    : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                                    ? 'border-red-300 bg-red-100 text-red-800'
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                <span className="font-medium">
                                  {String.fromCharCode(65 + optionIndex)}) {option}
                                </span>
                                {optionIndex === question.correctAnswer && (
                                  <span className="mr-2 text-emerald-600 font-bold">(الإجابة الصحيحة)</span>
                                )}
                                {optionIndex === userAnswer && userAnswer !== question.correctAnswer && (
                                  <span className="mr-2 text-red-600 font-bold">(إجابتك)</span>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-blue-50 border-r-4 border-blue-400 p-3 rounded">
                            <p className="text-blue-800">
                              <strong>الشرح:</strong> {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetExam} className="bg-gradient-to-r from-emerald-500 to-blue-600">
                إعادة المحاولة
              </Button>
              <Button variant="outline" onClick={onClose}>
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
          <DialogTitle className="text-2xl">الامتحان التجريبي رقم {examId}</DialogTitle>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="font-mono text-red-600">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm text-gray-600">
              السؤال {currentQuestion + 1} من {mockQuestions.length}
            </div>
          </div>
          <Progress value={((currentQuestion + 1) / mockQuestions.length) * 100} className="mt-2" />
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Question */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                السؤال {currentQuestion + 1}: {mockQuestions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {mockQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(mockQuestions[currentQuestion].id, index)}
                    className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                      answers[mockQuestions[currentQuestion].id] === index
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}) {option}
                    </span>
                  </button>
                ))}
              </div>
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
              {currentQuestion < mockQuestions.length - 1 ? (
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
                  disabled={Object.keys(answers).length === 0}
                >
                  تسليم الامتحان
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
          <Card className="border-0 shadow-lg bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">الانتقال السريع للأسئلة:</h4>
              <div className="grid grid-cols-10 gap-2">
                {mockQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg border-2 font-medium transition-all ${
                      index === currentQuestion
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : answers[mockQuestions[index].id] !== undefined
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
                  <span>تم الإجابة</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span>لم تتم الإجابة</span>
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
