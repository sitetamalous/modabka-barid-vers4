import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch the latest completed attempt for a specific exam.
 * Returns exam status including score, correct_answers, and attempt_id.
 */
export const useExamStatus = (examId: string) => {
  return useQuery({
    queryKey: ['exam-status', examId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('المستخدم غير مصرح له');
      }

      // Fetch the latest completed attempt for this exam
      const { data, error } = await supabase
        .from('user_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('exam_id', examId)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching exam status:', error);
        throw error;
      }

      // ✅ Ensure attempt_id is returned for answer review functionality
      return {
        score: data?.score,
        completed_at: data?.completed_at,
        correct_answers: data?.correct_answers,
        attempt_id: data?.id || null
      };
    },
    enabled: !!examId,
  });
};

/**
 * Hook to fetch all latest completed exam attempts for the user.
 * Returns a Map<examId, examStatus> including attempt_id.
 */
export const useAllExamStatuses = () => {
  return useQuery({
    queryKey: ['all-exam-statuses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('❌ No authenticated user found');
        return new Map();
      }

      console.log('👤 Fetching exam statuses for user:', user.id);

      // Fetch all completed attempts
      const { data: userAttempts, error } = await supabase
        .from('user_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user attempts:', error);
        throw error;
      }

      console.log('📊 All completed attempts:', userAttempts);

      // Store only the latest attempt per exam
      const examStatusMap = new Map();
      
      userAttempts?.forEach(attempt => {
        if (!examStatusMap.has(attempt.exam_id)) {
          console.log(`📝 Setting status for exam ${attempt.exam_id}:`, {
            score: attempt.score,
            completed_at: attempt.completed_at,
            correct_answers: attempt.correct_answers,
            attempt_id: attempt.id
          });
          
          examStatusMap.set(attempt.exam_id, {
            score: attempt.score,
            completed_at: attempt.completed_at,
            correct_answers: attempt.correct_answers,
            attempt_id: attempt.id
          });
        }
      });

      console.log('📊 Final exam status map:', examStatusMap);
      
      return examStatusMap;
    },
  });
};
