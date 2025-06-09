
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * FRESH BUILD: Hook to fetch user answers for a specific attempt
 * Used in the exam review system
 */
export const useUserAnswers = (attemptId: string) => {
  return useQuery({
    queryKey: ['user-answers-v2', attemptId], // New query key to avoid cache conflicts
    queryFn: async () => {
      console.log('🔍 FRESH: Fetching user answers for attempt:', attemptId);
      
      if (!attemptId) {
        console.error('❌ FRESH: No attemptId provided to useUserAnswers');
        throw new Error('معرف المحاولة مطلوب');
      }

      const { data, error } = await supabase
        .from('user_answers')
        .select(`
          *,
          questions (
            id,
            question_text,
            explanation,
            answer_options (
              id,
              option_text,
              is_correct,
              option_index
            )
          )
        `)
        .eq('attempt_id', attemptId)
        .order('answered_at', { ascending: true });

      console.log('🔍 FRESH: User answers query result for attempt:', attemptId);
      console.log('  - Data received:', data);
      console.log('  - Error:', error);
      console.log('  - Data length:', data?.length || 0);

      if (error) {
        console.error('❌ FRESH: Error fetching user answers:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ FRESH: No user answers found for attempt:', attemptId);
        return [];
      }

      console.log('✅ FRESH: Successfully fetched user answers:', {
        attemptId,
        answersCount: data.length,
        firstAnswer: data[0],
      });

      return data;
    },
    enabled: !!attemptId,
    staleTime: 0, // Always fresh
    gcTime: 300000, // 5 minutes
    refetchOnMount: true,
  });
};
