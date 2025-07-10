import { LoaderCircle, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth.context";
import { useClearCartMutation } from "@/hooks/mutations/useClearCartMutation";
import { usePrepareOrderMutation } from "@/hooks/mutations/usePrepareOrderMutation";
import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation";
import { useUpdateCartMutation } from "@/hooks/mutations/useUpdateCartMutation";
import { useCartQuery } from "@/hooks/queries/useCartQuery";
import type { Voucher } from "@/types/voucher";

import { CartSummary } from "./components/CartSummary";

import { VoucherDialog } from "./components/VoucherDialog";

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

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const { mutate: clearCart, isPending: isClearing } = useClearCartMutation();
  const updateCartMutation = useUpdateCartMutation();
  const removeFromCartMutation = useRemoveFromCartMutation();
  const { mutate: prepareOrder, isPending: isPreparingOrder } = usePrepareOrderMutation();

  const handleApplyVoucher = (voucher: Voucher) => {
    setAppliedVoucher(voucher);
    toast.success(`Voucher "${voucher.code}" applied!`);
  };

  const clearVoucher = () => {
    setAppliedVoucher(null);
    toast.info("Voucher removed.");
  };

  const cartItems = useMemo(
    () =>
      (cartResponse?.result?.Products || []).map((item: ApiCartProduct) => ({
        ...item,
        stock: item.stock || 99,
      })),
    [cartResponse]
  );

  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItemIds(cartItems.map((item) => item.ProductID));
    }
  }, [cartItems]);

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedItemIds.includes(item.ProductID)),
    [cartItems, selectedItemIds]
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((total, item) => total + item.unitPrice * item.Quantity, 0),
    [selectedItems]
  );

  const discountAmount = useMemo(() => {
    if (!appliedVoucher || subtotal < Number(appliedVoucher.minOrderValue)) return 0;
    let discount = 0;
    if (appliedVoucher.discountType === "FIXED") {
      discount = Number(appliedVoucher.discountValue);
    } else if (appliedVoucher.discountType === "PERCENTAGE") {
      discount = (subtotal * Number(appliedVoucher.discountValue)) / 100;
      if (Number(appliedVoucher.maxDiscountAmount) > 0 && discount > Number(appliedVoucher.maxDiscountAmount)) {
        discount = Number(appliedVoucher.maxDiscountAmount);
      }
    }
    return discount;
  }, [appliedVoucher, subtotal]);

  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 30000;

  const total = useMemo(() => {
    const calculatedTotal = subtotal + shipping - discountAmount;
    return calculatedTotal > 0 ? calculatedTotal : 0;
  }, [subtotal, shipping, discountAmount]);

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

  const handleSelectItem = (itemId: string) => {
    setSelectedItemIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked) {
      setSelectedItemIds(cartItems.map((item) => item.ProductID));
    } else {
      setSelectedItemIds([]);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to checkout.");
      return;
    }
    const selectedProductIDs = selectedItems.map((item) => item.ProductID);
    prepareOrder(selectedProductIDs, {
      onSuccess: () => navigate("/checkout"),
    });
  };

  const isMutating = updateCartMutation.isPending || removeFromCartMutation.isPending;
  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

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
    <>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-4 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">
              HOME
            </Link>
            <span className="mx-2">›</span>
            <span>SHOPPING CART</span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between rounded-t-lg border-b bg-white p-4">
                <h1 className="text-xl font-bold">
                  SHOPPING CART <span className="font-normal text-gray-600">({cartItems.length} items)</span>
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={handleSelectAll} />
                    <label htmlFor="select-all" className="cursor-pointer text-sm font-medium">
                      Select All
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearCart()}
                    disabled={isClearing}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.ProductID} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                    <Checkbox
                      checked={selectedItemIds.includes(item.ProductID)}
                      onCheckedChange={() => handleSelectItem(item.ProductID)}
                    />
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="line-clamp-2 font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Unit Price: {item.unitPrice.toLocaleString("vi-VN")}₫</p>
                    </div>
                    <QuantitySelector
                      quantity={item.Quantity}
                      onDecrease={() => handleUpdateQuantity(item.ProductID, item.Quantity - 1)}
                      onIncrease={() => handleUpdateQuantity(item.ProductID, item.Quantity + 1)}
                      maxStock={item.stock || 99}
                      isUpdating={isMutating}
                    />
                    <p className="w-24 text-right font-semibold text-red-600">
                      {(item.unitPrice * item.Quantity).toLocaleString("vi-VN")}₫
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveItem(item.ProductID)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <CartSummary
                  subtotal={subtotal}
                  selectedItems={selectedItems}
                  shipping={shipping}
                  total={total}
                  discount={appliedVoucher ? { code: appliedVoucher.code, amount: discountAmount } : undefined}
                  onOpenVoucherDialog={() => setIsVoucherDialogOpen(true)}
                  onClearVoucher={appliedVoucher ? clearVoucher : undefined}
                />
                {/* <Button
                  onClick={handleCheckout}
                  disabled={isPreparingOrder || selectedItems.length === 0}
                  className="w-full py-3 text-lg"
                >
                  {isPreparingOrder && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  PLACE ORDER
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <VoucherDialog
        isOpen={isVoucherDialogOpen}
        onOpenChange={setIsVoucherDialogOpen}
        onApplyVoucher={handleApplyVoucher}
        selectedVoucherCode={appliedVoucher?.code}
      />
    </>
  );
};

export default CartPage;
