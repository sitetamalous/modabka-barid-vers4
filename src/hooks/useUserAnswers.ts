
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserAnswers = (attemptId: string) => {
  return useQuery({
    queryKey: ['user-answers', attemptId],
    queryFn: async () => {
      console.log('🔍 Fetching user answers for attempt:', attemptId);
      
      if (!attemptId) {
        console.error('❌ No attemptId provided to useUserAnswers');
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

      console.log('🔍 User answers query result for attempt:', attemptId);
      console.log('  - Data received:', data);
      console.log('  - Error:', error);
      console.log('  - Data length:', data?.length || 0);

      if (error) {
        console.error('❌ Error fetching user answers:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No user answers found for attempt:', attemptId);
        console.warn('  This could indicate:');
        console.warn('  1. The attempt has no saved answers');
        console.warn('  2. The attempt_id is incorrect');
        console.warn('  3. Database sync issue');
        return [];
      }

      console.log('✅ Successfully fetched user answers:', {
        attemptId,
        answersCount: data.length,
        firstAnswer: data[0],
      });

      return data;
    },
    enabled: !!attemptId,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
};
