
import { useState } from 'react';
import { useUserAttempts } from '@/hooks/useUserAttempts';
import { MobileCard } from '@/components/ui/mobile-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Trophy, 
  Calendar, 
  Clock, 
  Target, 
  Award,
  BarChart3,
  Edit3,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Star,
  TrendingUp,
  CheckCircle,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

export const ProfileView = () => {
  const { data: userAttempts, isLoading } = useUserAttempts();
  const [user, setUser] = useState(supabase.auth.getUser());

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <User className="w-8 h-8 animate-pulse text-emerald-600 mx-auto mb-4" />
        <p className="text-gray-600">جاري تحميل الملف الشخصي...</p>
      </div>
    );
  }

  const completedAttempts = userAttempts?.filter(attempt => attempt.is_completed) || [];
  const totalAttempts = userAttempts?.length || 0;
  const averageScore = completedAttempts.length > 0 
    ? completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length 
    : 0;
  const highestScore = completedAttempts.length > 0 
    ? Math.max(...completedAttempts.map(attempt => attempt.score || 0))
    : 0;
  const totalTime = completedAttempts.reduce((sum, attempt) => sum + (attempt.time_taken || 0), 0);
  
  // Calculate achievements
  const excellentScores = completedAttempts.filter(a => (a.score || 0) >= 90).length;
  const consecutiveScores = completedAttempts.slice(0, 3).every(a => (a.score || 0) >= 70);
  const fastCompletions = completedAttempts.filter(a => (a.time_taken || 3600) < 2400).length; // less than 40 min
  
  // Performance level
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: "خبير", color: "text-emerald-600", bgColor: "bg-emerald-100", progress: 100 };
    if (score >= 80) return { label: "متقدم", color: "text-blue-600", bgColor: "bg-blue-100", progress: 80 };
    if (score >= 70) return { label: "متوسط", color: "text-green-600", bgColor: "bg-green-100", progress: 60 };
    if (score >= 60) return { label: "مبتدئ", color: "text-yellow-600", bgColor: "bg-yellow-100", progress: 40 };
    return { label: "جديد", color: "text-gray-600", bgColor: "bg-gray-100", progress: 20 };
  };

  const currentLevel = getPerformanceLevel(averageScore);

  // Calculate rank (mock calculation based on performance)
  const calculateRank = () => {
    if (averageScore >= 95) return "الأول";
    if (averageScore >= 90) return "الثاني";
    if (averageScore >= 85) return "الثالث";
    if (averageScore >= 80) return "المتميز";
    if (averageScore >= 70) return "المجتهد";
    return "المبتدئ";
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Profile Header */}
      <MobileCard>
        <div className="p-6 text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${currentLevel.bgColor} rounded-full flex items-center justify-center border-2 border-white`}>
              <Star className={`w-4 h-4 ${currentLevel.color}`} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-1">اكرم محرز</h2>
          <p className="text-gray-600 mb-2">مترشح لمنصب مكلف بالزبائن</p>
          
          <Badge 
            className={`${currentLevel.bgColor} ${currentLevel.color} text-lg px-4 py-2 mb-4`}
          >
            {currentLevel.label}
          </Badge>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>انضم في يونيو 2025</span>
          </div>
        </div>
      </MobileCard>

      {/* Performance Summary */}
      <MobileCard>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            ملخص الأداء
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <Trophy className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-600">{averageScore.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">المعدل العام</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{completedAttempts.length}</div>
              <div className="text-sm text-gray-600">امتحان مكتمل</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{highestScore}%</div>
              <div className="text-sm text-gray-600">أعلى نتيجة</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(totalTime / 60)} د
              </div>
              <div className="text-sm text-gray-600">إجمالي الوقت</div>
            </div>
          </div>

          {/* Progress to next level */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">التقدم للمستوى التالي</span>
              <span className="text-sm text-gray-600">{currentLevel.progress}%</span>
            </div>
            <Progress value={currentLevel.progress} className="h-3" />
          </div>

          {/* Current Rank */}
          <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border-2 border-emerald-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-bold text-gray-900">ترتيبك الحالي</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">{calculateRank()}</div>
            <p className="text-sm text-gray-600 mt-1">
              بناءً على أدائك في الامتحانات
            </p>
          </div>
        </div>
      </MobileCard>

      {/* Achievements */}
      <MobileCard>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            الإنجازات المحققة
          </h3>
          
          <div className="space-y-3">
            {excellentScores >= 1 && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-emerald-800">النجم المتألق</div>
                  <div className="text-sm text-emerald-600">حصلت على {excellentScores} نتيجة ممتازة (90%+)</div>
                </div>
              </div>
            )}
            
            {completedAttempts.length >= 5 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-blue-800">المثابر</div>
                  <div className="text-sm text-blue-600">أكملت أكثر من 5 امتحانات</div>
                </div>
              </div>
            )}
            
            {consecutiveScores && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-purple-800">الثابت</div>
                  <div className="text-sm text-purple-600">حافظت على نتائج جيدة في آخر 3 امتحانات</div>
                </div>
              </div>
            )}
            
            {fastCompletions >= 3 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-orange-800">السريع</div>
                  <div className="text-sm text-orange-600">أنهيت {fastCompletions} امتحانات بسرعة ودقة</div>
                </div>
              </div>
            )}
            
            {highestScore === 100 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-yellow-800">الكمال</div>
                  <div className="text-sm text-yellow-600">حصلت على الدرجة الكاملة في امتحان</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </MobileCard>

      {/* Personal Information */}
      <MobileCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-gray-600" />
              المعلومات الشخصية
            </h3>
            <Button variant="outline" size="sm">
              <Edit3 className="w-4 h-4 ml-2" />
              تعديل
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium">البريد الإلكتروني</div>
                <div className="text-sm text-gray-600">akram21@gmail.com</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium">رقم الهاتف</div>
                <div className="text-sm text-gray-600">غير محدد</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium">الموقع</div>
                <div className="text-sm text-gray-600">الجزائر</div>
              </div>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Recent Activity */}
      {completedAttempts.length > 0 && (
        <MobileCard>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              النشاط الأخير
            </h3>
            
            <div className="space-y-3">
              {completedAttempts.slice(0, 3).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{attempt.exams?.title || 'امتحان'}</div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(attempt.completed_at!), 'dd MMMM yyyy - HH:mm', { locale: ar })}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={(attempt.score || 0) >= 70 ? "secondary" : "destructive"}
                  >
                    {attempt.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </MobileCard>
      )}
    </div>
  );
};
