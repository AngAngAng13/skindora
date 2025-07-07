import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { productService } from "@/services/productService";
import type { ApiError } from "@/utils";

export const WISHLIST_QUERY_KEY = ["wishlist", "currentUser"];

export const useAddToWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productIds: string[]) => productService.addToWishlist(productIds),
    onSuccess: () => {
      toast.success("Added to your wishlist!");
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error("Could not add to wishlist", {
        description: error.message || "Please try again later.",
      });
    },
  });
};
