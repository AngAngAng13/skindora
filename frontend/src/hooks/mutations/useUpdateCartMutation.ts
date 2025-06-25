import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PREPARED_ORDER_QUERY_KEY } from "@/hooks/queries/usePreparedOrderQuery";
import { cartService } from "@/services/cartService";
import type { ApiError } from "@/utils";

import { CART_QUERY_KEY } from "../queries/useCartQuery";

export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateItemQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PREPARED_ORDER_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error("Update failed", { description: error.message });
    },
  });
};
