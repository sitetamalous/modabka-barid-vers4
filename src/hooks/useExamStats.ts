
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

      // Get ONLY unique exam IDs that user has completed
      // This ensures each exam is counted only once, regardless of retakes
      const { data: uniqueExamAttempts, error: uniqueExamAttemptsError } = await supabase
        .from('user_attempts')
        .select('exam_id')
        .eq('user_id', user.id)
        .eq('is_completed', true);

      if (uniqueExamAttemptsError) {
        console.error('Error fetching unique exam attempts:', uniqueExamAttemptsError);
        throw uniqueExamAttemptsError;
      }

      // Count DISTINCT exam IDs only
      const uniqueCompletedExamIds = [...new Set(uniqueExamAttempts?.map(attempt => attempt.exam_id) || [])];
      console.log('📊 Unique completed exam IDs:', uniqueCompletedExamIds);
      console.log('📊 Total unique exams completed:', uniqueCompletedExamIds.length);

      // Get LATEST attempt for each unique exam to calculate average score
      const latestAttemptPromises = uniqueCompletedExamIds.map(async (examId) => {
        const { data: latestAttempt } = await supabase
          .from('user_attempts')
          .select('score')
          .eq('user_id', user.id)
          .eq('exam_id', examId)
          .eq('is_completed', true)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();
        
        return latestAttempt?.score || 0;
      });

      const latestScores = await Promise.all(latestAttemptPromises);
      const validScores = latestScores.filter(score => score > 0);
      
      const averageScore = validScores.length > 0 
        ? Math.round(validScores.reduce((acc, score) => acc + score, 0) / validScores.length)
        : 0;

      console.log('📊 Latest scores for unique exams:', validScores);
      console.log('📊 Average score:', averageScore);

      return {
        totalExams: totalExams?.length || 0,
        completedExams: uniqueCompletedExamIds.length, // Count of UNIQUE exams completed
        averageScore,
        completionRate: totalExams?.length 
          ? Math.round((uniqueCompletedExamIds.length / totalExams.length) * 100) 
          : 0
      };
    },
  });
};
