import { LoaderCircle } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

interface CancelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  reason: string;
  setReason: (reason: string) => void;
  isCancelling: boolean;
}

export const CancelDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  reason,
  setReason,
  isCancelling,
}: CancelDialogProps) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
        <AlertDialogDescription>Please provide a reason for the cancellation.</AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-2">
        <Textarea placeholder="Type your reason here..." value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Back</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={!reason.trim() || isCancelling}>
          {isCancelling ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : "Submit Cancellation"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
