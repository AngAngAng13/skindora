import { useQuery } from "@tanstack/react-query";

import { ordersService } from "@/services/orders.service";
import type { MyOrdersApiResponse } from "@/services/orders.service";
import type { ApiError } from "@/utils";

export const MY_ORDERS_QUERY_KEY = ["orders", "me"];

export const useMyOrdersQuery = (enabled: boolean) => {
  return useQuery<MyOrdersApiResponse, ApiError>({
    queryKey: MY_ORDERS_QUERY_KEY,
    queryFn: async () => {
      const result = await ordersService.getMyOrders();
      if (result.isErr()) {
        throw result.error;
      }
      return result.value.data;
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
  });
};
