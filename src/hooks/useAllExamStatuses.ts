
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

      // Fetch all completed attempts with proper ordering
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

      console.log('📊 All completed attempts found:', userAttempts?.length || 0);
      console.log('📊 Attempts details:', userAttempts);

      // Create a map to store only the latest attempt per exam
      const examStatusMap = new Map();
      
      // Group by exam_id and keep only the latest attempt
      userAttempts?.forEach(attempt => {
        const examId = attempt.exam_id;
        
        // Only set if this exam hasn't been processed yet (first occurrence is the latest due to ordering)
        if (!examStatusMap.has(examId)) {
          const examStatus = {
            score: attempt.score,
            completed_at: attempt.completed_at,
            correct_answers: attempt.correct_answers,
            attempt_id: attempt.id, // This is the key field
            total_questions: attempt.total_questions,
            is_completed: true // Explicitly set this since we only fetch completed attempts
          };
          
          console.log(`✅ Setting status for exam ${examId}:`, examStatus);
          console.log(`✅ Validation - completed_at: ${!!attempt.completed_at}, attempt_id: ${!!attempt.id}, score: ${typeof attempt.score === 'number'}, is_completed: true`);
          examStatusMap.set(examId, examStatus);
        }
      });

      console.log('📊 Final exam status map size:', examStatusMap.size);
      console.log('📊 Final exam status map entries:');
      examStatusMap.forEach((status, examId) => {
        console.log(`  Exam ${examId}:`, status);
        console.log(`  Status validation - completed_at: ${!!status.completed_at}, attempt_id: ${!!status.attempt_id}, score: ${typeof status.score === 'number'}, is_completed: ${status.is_completed}`);
      });
      
      return examStatusMap;
    },
    staleTime: 5000, // 5 seconds - very fresh data
    gcTime: 300000, // 5 minutes
  });
};
