
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import { useResetExam } from "@/hooks/useResetExam";

interface ResetExamDialogProps {
  examId: string;
  examTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onResetComplete: () => void;
}

export const ResetExamDialog = ({ 
  examId, 
  examTitle, 
  isOpen, 
  onClose, 
  onResetComplete 
}: ResetExamDialogProps) => {
  const resetExamMutation = useResetExam();

  const handleReset = () => {
    resetExamMutation.mutate(
      { examId },
      {
        onSuccess: () => {
          onClose();
          onResetComplete();
        }
      }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent dir="rtl" className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl">مسح جميع البيانات السابقة</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-base leading-relaxed">
            هل أنت متأكد من رغبتك في مسح جميع المحاولات السابقة لامتحان <strong>"{examTitle}"</strong>؟
            
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>تحذير:</strong> سيتم حذف جميع البيانات التالية نهائياً:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>جميع النتائج والدرجات السابقة</li>
                    <li>جميع الإجابات المحفوظة</li>
                    <li>تاريخ المحاولات السابقة</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="text-sm text-emerald-800">
                <strong>بعد المسح:</strong> ستتمكن من بدء الامتحان كأول مرة تماماً.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel disabled={resetExamMutation.isPending}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={resetExamMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {resetExamMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                جاري المسح...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                مسح البيانات وإعادة التشغيل
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
