
import { useState } from "react";
import { useAllExams } from "@/hooks/useAllExams";
import { useAllExamStatuses } from "@/hooks/useAllExamStatuses";
import { ExamCard } from "@/components/ExamCard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, BookOpen } from "lucide-react";
import ExamModal from "@/components/ExamModal";

export const ExamsList = () => {
  const { data: exams, isLoading: examsLoading, error: examsError } = useAllExams();
  const { data: examStatuses, isLoading: statusesLoading } = useAllExamStatuses();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const handleStartExam = (examId: string) => {
    console.log('🚀 Starting exam from ExamsList:', examId);
    setSelectedExamId(examId);
  };

  const handleCloseExam = () => {
    console.log('🔚 Closing exam modal from ExamsList');
    setSelectedExamId(null);
  };

  console.log('📊 ExamsList Debug Info:');
  console.log('  - Exams loading:', examsLoading);
  console.log('  - Statuses loading:', statusesLoading);
  console.log('  - Exams count:', exams?.length || 0);
  console.log('  - Exam statuses map size:', examStatuses?.size || 0);
  
  if (!statusesLoading && examStatuses) {
    console.log('📊 Exam statuses map contents:');
    examStatuses.forEach((status, examId) => {
      console.log(`    Exam ${examId}:`, status);
    });
  }

  if (examsLoading || statusesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mr-3" />
        <span className="text-lg text-gray-600">جاري تحميل الامتحانات...</span>
      </div>
    );
  }

  if (examsError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-700">حدث خطأ في تحميل الامتحانات</p>
          <p className="text-red-600 text-sm mt-2">{examsError.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!exams || exams.length === 0) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            لا توجد امتحانات متاحة
          </h3>
          <p className="text-gray-600">
            لم يتم العثور على أي امتحانات متاحة في الوقت الحالي
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => {
          const examStatus = examStatuses?.get(exam.id) || null;
          
          console.log(`🔍 Rendering ExamCard for exam ${exam.id}:`);
          console.log(`  - Exam title: ${exam.title}`);
          console.log(`  - Status found:`, examStatus);
          console.log(`  - Has attempt_id:`, !!examStatus?.attempt_id);
          
          return (
            <ExamCard
              key={exam.id}
              exam={exam}
              examStatus={examStatus}
              onStartExam={handleStartExam}
            />
          );
        })}
      </div>

      {selectedExamId && (
        <ExamModal
          examId={selectedExamId}
          isOpen={!!selectedExamId}
          onClose={handleCloseExam}
        />
      )}
    </>
  );
};
