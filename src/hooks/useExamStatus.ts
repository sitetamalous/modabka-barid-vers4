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
        throw new Error('المستخدم غير مصرح له');
      }

      // Get the latest attempt for each exam (most recent attempt per exam)
      const { data, error } = await supabase
        .from('user_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching exam statuses:', error);
        throw error;
      }

      // Group by exam_id and keep only the latest attempt for each exam
      const latestAttempts = new Map();
      data?.forEach(attempt => {
        if (!latestAttempts.has(attempt.exam_id)) {
          latestAttempts.set(attempt.exam_id, attempt);
        }
      });

      // Convert back to array and create a map for easy lookup
      const statusMap = new Map();
      Array.from(latestAttempts.values()).forEach(attempt => {
        statusMap.set(attempt.exam_id, {
          score: attempt.score,
          completed_at: attempt.completed_at,
          correct_answers: attempt.correct_answers,
          attempt_id: attempt.id
        });
      });

      return statusMap;
    },
  });
};
