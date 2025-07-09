import { ArrowLeft, LoaderCircle, ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth.context";
import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation";
import { useUpdateCartMutation } from "@/hooks/mutations/useUpdateCartMutation";
import { useCartQuery } from "@/hooks/queries/useCartQuery";
import type { CartProduct as CartItemCardType } from "./components/CartItemCard";
import { CartItemCard } from "./components/CartItemCard";
import { CartSummary } from "./components/CartSummary";

interface ApiCartProduct {
  ProductID: string;
  Quantity: number;
  name: string;
  image: string;
  unitPrice: number;
  totalPrice: number;
  stock?: number;
}

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: cartResponse, isLoading: isCartLoading, isError, error } = useCartQuery(isAuthenticated);


  const updateCartMutation = useUpdateCartMutation();
  const removeFromCartMutation = useRemoveFromCartMutation();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate(id);
    } else {
      updateCartMutation.mutate({ productId: id, quantity });
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCartMutation.mutate(id);
  };

  const cartItems: CartItemCardType[] = useMemo(
    () =>
      (cartResponse?.result?.Products || []).map((item: ApiCartProduct) => ({
        ...item,
        stock: item.stock || 99,
      })),
    [cartResponse]
  );

  const isMutating = updateCartMutation.isPending || removeFromCartMutation.isPending;

  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + item.totalPrice, 0), [cartItems]);
  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shipping;

  if (isCartLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <LoaderCircle className="text-primary mb-4 h-16 w-16 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-900">Loading Your Cart...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-destructive mb-2 text-2xl font-bold">Could Not Load Cart</h2>
        <p className="mb-6 max-w-md text-gray-500">{error.message}</p>
        <Button onClick={() => navigate("/products")}>Go Shopping</Button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-400" />
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="mb-6 max-w-md text-center text-gray-500">Looks like you haven't added anything yet.</p>
        <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => navigate("/products")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
        <h1 className="text-2xl font-bold">Your Cart ({cartItems.length} items)</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => (
            <CartItemCard
              key={item.ProductID}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
              isUpdating={isMutating}
            />
          ))}
        </div>
        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal} shipping={shipping} total={total} cartItems={cartItems} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
