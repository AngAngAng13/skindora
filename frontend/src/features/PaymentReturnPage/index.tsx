import { AlertTriangle, CheckCircle, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useVerifyVNPayMutation } from "@/hooks/mutations/useVerifyVNPayMutation";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate: verifyPayment, isPending, isSuccess, isError, data, error } = useVerifyVNPayMutation();

  useEffect(() => {
    const vnpayData: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      vnpayData[key] = value;
    });

    
    if (vnpayData["vnp_ResponseCode"] && vnpayData["vnp_TxnRef"]) {
      verifyPayment(vnpayData);
    } else {
     
      navigate("/error");
    }
  }, [searchParams, verifyPayment, navigate]);

  const renderContent = () => {
    if (isPending) {
      return (
        <>
          <LoaderCircle className="text-primary h-16 w-16 animate-spin" />
          <h1 className="mt-6 text-2xl font-bold">Verifying Payment...</h1>
          <p className="text-muted-foreground mt-2">Please wait while we confirm your transaction.</p>
        </>
      );
    }

    if (isError) {
      return (
        <>
          <AlertTriangle className="text-destructive h-16 w-16" />
          <h1 className="mt-6 text-2xl font-bold">Payment Verification Failed</h1>
          <p className="text-muted-foreground mt-2">{error?.message || "There was an issue verifying your payment."}</p>
          <Button onClick={() => navigate("/profile")} className="mt-6">
            Go to My Profile
          </Button>
        </>
      );
    }

    if (isSuccess && data?.isOk() && data.value.data.code === "00") {
      return (
        <>
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h1 className="mt-6 text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground mt-2">Your order has been confirmed. You will be redirected shortly.</p>
          <Button onClick={() => navigate("/profile/orders")} className="mt-6">
            View My Orders
          </Button>
        </>
      );
    }

    return (
      <>
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h1 className="mt-6 text-2xl font-bold">Payment Failed</h1>
        <p className="text-muted-foreground mt-2">
          {data?.isOk() ? data.value.data.message : "The transaction was not completed successfully."}
        </p>
        <Button onClick={() => navigate("/checkout")} variant="outline" className="mt-6">
          Try Again
        </Button>
      </>
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      {renderContent()}
    </div>
  );
};

export default PaymentReturnPage;
