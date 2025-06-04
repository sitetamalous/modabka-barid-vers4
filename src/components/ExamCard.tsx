
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { 
  Clock, 
  Target, 
  PlayCircle, 
  CheckCircle, 
  Star,
  TrendingUp
} from "lucide-react";

interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    description: string;
    duration_minutes: number;
    total_questions: number;
  };
  examStatus?: {
    score: number;
    is_completed: boolean;
  };
  onStartExam: (examId: string) => void;
}

export const ExamCard = ({ exam, examStatus, onStartExam }: ExamCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = examStatus?.is_completed;

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <CardTitle className="text-xl mb-3 group-hover:text-emerald-600 transition-colors duration-300 leading-tight">
              {exam.title}
            </CardTitle>
            <p className="text-gray-600 text-sm leading-relaxed">
              {exam.description}
            </p>
          </div>
          
          {isCompleted && (
            <div className="flex flex-col items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                مكتمل
              </Badge>
              {examStatus && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-lg">{examStatus.score}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        {/* Exam Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">المدة</p>
              <p className="font-semibold text-gray-700">{exam.duration_minutes} دقيقة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">الأسئلة</p>
              <p className="font-semibold text-gray-700">{exam.total_questions} سؤال</p>
            </div>
          </div>
        </div>

        {/* Progress Bar for Completed Exams */}
        {isCompleted && examStatus && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">النتيجة النهائية</span>
              <span className="text-sm font-bold text-emerald-600">{examStatus.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${examStatus.score}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <AnimatedButton
          onClick={() => onStartExam(exam.id)}
          variant={isCompleted ? "outline" : "primary"}
          size="md"
          icon={isCompleted ? TrendingUp : PlayCircle}
          iconPosition="right"
          className="w-full"
        >
          {isCompleted ? 'مراجعة الامتحان' : 'بدء الامتحان'}
        </AnimatedButton>
      </CardContent>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 border-2 border-emerald-300 rounded-lg opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-300 pointer-events-none`} />
    </Card>
  );
};
