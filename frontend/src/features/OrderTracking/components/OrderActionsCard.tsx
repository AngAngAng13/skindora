import { CheckCircle, Clock, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderActionsCardProps {
  onCancel: () => void;
  isCancelable: boolean;
  isCancelling: boolean;
  cancelRequestStatus?: "REQUESTED" | "APPROVED" | "REJECTED";
}

export const OrderActionsCard = ({
  onCancel,
  isCancelable,
  isCancelling,
  cancelRequestStatus,
}: OrderActionsCardProps) => {
  let content;
  if (cancelRequestStatus === "REQUESTED") {
    content = (
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center text-sm font-medium text-blue-600">
          <Clock className="mr-2 h-4 w-4" />
          <span>Cancellation Awaiting Approval</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">Your request has been submitted.</p>
      </div>
    );
  } else if (cancelRequestStatus === "APPROVED") {
    content = (
      <div className="flex items-center text-sm font-medium text-green-600">
        <CheckCircle className="mr-2 h-4 w-4" />
        <span>Cancellation Approved</span>
      </div>
    );
  } else if (cancelRequestStatus === "REJECTED") {
    content = (
      <div className="flex items-center text-sm font-medium text-red-600">
        <XCircle className="mr-2 h-4 w-4" />
        <span>Cancellation Rejected</span>
      </div>
    );
  } else if (isCancelable) {
    content = (
      <Button variant="destructive" className="w-full" onClick={onCancel} disabled={isCancelling}>
        <XCircle className="mr-2 h-4 w-4" />
        {isCancelling ? "Submitting..." : "Cancel Order"}
      </Button>
    );
  } else {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};
