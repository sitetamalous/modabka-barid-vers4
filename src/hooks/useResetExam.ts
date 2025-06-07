
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useResetExam = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ examId }: { examId: string }) => {
      console.log('🔄 Starting complete exam reset for exam:', examId);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('المستخدم غير مصرح له');
      }

      // Get all user attempts for this exam
      const { data: userAttempts, error: attemptsError } = await supabase
        .from('user_attempts')
        .select('id')
        .eq('user_id', user.id)
        .eq('exam_id', examId);

      if (attemptsError) {
        console.error('❌ Error fetching user attempts:', attemptsError);
        throw attemptsError;
      }

      console.log('📋 Found', userAttempts?.length || 0, 'attempts to delete');

      if (userAttempts && userAttempts.length > 0) {
        const attemptIds = userAttempts.map(attempt => attempt.id);

        // Delete all user answers for these attempts
        const { error: answersError } = await supabase
          .from('user_answers')
          .delete()
          .in('attempt_id', attemptIds);

        if (answersError) {
          console.error('❌ Error deleting user answers:', answersError);
          throw answersError;
        }

        console.log('✅ Deleted all user answers');

        // Delete all user attempts for this exam
        const { error: attemptsDeleteError } = await supabase
          .from('user_attempts')
          .delete()
          .eq('user_id', user.id)
          .eq('exam_id', examId);

        if (attemptsDeleteError) {
          console.error('❌ Error deleting user attempts:', attemptsDeleteError);
          throw attemptsDeleteError;
        }

        console.log('✅ Deleted all user attempts');
      }

      return { deletedAttempts: userAttempts?.length || 0 };
    },
    onSuccess: (result) => {
      console.log('🎉 Exam reset completed successfully:', result);
      queryClient.invalidateQueries({ queryKey: ['user-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['user-answers'] });
      toast({
        title: "تم مسح البيانات بنجاح",
        description: `تم حذف ${result.deletedAttempts} محاولة سابقة. يمكنك الآن بدء الامتحان من جديد`,
      });
    },
    onError: (error) => {
      console.error('💥 Exam reset failed:', error);
      toast({
        title: "خطأ في مسح البيانات",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
