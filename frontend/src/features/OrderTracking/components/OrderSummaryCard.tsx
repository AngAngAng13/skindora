import { format } from "date-fns";
import { CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryCardProps {
  orderTotal: number;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: string;
  requireDate: string;
}

export const OrderSummaryCard = ({
  orderTotal,
  shippingFee,
  grandTotal,
  paymentMethod,
  requireDate,
}: OrderSummaryCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Order Summary</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>{orderTotal.toLocaleString("vi-VN")}₫</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping:</span>
        <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
      </div>
      <Separator />
      <div className="flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span>{grandTotal.toLocaleString("vi-VN")}₫</span>
      </div>
      <div className="flex items-center justify-between pt-2">
        <span className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="h-4 w-4 text-gray-500" /> Payment Method
        </span>
        <Badge variant="outline" className="font-medium">
          {paymentMethod}
        </Badge>
      </div>
      <div className="pt-2">
        <p className="text-sm text-gray-600">
          Expected Delivery: <span className="font-medium">{format(new Date(requireDate), "PPP")}</span>
        </p>
      </div>
    </CardContent>
  </Card>
);
