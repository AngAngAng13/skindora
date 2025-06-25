import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, CalendarIcon, CreditCard, Frown, LoaderCircle, MapPin, Package, Truck } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCheckoutMutation } from "@/hooks/queries/useCheckoutMutation";
import { usePreparedOrderQuery } from "@/hooks/queries/usePreparedOrderQuery";
import { cn } from "@/lib/utils";
import type { CheckoutPayload, ProductInOrder } from "@/services/orders.service";

const checkoutFormSchema = z.object({
  ShipAddress: z.string().min(10, { message: "Shipping address must be at least 10 characters." }),
  Description: z.string().optional(),
  RequireDate: z.date({ required_error: "A delivery date is required." }),
  PaymentMethod: z.enum(["COD", "ZALOPAY", "VNPAY"], { required_error: "Please select a payment method." }),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  form: ReturnType<typeof useForm<CheckoutFormData>>;
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting: boolean;
}

function CheckoutForm({ form, onSubmit, isSubmitting }: CheckoutFormProps) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-5">
              <Label htmlFor="shipAddress">Shipping Address *</Label>
              <Controller
                name="ShipAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      id="shipAddress"
                      placeholder="Enter your full address (house number, street, city)"
                      {...field}
                      className="min-h-[80px]"
                    />
                    {fieldState.error && <p className="text-destructive mt-1 text-sm">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-5">
              <Label htmlFor="description">Delivery Notes</Label>
              <Controller
                name="Description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="e.g., Call before delivery, leave with guard..."
                    {...field}
                    className="min-h-[60px]"
                  />
                )}
              />
            </div>
            <div className="space-y-5">
              <Label>Requested Delivery Date</Label>
              <Controller
                name="RequireDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP", { locale: vi }) : "Select a delivery date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && <p className="text-destructive mt-1 text-sm">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="PaymentMethod"
              control={form.control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                  <Label
                    htmlFor="cod"
                    className="has-[:checked]:bg-primary/10 has-[:checked]:border-primary flex cursor-pointer items-center space-x-3 rounded-lg border p-4"
                  >
                    <RadioGroupItem value="COD" id="cod" />
                    <div className="flex flex-1 items-center gap-3">
                      <Truck className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Cash on Delivery (COD)</p>
                        <p className="text-sm text-gray-500">Pay with cash upon receiving your order</p>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              )}
            />
          </CardContent>
        </Card>
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
    </FormProvider>
  );
}

interface CheckoutOrderSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  items: ProductInOrder[];
}

function CheckoutOrderSummary({ subtotal, shipping, discount, total, items }: CheckoutOrderSummaryProps) {
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
              <span>Discount:</span>
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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { data: preparedOrderResponse, isLoading: isSummaryLoading, isError } = usePreparedOrderQuery(true);
  const { mutate: createOrder, isPending: isSubmitting } = useCheckoutMutation();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { PaymentMethod: "COD" },
  });

  const onSubmit = (formData: CheckoutFormData) => {
    const payload: CheckoutPayload = {
      ...formData,
      RequireDate: formData.RequireDate.toISOString(),
      type: "cart",
      PaymentStatus: "UNPAID",
    };
    createOrder(payload, {
      onSuccess: () => navigate("/order-success"),
    });
  };

  if (isSummaryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError || !preparedOrderResponse?.result) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <Frown className="text-destructive mb-4 h-16 w-16" />
        <h2 className="mb-2 text-xl font-bold">Checkout Session Expired</h2>
        <p className="text-muted-foreground mb-6">
          Your cart may have changed. Please return to your cart to continue.
        </p>
        <Button variant="outline" onClick={() => navigate("/cart")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Cart
        </Button>
      </div>
    );
  }

  const orderDetails = preparedOrderResponse.result;
  const shippingFee = orderDetails.TotalPrice > 500000 ? 0 : 30000;
  const summaryDetails = {
    subtotal: orderDetails.TotalPrice,
    shipping: shippingFee,
    discount: orderDetails.DiscountAmount || 0,
    total: (orderDetails.FinalPrice || orderDetails.TotalPrice) + shippingFee,
    items: orderDetails.Products,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" onClick={() => navigate("/cart")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CheckoutForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </div>
          <div className="lg:col-span-1">
            <CheckoutOrderSummary {...summaryDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
