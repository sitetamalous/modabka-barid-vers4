
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAllExams = () => {
  return useQuery({
    queryKey: ['all-exams'],
    queryFn: async () => {
      console.log('Fetching all exams (including inactive)...');
      
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: true });

      console.log('All exams query result:', { data, error });
      console.log('Total exams in database:', data?.length || 0);
      
      if (data) {
        const activeExams = data.filter(exam => exam.is_active);
        const inactiveExams = data.filter(exam => !exam.is_active);
        console.log('Active exams:', activeExams.length);
        console.log('Inactive exams:', inactiveExams.length);
        console.log('Active exams details:', activeExams);
        console.log('Inactive exams details:', inactiveExams);
      }

      if (error) {
        console.error('Error fetching all exams:', error);
        throw error;
      }

      return data;
    },
  });
};
