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
  addToWishlist: async (productIds: string[]) => {
    const result = await apiClient.post<{ message: string }, { productId: string[] }>("/users/addToWishList", {
      productId: productIds,
    });
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data;
  },
    getWishlistProducts: async (): Promise<Product[]> => {
    const result = await apiClient.get<{ status: number; data: Product[] }>("/users/wishlist-products");
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data.data;
  },
  getWishlist: async (): Promise<string[]> => {
    const result = await apiClient.get<{ status: number; data: string[] }>("/users/getWishList");
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data.data;
  },
  removeFromWishlist: async (productIds: string[]) => {
    const result = await apiClient.put<{ message: string }, { productId: string[] }>("/users/removeFromWishList", {
      productId: productIds,
    });
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
