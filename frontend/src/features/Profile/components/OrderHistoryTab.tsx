import { format } from "date-fns";
import { AlertCircle, FileText, LoaderCircle, ShoppingBag, Truck } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth.context";
import { useMyOrdersQuery } from "@/hooks/queries/useMyOrdersQuery";

export const OrderHistoryTab: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: ordersResponse, isLoading, isError, error } = useMyOrdersQuery(isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground mt-4">Loading your order history...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle /> Could Not Load Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error?.message || "An unexpected error occurred."}</p>
        </CardContent>
      </Card>
    );
  }

  const orders = ordersResponse?.result || [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-xl font-semibold">No Orders Yet</h3>
        <p className="text-muted-foreground mt-2">You haven't placed any orders with us.</p>

        <Button variant="link" className="mt-4" onClick={() => navigate("/products")}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Orders</h2>
      {orders.map((order) => {
        const orderTotal = order.orderDetail.reduce((acc, item) => {
          return acc + parseInt(item.UnitPrice) * parseInt(item.Quantity);
        }, 0);

        return (
          <Card key={order.orderId} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 p-4">
              <div>
                <CardTitle className="text-base font-semibold">
                  Order ID: <span className="text-primary font-mono">{order.orderId.slice(-12).toUpperCase()}</span>
                </CardTitle>
                <CardDescription>
                  Placed on {format(new Date(order.orderDetail[0].OrderDate), "MMMM d, yyyy")}
                </CardDescription>
              </div>

              <Badge variant="secondary">Processing</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-4">
                {order.orderDetail.map((detail) => (
                  <div key={detail._id} className="flex items-start gap-4">
                    <img
                      src={detail.Products.image}
                      alt={detail.Products.name}
                      className="h-16 w-16 rounded-md border object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{detail.Products.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {parseInt(detail.Products.price).toLocaleString("vi-VN")}₫ x {detail.Quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {(parseInt(detail.Products.price) * parseInt(detail.Quantity)).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch bg-gray-50/50 p-4">
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Order Total</span>
                <span>{orderTotal.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" /> View Invoice
                </Button>

                <Button className="flex-1" onClick={() => navigate(`/orders/tracking/${order.orderId}`)}>
                  <Truck className="mr-2 h-4 w-4" />
                  Track Order
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
