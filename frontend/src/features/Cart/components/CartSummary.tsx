import { LoaderCircle, Ticket, X } from "lucide-react";
import type { Result } from "neverthrow";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { usePrepareOrderMutation } from "@/hooks/mutations/usePrepareOrderMutation";
import type { PreparedOrderResponse } from "@/services/orders.service";
import type { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  discount?: {
    code?: string;
    amount: number;
  };
  selectedItems: Array<{ ProductID: string }>;
  onOpenVoucherDialog: () => void;
  onClearVoucher?: () => void;
}

export function CartSummary({
  subtotal,
  shipping,
  total,
  discount,
  selectedItems,
  onOpenVoucherDialog,
  onClearVoucher,
}: CartSummaryProps) {
  const navigate = useNavigate();
  const { mutate: prepareOrder, isPending } = usePrepareOrderMutation();

  const handleCheckout = () => {
    if (!selectedItems || selectedItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    const selectedProductIDs = selectedItems.map((item) => item.ProductID);
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
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Order Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({selectedItems.length} items):</span>
            <span className="font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
          </div>
          {discount && discount.amount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1 font-medium">Voucher ({discount.code})</span>
              <span>-{discount.amount.toLocaleString("vi-VN")}₫</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium">{shipping > 0 ? `${shipping.toLocaleString("vi-VN")}₫` : "Free"}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>Total:</span>
            <span>{total.toLocaleString("vi-VN")}₫</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium">Discount Code</span>
          <Button
            variant="link"
            className="h-auto p-0 text-sm text-blue-600 hover:underline"
            onClick={onOpenVoucherDialog}
          >
            {discount?.code ? "Change" : "My Offers ›"}
          </Button>
        </div>
        <div className="mt-4">
          {discount?.code ? (
            <div className="border-primary/50 bg-primary/5 flex items-center justify-between rounded-md border border-dashed p-3">
              <span className="text-primary flex items-center gap-2 text-sm font-semibold">
                <Ticket className="h-4 w-4" />
                {discount.code}
              </span>
              <Button variant="ghost" size="icon" className="text-destructive h-6 w-6" onClick={onClearVoucher}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input placeholder="Enter discount code" className="flex-1" />
              <Button variant="secondary">APPLY</Button>
            </div>
          )}
        </div>
      </div>

      <Button onClick={handleCheckout} disabled={selectedItems.length === 0 || isPending} className="w-full" size="lg">
        {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : "Proceed to Checkout"}
      </Button>
    </div>
  );
}
