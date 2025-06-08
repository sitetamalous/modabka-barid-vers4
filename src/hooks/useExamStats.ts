
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExamStats = () => {
  return useQuery({
    queryKey: ['exam-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('المستخدم غير مصرح له');
      }

      // Get total exams available
      const { data: totalExams, error: totalExamsError } = await supabase
        .from('exams')
        .select('id')
        .eq('is_active', true);

      if (totalExamsError) {
        console.error('Error fetching total exams:', totalExamsError);
        throw totalExamsError;
      }

      // Get unique completed exams (only count each exam once, regardless of retakes)
      const { data: completedExams, error: completedExamsError } = await supabase
        .from('user_attempts')
        .select('exam_id')
        .eq('user_id', user.id)
        .eq('is_completed', true);

      if (completedExamsError) {
        console.error('Error fetching completed exams:', completedExamsError);
        throw completedExamsError;
      }

      // Count unique exam IDs (remove duplicates)
      const uniqueCompletedExams = [...new Set(completedExams?.map(attempt => attempt.exam_id) || [])];

      // Get latest attempts for each exam to calculate average score
      const { data: latestAttempts, error: latestAttemptsError } = await supabase
        .from('user_attempts')
        .select('exam_id, score')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (latestAttemptsError) {
        console.error('Error fetching latest attempts:', latestAttemptsError);
        throw latestAttemptsError;
      }

      // Get the latest score for each unique exam
      const examScores = new Map();
      latestAttempts?.forEach(attempt => {
        if (!examScores.has(attempt.exam_id)) {
          examScores.set(attempt.exam_id, attempt.score);
        }
      });

      const scores = Array.from(examScores.values()).filter(score => score !== null);
      const averageScore = scores.length > 0 
        ? Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
        : 0;

      return {
        totalExams: totalExams?.length || 0,
        completedExams: uniqueCompletedExams.length,
        averageScore,
        completionRate: totalExams?.length 
          ? Math.round((uniqueCompletedExams.length / totalExams.length) * 100) 
          : 0
      };
    },
  });
};
