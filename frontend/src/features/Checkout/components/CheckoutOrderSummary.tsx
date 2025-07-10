import { Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProductInOrder } from "@/services/orders.service";

interface CheckoutOrderSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  items: ProductInOrder[];
  voucherCode?: string; 
}

export function CheckoutOrderSummary({
  subtotal,
  shipping,
  discount,
  total,
  items,
  voucherCode,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="sticky top-24 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Subtotal:</span>
            <span>{subtotal.toLocaleString("vi-VN")}₫</span>
          </div>
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Shipping:</span>
            <span>{shipping.toLocaleString("vi-VN")}₫</span>
          </div>
          
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm font-medium text-green-600">
              <span>Discount {voucherCode && `(${voucherCode})`}:</span>
              <span>-{discount.toLocaleString("vi-VN")}₫</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{total.toLocaleString("vi-VN")}₫</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5" /> Items in Your Order
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-60 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div key={item.ProductID} className="flex items-center justify-between text-sm">
              <p className="truncate pr-2">
                {item.name} <span className="text-muted-foreground">x {item.Quantity}</span>
              </p>
              <p className="font-medium whitespace-nowrap">
                {(item.PricePerUnit * item.Quantity).toLocaleString("vi-VN")}₫
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
