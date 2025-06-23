import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/productService";

export const PRODUCTS_QUERY_KEY = (page: number, limit: number, filters: Record<string, string[]>) => [
  "products",
  "all",
  { page, limit, filters },
];

export const useAllProductsQuery = (page: number, limit: number, filters: Record<string, string[]>) => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY(page, limit, filters),
    queryFn: () => productService.getAllProducts({ page, limit, filters }),
    placeholderData: (previousData) => previousData,
  });
};
