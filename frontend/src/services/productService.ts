import { apiClient } from "@/lib/apiClient";
import type { PaginatedProductsResponse, ProductSummary as Product, ProductDetail} from "@/types";

interface ApiResponse<T> {
  message: string;
  result: T;
}



export const productService = {
  
  getFeaturedProducts: async () => {
    const result = await apiClient.get<ApiResponse<Product[]>>("/products/featured");

    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data.result;
  },

 
  getAllProducts: async ({ page = 1, limit = 10 }) => {
    const result = await apiClient.get<PaginatedProductsResponse>(`/products?page=${page}&limit=${limit}`);

    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data;
  },

 
  getProductById: async (productId: string): Promise<ProductDetail> => {
    const result = await apiClient.get<ApiResponse<ProductDetail>>(`/products/${productId}`);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data.result;
  },
};
