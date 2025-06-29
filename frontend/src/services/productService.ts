import { apiClient } from "@/lib/apiClient";
import type { PaginatedProductsResponse, Product } from "@/types";

export const productService = {
  getAllProducts: async ({
    page = 1,
    limit = 12,
    filters = {},
  }: {
    page: number;
    limit: number;
    filters?: Record<string, string[]>;
  }) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        params.append(key, value.join(","));
      }
    });

    const queryString = params.toString();
    const result = await apiClient.get<PaginatedProductsResponse>(`/products/get-all?${queryString}`);

    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data;
  },

  getProductById: async (productId: string): Promise<Product> => {
    const result = await apiClient.get<{ message: string; result: Product }>(`/products/${productId}`);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data.result;
  },
};
