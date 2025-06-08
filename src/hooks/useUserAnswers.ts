
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserAnswers = (attemptId: string) => {
  return useQuery({
    queryKey: ['user-answers', attemptId],
    queryFn: async () => {
      console.log('🔍 Fetching user answers for attempt:', attemptId);
      
      if (!attemptId) {
        console.error('❌ No attemptId provided');
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

      console.log('🔍 User answers query result:', { data, error, attemptId });

      if (error) {
        console.error('❌ Error fetching user answers:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No user answers found for attempt:', attemptId);
        return [];
      }

      console.log('✅ Successfully fetched', data.length, 'user answers');
      return data;
    },
    enabled: !!attemptId,
  });
};
