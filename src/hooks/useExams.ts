
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExams = () => {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      console.log('Fetching exams...');
      
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      console.log('Exams query result:', { data, error });
      console.log('Number of exams returned:', data?.length || 0);

      if (error) {
        console.error('Error fetching exams:', error);
        throw error;
      }

      return data;
    },
  });
};

export const useExamQuestions = (examId: string) => {
  return useQuery({
    queryKey: ['exam-questions', examId],
    queryFn: async () => {
      console.log('Fetching questions for exam:', examId);
      
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          answer_options (*)
        `)
        .eq('exam_id', examId)
        .order('order_index', { ascending: true });

      console.log('Questions query result:', { questions, questionsError });

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw questionsError;
      }

      return questions;
    },
    enabled: !!examId,
  });
};
