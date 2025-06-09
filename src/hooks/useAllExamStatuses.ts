import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch all latest completed exam attempts for the user.
 * Returns a Map<examId, examStatus> including attempt_id.
 * REBUILT FROM SCRATCH - Fresh implementation
 */
export const useAllExamStatuses = () => {
  return useQuery({
    queryKey: ['all-exam-statuses-v2'], // New query key to avoid cache conflicts
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('🚫 No authenticated user found');
        return new Map();
      }

      console.log('🔄 FRESH BUILD: Fetching exam statuses for user:', user.id);

      // Fetch ONLY completed attempts, ordered by completion date (latest first)
      const { data: completedAttempts, error } = await supabase
        .from('user_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .not('completed_at', 'is', null)
        .not('score', 'is', null)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('💥 Error fetching completed attempts:', error);
        throw error;
      }

      console.log('📊 FRESH DATA: Found completed attempts:', completedAttempts?.length || 0);

      // Create a clean map with only the latest attempt per exam
      const examStatusMap = new Map();
      
      // Group by exam_id and keep only the most recent completed attempt
      completedAttempts?.forEach(attempt => {
        const examId = attempt.exam_id;
        
        // Only add if this exam hasn't been processed yet (first = latest due to ordering)
        if (!examStatusMap.has(examId)) {
          // Build clean, consistent status object
          const cleanStatus = {
            exam_id: examId,
            attempt_id: attempt.id,
            score: attempt.score,
            correct_answers: attempt.correct_answers,
            completed_at: attempt.completed_at,
            is_completed: true, // Always true since we only fetch completed
            total_questions: attempt.total_questions
          };
          
          console.log(`✅ FRESH: Setting status for exam ${examId}:`, cleanStatus);
          examStatusMap.set(examId, cleanStatus);
        }
      });

      console.log('🎯 FRESH BUILD: Final exam status map size:', examStatusMap.size);
      examStatusMap.forEach((status, examId) => {
        console.log(`📝 Exam ${examId} status:`, status);
      });
      
      return examStatusMap;
    },
    staleTime: 0, // Always fresh - no stale data
    gcTime: 0, // Don't cache - always rebuild
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
