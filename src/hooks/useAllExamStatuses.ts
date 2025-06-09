import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch all latest completed exam attempts for the user.
 * Returns a Map<examId, examStatus> including attempt_id.
 * COMPLETELY REBUILT - Fresh implementation with proper attempt_id mapping
 */
export const useAllExamStatuses = () => {
  return useQuery({
    queryKey: ['all-exam-statuses-v3'], // New query key to avoid cache conflicts
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('🚫 FIXED: No authenticated user found');
        return new Map();
      }

      console.log('🔄 FIXED: Fetching exam statuses for user:', user.id);

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
        console.error('💥 FIXED: Error fetching completed attempts:', error);
        throw error;
      }

      console.log('📊 FIXED: Found completed attempts:', completedAttempts?.length || 0);

      // Create a clean map with only the latest attempt per exam
      const examStatusMap = new Map();
      
      // Group by exam_id and keep only the most recent completed attempt
      completedAttempts?.forEach(attempt => {
        const examId = attempt.exam_id;
        
        // Only add if this exam hasn't been processed yet (first = latest due to ordering)
        if (!examStatusMap.has(examId)) {
          // CRITICAL FIX: Build clean, consistent status object with proper attempt_id
          const cleanStatus = {
            exam_id: examId,
            attempt_id: attempt.id,  // 👈 CRITICAL: Map attempt.id to attempt_id
            score: attempt.score,
            correct_answers: attempt.correct_answers,
            completed_at: attempt.completed_at,
            is_completed: true, // Always true since we only fetch completed
            total_questions: attempt.total_questions
          };
          
          console.log(`✅ FIXED: Setting status for exam ${examId}:`, cleanStatus);
          console.log(`🎯 FIXED: attempt_id for exam ${examId}:`, cleanStatus.attempt_id);
          examStatusMap.set(examId, cleanStatus);
        }
      });

      console.log('🎯 FIXED: Final exam status map size:', examStatusMap.size);
      
      // Verify each exam has proper attempt_id
      examStatusMap.forEach((status, examId) => {
        console.log(`📝 FIXED: Exam ${examId} status:`, status);
        console.log(`🔍 FIXED: Exam ${examId} attempt_id:`, status.attempt_id);
        
        if (!status.attempt_id) {
          console.error(`❌ FIXED: Missing attempt_id for exam ${examId}!`);
        }
      });
      
      return examStatusMap;
    },
    staleTime: 0, // Always fresh - no stale data
    gcTime: 0, // Don't cache - always rebuild
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};