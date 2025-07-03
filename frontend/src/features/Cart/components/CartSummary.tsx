import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Result } from "neverthrow";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePrepareOrderMutation } from "@/hooks/mutations/usePrepareOrderMutation";

import type {  PreparedOrderResponse } from "@/services/orders.service";
import type { ApiResponse } from "@/utils/axios/types";
import type { ApiError} from "@/utils";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  discount?: {
    code: string;
    amount: number;
  };
  cartItems: Array<{ ProductID: string }>;
}

export function CartSummary({ subtotal, shipping, total, discount, cartItems }: CartSummaryProps) {
  const navigate = useNavigate();
  const { mutate: prepareOrder, isPending } = usePrepareOrderMutation();

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    const selectedProductIDs = cartItems.map((item) => item.ProductID);
    prepareOrder(selectedProductIDs, {
     
      onSuccess: (result: Result<ApiResponse<PreparedOrderResponse>, ApiError>) => {
        if (result.isOk()) {
          navigate("/checkout"); 
        } else {
          toast.error("Could not prepare your order", {
            description: result.error.message || "Please try again.",
          });
        }
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{subtotal.toLocaleString("vi-VN")}₫</span>
        </div>
        {discount && discount.amount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({discount.code}):</span>
            <span>-{discount.amount.toLocaleString("vi-VN")}₫</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>
            {shipping === 0 ? <Badge variant="secondary">Free</Badge> : `${shipping.toLocaleString("vi-VN")}₫`}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>{total.toLocaleString("vi-VN")}₫</span>
        </div>
        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={subtotal === 0 || isPending}>
          {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Preparing..." : "Proceed to Checkout"}
        </Button>
      </CardContent>
    </Card>
  );
}