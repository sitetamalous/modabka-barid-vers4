
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * FRESH BUILD: Hook to submit exam attempt
 * Ensures proper completion marking and data freshness
 */
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
      console.log('🚀 FRESH: Starting exam submission process...', { 
        attemptId, 
        answersCount: answers.length, 
        timeTaken 
      });
      
      // Calculate score
      const correctAnswers = answers.filter(answer => answer.isCorrect).length;
      const score = Math.round((correctAnswers / answers.length) * 100);
      
      console.log('📊 FRESH: Calculated results:', { 
        correctAnswers, 
        totalQuestions: answers.length, 
        score 
      });

      // Update attempt with completion details
      const { data: updatedAttempt, error: attemptError } = await supabase
        .from('user_attempts')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          score,
          correct_answers: correctAnswers,
          time_taken: timeTaken
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (attemptError) {
        console.error('❌ FRESH: Error updating attempt:', attemptError);
        throw attemptError;
      }

      console.log('✅ FRESH: Attempt updated successfully:', updatedAttempt);

      // Filter and prepare valid answers
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

      console.log('💾 FRESH: Preparing to insert user answers:', {
        validAnswersCount: validAnswers.length,
        totalAnswersReceived: answers.length,
        filteredOut: answers.length - validAnswers.length
      });

      if (userAnswers.length > 0) {
        const { data: insertedAnswers, error: answersError } = await supabase
          .from('user_answers')
          .insert(userAnswers)
          .select();

        if (answersError) {
          console.error('❌ FRESH: Error inserting answers:', answersError);
          throw answersError;
        }

        console.log('✅ FRESH: User answers saved successfully:', insertedAnswers?.length);
      } else {
        console.log('⚠️ FRESH: No valid answers to insert for attempt:', attemptId);
      }

      const result = { 
        score, 
        correctAnswers, 
        totalQuestions: answers.length, 
        attemptId: updatedAttempt.id 
      };

      console.log('🎉 FRESH: Submission completed successfully:', result);
      return result;
    },
    onSuccess: (result) => {
      console.log('🎉 FRESH: Exam submission mutation completed successfully:', result);
      
      // FRESH BUILD: Invalidate all exam-related queries with new keys
      queryClient.invalidateQueries({ queryKey: ['user-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['all-exam-statuses-v2'] }); // New key
      queryClient.invalidateQueries({ queryKey: ['exam-stats'] });
      queryClient.invalidateQueries({ queryKey: ['exam-status'] });
      queryClient.invalidateQueries({ queryKey: ['user-answers-v2'] }); // New key
      
      // Force refetch of exam statuses
      queryClient.refetchQueries({ queryKey: ['all-exam-statuses-v2'] });
      
      console.log('🔄 FRESH: All related queries invalidated and refetched');
      
      toast({
        title: "تم تسليم الامتحان بنجاح",
        description: `حصلت على ${result.score}% - ${result.correctAnswers} إجابة صحيحة من ${result.totalQuestions}`,
      });
    },
    onError: (error) => {
      console.error('💥 FRESH: Exam submission failed:', error);
      toast({
        title: "خطأ في تسليم الامتحان",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
