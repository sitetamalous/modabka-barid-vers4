
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
      console.log('🚀 Starting exam submission process...', { 
        attemptId, 
        answersCount: answers.length, 
        timeTaken 
      });
      
      // Calculate score
      const correctAnswers = answers.filter(answer => answer.isCorrect).length;
      const score = Math.round((correctAnswers / answers.length) * 100);
      
      console.log('📊 Calculated results:', { 
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
        console.error('❌ Error updating attempt:', attemptError);
        throw attemptError;
      }

      console.log('✅ Attempt updated successfully:', updatedAttempt);

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

      console.log('💾 Preparing to insert user answers:', {
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
          console.error('❌ Error inserting answers:', answersError);
          throw answersError;
        }

        console.log('✅ User answers saved successfully:', insertedAnswers?.length);
      } else {
        console.log('⚠️ No valid answers to insert for attempt:', attemptId);
      }

      const result = { 
        score, 
        correctAnswers, 
        totalQuestions: answers.length, 
        attemptId: updatedAttempt.id 
      };

      console.log('🎉 Submission completed successfully:', result);
      return result;
    },
    onSuccess: (result) => {
      console.log('🎉 Exam submission mutation completed successfully:', result);
      
      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['user-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['all-exam-statuses'] });
      queryClient.invalidateQueries({ queryKey: ['exam-stats'] });
      queryClient.invalidateQueries({ queryKey: ['exam-status'] });
      queryClient.invalidateQueries({ queryKey: ['user-answers'] });
      
      console.log('🔄 All related queries invalidated');
      
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
