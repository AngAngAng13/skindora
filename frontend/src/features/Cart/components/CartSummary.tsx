import { LoaderCircle, Ticket, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
  onApplyManualVoucher: (code: string) => void;
  onCheckout: () => void; 
  isProcessingCheckout: boolean; 
}

export function CartSummary({
  subtotal,
  shipping,
  total,
  discount,
  selectedItems,
  onOpenVoucherDialog,
  onClearVoucher,
  onApplyManualVoucher,
  isProcessingCheckout,
  onCheckout,
}: CartSummaryProps) {
  const [manualCode, setManualCode] = useState("");

  const handleApplyClick = () => {
    if (!manualCode.trim()) return;
    onApplyManualVoucher(manualCode.trim());
    setManualCode("");
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
              <Input
                placeholder="Enter discount code"
                className="flex-1"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyClick()}
              />
              <Button variant="secondary" onClick={handleApplyClick}>
                APPLY
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={onCheckout}
        disabled={selectedItems.length === 0 || isProcessingCheckout}
        className="w-full"
        size="lg"
      >
        {isProcessingCheckout ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : "Proceed to Checkout"}
      </Button>
    </div>
  );
}
