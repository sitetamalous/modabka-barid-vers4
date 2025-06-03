
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  LogOut, 
  PlayCircle, 
  Clock, 
  Target, 
  TrendingUp,
  Star,
  CheckCircle,
  BookOpen
} from "lucide-react";
import ExamModal from "@/components/ExamModal";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [selectedExam, setSelectedExam] = useState<number | null>(null);

  // Mock data for exams
  const exams = [
    { id: 1, title: "الامتحان التجريبي الأول", description: "مقدمة حول بريد الجزائر والخدمات الأساسية", duration: 60, questions: 50, completed: true, score: 85 },
    { id: 2, title: "الامتحان التجريبي الثاني", description: "الخدمات المالية والحوالات البريدية", duration: 60, questions: 50, completed: true, score: 92 },
    { id: 3, title: "الامتحان التجريبي الثالث", description: "الخدمات الرقمية وE-CCP", duration: 60, questions: 50, completed: false, score: null },
    { id: 4, title: "الامتحان التجريبي الرابع", description: "خدمة الزبائن ومعالجة الشكاوى", duration: 60, questions: 50, completed: false, score: null },
    { id: 5, title: "الامتحان التجريبي الخامس", description: "التطبيقات المحمولة وBaridi Mob", duration: 60, questions: 50, completed: false, score: null },
    { id: 6, title: "الامتحان التجريبي السادس", description: "الامتحان الشامل الأول", duration: 75, questions: 50, completed: false, score: null },
    { id: 7, title: "الامتحان التجريبي السابع", description: "حالات عملية ومواقف حقيقية", duration: 60, questions: 50, completed: false, score: null },
    { id: 8, title: "الامتحان التجريبي الثامن", description: "القوانين واللوائح الداخلية", duration: 60, questions: 50, completed: false, score: null },
    { id: 9, title: "الامتحان التجريبي التاسع", description: "الامتحان الشامل الثاني", duration: 75, questions: 50, completed: false, score: null },
    { id: 10, title: "الامتحان التجريبي العاشر", description: "المراجعة النهائية والتقييم الشامل", duration: 90, questions: 50, completed: false, score: null }
  ];

  const completedExams = exams.filter(exam => exam.completed).length;
  const averageScore = exams.filter(exam => exam.completed).reduce((sum, exam) => sum + (exam.score || 0), 0) / completedExams || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-sm text-gray-600">مرحباً بك في منصة التحضير</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>الامتحانات المكتملة</span>
                <CheckCircle className="w-8 h-8" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedExams}/10</div>
              <Progress value={(completedExams / 10) * 100} className="mt-3 bg-emerald-400" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>المعدل العام</span>
                <Star className="w-8 h-8" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageScore.toFixed(1)}%</div>
              <div className="text-blue-100 mt-2">من الامتحانات المكتملة</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>التقدم العام</span>
                <TrendingUp className="w-8 h-8" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{((completedExams / 10) * 100).toFixed(0)}%</div>
              <Progress value={(completedExams / 10) * 100} className="mt-3 bg-purple-400" />
            </CardContent>
          </Card>
        </div>

        {/* Exams Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            الامتحانات التجريبية
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                        {exam.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {exam.description}
                      </CardDescription>
                    </div>
                    {exam.completed && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        مكتمل
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{exam.duration} دقيقة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{exam.questions} سؤال</span>
                    </div>
                  </div>

                  {exam.completed && exam.score && (
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-700">النتيجة:</span>
                        <span className="text-lg font-bold text-emerald-600">{exam.score}%</span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedExam(exam.id)}
                    className={`w-full flex items-center gap-2 ${
                      exam.completed 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700'
                    }`}
                    variant={exam.completed ? 'outline' : 'default'}
                  >
                    <PlayCircle className="w-4 h-4" />
                    {exam.completed ? 'مراجعة الامتحان' : 'بدء الامتحان'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Study Tips */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Target className="w-6 h-6 text-emerald-600" />
              نصائح للنجاح
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">قبل الامتحان:</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• راجع جميع المواد المتعلقة بخدمات بريد الجزائر</li>
                  <li>• تأكد من فهم الخدمات الرقمية وE-CCP</li>
                  <li>• تدرب على حل الأسئلة في الوقت المحدد</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">أثناء الامتحان:</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• اقرأ السؤال بعناية قبل الإجابة</li>
                  <li>• ابدأ بالأسئلة السهلة أولاً</li>
                  <li>• راجع إجاباتك قبل التسليم</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedExam && (
        <ExamModal
          examId={selectedExam}
          isOpen={true}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
