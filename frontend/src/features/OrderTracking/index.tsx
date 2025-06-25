import { format } from "date-fns";
import { AlertCircle, ArrowLeft, CheckCircle, Clock, LoaderCircle, MapPin, Package, Truck, CreditCard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrderByIdQuery } from "@/hooks/queries/useOrderByIdQuery";

const generateShippingSteps = (status: string, orderDate: string, requireDate: string) => {
  const steps = [
    {
      status: "confirmed",
      title: "Order Confirmed",
      description: "Your order has been confirmed and is being prepared.",
    },
    { status: "processing", title: "Processing", description: "The items are being carefully packaged." },
    { status: "shipping", title: "In Transit", description: "The order is on its way to you." },
    { status: "delivered", title: "Delivered", description: "Your order has been successfully delivered." },
  ];

  const statusHierarchy = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED", "FAILED"];
  const currentStatusIndex = statusHierarchy.indexOf(status);

  const getStepDate = (index: number) => {
    if (index === 0) return format(new Date(orderDate), "yyyy-MM-dd HH:mm");
    if (index === 3 && status === "DELIVERED") return format(new Date(requireDate), "yyyy-MM-dd HH:mm");
    if (index < currentStatusIndex)
      return format(new Date(new Date(orderDate).getTime() + index * 24 * 60 * 60 * 1000), "yyyy-MM-dd HH:mm"); 
    return "";
  };

  return steps.map((step, index) => {
    const stepIndexInHierarchy = statusHierarchy.indexOf(step.status.toUpperCase());
    const isCompleted = stepIndexInHierarchy < currentStatusIndex;
    const isCurrent = stepIndexInHierarchy === currentStatusIndex;

    return {
      ...step,
      completed: isCompleted,
      current: isCurrent,
      date: isCompleted || isCurrent ? getStepDate(index) : "",
    };
  });
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { data: orderResponse, isLoading, isError, error } = useOrderByIdQuery(orderId);

  const getStepIcon = (step: { completed: boolean; current: boolean }) => {
    if (step.completed) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    } else if (step.current) {
      return <Clock className="h-6 w-6 animate-pulse text-blue-600" />;
    } else {
      return <div className="h-6 w-6 rounded-full border-2 border-gray-300 bg-white" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground mt-4">Loading order details...</p>
      </div>
    );
  }

  if (isError || !orderResponse) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="text-destructive h-16 w-16" />
        <h2 className="mt-4 text-2xl font-bold">Order Not Found</h2>
        <p className="text-muted-foreground mt-2">
          {error?.message || "We couldn't find the order you're looking for."}
        </p>
        <Button onClick={() => navigate("/profile/orders")} variant="outline" className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
        </Button>
      </div>
    );
  }

  const order = orderResponse.result;
  const shippingSteps = generateShippingSteps(order.Status, order.orderDetail[0].OrderDate, order.RequireDate);
  const orderTotal = parseFloat(order.TotalPrice);
  const shippingFee = orderTotal > 500000 ? 0 : 30000;
  const grandTotal = orderTotal + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-gray-500">Placed on {format(new Date(order.orderDetail[0].OrderDate), "PPP")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {shippingSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {getStepIcon(step)}
                        {index < shippingSteps.length - 1 && (
                          <div className={`mt-2 h-16 w-0.5 ${step.completed ? "bg-green-600" : "bg-gray-300"}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="mb-1 flex items-center gap-2">
                          <h3
                            className={`font-medium ${
                              step.current ? "text-blue-600" : step.completed ? "text-green-600" : "text-gray-500"
                            }`}
                          >
                            {step.title}
                          </h3>
                          {step.current && (
                            <Badge variant="default" className="bg-blue-600 text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="mb-1 text-sm text-gray-600">{step.description}</p>
                        {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Items in Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderDetail.map((item) => (
                    <div key={item._id} className="flex gap-4 rounded-lg border bg-white p-4">
                      <img
                        src={item.Products.image}
                        alt={item.Products.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.Products.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.Quantity}</p>
                        <p className="text-lg font-bold">{parseInt(item.UnitPrice).toLocaleString("vi-VN")}₫</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{order.ShipAddress}</p>
              </CardContent>
            </Card>

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
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500"/>
                    Payment Method
                  </span>
                  <Badge variant="outline" className="font-medium">{order.PaymentMethod}</Badge>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600">
                    Expected Delivery:  <span className="font-medium">{format(new Date(order.RequireDate), "PPP")}</span>
                  </p>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
