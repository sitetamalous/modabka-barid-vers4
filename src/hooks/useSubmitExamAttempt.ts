
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

      // Insert user answers
      const userAnswers = answers.map(answer => ({
        attempt_id: attemptId,
        question_id: answer.questionId,
        selected_option_id: answer.selectedOptionId,
        is_correct: answer.isCorrect
      }));

      console.log('💾 Inserting user answers:', userAnswers.length);

      const { error: answersError } = await supabase
        .from('user_answers')
        .insert(userAnswers);

      if (answersError) {
        console.error('❌ Error inserting answers:', answersError);
        throw answersError;
      }

      console.log('✅ All answers saved successfully');

      return { score, correctAnswers, totalQuestions: answers.length };
    },
    onSuccess: (result) => {
      console.log('🎉 Exam submission completed successfully:', result);
      queryClient.invalidateQueries({ queryKey: ['user-attempts'] });
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
