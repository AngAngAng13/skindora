import { apiClient } from "@/lib/apiClient";
import type { PaginatedProductsResponse, ProductDetail } from "@/types/product";

// The backend response is now directly the paginated shape
// No extra 'message' or 'result' nesting for this specific endpoint

export const productService = {
  // ... (getFeaturedProducts can stay if you expect that endpoint later)

  /**
   * Fetches a paginated list of all products.
   * @param page - The page number to fetch.
   * @param limit - The number of items per page.
   */
  getAllProducts: async ({ page = 1, limit = 12 }) => {
    // Correct the endpoint path to '/products/get-all'
    const result = await apiClient.get<PaginatedProductsResponse>(`/products/get-all?page=${page}&limit=${limit}`);

    if (result.isErr()) {
      throw result.error; // Let TanStack Query handle the error
    }
    // The response body is the data we need
    return result.value.data;
  },

  /**
   * Fetches the full details for a single product.
   * @param productId - The ID of the product to fetch.
   */
  getProductById: async (productId: string): Promise<ProductDetail> => {
    // Assuming this endpoint will be '/products/:productId'
    const result = await apiClient.get<{ message: string; result: ProductDetail }>(`/products/${productId}`);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data.result;
  },
};
