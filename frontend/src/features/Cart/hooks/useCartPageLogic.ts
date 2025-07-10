import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth.context";
import { useClearCartMutation } from "@/hooks/mutations/useClearCartMutation";
import { usePrepareOrderMutation } from "@/hooks/mutations/usePrepareOrderMutation";
import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation";
import { useUpdateCartMutation } from "@/hooks/mutations/useUpdateCartMutation";
import { useCartQuery } from "@/hooks/queries/useCartQuery";
import type { Voucher } from "@/types/voucher";

interface ApiCartProduct {
  ProductID: string;
  Quantity: number;
  name: string;
  image: string;
  unitPrice: number;
  totalPrice: number;
  stock?: number;
}

export const useCartPageLogic = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: cartResponse, isLoading: isCartLoading, isError, error } = useCartQuery(isAuthenticated);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const { mutate: clearCart, isPending: isClearing } = useClearCartMutation();
  const { mutate: updateCart, isPending: isUpdating } = useUpdateCartMutation();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCartMutation();
  const { mutate: prepareOrder, isPending: isPreparingOrder } = usePrepareOrderMutation();

  const isMutating = isUpdating || isRemoving;

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
    } else {
      setSelectedItemIds([]);
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
      removeFromCart(id);
    } else {
      updateCart({ productId: id, quantity });
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItemIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedItemIds(checked ? cartItems.map((item) => item.ProductID) : []);
  };

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  return {
    navigate,
    isCartLoading,
    isError,
    error,
    cartItems,
    isAllSelected,
    isClearing,
    isMutating,
    isPreparingOrder,
    isVoucherDialogOpen,
    subtotal,
    shipping,
    total,
    discountAmount,
    appliedVoucher,
    selectedItems,
    selectedItemIds,
    handleSelectAll,
    handleSelectItem,
    handleRemoveItem,
    handleUpdateQuantity,
    handleApplyVoucher,
    clearVoucher,
    clearCart,
    prepareOrder,
    setIsVoucherDialogOpen,
  };
};
