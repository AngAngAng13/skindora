import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PREPARED_ORDER_QUERY_KEY } from "@/hooks/queries/usePreparedOrderQuery";
import { cartService } from "@/services/cartService";
import type { ApiError } from "@/utils";

import { CART_QUERY_KEY } from "../queries/useCartQuery";

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartService.removeItem(productId),
    onSuccess: () => {
      toast.info("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PREPARED_ORDER_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to remove item", { description: error.message });
    },
  });
};
