import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PREPARED_ORDER_QUERY_KEY } from "@/hooks/queries/usePreparedOrderQuery";
import { cartService } from "@/services/cartService";
import type { ApiError } from "@/utils";

import { CART_QUERY_KEY } from "../queries/useCartQuery";

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      toast.success("Product added to cart!", {
        description: "You can view your cart at any time.",
      });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PREPARED_ORDER_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to add to cart", {
        description: error.message || "Please try again.",
      });
    },
  });
};
