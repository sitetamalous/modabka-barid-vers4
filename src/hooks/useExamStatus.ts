import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExamStatus = (examId: string) => {
  return useQuery({
    queryKey: ['exam-status', examId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('المستخدم غير مصرح له');
      }

      // Get the latest completed attempt for this specific exam
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
        console.error('Error fetching exam status:', error);
        throw error;
      }

      return data;
    },
    enabled: !!examId,
  });
};

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

      // Get the LATEST completed attempt for each exam
      const { data: userAttempts, error } = await supabase
        .from('user_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching user attempts:', error);
        throw error;
      }

      console.log('📊 All completed attempts:', userAttempts);

      // Create a map with the LATEST attempt for each exam
      const examStatusMap = new Map();
      
      userAttempts?.forEach(attempt => {
        // Only keep the LATEST attempt for each exam
        if (!examStatusMap.has(attempt.exam_id)) {
          console.log(`📝 Setting status for exam ${attempt.exam_id}:`, {
            score: attempt.score,
            completed_at: attempt.completed_at,
            correct_answers: attempt.correct_answers,
            attempt_id: attempt.id // ← هذا مهم جداً!
          });
          
          examStatusMap.set(attempt.exam_id, {
            score: attempt.score,
            completed_at: attempt.completed_at,
            correct_answers: attempt.correct_answers,
            attempt_id: attempt.id // ← التأكد من وجود attempt_id
          });
        }
      });

      console.log('📊 Final exam status map:', examStatusMap);
      return examStatusMap;
    },
  });
};
