
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSubmitExamAttempt = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      attemptId, 
      answers, 
      timeTaken 
    }: { 
      attemptId: string; 
      answers: { questionId: string; selectedOptionId: string; isCorrect: boolean }[];
      timeTaken: number;
    }) => {
      console.log('🚀 Starting exam submission...', { attemptId, answersCount: answers.length, timeTaken });
      
      // Calculate score
      const correctAnswers = answers.filter(answer => answer.isCorrect).length;
      const score = Math.round((correctAnswers / answers.length) * 100);
      
      console.log('📊 Calculated results:', { correctAnswers, totalQuestions: answers.length, score });

      // Update attempt with completion details
      const { error: attemptError } = await supabase
        .from('user_attempts')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          score,
          correct_answers: correctAnswers,
          time_taken: timeTaken
        })
        .eq('id', attemptId);

      if (attemptError) {
        console.error('❌ Error updating attempt:', attemptError);
        throw attemptError;
      }

      console.log('✅ Attempt updated successfully');

      // Filter out answers without selected option and prepare user answers
      const validAnswers = answers.filter(answer => 
        answer.selectedOptionId && 
        answer.selectedOptionId.trim() !== '' && 
        answer.selectedOptionId !== 'undefined' &&
        answer.selectedOptionId !== 'null'
      );

      const userAnswers = validAnswers.map(answer => ({
        attempt_id: attemptId,
        question_id: answer.questionId,
        selected_option_id: answer.selectedOptionId,
        is_correct: answer.isCorrect
      }));

      console.log('💾 Inserting user answers:', userAnswers.length, 'out of', answers.length, 'total questions');
      console.log('💾 Filtered out', answers.length - validAnswers.length, 'questions without answers');

      if (userAnswers.length > 0) {
        const { error: answersError } = await supabase
          .from('user_answers')
          .insert(userAnswers);

        if (answersError) {
          console.error('❌ Error inserting answers:', answersError);
          throw answersError;
        }

        console.log('✅ All valid answers saved successfully');
      } else {
        console.log('⚠️ No valid answers to insert');
      }

      return { score, correctAnswers, totalQuestions: answers.length };
    },
    onSuccess: (result) => {
      console.log('🎉 Exam submission completed successfully:', result);
      queryClient.invalidateQueries({ queryKey: ['user-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['exam-stats'] });
      queryClient.invalidateQueries({ queryKey: ['exam-status'] });
      toast({
        title: "تم تسليم الامتحان بنجاح",
        description: `حصلت على ${result.score}% - ${result.correctAnswers} إجابة صحيحة من ${result.totalQuestions}`,
      });
    },
    onError: (error) => {
      console.error('💥 Exam submission failed:', error);
      toast({
        title: "خطأ في تسليم الامتحان",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
